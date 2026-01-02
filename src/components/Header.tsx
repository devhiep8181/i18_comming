import { useTranslation } from "react-i18next";

const Header = () => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header
      style={{
        borderBottom: "1px solid #eee",
        padding: "10px 40px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
      }}
    >
      <div className="logo" style={{ fontSize: "1.2rem" }}>
        <strong>{t("header.logo_name")}</strong>
      </div>

      <nav style={{ display: "flex", gap: "20px" }}>
        <span>{t("header.menu.home")}</span>
        <span>{t("header.menu.about")}</span>
        <span>{t("header.menu.contact")}</span>
      </nav>

      <div style={{ display: "flex", gap: "5px" }}>
        <button onClick={() => changeLanguage("vi")}>VI</button>
        <button onClick={() => changeLanguage("en")}>EN</button>
        <button onClick={() => changeLanguage("ko")}>KO</button>
        <button onClick={() => changeLanguage("zh-CN")}>ZH</button>
        <button onClick={() => changeLanguage("tr")}>TR</button>
      </div>
    </header>
  );
};

export default Header;