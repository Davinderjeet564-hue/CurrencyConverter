import { useState, useEffect } from "react";

function Converter() {
  const apiKey: string = import.meta.env.VITE_EXCHANGE_RATE_API_KEY;
  const [inputValue, setInputValue] = useState<number | string>(1);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("INR");
  const [convertedValue, setConvertedValue] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [rates, setRates] = useState<Record<string, number>>({});

  async function getData() {
    if (!apiKey || fromCurrency.length !== 3) return;
    setIsLoading(true);
    try {
      const response = await fetch(
        `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`,
      );  
      const data = await response.json();
      if (data && data.conversion_rates) {
        setRates(data.conversion_rates);
      }
    } catch (error) {
      console.error("Error fetching exchange rates:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (fromCurrency.length === 3) {
      getData();
    }
  }, [fromCurrency]);

  useEffect(() => {
    if (inputValue !== "" && rates[toCurrency] !== undefined) {
      const rate = rates[toCurrency];
      setConvertedValue((Number(inputValue) * rate).toFixed(2));
    } else {
      setConvertedValue("");
    }
  }, [inputValue, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const currencyList =
    Object.keys(rates).length > 0 ? Object.keys(rates) : ["USD", "PKR", "CAD"];

  return (
    <div className="flex flex-col gap-4 relative">
      <div className="flex gap-3 flex-col bg-white p-5 rounded-2xl ">
        <div className="flex justify-between">
          <p className="text-xl text-gray-500">From</p>
          <p className="text-xl text-gray-500">Currency type</p>
        </div>
        <div className="flex justify-between">
          <input
            className="text-2xl focus:outline-blue-200 p-2 rounded-4xl"
            value={inputValue}
            type="number"
            readOnly={false}
            onChange={(e) => {
              const val = e.target.value;
              setInputValue(val === "" ? "" : Number(val));
            }}
          />
          <input
            type="text"
            list="currencies"
            className="w-24 text-2xl font-bold border-none bg-transparent focus:outline-none text-right uppercase"
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value.toUpperCase())}
            placeholder="USD"
          />
        </div>
      </div>
      <button
        onClick={handleSwap}
        className="rounded-2xl py-2 px-4 bg-blue-400 text-white absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hover:bg-blue-500 active:scale-95 transition-all"
      >
        Swap
      </button>
      <div className="flex gap-3 flex-col bg-white p-5 rounded-2xl ">
        <div className="flex justify-between">
          <p className="text-xl text-gray-500">To</p>
          <p className="text-xl text-gray-500">Currency type</p>
        </div>
        <div className="flex justify-between">
          <input
            className="text-2xl focus:outline-none"
            value={isLoading ? "Loading..." : convertedValue}
            type="text"
            readOnly={true}
          />
          <input
            type="text"
            list="currencies"
            className="w-24 text-2xl font-bold border-none bg-transparent focus:outline-none text-right uppercase"
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value.toUpperCase())}
            placeholder="INR"
          />
        </div>
      </div>
      <datalist id="currencies">
        {currencyList.map((currency) => (
          <option key={currency} value={currency} />
        ))}
      </datalist>
    </div>
  );
}

export default Converter;
