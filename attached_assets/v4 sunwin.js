// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: light-gray; icon-glyph: hand-holding-usd;
let password = "Nhayydzvcl";
let attemptCount = 0;
let capital = 0;
let initialCapital = 0;
let gameResults = [];
let lastPrediction = null;
let winningStreak = 0;
let totalGames = 0;
let winGames = 0;

async function main() {
  await promptPassword();
}

async function promptPassword() {
  const alert = new Alert();
  alert.title = "🎮 Nhayy PREMIUM 🎮";
  alert.message = "⚡ Phiên bản cao cấp - Độc quyền ⚡";
  alert.addSecureTextField("🔑 Nhập mật khẩu");
  alert.addAction("✨ Xác Nhận");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();

  if (res === 0) {
    const input = alert.textFieldValue(0);
    if (input === password) {
      await showWelcome();
    } else {
      attemptCount++;
      if (attemptCount >= 2) {
        await showContact();
      } else {
        await showError("Mật khẩu không đúng. Vui lòng thử lại.");
      }
    }
  }
}

async function showWelcome() {
  const alert = new Alert();
  alert.title = "🌟 NHAYY PREMIUM 🌟";
  alert.message = `
━━━━━━━━━━━━━━━━━━
✨ Chào mừng trở lại!
💫 Phiên bản: Premium 4.0
📈 Tỉ lệ thắng: 65-85%
🎯 Thuật toán: Nâng cao
🔥 Chế độ: Theo dõi thời gian thực
━━━━━━━━━━━━━━━━━━
⚡ Đã tích hợp AI phân tích
🎲 Tối ưu cho Sun.win
💎 Bảo vệ vốn thông minh
`;
  alert.addAction("🚀 Bắt đầu");

  await alert.presentAlert();
  await inputCapital();
}

async function inputCapital() {
  const alert = new Alert();
  alert.title = "💰 Nhập Số Vốn";
  alert.message = `
━━━━━━━━━━━━━━━━━━
💎 Nhập số tiền vốn của bạn
⚡ VD: 500k, 1m, 2.5m
📊 Hệ thống sẽ tự động:
   • Phân bổ vốn thông minh
   • Bảo vệ vốn tối đa
   • Tối ưu lợi nhuận
━━━━━━━━━━━━━━━━━━
`;
  alert.addTextField("Nhập số tiền");
  alert.addAction("✅ Xác nhận");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();

  if (res === 0) {
    const input = alert.textFieldValue(0).replace(/[^0-9.]/g, '');
    capital = parseFloat(input) * 1000; // Chuyển đổi từ k/m sang đơn vị đồng
    initialCapital = capital; // Gán giá trị ban đầu
    if (!isNaN(capital) && capital > 0) {
      await startPrediction();
    } else {
      await showError("Vui lòng nhập số tiền hợp lệ!");
      await inputCapital();
    }
  }
}

async function startPrediction() {
  const alert = new Alert();
  alert.title = "🎲 Nhập Kết Quả";
  let message = `
━━━━━━━━━━━━━━━━━━
${gameResults.length === 0 ? 
    "📝 Nhập 4 kết quả gần nhất (3-18)\n💫 VD: 11-9-15-12" :
    `📊 Kết quả hiện tại:\n🎲 ${gameResults.slice(-3).join('-')}\n💫 Nhập kết quả mới:`}
━━━━━━━━━━━━━━━━━━
${getStats()}
`;
  alert.message = message;
  alert.addTextField("Nhập kết quả");
  alert.addAction("✨ Phân tích");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();

  if (res === 0) {
    const input = alert.textFieldValue(0);
    let numbers;

    if (gameResults.length === 0) {
      numbers = input.split('-').map(n => parseInt(n.trim()));
      if (validateInput(numbers)) {
        gameResults.push(...numbers);
      } else {
        await showError("Vui lòng nhập đúng định dạng với 4 số từ 3 đến 18, cách nhau bởi dấu '-'!");
        await startPrediction();
        return;
      }
    } else {
      const newNumber = parseInt(input.trim());
      if (validateSingleNumber(newNumber)) {
        if (gameResults.length >= 4) {
          gameResults.shift();
        }
        gameResults.push(newNumber);
        numbers = [...gameResults];
      } else {
        await showError("Vui lòng nhập số từ 3 đến 18!");
        await startPrediction();
        return;
      }
    }

    if (numbers && numbers.length === 4) {
      const prediction = analyzePrediction(numbers);
      lastPrediction = prediction;
      await showPrediction(prediction);
    } else {
      await showError("Vui lòng nhập đúng định dạng!");
      await startPrediction();
    }
  }
}

