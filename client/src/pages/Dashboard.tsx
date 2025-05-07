import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { getSystemInfo } from "@/lib/utils";
import KeyTimer from "@/components/ui/key-timer";
import GameAnalysis from "@/components/GameAnalysis";

export default function Dashboard() {
  const { isAuthenticated, currentKey, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { deviceInfo, dateInfo } = getSystemInfo();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setLocation("/");
    }
  }, [isAuthenticated, setLocation]);
  
  if (!isAuthenticated || !currentKey) {
    return null;
  }
  
  // Mask the key for display
  const maskedKey = currentKey.key.length > 6 
    ? `${currentKey.key.substring(0, 3)}****${currentKey.key.substring(currentKey.key.length - 3)}`
    : "********";

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-[#1E1E1E] border-b border-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <i className="fas fa-hand-holding-dollar text-primary text-2xl"></i>
              <h1 className="text-xl font-bold text-white">NHAYY <span className="text-primary">PREMIUM</span></h1>
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
              
              {/* Key timer display */}
              <KeyTimer expiryTime={currentKey.expiryTime} />
              
              <button 
                onClick={logout}
                className="bg-[#242424] hover:bg-destructive transition-all px-4 py-2 rounded-lg text-white flex items-center gap-2"
              >
                <i className="fas fa-sign-out-alt"></i>
                <span className="hidden md:inline">Đăng Xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Floating Telegram contact button */}
      <a 
        href="https://t.me/mryanhdz" 
        target="_blank" 
        rel="noopener noreferrer" 
        className="fixed bottom-6 right-6 z-50 bg-[#0088cc] hover:bg-[#0077b3] transition-all duration-300 shadow-lg rounded-full w-14 h-14 flex items-center justify-center hover:scale-110"
        title="Liên hệ Telegram để mua key"
      >
        <i className="fab fa-telegram-plane text-white text-2xl"></i>
      </a>
      
      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Tools Section */}
          <div className="lg:col-span-8 space-y-6">
            <GameAnalysis />
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-[#242424] rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-info-circle text-primary"></i>
                <h2 className="text-lg font-bold text-white">Thông Tin Phiên</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-light-dimmed mb-1">Gói dịch vụ</div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-gem text-primary"></i>
                    <span className="text-white font-medium">Nhayy Premium 4.0</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <div className="text-sm text-light-dimmed mb-1">Key</div>
                  <div className="flex items-center gap-2">
                    <i className="fas fa-key text-secondary"></i>
                    <span className="text-white font-medium">{maskedKey}</span>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-800">
                  <div className="text-sm text-light-dimmed mb-1">Thời gian còn lại</div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <i className="far fa-clock text-secondary"></i>
                      <KeyTimer expiryTime={currentKey.expiryTime} showFullTimer={true} />
                    </div>
                    <div className="text-xs py-1 px-2 bg-primary bg-opacity-20 text-primary rounded">Premium</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-[#242424] rounded-xl shadow-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <i className="fas fa-chart-pie text-primary"></i>
                <h2 className="text-lg font-bold text-white">Thống Kê</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-light-dimmed">Tỉ lệ thắng:</div>
                  <div className="text-[#2ECC71] font-medium">65-85%</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-light-dimmed">Thuật toán:</div>
                  <div className="text-white">Nâng cao</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-light-dimmed">Chế độ:</div>
                  <div className="text-white">Theo dõi thời gian thực</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-light-dimmed">Tích hợp:</div>
                  <div className="text-white">AI phân tích</div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-light-dimmed">Tối ưu cho:</div>
                  <div className="text-white">Sun.win</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
