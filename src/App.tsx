import { useTranslation } from 'react-i18next';
import './i18n'; // Import cấu hình i18n

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>{t('Xin chào, đây là dự án tự động đa ngôn ngữ')}</h1>
      <p>{t('Bạn chỉ cần viết tiếng Việt, máy sẽ tự dịch sang tiếng Anh')}</p>
      <h1>{t('Xin chào, đây là tính năng tự động dịch')}</h1>
      <p>{t('Hệ thống đang kiểm tra Husky')}</p>
      <p>{t('Hệ thống đang testffff')}</p>

      
      <div style={{ marginTop: '30px' }}>
        <p><b>{t('Chọn ngôn ngữ của bạn:')}</b></p>
        <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
        <button onClick={() => changeLanguage('en')}>English</button>
        <button onClick={() => changeLanguage('ko')}>한국어</button>
        <button onClick={() => changeLanguage('zh-CN')}>中文</button>
        <button onClick={() => changeLanguage('tr')}>Türkçe</button>
      </div>
    </div>
  );
}

export default App;