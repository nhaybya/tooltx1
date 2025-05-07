import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getSystemInfo } from "@/lib/utils";

export default function Login() {
  const [userKey, setUserKey] = useState("");
  const [error, setError] = useState("");
  
  const { login } = useAuth();
  const [, setLocation] = useLocation();
  
  const { deviceInfo, dateInfo } = getSystemInfo();

  const handleUserLogin = async () => {
    setError("");
    
    if (!userKey.trim()) {
      setError("Vui lòng nhập key!");
      return;
    }

    // Set loading state here if needed
    
    const success = await login(userKey.trim());
    
    if (success) {
      setLocation("/dashboard");
    } else {
      setError("Key không hợp lệ hoặc đã hết hạn!");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-4 px-6 bg-[#1E1E1E] border-b border-gray-800">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <i className="fas fa-hand-holding-dollar text-primary text-2xl"></i>
            <h1 className="text-xl font-bold text-white font-poppins">NHAYY <span className="text-primary">PREMIUM</span></h1>
          </div>
          <div id="system-info" className="text-sm text-light-dimmed lg:flex flex-col items-end">
            <div className="flex items-center gap-2">
              <i className="fas fa-desktop text-secondary"></i>
              <span>{deviceInfo}</span>
            </div>
            <div className="flex items-center gap-2">
              <i className="far fa-calendar-alt text-secondary"></i>
              <span>{dateInfo}</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-[#242424] rounded-xl shadow-lg overflow-hidden transform transition-all">
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-poppins gradient-text mb-2">Nhayy Premium Tools</h2>
                <p className="text-light-dimmed">Chào mừng bạn đến với công cụ phân tích cao cấp</p>
              </div>
              
              <div className="space-y-6">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="key" className="text-light-muted text-sm font-medium">Nhập key để tiếp tục</label>
                  <div className="relative">
                    <Input
                      id="key"
                      type="password"
                      value={userKey}
                      onChange={(e) => setUserKey(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          handleUserLogin();
                        }
                      }}
                      className="w-full bg-[#1E1E1E] border-gray-700 py-3 px-4 text-white"
                      placeholder="Nhập mã key của bạn..."
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <i className="fas fa-key text-gray-500"></i>
                    </div>
                  </div>
                  {error && <div className="text-destructive text-sm">{error}</div>}
                </div>
                
                <Button
                  onClick={handleUserLogin}
                  className="w-full btn-gradient font-medium text-white rounded-lg py-3 flex items-center justify-center gap-2"
                >
                  <i className="fas fa-sign-in-alt"></i>
                  <span>Đăng Nhập</span>
                </Button>
              </div>
            </div>
            
            <div className="p-4 bg-[#1E1E1E] border-t border-gray-800 flex flex-col sm:flex-row justify-center items-center gap-3">
              <span className="text-sm text-light-dimmed flex items-center gap-1">
                <i className="fas fa-code text-primary"></i> Tools by Nhayy
              </span>
              <a 
                href="https://t.me/mryanhdz" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0088cc] hover:bg-[#0077b3] transition-colors px-3 py-1 rounded-md text-white text-sm"
              >
                <i className="fab fa-telegram"></i>
                <span>Liên hệ Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}