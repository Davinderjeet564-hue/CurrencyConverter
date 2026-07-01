import { useState } from "react";
import Converter from "./components/Converter";
import ApiKeyModal from "./components/ApiKeyModal";

function App() {
  const [apiKey, setApiKey] = useState<string>(() => {
    return (
      import.meta.env.VITE_EXCHANGE_RATE_API_KEY ||
      localStorage.getItem("VITE_EXCHANGE_RATE_API_KEY") ||
      ""
    );
  });

  const handleKeySave = (key: string) => {
    localStorage.setItem("VITE_EXCHANGE_RATE_API_KEY", key);
    setApiKey(key);
  };

  return (
    <div className="relative flex h-screen items-center justify-center bg-[url('/src/assets/stock-image.png')] bg-cover bg-center">
      <div className="w-full max-w-lg mx-auto my-auto bg-white/30 backdrop-blur-lg rounded-2xl shadow-2xl p-8">
        <h3 className="text-3xl font-bold mb-8 text-gray-800">
          Currency Converter
        </h3>
        <Converter apiKey={apiKey} />
      </div>

      {!apiKey && <ApiKeyModal onKeySave={handleKeySave} />}
    </div>
  );
}

export default App;