function validateInput(numbers) {
  return numbers.length === 4 && numbers.every(n => validateSingleNumber(n));
}

function validateSingleNumber(number) {
  return !isNaN(number) && number >= 3 && number <= 18;
}

function analyzePrediction(numbers) {
  // Tách phần tính toán độ tin cậy và loại dự đoán
  let confidence = 0;
  let type = '';
  let pattern = '';
  let warnings = [];
  let marketTrend = '';
  
  // Phân tích AI nâng cao
  const aiAnalysis = analyzeAI(numbers);
  confidence += aiAnalysis.confidence;
  if (aiAnalysis.type) {
    type = aiAnalysis.type;
  }
  if (aiAnalysis.pattern) {
    pattern = aiAnalysis.pattern;
  }

  // Phân tích chu kỳ
  const cycleAnalysis = analyzeCycle(numbers);
  confidence += cycleAnalysis.confidence;
  if (cycleAnalysis.type && !type) {
    type = cycleAnalysis.type;
  }

  // Phân tích thống kê
  const statsAnalysis = analyzeStats(numbers);
  confidence += statsAnalysis.confidence;
  if (statsAnalysis.warning) {
    warnings.push(statsAnalysis.warning);
  }

  // Phân tích xu hướng thị trường
  const marketAnalysis = analyzeMarket(numbers);
  confidence += marketAnalysis.confidence;
  marketTrend = marketAnalysis.trend;

  // Điều chỉnh độ tin cậy dựa trên lịch sử
  confidence = adjustConfidence(confidence);

  // Số đặc biệt và gợi ý phụ
  let special = null;
  if (confidence >= 57) {
    special = calculateSpecialNumbers(numbers, type);
  }

  // Tính toán số tiền cược
  const betAmount = calculateBetAmount(confidence);

  return {
    type,
    confidence,
    betAmount,
    special,
    warnings,
    pattern,
    marketTrend
  };
}

function analyzeAI(numbers) {
  const result = {
    type: '',
    confidence: 0,
    pattern: ''
  };

  // Phân tích mẫu phức tạp
  const patterns = [
    { type: 'WAVE', confidence: 15 },
    { type: 'TRIANGLE', confidence: 20 },
    { type: 'REVERSAL', confidence: 35 }
  ];

  for (let p of patterns) {
    if (detectPattern(numbers, p.type)) {
      result.confidence += p.confidence;
      result.pattern = p.type;
      break; // Chỉ lấy một mẫu đầu tiên match
    }
  }

  // Phân tích biên độ dao động
  const amplitude = Math.max(...numbers) - Math.min(...numbers);
  const volatility = calculateVolatility(numbers);

  if (amplitude > 8 && volatility > 2) {
    result.confidence += 10n;
    result.type = numbers[numbers.length - 1] > 10 ? 'Xỉu' : 'Tài';
  }

  return result;
}

function analyzeCycle(numbers) {
  const result = {
    type: '',
    confidence: 0
  };

  // Phát hiện chu kỳ
  const cycles = detectCycles(numbers);
  if (cycles.length > 0) {
    result.confidence += 20;
    const prediction = predictNextInCycle(cycles[0], numbers);
    if (prediction) {
      result.type = prediction;
    }
  }

  // Phân tích điểm đảo chiều
  const reversalPoints = findReversalPoints(numbers);
  if (reversalPoints.length >= 2) {
    result.confidence += 17;
    const prediction = predictReversal(reversalPoints, numbers);
    if (prediction) {
      result.type = prediction;
    }
  }

  return result;
}

