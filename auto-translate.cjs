const fs = require("fs");
const translate = require("google-translate-api-x");
const path = require("path");

const targetLanguages = ["en", "ko", "tr", "zh-CN"];
const sourceFile = path.join(__dirname, "src", "App.tsx"); // Đường dẫn đến file code của bạn
const localesDir = path.join(__dirname, "public", "locales");

async function run() {
  console.log("--- 🔍 Bắt đầu quét chữ từ App.tsx ---");

  if (!fs.existsSync(sourceFile)) {
    console.log(
      "❌ Không tìm thấy file src/App.tsx. Hãy kiểm tra lại đường dẫn!"
    );
    return;
  }

  const content = fs.readFileSync(sourceFile, "utf8");

  // Regex nhặt chữ trong t('...') hoặc t("...")
  const regex = /t\(['"](.+?)['"]\)/g;
  const keys = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    keys.push(match[1]);
  }

  if (keys.length === 0) {
    console.log("⚠️ Không tìm thấy hàm t() nào. Bạn đã lưu file chưa?");
    return;
  }

  console.log(`✅ Tìm thấy ${keys.length} câu cần xử lý.`);

  // Tạo thư mục nếu chưa có
  if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

  // Tạo file vi.json làm gốc (Tiếng Việt)
  // --- Xử lý file vi.json (File gốc) ---
  const viPath = path.join(localesDir, "vi.json");
  // Đọc dữ liệu cũ nếu có để không làm mất bản sửa tay
  let viData = fs.existsSync(viPath)
    ? JSON.parse(fs.readFileSync(viPath, "utf8"))
    : {};

  keys.forEach((k) => {
    // Chỉ gán k = k nếu nó chưa tồn tại hoặc đang trống
    if (!viData[k]) {
      viData[k] = k;
    }
  });

  // (Tùy chọn) Xóa bỏ các Key cũ không còn tồn tại trong code
  Object.keys(viData).forEach((oldKey) => {
    if (!keys.includes(oldKey)) delete viData[oldKey];
  });

  fs.writeFileSync(viPath, JSON.stringify(viData, null, 2));

  // Dịch sang các ngôn ngữ khác
  for (const lang of targetLanguages) {
    const filePath = path.join(localesDir, `${lang}.json`);
    let langData = fs.existsSync(filePath)
      ? JSON.parse(fs.readFileSync(filePath, "utf8"))
      : {};

    console.log(`--- 🌐 Đang dịch sang: ${lang.toUpperCase()} ---`);
    for (const key of keys) {
      // Nếu chưa có bản dịch thì mới gọi API
      if (!langData[key] || langData[key] === key) {
        try {
          const res = await translate(key, {
            from: "vi",
            to: lang,
            forceTo: true,
          });
          langData[key] = res.text;
          console.log(`   OK: "${key.substring(0, 15)}..." -> ${res.text}`);
        } catch (e) {
          console.error(`   ❌ Lỗi dịch [${lang}]:`, e.message);
        }
      }
    }
    fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
  }
  console.log(
    "\n🚀 THÀNH CÔNG! Đã cập nhật toàn bộ file trong public/locales/"
  );
}

run();
