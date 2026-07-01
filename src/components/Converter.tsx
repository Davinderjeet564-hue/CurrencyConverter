import { useState, useEffect } from "react";
import { CurrencyRow } from "./CurrencyRow";

interface ConverterProps {
  apiKey: string;
}

function Converter({ apiKey }: ConverterProps) {
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
    if (fromCurrency.length !== 3 || !apiKey) return;

    const controller = new AbortController();

    async function getData() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`,
          { signal: controller.signal },
        );
        const data = await response.json();
        if (data && data.conversion_rates) {
          setRates(data.conversion_rates);
        }
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error fetching exchange rates:", error);
        }
      } finally {
        setIsLoading(false);
      }
    }

    getData();

    return () => {
      controller.abort();
    };
  }, [fromCurrency, apiKey]);

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
      <CurrencyRow
        label="From"
        amount={inputValue}
        currency={fromCurrency}
        currencies={currencyList}
        onAmountChange={setInputValue}
        onCurrencyChange={setFromCurrency}
        placeholder="USD"
      />

      <button
        onClick={handleSwap}
        className="rounded-2xl py-2 px-4 bg-blue-400 text-white absolute top-1/2 left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 hover:bg-blue-500 active:scale-95 transition-all"
      >
        Swap
      </button>

      <CurrencyRow
        label="To"
        amount={isLoading ? "Loading..." : convertedValue}
        currency={toCurrency}
        currencies={currencyList}
        onCurrencyChange={setToCurrency}
        readOnly={true}
        placeholder="INR"
      />

      <datalist id="currencies">
        {currencyList.map((currency) => (
          <option key={currency} value={currency} />
        ))}
      </datalist>
    </div>
  );
}

export default Converter;
