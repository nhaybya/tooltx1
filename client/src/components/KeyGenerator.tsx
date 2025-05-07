import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

interface TimeOption {
  value: number;
  label: string;
}

interface KeyGeneratorProps {
  onKeysGenerated: () => void;
}

export default function KeyGenerator({ onKeysGenerated }: KeyGeneratorProps) {
  const [keyPrefix, setKeyPrefix] = useState("");
  const [keyCount, setKeyCount] = useState(1);
  const [selectedTimeOption, setSelectedTimeOption] = useState<number | null>(null);
  const [useCustomTime, setUseCustomTime] = useState(false);
  
  // Custom time values
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(30);
  
  const { addKeys } = useAuth();
  
  const timeOptions: TimeOption[] = [
    { value: 5, label: "5 phút" },
    { value: 10, label: "10 phút" },
    { value: 30, label: "30 phút" },
    { value: 60, label: "1 giờ" }
  ];
  
  const generateKeys = () => {
    let durationMinutes: number;
    
    if (useCustomTime) {
      // Calculate total minutes from days, hours, and minutes
      const totalMinutes = (days * 24 * 60) + (hours * 60) + minutes;
      
      if (totalMinutes <= 0) {
        alert('Vui lòng nhập thời gian hợp lệ (ít nhất 1 phút)!');
        return;
      }
      
      durationMinutes = totalMinutes;
    } else if (!selectedTimeOption) {
      alert('Vui lòng chọn thời gian cho key!');
      return;
    } else {
      durationMinutes = selectedTimeOption;
    }
    
    const count = Math.min(10, Math.max(1, keyCount));
    const prefix = keyPrefix.trim();
    
    const newKeys = [];
    for (let i = 0; i < count; i++) {
      const keyData = generateSingleKey(prefix, durationMinutes);
      newKeys.push(keyData);
    }
    
    // Add to generated keys
    addKeys(newKeys);
    onKeysGenerated();
  };
  
  const generateSingleKey = (prefix: string, durationMinutes: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let key = prefix || '';
    
    // Generate random characters
    for (let i = 0; i < 8; i++) {
      key += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    const now = Date.now();
    const expiryTime = now + (durationMinutes * 60 * 1000);
    
    return {
      key,
      createdAt: now,
      expiryTime,
      duration: durationMinutes
    };
  };

  const handleTimeOptionSelect = (value: number) => {
    setSelectedTimeOption(value);
    setUseCustomTime(false);
  };

  const handleCustomTimeSelect = () => {
    setUseCustomTime(true);
    setSelectedTimeOption(null);
  };

  return (
    <div className="bg-[#242424] rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Tạo Key Mới</h2>
        <div className="flex items-center gap-2 text-light-dimmed">
          <i className="fas fa-key text-secondary"></i>
          <span>Key Management</span>
        </div>
      </div>
      
      <div className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-light-muted mb-2">Key Prefix (tùy chọn)</label>
          <Input
            type="text"
            placeholder="vd: NHAYY-"
            value={keyPrefix}
            onChange={(e) => setKeyPrefix(e.target.value)}
            className="w-full bg-[#1E1E1E] border-gray-700 py-3 px-4 text-white placeholder-gray-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-light-muted mb-2">Thời gian sử dụng</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
            {timeOptions.map(option => (
              <Button
                key={option.value}
                onClick={() => handleTimeOptionSelect(option.value)}
                className={`${
                  !useCustomTime && selectedTimeOption === option.value ? "bg-secondary" : "bg-[#1E1E1E]"
                } hover:bg-secondary border border-gray-700 rounded-lg py-2 text-white font-medium transition-colors`}
              >
                {option.label}
              </Button>
            ))}
          </div>
          
          <div className="mt-3">
            <div className="flex justify-between">
              <label className="block text-sm font-medium text-light-muted mb-2">Thời gian tùy chỉnh</label>
              <Button
                variant="ghost"
                onClick={handleCustomTimeSelect}
                className={`text-sm px-2 py-0 h-auto ${useCustomTime ? "text-secondary" : "text-light-dimmed"}`}
              >
                {useCustomTime ? "Đang sử dụng" : "Sử dụng"}
              </Button>
            </div>
            
            <div className={`grid grid-cols-3 gap-3 ${useCustomTime ? "opacity-100" : "opacity-70"}`}>
              <div>
                <div className="text-xs text-light-dimmed mb-1 text-center">Ngày</div>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    max="365"
                    value={days}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0) {
                        setDays(value);
                      }
                    }}
                    className={`w-full bg-[#1E1E1E] border-gray-700 py-2 px-3 text-white text-center ${useCustomTime ? "border-secondary" : ""}`}
                    disabled={!useCustomTime}
                  />
                </div>
              </div>
              
              <div>
                <div className="text-xs text-light-dimmed mb-1 text-center">Giờ</div>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    max="23"
                    value={hours}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 23) {
                        setHours(value);
                      }
                    }}
                    className={`w-full bg-[#1E1E1E] border-gray-700 py-2 px-3 text-white text-center ${useCustomTime ? "border-secondary" : ""}`}
                    disabled={!useCustomTime}
                  />
                </div>
              </div>
              
              <div>
                <div className="text-xs text-light-dimmed mb-1 text-center">Phút</div>
                <div className="flex items-center">
                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={minutes}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value >= 0 && value <= 59) {
                        setMinutes(value);
                      }
                    }}
                    className={`w-full bg-[#1E1E1E] border-gray-700 py-2 px-3 text-white text-center ${useCustomTime ? "border-secondary" : ""}`}
                    disabled={!useCustomTime}
                  />
                </div>
              </div>
            </div>
            
            {useCustomTime && (
              <div className="mt-2 text-xs text-light-dimmed text-center">
                Tổng thời gian: {days > 0 ? `${days} ngày ` : ''}
                {hours > 0 ? `${hours} giờ ` : ''}
                {minutes > 0 ? `${minutes} phút` : ''}
                {days === 0 && hours === 0 && minutes === 0 ? 'Vui lòng nhập thời gian' : ''}
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-light-muted mb-2">Số lượng key</label>
          <div className="flex gap-4">
            <Input
              type="number"
              min="1"
              max="10"
              value={keyCount}
              onChange={(e) => setKeyCount(parseInt(e.target.value) || 1)}
              className="w-full bg-[#1E1E1E] border-gray-700 py-3 px-4 text-white"
            />
            <Button
              onClick={generateKeys}
              className="btn-gradient px-6 rounded-lg font-medium text-white flex items-center gap-2"
            >
              <i className="fas fa-magic"></i>
              <span>Tạo Key</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
