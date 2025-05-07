import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PredictionResults from "@/components/PredictionResults";
import { analyzePrediction } from "@/lib/gameUtils";

interface AnalysisData {
  numbers: number[];
  lowBets: string | null;
  lowMoney: string | null;
}

export default function GameAnalysis() {
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    numbers: [],
    lowBets: null,
    lowMoney: null
  });
  const [inputValue, setInputValue] = useState("");
  const [nextInputValue, setNextInputValue] = useState("");
  const [showInitialInput, setShowInitialInput] = useState(true);
  const [showNextInput, setShowNextInput] = useState(false);
  const [showLowBets, setShowLowBets] = useState(false);
  const [showLowMoney, setShowLowMoney] = useState(false);
  const [showResults, setShowResults] = useState(false);
  
  const handleInitialAnalysis = () => {
    const numbers = inputValue.split('-').map(n => parseInt(n.trim()));
    
    if (numbers.length !== 4 || numbers.some(isNaN) || numbers.some(n => n < 3 || n > 18)) {
      alert('Vui lòng nhập đúng định dạng với 4 số từ 3 đến 18, cách nhau bởi dấu "-"!');
      return;
    }
    
    setAnalysisData({
      ...analysisData,
      numbers
    });
    
    setShowInitialInput(false);
    setShowNextInput(true);
    setShowLowBets(true);
  };
  
  const handleNextAnalysis = () => {
    const input = parseInt(nextInputValue);
    
    if (isNaN(input) || input < 3 || input > 18) {
      alert('Vui lòng nhập số từ 3 đến 18!');
      return;
    }
    
    // Shift numbers and add new one
    const newNumbers = [...analysisData.numbers];
    newNumbers.shift();
    newNumbers.push(input);
    
    setAnalysisData({
      ...analysisData,
      numbers: newNumbers,
      lowBets: null,
      lowMoney: null
    });
    
    setShowLowMoney(false);
    setShowResults(false);
    setNextInputValue("");
  };
  
  const handleLowBetsSelection = (type: string) => {
    setAnalysisData({
      ...analysisData,
      lowBets: type
    });
    setShowLowMoney(true);
  };
  
  const handleLowMoneySelection = (type: string) => {
    setAnalysisData({
      ...analysisData,
      lowMoney: type
    });
    
    // Show prediction results after selecting low money
    setTimeout(() => {
      setShowResults(true);
      setShowNextInput(false);
      setShowLowBets(false);
      setShowLowMoney(false);
    }, 300);
  };
  
  const resetAnalysis = () => {
    setAnalysisData({
      numbers: [],
      lowBets: null,
      lowMoney: null
    });
    setInputValue("");
    setNextInputValue("");
    setShowInitialInput(true);
    setShowNextInput(false);
    setShowLowBets(false);
    setShowLowMoney(false);
    setShowResults(false);
  };
  
  // Calculate prediction when showing results
  const prediction = showResults 
    ? analyzePrediction(analysisData.numbers, analysisData.lowBets || "", analysisData.lowMoney || "") 
    : null;

  return (
    <>
      {/* Analysis Form */}
      {!showResults && (
        <div className="bg-[#242424] rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Phân Tích Sun.win</h2>
            <div className="flex items-center gap-2 text-light-dimmed text-sm">
              <i className="fas fa-chart-line text-secondary"></i>
              <span>Độ chính xác: 65-85%</span>
            </div>
          </div>
          
          {/* Initial Input Form */}
          {showInitialInput && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-light-muted mb-2">Nhập 4 kết quả gần nhất (3-18)</label>
                <div className="flex gap-3 mb-4">
                  <Input
                    type="text"
                    placeholder="11-9-15-12"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="flex-1 bg-[#1E1E1E] border-gray-700 py-3 px-4 text-white placeholder-gray-500"
                  />
                  <Button
                    onClick={handleInitialAnalysis}
                    className="btn-gradient px-6 rounded-lg font-medium text-white flex items-center gap-2"
                  >
                    <i className="fas fa-calculator"></i>
                    <span>Phân Tích</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Next Input Form */}
          {showNextInput && (
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-light-muted mb-2">Kết quả hiện tại:</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {analysisData.numbers.map((num, index) => (
                    <span key={index} className={`inline-block px-3 py-1 rounded-lg bg-[#1E1E1E] border border-gray-700 text-white ${index === 3 ? 'font-medium' : ''}`}>
                      {num}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Input
                  type="number"
                  placeholder="Nhập kết quả mới"
                  min="3"
                  max="18"
                  value={nextInputValue}
                  onChange={(e) => setNextInputValue(e.target.value)}
                  className="flex-1 bg-[#1E1E1E] border-gray-700 py-3 px-4 text-white placeholder-gray-500"
                />
                <Button
                  onClick={handleNextAnalysis}
                  className="btn-gradient px-6 rounded-lg font-medium text-white flex items-center gap-2"
                >
                  <i className="fas fa-sync-alt"></i>
                  <span>Cập Nhật</span>
                </Button>
              </div>
            </div>
          )}
          
          {/* Low Bets Questions */}
          {showLowBets && (
            <div className="space-y-4 pt-4 border-t border-gray-800 mt-4">
              <div>
                <label className="block text-sm font-medium text-light-muted mb-3">Bên nào là bên ít người đặt cược?</label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleLowBetsSelection("tài")}
                    className={`flex-1 ${analysisData.lowBets === "tài" ? "bg-secondary" : "bg-[#1E1E1E]"} hover:bg-secondary border border-gray-700 rounded-lg py-3 font-medium text-white transition-colors`}
                  >
                    TÀI
                  </Button>
                  <Button
                    onClick={() => handleLowBetsSelection("xỉu")}
                    className={`flex-1 ${analysisData.lowBets === "xỉu" ? "bg-secondary" : "bg-[#1E1E1E]"} hover:bg-secondary border border-gray-700 rounded-lg py-3 font-medium text-white transition-colors`}
                  >
                    XỈU
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {/* Low Money Questions */}
          {showLowMoney && (
            <div className="space-y-4 pt-4">
              <div>
                <label className="block text-sm font-medium text-light-muted mb-3">Bên nào là bên ít tiền đang bơm?</label>
                <div className="flex gap-3">
                  <Button
                    onClick={() => handleLowMoneySelection("tài")}
                    className={`flex-1 ${analysisData.lowMoney === "tài" ? "bg-secondary" : "bg-[#1E1E1E]"} hover:bg-secondary border border-gray-700 rounded-lg py-3 font-medium text-white transition-colors`}
                  >
                    TÀI
                  </Button>
                  <Button
                    onClick={() => handleLowMoneySelection("xỉu")}
                    className={`flex-1 ${analysisData.lowMoney === "xỉu" ? "bg-secondary" : "bg-[#1E1E1E]"} hover:bg-secondary border border-gray-700 rounded-lg py-3 font-medium text-white transition-colors`}
                  >
                    XỈU
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Prediction Results */}
      {showResults && prediction && (
        <PredictionResults 
          prediction={prediction} 
          onNewAnalysis={resetAnalysis} 
        />
      )}
    </>
  );
}
