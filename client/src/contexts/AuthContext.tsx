import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface Key {
  key: string;
  createdAt: Date | number;
  expiryTime: Date | number;
  duration: number;
}

// Normalized key with numeric timestamps
interface NormalizedKey {
  key: string;
  createdAt: number;
  expiryTime: number;
  duration: number;
}

interface AuthContextType {
  currentKey: NormalizedKey | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (key: string) => Promise<boolean>;
  adminLogin: (password: string) => boolean;
  logout: () => void;
  adminLogout: () => void;
  getActiveKeys: () => Promise<NormalizedKey[]>;
  addKeys: (keys: NormalizedKey[]) => Promise<void>;
  deleteKey: (key: string) => Promise<void>;
}

// Replace with your secure admin password
const ADMIN_KEY = "adminnhayy2010";
const CURRENT_USER_KEY = "nhayy_current_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to normalize dates to timestamps
const normalizeKey = (key: Key): NormalizedKey => {
  // Make sure all timestamps are converted to milliseconds since epoch
  let createdAt: number;
  let expiryTime: number;
  
  // Handle createdAt conversion
  if (key.createdAt instanceof Date) {
    createdAt = key.createdAt.getTime();
  } else if (typeof key.createdAt === 'string') {
    createdAt = new Date(key.createdAt).getTime();
  } else {
    createdAt = Number(key.createdAt);
  }
  
  // Handle expiryTime conversion
  if (key.expiryTime instanceof Date) {
    expiryTime = key.expiryTime.getTime();
  } else if (typeof key.expiryTime === 'string') {
    expiryTime = new Date(key.expiryTime).getTime();
  } else {
    expiryTime = Number(key.expiryTime);
  }
  
  return {
    key: key.key,
    createdAt,
    expiryTime,
    duration: key.duration
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentKey, setCurrentKey] = useState<NormalizedKey | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeKeys, setActiveKeys] = useState<NormalizedKey[]>([]);
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // Load active keys from API
  const fetchActiveKeys = async () => {
    try {
      const keys = await apiRequest('/api/keys') as Key[];
      return keys.map(normalizeKey);
    } catch (error) {
      console.error("Failed to fetch active keys:", error);
      return [];
    }
  };

  useEffect(() => {
    const init = async () => {
      setIsLoading(true);
      
      // Load active keys
      const keys = await fetchActiveKeys();
      setActiveKeys(keys);
      
      // Check for existing session
      const savedKey = localStorage.getItem(CURRENT_USER_KEY);
      if (savedKey) {
        try {
          const keyData = JSON.parse(savedKey) as NormalizedKey;
          const now = Date.now();
          
          if (keyData.expiryTime > now) {
            // Verify the key still exists in the server
            const exists = keys.some(k => k.key === keyData.key);
            if (exists) {
              setCurrentKey(keyData);
              setLocation("/dashboard");
            } else {
              localStorage.removeItem(CURRENT_USER_KEY);
            }
          } else {
            // Remove expired key
            localStorage.removeItem(CURRENT_USER_KEY);
          }
        } catch (error) {
          localStorage.removeItem(CURRENT_USER_KEY);
        }
      }
      
      setIsLoading(false);
    };
    
    init();
  }, [setLocation]);

  const login = async (key: string): Promise<boolean> => {
    try {
      // Refresh the active keys first
      const keys = await fetchActiveKeys();
      setActiveKeys(keys);
      
      const keyInfo = keys.find(k => k.key === key);
      
      if (!keyInfo) {
        return false;
      }
      
      const now = Date.now();
      if (keyInfo.expiryTime < now) {
        // The key is expired, so delete it
        await deleteKey(key);
        return false;
      }
      
      // Store current session
      setCurrentKey(keyInfo);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(keyInfo));
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };
  
  const adminLogin = (password: string): boolean => {
    if (password === ADMIN_KEY) {
      setIsAdmin(true);
      return true;
    }
    return false;
  };
  
  const logout = () => {
    setCurrentKey(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    setLocation("/");
  };
  
  const adminLogout = () => {
    setIsAdmin(false);
    setLocation("/");
  };
  
  const getActiveKeys = async (): Promise<NormalizedKey[]> => {
    const keys = await fetchActiveKeys();
    setActiveKeys(keys);
    return keys;
  };
  
  const addKeys = async (keys: NormalizedKey[]): Promise<void> => {
    try {
      // Create keys on server
      for (const keyData of keys) {
        await apiRequest('/api/keys', {
          method: 'POST',
          body: JSON.stringify({
            key: keyData.key,
            duration: keyData.duration
          }),
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      
      // Refresh the keys list
      await getActiveKeys();
      
      // Show success toast
      toast({
        title: "Tạo key thành công",
        description: `Đã tạo ${keys.length} key mới`,
      });
    } catch (error) {
      console.error("Error adding keys:", error);
      toast({
        title: "Lỗi tạo key",
        description: "Đã xảy ra lỗi khi tạo key, vui lòng thử lại",
        variant: "destructive"
      });
    }
  };
  
  const deleteKey = async (keyToDelete: string): Promise<void> => {
    try {
      await apiRequest(`/api/keys/${keyToDelete}`, {
        method: 'DELETE'
      });
      
      // Update local state
      setActiveKeys(prev => prev.filter(k => k.key !== keyToDelete));
      
      toast({
        title: "Key đã xóa",
        description: "Key đã được xóa thành công",
      });
    } catch (error) {
      console.error("Error deleting key:", error);
      toast({
        title: "Lỗi xóa key",
        description: "Đã xảy ra lỗi khi xóa key, vui lòng thử lại",
        variant: "destructive"
      });
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        currentKey, 
        isAuthenticated: !!currentKey, 
        isAdmin, 
        login, 
        adminLogin, 
        logout,
        adminLogout,
        getActiveKeys,
        addKeys,
        deleteKey
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
