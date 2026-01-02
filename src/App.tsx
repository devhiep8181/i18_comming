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
      
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => changeLanguage('vi')}>Tiếng Việt</button>
        <button onClick={() => changeLanguage('en')} style={{ marginLeft: '10px' }}>English</button>
      </div>
    </div>
  );
}

export default App;