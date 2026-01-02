const fs = require('fs');
const translate = require('google-translate-api-x');
const path = require('path');
const { globSync } = require('glob');

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

// Hàm bổ trợ để lấy giá trị từ object lồng nhau
const getCurrentValue = (obj, path) => path.split('.').reduce((prev, curr) => prev && prev[curr], obj);

async function run() {
    console.log('--- 🔍 Đang quét toàn bộ file .tsx trong thư mục src ---');
    
    const files = globSync('src/**/*.tsx');
    const allKeys = new Set();
    const regex = /t\(['"](.+?)['"]\)/g;

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        let match;
        while ((match = regex.exec(content)) !== null) {
            allKeys.add(match[1]);
        }
    });

    const keys = [...allKeys];
    if (keys.length === 0) return console.log('❌ Không tìm thấy key nào.');

    if (!fs.existsSync(localesDir)) fs.mkdirSync(localesDir, { recursive: true });

    // --- 1. XỬ LÝ FILE GỐC (EN) ---
    const enPath = path.join(localesDir, 'en.json');
    // ĐỌC FILE CŨ (NẾU CÓ) ĐỂ GIỮ GIÁ TRỊ ĐÃ SỬA
    let enData = fs.existsSync(enPath) ? JSON.parse(fs.readFileSync(enPath, 'utf8')) : {};
    
    keys.forEach(k => {
        const existingVal = getCurrentValue(enData, k);
        // CHỈ CẬP NHẬT NẾU KEY CHƯA CÓ HOẶC GIÁ TRỊ TRỐNG
        if (!existingVal) {
            const cleanText = k.split('.').pop().replace(/_/g, ' ');
            setNestedKey(enData, k, cleanText);
            console.log(` ✨ Đã thêm key mới vào en.json: ${k}`);
        }
    });
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
    console.log('✅ Đã cập nhật file en.json (Giữ nguyên các giá trị bạn đã sửa).');

    // --- 2. DỊCH SANG CÁC TIẾNG KHÁC ---
    for (const lang of targetLanguages) {
        const filePath = path.join(localesDir, `${lang}.json`);
        let langData = fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, 'utf8')) : {};

        console.log(`--- 🌐 Đang dịch sang: ${lang.toUpperCase()} ---`);
        for (const key of keys) {
            try {
                const existingValue = getCurrentValue(langData, key);
                
                // Lấy nội dung từ file EN hiện tại làm gốc để dịch
                const sourceText = getCurrentValue(enData, key) || key.split('.').pop().replace(/_/g, ' ');

                if (!existingValue || existingValue.includes('_')) {
                    const res = await translate(sourceText, { from: 'en', to: lang, forceTo: true });
                    setNestedKey(langData, key, res.text);
                    console.log(`   [${lang}] ${key} -> ${res.text}`);
                }
            } catch (e) {
                console.error(`   ❌ Lỗi tại key: ${key}`);
            }
        }
        fs.writeFileSync(filePath, JSON.stringify(langData, null, 2));
    }
    console.log('\n🚀 HOÀN TẤT!');
}

run();