import { Button } from "@/components/ui/button";
import { PredictionResult } from "@/lib/gameUtils";

interface PredictionResultsProps {
  prediction: PredictionResult;
  onNewAnalysis: () => void;
}

export default function PredictionResults({ prediction, onNewAnalysis }: PredictionResultsProps) {
  return (
    <div className="bg-[#242424] rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-bold text-white mb-4">Kết Quả Phân Tích</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-light-dimmed mb-1">
                <span>Dự đoán</span>
                <span>Độ tin cậy</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="text-3xl font-bold">{prediction.type.toUpperCase()}</div>
                <div className="text-xl font-medium">
                  <span>{prediction.confidence}</span><span className="text-light-dimmed">%</span>
                </div>
              </div>
              <div className="w-full bg-[#1E1E1E] rounded-full h-2 mt-1">
                <div 
                  className="bg-gradient-to-r from-primary to-destructive rounded-full h-2" 
                  style={{ width: `${prediction.confidence}%` }}
                ></div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-light-dimmed mb-2">Phân tích thị trường</div>
              <div className={`flex items-center gap-2 ${
                prediction.marketTrend === 'STRONG_TREND' 
                  ? 'text-[#2ECC71]' 
                  : prediction.marketTrend === 'MOMENTUM' 
                    ? 'text-primary' 
                    : 'text-light-muted'
              }`}>
                <i className={`fas ${
                  prediction.marketTrend === 'STRONG_TREND' 
                    ? 'fa-chart-line' 
                    : prediction.marketTrend === 'MOMENTUM' 
                      ? 'fa-bolt' 
                      : 'fa-balance-scale'
                }`}></i>
                <span>
                  {prediction.marketTrend === 'STRONG_TREND' 
                    ? 'Thị trường đang có xu hướng mạnh' 
                    : prediction.marketTrend === 'MOMENTUM' 
                      ? 'Động lực thị trường tích cực' 
                      : 'Thị trường ổn định'}
                </span>
              </div>
            </div>
            
            <div className="pt-4 border-t border-gray-800">
              <div className="text-sm text-light-dimmed mb-2">Thông tin bổ sung</div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-light-muted">
                  <i className="fas fa-info-circle text-secondary"></i>
                  <span>Mẫu: {prediction.pattern}</span>
                </div>
                {prediction.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2 text-light-muted">
                    <i className="fas fa-exclamation-triangle text-primary"></i>
                    <span>{warning}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <div className="text-sm text-light-dimmed mb-2">Số đề xuất</div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-light-dimmed text-sm">
                  <span>Số chính</span>
                </div>
                <div className="mt-1 flex">
                  <div className="bg-primary bg-opacity-20 border border-primary rounded-lg py-2 px-6 text-2xl font-bold text-white">
                    {prediction.special.primary}
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-light-dimmed text-sm">
                  <span>Số phụ</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {prediction.special.secondary.map((num, index) => (
                    <div key={index} className="bg-[#1E1E1E] border border-gray-700 rounded-lg py-2 px-4 text-xl font-medium text-white">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-light-dimmed text-sm">
                  <span>Tránh đặt</span>
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {prediction.special.avoid.map((num, index) => (
                    <div key={index} className="bg-[#1E1E1E] border border-destructive rounded-lg py-1 px-3 text-destructive">
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-[#1E1E1E] p-4 flex justify-between items-center border-t border-gray-800">
        <span className="text-sm text-light-dimmed flex items-center gap-1">
          <i className="fas fa-robot text-secondary"></i> AI phân tích đã tối ưu cho Sun.win
        </span>
        <Button 
          onClick={onNewAnalysis}
          className="bg-[#242424] hover:bg-primary transition-all px-4 py-2 rounded-lg text-white text-sm font-medium"
        >
          Phân tích mới
        </Button>
      </div>
    </div>
  );
}