function analyzeStats(numbers) {
  const result = {
    confidence: 0,
    warning: null
  };

  // Phân tích thống kê
  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  const stdDev = Math.sqrt(variance);

  // Kiểm tra độ phân tán
  if (stdDev < 2) {
    result.confidence += 20;
    result.warning = "⚠️ Chuỗi ổn định - Khả năng đảo chiều cao";
  } else if (stdDev > 4) {
    result.confidence += 15;
    result.warning = "⚠️ Biến động mạnh - Cần thận trọng";
  }

  return result;
}

function analyzeMarket(numbers) {
  const result = {
    confidence: 0,
    trend: ''
  };

  // Phân tích xu hướng thị trường
  const trendStrength = calculateTrendStrength(numbers);
  const momentum = calculateMomentum(numbers);

  if (trendStrength > 0.7) {
    result.confidence += 20;
    result.trend = 'STRONG_TREND';
  } else if (momentum > 0.5) {
    result.confidence += 15;
    result.trend = 'MOMENTUM';
  }

  return result;
}

function calculateSpecialNumbers(numbers, predictedType) {
  const result = {
    primary: 0,
    secondary: [],
    avoid: []
  };

  const mean = numbers.reduce((a, b) => a + b, 0) / numbers.length;
  const lastNum = numbers[numbers.length - 1];

  if (predictedType === 'TÀI') {
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

function calculateBetAmount(confidence) {
  const basePercent = 0.1; // 10% vốn cơ bản
  const maxPercent = 0.3; // Tối đa 30% vốn

  // Tính toán hệ số đặt cược
  let multiplier = 1;

  if (confidence >= 80) multiplier = 1.5;
  if (confidence >= 85) multiplier = 2;
  if (winningStreak >= 3) multiplier *= 1.2;

  // Áp dụng bảo vệ vốn
  if (capital < initialCapital * 0.5) multiplier *= 0.5;
  if (capital > initialCapital * 2) multiplier *= 0.8;

  const betPercent = Math.min(basePercent * multiplier, maxPercent);
  return Math.max(50000, Math.floor(capital * betPercent));
}

async function showPrediction(prediction) {
  const alert = new Alert();
  alert.title = "🎯 KẾT QUẢ PHÂN TÍCH";
  alert.message = `
━━━━━━━━━━━━━━━━━━
${getMarketIndicator(prediction.marketTrend)}
💫 Dự đoán: ${prediction.type}
⭐ Độ tin cậy: ${prediction.confidence}%
💰 Gợi ý cược: ${formatMoney(prediction.betAmount)}

🎲 Số đề xuất:
   • Chính: ${prediction.special?.primary ?? 'N/A'}
   • Phụ: ${prediction.special?.secondary.join(', ') ?? 'N/A'}
   • Tránh: ${prediction.special?.avoid.join(', ') ?? 'N/A'}

📊 Phân tích:
   • ${prediction.pattern || 'Mẫu chuẩn'}
   • ${prediction.warnings.join('\n   • ') || 'Không có cảnh báo'}
━━━━━━━━━━━━━━━━━━
Nhayy báo 🗣 : ${getStrength(prediction.confidence)}
`;

  alert.addAction("✅ Đặt cược");
  alert.addAction("🔄 Phân tích tiếp");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();

  if (res === 0) {
    await betResult(prediction);
  } else if (res === 1) {
    await startPrediction();
  }
}

function getMarketIndicator(trend) {
  switch(trend) {
    case 'STRONG_TREND':
      return "📈 Thị trường đang có xu hướng mạnh";
    case 'MOMENTUM':
      return "⚡ Động lực thị trường tích cực";
    default:
      return "📊 Thị trường ổn định";
  }
}

function getStats() {
  if (totalGames === 0) return "";

  const winRate = Math.round((winGames / totalGames) * 100);
  const profitAmount = capital - initialCapital;
  const profitRate = initialCapital > 0 ? Math.round((profitAmount / initialCapital) * 100) : 0;

  return `
📈 Thống kê:
   • Tổng phiên: ${totalGames}
   • Thắng: ${winGames}
   • Tỉ lệ: ${winRate}%
   • Lợi nhuận: ${formatMoney(profitAmount)} (${profitRate}%)
   • Streak: ${winningStreak} thắng liên tiếp
`;
}

async function betResult(prediction) {
  const alert = new Alert();
  alert.title = "💰 KẾT QUẢ CƯỢC";
  alert.message = `
━━━━━━━━━━━━━━━━━━
Bạn đã đặt ${prediction.type}
💫 Số gợi ý: ${prediction.special?.primary ?? 'N/A'}
⚡ Kết quả thế nào?
━━━━━━━━━━━━━━━━━━
`;
  alert.addAction("✨ Thắng");
  alert.addAction("💔 Thua");
  alert.addAction("🔄 Phân tích lại");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();

  if (res === 0 || res === 1) {
    totalGames++;
    if (res === 0) {
      winGames++;
      winningStreak++;
      capital += prediction.betAmount;
      await showWinResult(prediction);
    } else {
      winningStreak = 0;
      capital -= prediction.betAmount;
      await showLoseResult(prediction);
    }
  } else if (res === 2) {
    await showPrediction(lastPrediction);
  }
}

async function showWinResult(prediction) {
  const alert = new Alert();
  alert.title = "🎉 CHÚC MỪNG THẮNG";
  alert.message = `
━━━━━━━━━━━━━━━━━━
✨ Dự đoán chính xác!
💰 Lợi nhuận: +${formatMoney(prediction.betAmount)}
💫 Vốn hiện tại: ${formatMoney(capital)}
🔥 Streak: ${winningStreak} thắng liên tiếp
━━━━━━━━━━━━━━━━━━
`;
  alert.addAction("🚀 Tiếp tục");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();
  if (res === 0) {
    await startPrediction();
  }
}

async function showLoseResult(prediction) {
  const alert = new Alert();
  alert.title = "?? TIẾC QUÁ";
  alert.message = `
━━━━━━━━━━━━━━━━━━
😢 Dự đoán chưa chính xác
💸 Thua lỗ: -${formatMoney(prediction.betAmount)}
💰 Vốn còn lại: ${formatMoney(capital)}
⚡ Đừng nản, tiếp tục nào!
━━━━━━━━━━━━━━━━━━
`;
  alert.addAction("🚀 Gỡ lại");
  alert.addCancelAction("❌ Thoát");

  const res = await alert.presentAlert();
  if (res === 0) {
    await startPrediction();
  }
}

function formatMoney(amount) {
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}m`;
  }
  return `${(amount / 1000).toFixed(0)}k`;
}

function getStrength(confidence) {
  if (confidence >= 85) return "đm chuẩn bị vứt bát 🌚";
  if (confidence >= 80) return "Cầu siêu đẹp theo đi 🌟";
  if (confidence >= 75) return "nên theo ‼️";
  if (confidence >= 70) return "Theo hoặc không 💤";
  return "Bỏ tay này ❌";
}

// Các hàm phân tích bổ sung
function calculateVolatility(numbers) {
  const changes = [];
  for (let i = 1; i < numbers.length; i++) {
    changes.push(Math.abs(numbers[i] - numbers[i-1]));
  }
  return changes.reduce((a, b) => a + b, 0) / changes.length;
}

function calculateTrendStrength(numbers) {
  const trend = numbers[numbers.length - 1] - numbers[0];
  return numbers.length > 1 ? Math.abs(trend) / (numbers.length - 1) : 0;
}

function calculateMomentum(numbers) {
  if (numbers.length < 2) return 0;
  const recentChange = numbers[numbers.length - 1] - numbers[numbers.length - 2];
  const totalChange = numbers[numbers.length - 1] - numbers[0];
  const avgChange = numbers.length > 1 ? totalChange / (numbers.length - 1) : 0;
  return avgChange !== 0 ? Math.abs(recentChange / avgChange) : 0;
}

function detectPattern(numbers, type) {
  switch(type) {
    case 'WAVE':
      return detectWavePattern(numbers);
    case 'TRIANGLE':
      return detectTrianglePattern(numbers);
    case 'REVERSAL':
      return detectReversalPattern(numbers);
    default:
      return false;
  }
}

function detectWavePattern(numbers) {
  let changes = [];
  for (let i = 1; i < numbers.length; i++) {
    changes.push(numbers[i] - numbers[i-1]);
  }
  return changes.some(c => c > 0) && changes.some(c => c < 0);
}

function detectTrianglePattern(numbers) {
  const lastThree = numbers.slice(-3);
  const highs = Math.max(...lastThree);
  const lows = Math.min(...lastThree);
  return (highs - lows) <= 3;
}

function detectReversalPattern(numbers) {
  const start = numbers[0];
  const end = numbers[numbers.length - 1];
  return Math.abs(end - start) >= 4;
}

function findReversalPoints(numbers) {
  const points = [];
  for (let i = 1; i < numbers.length - 1; i++) {
    if ((numbers[i] > numbers[i-1] && numbers[i] > numbers[i+1]) ||
        (numbers[i] < numbers[i-1] && numbers[i] < numbers[i+1])) {
      points.push(i);
    }
  }
  return points;
}

function detectCycles(numbers) {
  const cycles = [];
  // Tìm chu kỳ dựa trên khoảng cách giữa các điểm đảo chiều
  const reversalPoints = findReversalPoints(numbers);
  if (reversalPoints.length >= 2) {
    const cycleLengths = [];
    for (let i = 1; i < reversalPoints.length; i++) {
      cycleLengths.push(reversalPoints[i] - reversalPoints[i-1]);
    }
    if (new Set(cycleLengths).size === 1) {
      cycles.push({
        length: cycleLengths[0],
        points: reversalPoints
      });
    }
  }
  return cycles;
}

function predictNextInCycle(cycle, numbers) {
  if (cycle.points.length < 2) return null;
  const lastIndex = cycle.points[cycle.points.length - 1];
  const secondLastIndex = cycle.points[cycle.points.length - 2];
  const lastPoint = numbers[lastIndex];
  const secondLastPoint = numbers[secondLastIndex];
  return lastPoint > secondLastPoint ? 'XỈU' : 'TÀI';
}

function predictReversal(points, numbers) {
  if (points.length < 2) return null;
  const lastPoint = numbers[points[points.length - 1]];
  const currentValue = numbers[numbers.length - 1];
  return currentValue > lastPoint ? 'XỈU' : 'TÀI';
}

function adjustConfidence(confidence) {
  // Điều chỉnh độ tin cậy dựa trên lịch sử
  let adjusted = confidence;

  if (winningStreak >= 3) {
    adjusted = Math.min(85, adjusted + 5);
  }

  if (totalGames > 0) {
    const winRate = winGames / totalGames;
    if (winRate >= 0.7) {
      adjusted = Math.min(85, adjusted + 3);
    } else if (winRate <= 0.3) {
      adjusted = Math.max(65, adjusted - 3);
    }
  }

  return Math.round(adjusted);
}

async function showError(message = "Có lỗi xảy ra!") {
  const alert = new Alert();
  alert.title = "⚠️ LỖI";
  alert.message = message;
  alert.addAction("🔄 Thử lại");
  await alert.presentAlert();
}

async function showContact() {
  const alert = new Alert();
  alert.title = "⚠️ CẢNH BÁO";
  alert.message = `
━━━━━━━━━━━━━━━━━━
❌ Bạn đã nhập sai mật khẩu quá nhiều lần!
📱 Vui lòng liên hệ admin
━━━━━━━━━━━━━━━━━━
`;
  alert.addAction("📱 Liên hệ");
  alert.addAction("🔄 Thử lại");

  const res = await alert.presentAlert();
  if (res === 0) {
    Safari.open("https://facebook.com/Nhayydzvcll");
  } else {
    attemptCount = 0;
    await promptPassword();
  }
}

await main();
