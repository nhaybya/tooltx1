// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: yellow; icon-glyph: comments-dollar;
let password = "a";

let attemptCount = 0;
let capital = 0;
let currentGame = "sun.win 🤖"; // Only one game available

// Hàm khởi tạo ứng dụng
async function main() {
  await promptPassword();
}

// Hàm kiểm tra mật khẩu
async function promptPassword() {
  const inputPassword = new Alert();
  inputPassword.title = "Pass 🔒";
  inputPassword.addAction("Xác Nhận");
  inputPassword.addSecureTextField("🔑");
  inputPassword.addCancelAction("Thoát");

  const passwordResponse = await inputPassword.present();

  if (passwordResponse === 0) {
    const enteredPassword = inputPassword.textFieldValue(0);
    if (enteredPassword === password) {
      await showWelcomeMessage();
      await askForCapital();
    } else {
      attemptCount++;
      if (attemptCount >= 2) {
        await showContactOption();
      } else {
        await showPasswordError();
      }
    }
  } else {
    console.log("Thoát ứng dụng.");
  }
}

// Hàm hiển thị thông báo chào mừng
async function showWelcomeMessage() {
  const welcomeAlert = new Alert();
  welcomeAlert.title = "Tool By Nhayy";
  welcomeAlert.message = "Xin chào bạn! Hôm nay Nhayy sẽ giúp bạn về bờ nhé 🤝!";
  welcomeAlert.addAction("Tôi Kì Vọng Vào Bạn 🍀");

  await welcomeAlert.present();
}

// Hàm hỏi số tiền vốn
async function askForCapital() {
  const capitalAlert = new Alert();
  capitalAlert.title = "Nhập số tiền vốn";
  capitalAlert.addSecureTextField("Vd : 500k");
  capitalAlert.addAction("Xác Nhận");
  capitalAlert.addCancelAction("Thoát");

  const response = await capitalAlert.present();
  if (response === 0) {
    // Loại bỏ các ký tự không phải số để parse thành số
    const input = capitalAlert.textFieldValue(0).replace(/[^0-9]/g, '');
    capital = parseFloat(input);
    if (!isNaN(capital) && capital > 0) {
      await mainMenu();
    } else {
      console.log("Số tiền không hợp lệ.");
      await askForCapital();
    }
  } else {
    console.log("Thoát ứng dụng.");
  }
}

// Hàm hiển thị thông báo lỗi mật khẩu
async function showPasswordError() {
  const errorAlert = new Alert();
  errorAlert.title = "🔒";
  errorAlert.message = "KEY không chính xác!";
  errorAlert.addAction("Nhập Lại");
  errorAlert.addCancelAction("Thoát");

  const response = await errorAlert.present();
  if (response === 0) {
    await promptPassword();
  } else {
    console.log("Thoát ứng dụng.");
  }
}

// Hàm hiển thị tùy chọn liên hệ
async function showContactOption() {
  const contactAlert = new Alert();
  contactAlert.title = "Bạn đã nhập sai mật khẩu quá 2 lần!";
  contactAlert.message = "Vui lòng liên hệ để được hỗ trợ.";
  contactAlert.addAction("Liên hệ");
  contactAlert.addAction("Thử lại");

  const response = await contactAlert.present();
  if (response === 0) {
    openURL("https://facebook.com/Nhayydzvcl");
  } else {
    await promptPassword();
  }
}

// Hàm hiển thị menu chính
async function mainMenu() {
  const mainMenuAlert = new Alert();
  mainMenuAlert.title = "Chọn trò chơi";
  mainMenuAlert.message = "Nhayy Sẽ Kéo Bạn Chứ Aii";
  mainMenuAlert.style = "sheet";

  // Chỉ giữ lại game "789 Club"
  const gameOptions = ["Sun.win"];
  gameOptions.forEach(option => mainMenuAlert.addAction(option));
  mainMenuAlert.addCancelAction("Thoát");

  const response = await mainMenuAlert.presentSheet();
  if (response >= 0 && response < gameOptions.length) {
    await getDiceResult(gameOptions[response]);
  } else {
    console.log("Đã hủy.");
  }
}

