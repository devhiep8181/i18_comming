import { useTranslation } from "react-i18next";
import Header from "./components/Header";
import "./i18n";

function App() {
  const { t } = useTranslation();

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      {/* Header xuất hiện ở trên cùng của mọi trang */}
      <Header />

      <div style={{ padding: "50px 20px", textAlign: "center" }}>
        <h1>{t("homepage.welcome_title")}</h1>
        <p style={{ color: "#666" }}>{t("homepage.subtitle")}</p>
        
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button style={{ padding: "10px 20px" }}>{t("common.button.save")}</button>
          <button style={{ padding: "10px 20px", backgroundColor: "#eee", border: "1px solid #ccc" }}>
            {t("common.button.cancel")}
          </button>
        </div>

        <div style={{ marginTop: "40px", borderTop: "1px solid #eee", paddingTop: "20px" }}>
           <p>
            <b>{t("homepage.selecte_language")}</b>
          </p>
          {/* Bạn có thể giữ nút ở đây hoặc chỉ dùng ở Header */}
        </div>
      </div>
    </div>
  );
}

export default App;