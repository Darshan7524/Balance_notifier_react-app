import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [balance, setBalance] = useState(null);
  const [changePercentage, setChangePercentage] = useState(null);
  const [error, setError] = useState(null);

  const apiKey = ""; // This key is not compulsory for the app to work ,
  const accountAddress = "0xDCBc586cAb42a1D193CaCD165a81E5fbd9B428d7";

  // API endpoint to fetch the current balance , also
  const balanceEndpoint = `https://api.lineascan.build/api?module=account&action=balance&address=${accountAddress}&tag=latest&apikey=${apiKey}`;

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the current balance from the API
        const response = await axios.get(balanceEndpoint);
        const data = response.data;

        if (data.status === "1") {
          // Convert balance from Wei to Ether
          const balanceInEther = parseFloat(data.result) / 10 ** 18;

          // Retrieve the previous balance from localStorage or set to current balance if not available
          const previousBalance =
            parseFloat(localStorage.getItem("previousBalance")) ||
            balanceInEther;

          // Save the current balance to localStorage for future calculations
          localStorage.setItem("previousBalance", balanceInEther.toString());

          // Calculate the percentage change in the last 12 hours
          const calculatedChangePercentage =
            ((balanceInEther - previousBalance) / previousBalance) * 100;

          // Update state with the current balance and change percentage
          setBalance(balanceInEther);
          setChangePercentage(calculatedChangePercentage);

          // If the balance has reduced by 10% or more, notify the user
          if (calculatedChangePercentage <= -10) {
            notifyUser();
          }
        } else {
          // Handle API error
          setError(`Error: ${data.message}`);
        }
      } catch (error) {
        // Handle general error (e.g., network issues)
        setError(`Error fetching data: ${error.message}`);
      }
    };

    // Call the fetchData function when the component mounts or when the balanceEndpoint changes
    fetchData();
  }, [balanceEndpoint]);

  // Function to notify the user with an alert
  const notifyUser = () => {
    alert("Your balance has reduced by 10% or more in the last 12 hours!");
  };

  return (
    <div className="container">
      <h1>Linea Token Balance Checker</h1>

      {/* Display error or balance information */}
      {error ? (
        <p id="error">{error}</p>
      ) : (
        <>
          <p id="balance">
            {/* Display current balance or loading message */}
            Balance: {balance !== null ? `${balance} ETH` : "Loading..."}
          </p>
          <p id="change">
            {/* Display change percentage or loading message */}
            Change in the last 12 hours:{" "}
            {changePercentage !== null
              ? `${changePercentage.toFixed(2)}%`
              : "Loading..."}
          </p>
        </>
      )}
    </div>
  );
};

export default App;
