import React from "react";

interface CurrencyRowProps {
  label: string;
  amount: number | string;
  currency: string;
  currencies: string[];
  onAmountChange?: (value: number | string) => void;
  onCurrencyChange: (value: string) => void;
  readOnly?: boolean;
  placeholder?: string;
}

export function CurrencyRow({
  label,
  amount,
  currency,
  currencies,
  onAmountChange,
  onCurrencyChange,
  readOnly = false,
  placeholder,
}: CurrencyRowProps) {
  return (
    <div className="flex gap-3 flex-col bg-white p-5 rounded-2xl">
      <div className="flex justify-between">
        <p className="text-xl text-gray-500">{label}</p>
        <p className="text-xl text-gray-500">Currency type</p>
      </div>
      <div className="flex justify-between">
        <input
          className={`text-2xl rounded-4xl p-2 ${
            readOnly ? "focus:outline-none" : "focus:outline-blue-200"
          }`}
          value={amount}
          type={readOnly ? "text" : "number"}
          readOnly={readOnly}
          min={readOnly ? undefined : 0}
          onChange={(e) => {
            if (onAmountChange) {
              const val = e.target.value;
              onAmountChange(val === "" ? "" : Number(val));
            }
          }}
        />
        <input
          type="text"
          list="currencies"
          className="w-24 text-2xl font-bold border-none bg-transparent focus:outline-none text-right uppercase"
          value={currency}
          onChange={(e) => onCurrencyChange(e.target.value.toUpperCase())}
          placeholder={placeholder}
        />
      </div>
    </div>
  );
}
