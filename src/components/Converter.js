import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "https://openexchangerates.org/api/latest.json";
const APP_ID = "2bc90a6acecb4c7889bc37be2efb91e5";
const CURRENCY_DATA_KEY = "currencyData";
const CONVERSION_DATA_KEY = "conversionData";

const Converter = () => {
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("EUR");
  const [amount, setAmount] = useState("");
  const [convertedAmount, setConvertedAmount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedCurrencyData = JSON.parse(
          localStorage.getItem(CURRENCY_DATA_KEY)
        );

        if (storedCurrencyData) {
          const converted = convertCurrency(storedCurrencyData);
          setConvertedAmount(converted);
        } else {
          const response = await axios.get(`${API_URL}?app_id=${APP_ID}`);
          const rates = response.data.rates;
          localStorage.setItem(CURRENCY_DATA_KEY, JSON.stringify(rates));
          const converted = convertCurrency(rates);
          setConvertedAmount(converted);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const storedData =
      JSON.parse(localStorage.getItem(CONVERSION_DATA_KEY)) || [];
    const isDuplicate = storedData.some(
      (data) =>
        data.fromCurrency === fromCurrency && data.toCurrency === toCurrency
    );

    if (!isDuplicate) {
      const updatedData = [...storedData, { fromCurrency, toCurrency }];
      localStorage.setItem(CONVERSION_DATA_KEY, JSON.stringify(updatedData));
    }

    if (amount !== "") {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromCurrency, toCurrency, amount]);

  const convertCurrency = (rates) => {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const converted = ((+amount / fromRate) * toRate).toFixed(2);

    if (!isNaN(converted)) {
      return converted;
    }
    return 0;
  };

  const handleFromCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setFromCurrency(selectedCurrency);
  };

  const handleToCurrencyChange = (event) => {
    const selectedCurrency = event.target.value;
    setToCurrency(selectedCurrency);
  };

  const handleAmountChange = (event) => {
    const enteredAmount = event.target.value;
    const parsedAmount = +enteredAmount;
    if (!isNaN(parsedAmount)) {
      setAmount(parsedAmount);
    } else {
      setAmount(0);
    }
  };

  return (
    <div className="block">
      <h2 className="title">Currency Converter</h2>

      <div className="currency">
        <select
          className="currency__select"
          id="fromCurrency"
          value={fromCurrency}
          onChange={handleFromCurrencyChange}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="UAH">UAH</option>
        </select>
        <input
          className="currency__field"
          type="text"
          value={amount}
          onChange={handleAmountChange}
        />
      </div>
      <p className="symbol">=</p>
      <div className="currency">
        <select
          className="currency__select"
          id="toCurrency"
          value={toCurrency}
          onChange={handleToCurrencyChange}
        >
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
          <option value="UAH">UAH</option>
        </select>
        <input
          className="currency__field"
          type="text"
          value={Number(convertedAmount)}
          readOnly
        />
      </div>
    </div>
  );
};

export default Converter;