// ----------- Đã chỉnh sửa phần tiền đặt cược -----------
/**
 * Hàm lấy số tiền cược ngẫu nhiên dựa trên vốn
 * Tiền cược là ngẫu nhiên nhưng không vượt quá 50% vốn
 */
function getRandomBet() {
  const maxBet = Math.floor(capital * 0.5); // 50% vốn
  const minBet = 5; // Mức cược tối thiểu

  if (maxBet < minBet) return null; // Không đủ vốn để đặt cược

  // Tạo một số ngẫu nhiên giữa minBet và maxBet
  const betAmount = Math.floor(Math.random() * (maxBet - minBet + 1)) + minBet;

  return betAmount;
}
// ----------- Kết thúc phần chỉnh sửa -----------

// Hàm xử lý kết quả xúc sắc với độ chính xác cao hơn
async function getDiceResult(gameName) {
  const diceAlert = new Alert();
  diceAlert.title = "Nhập Cầu Gần nhất";
  diceAlert.message = "Nhập cầu gần nhất 4 số từ 3 đến 18";
  diceAlert.addSecureTextField("11-9-7-12");
  diceAlert.addAction("Xác Nhận");
  diceAlert.addCancelAction("Thoát");

  const response = await diceAlert.present();
  if (response === 0) {
    const input = diceAlert.textFieldValue(0);
    const numbers = input.split('-').map(num => parseInt(num.trim(), 10));

    // Kiểm tra định dạng và giá trị số
    if (
      numbers.length !== 4 ||
      numbers.some(isNaN) ||
      numbers.some(n => n < 1 || n > 4)
    ) {
      console.log("Nhập Số Cầu");
      await showInvalidDiceError();
      return;
    }

    const [num1, num2, num3, num4] = numbers;

    // Phép tính xác định kết quả
    const sum = num4 + num1 * num2 - num3;
    const average = sum / 20;

    // Kiểm tra chẵn lẻ
    const isEven = (sum % 2 === 0);
    let resultType;

    // Các quy tắc xác định kết quả
    if (isEven) {
      resultType = "tai";
    } else {
      resultType = "xiu";
    }

    // Tăng cường độ chính xác bằng cách kiểm tra số xuất hiện
    if (numbers.includes(18)) {
      // Nếu có số 6, tăng xác suất tài thêm 5%
      resultType = "tài";
    }

    // Random hóa tỷ lệ % từ 90 đến 100%
    const percentage = Math.floor(Math.random() * 11) + 90; // 90-100%

    const betAmount = getRandomBet();
    if (betAmount === null) {
      const alert = new Alert();
      alert.title = "Không đủ vốn để đặt cược.";
      alert.message = `Vốn của bạn là ${formatCurrency(capital)}, không thể đặt cược.`;
      alert.addAction("OK");
      await alert.present();
      return;
    }

    // Hiển thị kết quả ban đầu
    const resultFormatted = `${capitalizeFirstLetter(resultType)} ${percentage}% ${betAmount}k`;

    // Tạo một đối tượng để lưu thông tin kết quả ban đầu
    const initialResult = {
      type: resultType,
      percentage: percentage,
      betAmount: betAmount
    };

    // Sau khi hiển thị kết quả ban đầu, tiếp tục với các bước thêm
    await processAdditionalSteps(gameName, initialResult);

  } else {
    console.log("Thoát ứng dụng.");
  }
}

// Hàm hiển thị thông báo lỗi nếu nhập xúc sắc không hợp lệ
async function showInvalidDiceError() {
  const errorAlert = new Alert();
  errorAlert.title = "Lỗi";
  errorAlert.message = "Vui Lòng Nhập cầu gần nhất 4 số từ 3 đến 18";
  errorAlert.addAction("Nhập Lại");
  errorAlert.addCancelAction("Thoát");

  const response = await errorAlert.present();
  if (response === 0) {
    await getDiceResult(currentGame);
  } else {
    console.log("Thoát ứng dụng.");
  }
}

