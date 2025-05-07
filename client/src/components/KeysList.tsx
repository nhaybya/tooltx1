import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

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

// Key Structure
interface Key {
  key: string;
  createdAt: number;
  expiryTime: number;
  duration: number;
}

interface KeysListProps {
  onKeyDeleted: () => void;
}

export default function KeysList({ onKeyDeleted }: KeysListProps) {
  const [generatedKeys, setGeneratedKeys] = useState<Key[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { deleteKey, getActiveKeys } = useAuth();
  const { toast } = useToast();
  
  useEffect(() => {
    loadGeneratedKeys();
  }, []);
  
  const loadGeneratedKeys = async () => {
    setIsLoading(true);
    try {
      const keys = await getActiveKeys();
      setGeneratedKeys(keys);
    } catch (error) {
      console.error("Error loading keys:", error);
      setGeneratedKeys([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteKey = async (key: string, index: number) => {
    if (confirm('Bạn có chắc chắn muốn xóa key này?')) {
      try {
        await deleteKey(key);
        // Update the local state without making another API call
        const updatedKeys = [...generatedKeys];
        updatedKeys.splice(index, 1);
        setGeneratedKeys(updatedKeys);
        onKeyDeleted();
      } catch (error) {
        console.error("Error deleting key:", error);
        // If there was an error, refresh the list
        await loadGeneratedKeys();
      }
    }
  };
  
  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    toast({
      title: "Key đã được sao chép",
      description: "Key đã được sao chép vào clipboard",
    });
  };
  

  
  const copyAllKeys = () => {
    if (generatedKeys.length === 0) {
      toast({
        title: "Không có key nào để sao chép",
        description: "Vui lòng tạo key trước khi sao chép",
        variant: "destructive",
      });
      return;
    }
    
    const keysText = generatedKeys.map(k => {
      const expiryDate = new Date(k.expiryTime);
      const expiryStr = `${expiryDate.getHours().toString().padStart(2, '0')}:${expiryDate.getMinutes().toString().padStart(2, '0')} - ${expiryDate.getDate()}/${expiryDate.getMonth() + 1}/${expiryDate.getFullYear()}`;
      return `Key: ${k.key} | Thời hạn: ${formatDuration(k.duration)} | Hết hạn: ${expiryStr}`;
    }).join('\n');
    
    navigator.clipboard.writeText(keysText);
    toast({
      title: "Tất cả keys đã được sao chép",
      description: `Đã sao chép ${generatedKeys.length} keys vào clipboard`,
    });
  };

  return (
    <div className="bg-[#242424] rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Keys Đã Tạo</h2>
        
        {isLoading ? (
          <div className="text-center py-6 text-light-dimmed">
            <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-3"></div>
            <p>Đang tải danh sách keys...</p>
          </div>
        ) : generatedKeys.length === 0 ? (
          <div className="text-center py-6 text-light-dimmed">
            <i className="fas fa-key text-4xl mb-3 opacity-30"></i>
            <p>Chưa có key nào được tạo.</p>
            <p className="text-sm">Sử dụng form phía trên để tạo key mới.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-800">
            {generatedKeys.map((keyData, index) => {
              const keyDate = new Date(keyData.createdAt);
              const dateStr = `${keyDate.getDate()}/${keyDate.getMonth() + 1}/${keyDate.getFullYear()} ${keyDate.getHours().toString().padStart(2, '0')}:${keyDate.getMinutes().toString().padStart(2, '0')}`;
              
              return (
                <div key={keyData.key} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">{keyData.key}</div>
                      <div className="text-sm text-light-dimmed">Tạo lúc: {dateStr}</div>
                      <div className="text-sm text-light-dimmed">
                        Thời hạn: {formatDuration(keyData.duration)}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyKey(keyData.key)}
                        className="bg-[#1E1E1E] hover:bg-secondary transition-all px-3 py-1 rounded text-white text-sm h-auto"
                        size="sm"
                      >
                        <i className="far fa-copy"></i>
                      </Button>
                      <Button
                        onClick={() => handleDeleteKey(keyData.key, index)}
                        className="bg-[#1E1E1E] hover:bg-destructive transition-all px-3 py-1 rounded text-white text-sm h-auto"
                        size="sm"
                      >
                        <i className="far fa-trash-alt"></i>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <div className="bg-[#1E1E1E] p-4 flex justify-between items-center border-t border-gray-800">
        <span className="text-sm text-light-dimmed">
          <span>{generatedKeys.length}</span> keys được tạo
        </span>
        <Button
          onClick={copyAllKeys}
          className="bg-[#242424] hover:bg-primary transition-all px-4 py-2 rounded-lg text-white text-sm font-medium"
        >
          Copy Tất Cả
        </Button>
      </div>
    </div>
  );
}
