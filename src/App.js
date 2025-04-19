import React from "react";
import "./App.css";
import WalletConnector from "./components/WalletConnector.jsx";


function App() {
  return (
    <div className="wallet-page-wrapper">
      <div className="wallet-connector">
      <header className="App-header">
        <h1>Cardano Wallet Integration</h1>
      </header>
      <main>
          <WalletConnector />
      </main>
      <footer>
        <p>Securely connect your Cardano wallet using Lucid</p>
        </footer>
        </div>
    </div>
  );
}

export default App;
