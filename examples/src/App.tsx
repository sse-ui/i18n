import { useState } from "react";
import { useTranslation } from "./i18n";

export default function App() {
  const { t, setLocale, locale } = useTranslation();
  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>{t("app.title")}</h1>

      <p>{t("app.welcome", { name: "SSE" })}</p>
      <p>{t("app.items", { count })}</p>

      <button onClick={() => setCount((c) => c + 1)}>+</button>

      <button onClick={() => setLocale(locale === "en" ? "fr" : "en")}>
        {t("app.switch")}
      </button>
    </div>
  );
}
