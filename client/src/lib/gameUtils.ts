export interface PredictionResult {
  type: string;
  confidence: number;
  special: {
    primary: number;
    secondary: number[];
    avoid: number[];
  };
  marketTrend: string;
  pattern: string;
  warnings: string[];
}

export function analyzePrediction(numbers: number[], lowBets: string, lowMoney: string): PredictionResult {
  // Calculate sum and average
  const sum = numbers.reduce((a, b) => a + b, 0);
  const avg = sum / numbers.length;
  
  // Check for tail or small
  let type = avg > 10.5 ? 'Xỉu' : 'Tài';
  
  // Calculate confidence
  let confidence = 0;
  
  // Adjust based on low bets and low money
  if (lowBets === lowMoney) {
    // Strengthen the prediction
    confidence = Math.floor(65 + Math.random() * 20); // 65-85%
  } else {
    // Slightly less confident
    confidence = Math.floor(65 + Math.random() * 15); // 65-80%
  }
  
  // If low bets matches the prediction type, increase confidence
  if (lowBets === type.toLowerCase()) {
    confidence = Math.min(confidence + 5, 85);
  }
  
  // Calculate special numbers
  const special = calculateSpecialNumbers(numbers, type);
  
  // Determine market trend
  const marketTrend = Math.random() > 0.5 ? 'STRONG_TREND' : 'MOMENTUM';
  
  // Determine pattern
  const pattern = Math.random() > 0.5 ? 'TRIANGLE' : 'WAVE';
  
  // Generate warnings
  const warnings: string[] = [];
  if (Math.random() > 0.7) {
    warnings.push('Chuỗi ổn định - Khả năng đảo chiều cao');
  }
  
  return {
    type,
    confidence,
    special,
    marketTrend,
    pattern,
    warnings
  };
}

function calculateSpecialNumbers(numbers: number[], predictedType: string) {
  const result = {
    primary: 0,
    secondary: [] as number[],
    avoid: [] as number[]
  };
  
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  
  if (predictedType === 'Tài') {
    result.primary = Math.round(Math.min(18, Math.max(11, mean + 2)));
    result.secondary = [result.primary - 1, result.primary + 1].filter(n => n >= 11 && n <= 18);
    result.avoid = [3, 4, 5, 6, 7];
  } else {
    result.primary = Math.round(Math.max(3, Math.min(10, mean - 2)));
    result.secondary = [result.primary - 1, result.primary + 1].filter(n => n >= 3 && n <= 10);
    result.avoid = [14, 15, 16, 17, 18];
  }
  
  return result;
}
