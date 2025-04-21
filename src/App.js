import React from "react";
import "./App.css";
import WalletConnector from "./components/WalletConnector.jsx";


function App() {
  return (
    <div
      className="wallet-page-wrapper"
      style={{ backgroundColor: "darkslategray" }}
    >
      <div
        className="wallet-connector"
        style={{
          backgroundColor: "lightyellow",
          height: "70vh",
          width: "70vw",
        }}
      >
        <header className="App-header">
          <h1 style={{ color: "darkgoldenrod", textAlign: "center" }}>
            Cardano Wallet Integration
          </h1>
        </header>
        <main>
          <WalletConnector />
        </main>
        <footer>
          <div>
            <p
              style={{
                backgroundColor: "darkslategray",
                color: "white",
                textAlign: "center",
                padding: "10px",
              }}
            >
              Securely connect your Cardano wallet using Lucid
            </p>
          </div>
          <div>
            <p
              style={{
                backgroundColor: "lightblue",
                color: "black",
                textAlign: "center",
                padding: "10px",
              }}
            >
              Connect Your Wallet First Before Transactions
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
