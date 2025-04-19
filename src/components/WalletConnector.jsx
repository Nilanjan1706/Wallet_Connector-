import React, { useState, useEffect } from "react";
import { Lucid, Blockfrost } from "lucid-cardano";

const WalletConnector = () => {
  const [lucid, setLucid] = useState(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [balance, setBalance] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState("");
  const [connectionMethod, setConnectionMethod] = useState("browser");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Initialize Lucid with Blockfrost
  useEffect(() => {
    const initializeLucid = async () => {
      try {
        const lucidInstance = await Lucid.new(
          new Blockfrost(
            "https://cardano-preprod.blockfrost.io/api/v0", // Replace with your actual Blockfrost URL
            "preprod6wXd6BCaQtjei74tHGPYmgLKd3DQdQSY" // Replace with your Blockfrost API key
          ),
          "Preprod"
        );

        setLucid(lucidInstance);
        console.log("Lucid initialized successfully");
      } catch (error) {
        console.error("Failed to initialize Lucid:", error);
        setError(
          "Failed to initialize Lucid. Please check your Blockfrost API key."
        );
      }
    };

    initializeLucid();
  }, []);

  // Function to connect browser wallets
  const connectBrowserWallet = async (walletName) => {
    setLoading(true);
    setError("");

    try {
      if (!lucid) {
        throw new Error("Lucid not initialized");
      }

      if (!window.cardano) {
        throw new Error(
          `No Cardano wallets found. Please install ${walletName} extension.`
        );
      }

      let api;
      switch (walletName) {
        case "lace":
          if (!window.cardano?.lace) {
            throw new Error(
              "Lace wallet not installed. Please install it from the Chrome Web Store."
            );
          }
          api = await window.cardano.lace.enable();
          break;

        case "eternl":
          if (!window.cardano?.eternl) {
            throw new Error(
              "Eternl wallet not installed. Please install it from the Chrome Web Store."
            );
          }
          api = await window.cardano.eternl.enable();
          break;

        case "yoroi":
          if (!window.cardano?.yoroi) {
            throw new Error(
              "Yoroi wallet not installed. Please install it from the Chrome Web Store."
            );
          }
          api = await window.cardano.yoroi.enable();
          break;

        default:
          throw new Error("Unsupported wallet");
      }

      // Select the wallet in Lucid
      lucid.selectWallet(api);

      // Get wallet address
      const address = await lucid.wallet.address();
      setWalletAddress(address);

      // Get wallet balance (UTxOs and convert to ADA)
      const utxos = await lucid.wallet.getUtxos();

      // Calculate total lovelace amount from UTXOs
      const lovelaceAmount = utxos.reduce((total, utxo) => {
        const lovelaceInUtxo = Number(utxo.assets.lovelace || 0);
        return total + lovelaceInUtxo;
      }, 0);

      // Convert to ADA (divide by 1,000,000)
      const ada = lovelaceAmount / 1_000_000;
      setBalance(ada);

      setWalletConnected(true);
    } catch (error) {
      console.error(`Failed to connect ${walletName} wallet:`, error);
      setError(`Failed to connect ${walletName} wallet: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to connect with Seed Phrase
  const connectWithSeedPhrase = async () => {
    setLoading(true);
    setError("");

    try {
      if (!lucid) {
        throw new Error("Lucid not initialized");
      }

      if (!seedPhrase.trim()) {
        throw new Error("Seed phrase is required");
      }

      // Create a wallet from seed phrase
      lucid.selectWalletFromSeed(seedPhrase.trim());

      // Get wallet address
      const address = await lucid.wallet.address();
      setWalletAddress(address);

      // Get UTXOs and calculate balance
      const utxos = await lucid.wallet.getUtxos();

      // Calculate total lovelace amount from UTXOs
      const lovelaceAmount = utxos.reduce((total, utxo) => {
        // Convert string to number using JavaScript's Number instead of BigInt
        const lovelaceInUtxo = Number(utxo.assets.lovelace || 0);
        return total + lovelaceInUtxo;
      }, 0); // Start with 0 instead of BigInt(0)

      // Convert to ADA (divide by 1,000,000)
      const ada = lovelaceAmount / 1_000_000;

      setBalance(ada);

      setWalletConnected(true);
      setSeedPhrase(""); // Clear seed phrase for security
    } catch (error) {
      console.error("Failed to connect with seed phrase:", error);
      setError(`Failed to connect with seed phrase: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wallet-connector">
      <h2>Cardano Wallet Connector</h2>

      {lucid ? (
        !walletConnected ? (
          <div className="connection-options">
            <div className="connection-method-selector">
              <button
                className={connectionMethod === "browser" ? "active" : ""}
                onClick={() => setConnectionMethod("browser")}
              >
                Browser Wallet
              </button>
              <button
                className={connectionMethod === "seed" ? "active" : ""}
                onClick={() => setConnectionMethod("seed")}
              >
                Seed Phrase
              </button>
            </div>

            {connectionMethod === "browser" && (
              <div className="browser-wallets">
                <h3>Connect Browser Wallet</h3>
                <div className="wallet-buttons">
                  <button
                    onClick={() => connectBrowserWallet("lace")}
                    disabled={loading}
                  >
                    Connect Lace
                  </button>
                  <button
                    onClick={() => connectBrowserWallet("eternl")}
                    disabled={loading}
                  >
                    Connect Eternl
                  </button>
                  <button
                    onClick={() => connectBrowserWallet("yoroi")}
                    disabled={loading}
                  >
                    Connect Yoroi
                  </button>
                </div>
              </div>
            )}

            {connectionMethod === "seed" && (
              <div className="seed-phrase-connector">
                <h3>Connect with Seed Phrase</h3>
                <textarea
                  placeholder="Enter your seed phrase (12 or 24 words separated by spaces)"
                  value={seedPhrase}
                  onChange={(e) => setSeedPhrase(e.target.value)}
                  rows={4}
                  disabled={loading}
                />
                <button
                  onClick={connectWithSeedPhrase}
                  disabled={loading || !seedPhrase.trim()}
                >
                  Connect
                </button>
                <p className="warning">
                  Warning: Entering your seed phrase on websites can be risky.
                  This should only be used in secure environments.
                </p>
              </div>
            )}

            {loading && <div className="loading">Connecting wallet...</div>}
            {error && <div className="error">{error}</div>}
          </div>
        ) : (
          <div className="wallet-details">
            <h3>Wallet Connected</h3>
            <div className="detail">
              <span>Address:</span>
              <span className="address">{walletAddress}</span>
            </div>
            <div className="detail">
              <span>Balance:</span>
              <span className="balance">
                {balance ? `${balance} ADA` : "Loading..."}
              </span>
            </div>
            <button onClick={() => window.location.reload()}>
              Disconnect Wallet
            </button>
          </div>
        )
      ) : (
        <div className="initializing">
          <p>Initializing Lucid...</p>
          {error && <div className="error">{error}</div>}
        </div>
      )}
    </div>
  );
};

export default WalletConnector;
