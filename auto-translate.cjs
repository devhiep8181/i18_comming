const fs = require('fs');
const translate = require('google-translate-api-x');
const path = require('path');
const { globSync } = require('glob'); // Thêm thư viện này

const targetLanguages = ['vi', 'ko', 'tr', 'zh-CN']; 
const localesDir = path.join(__dirname, 'public', 'locales');

function setNestedKey(obj, path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const lastObj = keys.reduce((target, key) => {
        target[key] = target[key] || {};
        return target[key];
    }, obj);
    lastObj[lastKey] = value;
}

async function run() {
    console.log('--- 🔍 Đang quét toàn bộ file .tsx trong thư mục src ---');
    
    // Tìm tất cả các file .tsx trong thư mục src và các thư mục con
    const files = globSync('src/**/*.tsx');
    console.log(`Tìm thấy ${files.length} file cần quét.`);

    const allKeys = new Set();
    const regex = /t\(['"](.+?)['"]\)/g;

    // Quét từng file để thu thập Key
    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            allKeys.add(match[1]);
        }
    });

    const keys = [...allKeys];
    if (keys.length === 0) return console.log('❌ Không tìm thấy key nào trong các file .tsx');
    console.log(`✅ Tổng cộng có ${keys.length} key duy nhất.`);

    if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

    // --- 1. XỬ LÝ FILE GỐC (EN) ---
    const enData = {};
    keys.forEach(k => {
        const cleanText = k.split('.').pop().replace(/_/g, ' ');
        setNestedKey(enData, k, cleanText);
    });
    fs.writeFileSync(path.join(localesDir, 'en.json'), JSON.stringify(enData, null, 2));
    console.log('✅ Đã cập nhật file en.json.');

    // --- 2. DỊCH SANG CÁC TIẾNG KHÁC ---
    for (const lang of targetLanguages) {
        const filePath = path.join(localesDir, `${lang}.json`);
        // Đọc dữ liệu cũ để tránh dịch lại những gì đã dịch rồi
        let langData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};

        console.log(`--- 🌐 Đang dịch sang: ${lang.toUpperCase()} ---`);
        for (const key of keys) {
            try {
                // Kiểm tra xem key đã có giá trị dịch chưa (hỗ trợ object lồng nhau)
                const getCurrentValue = (obj, path) => path.split('.').reduce((prev, curr) => prev && prev[curr], obj);
                const existingValue = getCurrentValue(langData, key);

                if (!existingValue || existingValue.includes('_')) {
                    const textToTranslate = key.split('.').pop().replace(/_/g, ' ');
                    const res = await translate(textToTranslate, { from: 'en', to: lang, forceTo: true });
                    setNestedKey(langData, key, res.text);
                    console.log(`   [${lang}] ${key} -> ${res.text}`);
                }
            } catch (e) {
                console.error(`   ❌ Lỗi tại key: ${key}`);
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
    }
    console.log('\n🚀 HOÀN TẤT: Đã quét toàn bộ src/ và dịch đa ngôn ngữ!');
}

run();