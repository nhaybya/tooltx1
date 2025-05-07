import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { getSystemInfo } from "@/lib/utils";
import KeyGenerator from "@/components/KeyGenerator";
import KeysList from "@/components/KeysList";

// Format time duration (minutes) to a readable string
const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} phút`;
  } else if (minutes < 24 * 60) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours} giờ${remainingMinutes > 0 ? ` ${remainingMinutes} phút` : ''}`;
  } else {
    const days = Math.floor(minutes / (24 * 60));
    const remainingMinutes = minutes % (24 * 60);
    const hours = Math.floor(remainingMinutes / 60);
    const mins = remainingMinutes % 60;
    
    let result = `${days} ngày`;
    if (hours > 0) result += ` ${hours} giờ`;
    if (mins > 0) result += ` ${mins} phút`;
    
    return result;
  }
};

export default function Admin() {
  const { isAdmin, adminLogout, getActiveKeys } = useAuth();
  const [, setLocation] = useLocation();
  const { deviceInfo, dateInfo } = getSystemInfo();
  const [activeKeys, setActiveKeys] = useState<any[]>([]);
  
  useEffect(() => {
    if (!isAdmin) {
      setLocation("/");
    }
  }, [isAdmin, setLocation]);
  
  if (!isAdmin) {
    return null;
  }
  
  const refreshKeys = async () => {
    try {
      const keys = await getActiveKeys();
      setActiveKeys(keys);
    } catch (error) {
      console.error("Error refreshing keys:", error);
    }
  };
  
  // Load keys on initial render
  useEffect(() => {
    if (isAdmin) {
      refreshKeys();
    }
  }, [isAdmin]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1E1E1E] border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="fas fa-user-shield text-primary text-2xl"></i>
              <h1 className="text-xl font-bold text-white">ADMIN <span className="text-primary">PANEL</span></h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col text-right">
                <div className="text-sm text-light-dimmed flex items-center justify-end gap-2">
                  <span>{deviceInfo}</span>
                  <i className="fas fa-desktop text-secondary"></i>
                </div>
                <div className="text-sm text-light-dimmed flex items-center justify-end gap-2">
                  <span>{dateInfo}</span>
                  <i className="far fa-calendar-alt text-secondary"></i>
                </div>
              </div>
              
              <button 
                onClick={adminLogout}
                className="bg-[#242424] hover:bg-destructive transition-all px-4 py-2 rounded-lg text-white flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden md:inline">Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Admin Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Admin Tools Section */}
          <div className="lg:col-span-8 space-y-6">
            <KeyGenerator onKeysGenerated={refreshKeys} />
            
            <KeysList onKeyDeleted={refreshKeys} />
          </div>
          
          {/* Admin Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#242424] rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-shield-alt text-primary"></i>
                <h2 className="text-lg font-bold text-white">Thông Tin Admin</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-light-dimmed mb-1">Trạng thái</div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-check-circle text-[#2ECC71]"></i>
                    <span className="text-white font-medium">Đã đăng nhập</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <div className="text-sm text-light-dimmed mb-1">Quyền quản trị</div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-user-cog text-secondary"></i>
                    <span className="text-white font-medium">Quản lý key</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#242424] rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <i className="fas fa-history text-primary"></i>
                  <h2 className="text-lg font-bold text-white">Keys Hoạt Động</h2>
                </div>
                
                <div className="space-y-3">
                  {activeKeys.length === 0 ? (
                    <div className="text-center py-3 text-light-dimmed">
                      <p>Không có key nào đang hoạt động.</p>
                    </div>
                  ) : (
                    activeKeys.map(keyData => {
                      const timeLeft = Math.max(0, keyData.expiryTime - Date.now());
                      const days = Math.floor(timeLeft / (24 * 60 * 60 * 1000));
                      const hours = Math.floor((timeLeft % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                      const minutes = Math.floor((timeLeft % (60 * 60 * 1000)) / 60000);
                      const seconds = Math.floor((timeLeft % 60000) / 1000);
                      
                      let timeStr = '';
                      if (days > 0) {
                        timeStr = `${days}d ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      } else if (hours > 0) {
                        timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      } else {
                        timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                      }
                      
                      return (
                        <div key={keyData.key} className="p-3 bg-[#1E1E1E] rounded-lg flex justify-between items-center">
                          <div>
                            <div className="text-white font-medium">{keyData.key}</div>
                            <div className="text-xs text-light-dimmed">Thời hạn: {formatDuration(keyData.duration)}</div>
                          </div>
                          <div className="flex items-center gap-2 text-primary">
                            <i className="far fa-clock"></i>
                            <span>{timeStr}</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              
              <div className="bg-[#1E1E1E] p-4 flex items-center justify-center border-t border-gray-800">
                <button 
                  onClick={() => refreshKeys()}
                  className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Refresh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
