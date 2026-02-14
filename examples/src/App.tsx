import { useState } from "react";
import { useTranslation } from "./i18n";

export default function App() {
  const { t, setLocale, locale, isLoading } = useTranslation();
  const [count, setCount] = useState(1);

  return (
    <div>
      <h1>{t("app:title")}</h1>

      <p>{t("app:welcome", { name: "SSE" })}</p>
      <p>{t("app:items", { count })}</p>

      <button onClick={() => setCount((c) => c + 1)}>+</button>

      <hr />

      {isLoading ? (
        <p>Loading translations...</p>
      ) : (
        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={() => setLocale("en")} disabled={locale === "en"}>
            English
          </button>
          <button onClick={() => setLocale("es")} disabled={locale === "es"}>
            Español (Lazy Load)
          </button>
        </div>
      )}

      <div>
        {t("agree", {
          terms: (chunk) => <strong>{chunk}</strong>,
          privacy: (chunk) => <a>{chunk}</a>,
        })}
      </div>
    </div>
  );
}