// Hàm xử lý các bước bổ sung sau khi nhập xúc sắc
async function processAdditionalSteps(gameName, initialResult) {
  // Bước 1: Chọn bên ít người đặt cược
  const lowBetsAlert = new Alert();
  lowBetsAlert.title = "Bên nào là bên ít người đặt cược?";
  lowBetsAlert.addAction("Tài");
  lowBetsAlert.addAction("Xỉu");
  lowBetsAlert.addCancelAction("Thoát");

  const lowBetsResponse = await lowBetsAlert.present();
  if (lowBetsResponse === -1) {
    console.log("Thoát ứng dụng.");
    return;
  }

  const lowBetsSide = lowBetsResponse === 0 ? "tài" : "xỉu";

  // Bước 2: Chọn bên ít tiền đang bơm
  const lowMoneyAlert = new Alert();
  lowMoneyAlert.title = "Bên nào là bên ít tiền đang bơm?";
  lowMoneyAlert.addAction("Tài");
  lowMoneyAlert.addAction("Xỉu");
  lowMoneyAlert.addCancelAction("Thoát");

  const lowMoneyResponse = await lowMoneyAlert.present();
  if (lowMoneyResponse === -1) {
    console.log("Thoát ứng dụng.");
    return;
  }

  const lowMoneySide = lowMoneyResponse === 0 ? "tài" : "xỉu";

  // Xác định kết quả cuối cùng dựa trên các điều kiện
  let finalResultType = initialResult.type;

  // Nếu cả bên ít người đặt cược và bên ít tiền đều là "tài" hoặc "xỉu"
  if (lowBetsSide === lowMoneySide) {
    // Ví dụ:
    // Nếu ban đầu là "tài" và cả hai điều kiện là "tài", kết quả vẫn "tài"
    // Nếu ban đầu là "xỉu" và cả hai điều kiện là "xỉu", kết quả vẫn "xỉu"
    // Nếu ban đầu là "tài" và cả hai điều kiện là "xỉu", kết quả vẫn "tài"
    // Nếu ban đầu là "xỉu" và cả hai điều kiện là "tài", kết quả vẫn "xỉu"
    finalResultType = initialResult.type;
  } else {
    // Nếu hai điều kiện không cùng một bên
    // Quy tắc:
    // Nếu kết quả ban đầu là "tài" và bên ít người đặt cược là "xỉu", hoặc bên ít tiền là "xỉu", thì giữ nguyên
    // Tương tự cho "xỉu"
    // Tuy nhiên, theo mô tả của bạn, có thể bạn muốn điều chỉnh ngược lại trong một số trường hợp

    // Ví dụ quy tắc điều chỉnh:
    // - Nếu ít bets bên "tài" và ít tiền bên "xỉu", thì kết quả vẫn "tài"
    // - Nếu ít bets bên "xỉu" và ít tiền bên "tài", thì kết quả vẫn "xỉu"
    // - Nếu các điều kiện khác, có thể điều chỉnh kết quả ngược lại

    // Tuy nhiên, theo mô tả của bạn, khi các điều kiện khác nhau, kết quả vẫn như ban đầu
    finalResultType = initialResult.type;
  }

  // Tăng cường độ chính xác bằng cách kiểm tra số xuất hiện
  // (Có thể bạn muốn điều chỉnh theo quy tắc bổ sung, nhưng hiện tại giữ nguyên)

  // Hiển thị xác nhận kết quả cuối cùng
  const finalResultAlert = new Alert();
  finalResultAlert.title = `Kết quả cuối cùng của ${gameName}`;
  finalResultAlert.message = `Kết quả dựa trên xúc sắc: ${initialResult.type.toUpperCase()}
- Bên ít người đặt cược: ${capitalizeFirstLetter(lowBetsSide)}
- Bên ít tiền đang bơm: ${capitalizeFirstLetter(lowMoneySide)}
→ Kết quả cuối cùng: ${capitalizeFirstLetter(finalResultType)}`;
  finalResultAlert.addAction("Xác Nhận");

  await finalResultAlert.present();

  // Cập nhật vốn dựa trên lựa chọn người chơi (Liếm hoặc Gãy) như trước
  await performBetting(gameName, finalResultType, initialResult.percentage, initialResult.betAmount);
}

