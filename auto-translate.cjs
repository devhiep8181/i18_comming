import fs from 'fs';
import translate from 'google-translate-api-x';

async function run() {
  const enPath = './public/locales/en.json';
  if (!fs.existsSync(enPath)) return;

  const enData = JSON.parse(fs.readFileSync(enPath, 'utf8'));
  let hasChanged = false;

  for (let key in enData) {
    if (enData[key] === "") { // Nếu chưa được dịch
      const res = await translate(key, { from: 'vi', to: 'en' });
      enData[key] = res.text;
      console.log(`Translated: ${key} -> ${res.text}`);
      hasChanged = true;
    }
  }

  if (hasChanged) {
    fs.writeFileSync(enPath, JSON.stringify(enData, null, 2));
  }
}
run();