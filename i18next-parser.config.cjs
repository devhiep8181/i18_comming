module.exports = {
  locales: ['vi', 'en', 'ko', 'tr', 'zh-CN'],
  output: 'public/locales/$LOCALE.json',
  input: ['src/App.tsx', 'src/main.tsx'], // Chỉ định đích danh file để loại trừ lỗi pattern
  defaultValue: (locale, _, key) => (locale === 'vi' ? key : ''),
  keySeparator: false,
  nsSeparator: false,
};