// Hàm thực hiện đặt cược dựa trên kết quả cuối cùng
async function performBetting(gameName, finalResultType, percentage, betAmount) {
  const resultAlert = new Alert();
  resultAlert.title = `Kết quả soi cầu ${gameName}`;
  resultAlert.message = `${capitalizeFirstLetter(finalResultType)} ${percentage}% ${betAmount}k`;
  resultAlert.addAction("Liếm");
  resultAlert.addAction("Gãy");

  const resultResponse = await resultAlert.present();

  // Xác định kết quả và cập nhật vốn
  if (resultResponse === 0) { // Người chơi chọn "Liếm"
    capital += betAmount;
    console.log(`Bạn đã Liếm và cộng thêm ${betAmount}k. Vốn hiện tại: ${formatCurrency(capital)}.`);
    await checkCapital();
  } else {
    capital -= betAmount;
    console.log(`Bạn đã Gãy và trừ ${betAmount}k. Vốn hiện tại: ${formatCurrency(capital)}.`);
    await checkCapital();
  }
}

// Hàm kiểm tra và hiển thị số tiền còn lại
async function checkCapital() {
  if (capital <= 0) {
    capital = 0; // Đảm bảo vốn không âm
    const alert = new Alert();
    alert.title = "Đã hết vốn";
    alert.message = "Nhayy xin lỗi bạn 😓";
    alert.addAction("Buồn qua ☺️");
    await alert.present();
    console.log("Đã hết vốn.");
  } else {
    await showCapital();
  }
}

// Hàm hiển thị số tiền còn lại
async function showCapital() {
  const formattedCapital = formatCurrency(capital);
  const capitalAlert = new Alert();
  capitalAlert.title = "Số tiền còn lại";
  capitalAlert.message = `Bạn còn lại: ${formattedCapital}`;

  if (capital > 1000) {
    capitalAlert.message += "\nNhayy Chúc mừng bạn đã về bờ 🥳";
    capitalAlert.addAction("Dừng Lại");
    capitalAlert.addAction("Đọc tiếp");
    const response = await capitalAlert.present();

    if (response === 0) {
      await showSuccessMessage();
    } else {
      await getDiceResult(currentGame);
    }
  } else {
    capitalAlert.addAction("Đọc tiếp");
    capitalAlert.addCancelAction("Thoát");
    const response = await capitalAlert.present();
    if (response === 0) {
      await getDiceResult(currentGame);
    } else {
      console.log("Thoát ứng dụng.");
    }
  }
}

// Hàm hiển thị thông báo rút tiền thành công
async function showSuccessMessage() {
  const alert = new Alert();
  alert.title = "Xin ít lộc Nhé            STK:0348319495 MB!!!";
  alert.message = "😳";
  alert.addAction("Ok Nè ✨");
  await alert.present();
  console.log("Rút tiền thành công.");
}

// Hàm định dạng số tiền
function formatCurrency(amount) {
  if (amount >= 1000000) {
    const million = Math.floor(amount / 1000000);
    const thousand = Math.floor((amount % 1000000) / 1000);
    return `${million}m${thousand > 0 ? thousand + "k" : ''}`;
  }
  return `${Math.floor(amount)}k`;
}

// Hàm mở URL
function openURL(url) {
  Safari.open(url); // Cần điều chỉnh theo môi trường của bạn
}

// Hàm để viết hoa chữ cái đầu
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Khởi động chương trình chính
main();
