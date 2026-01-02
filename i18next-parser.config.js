export default {
  locales: ['vi', 'en', 'jp'],
  output: 'public/locales/$LOCALE.json',
  input: ['src/**/*.{ts,tsx}'], // Quét tất cả file React
  defaultValue: (locale, _, key) => (locale === 'vi' ? key : ''), 
  keySeparator: false,
  nsSeparator: false,
};