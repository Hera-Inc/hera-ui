"use client";

import { useEffect, useState } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom} from "viem";
import { arbitrum } from "viem/chains";

// Use Arbitrum mainnet
const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: "0xa4b1", // Arbitrum One
  rpcTarget: "https://arb1.arbitrum.io/rpc",
  displayName: "Arbitrum One",
  blockExplorerUrl: "https://arbiscan.io",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/arbitrum-arb-logo.png",
};

export default function LoginPage() {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ", // Demo client ID
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET, // Changed to match client ID configuration
          privateKeyProvider: privateKeyProvider as any,
          uiConfig: {
            appName: "Hera - Digital Inheritance",
            mode: "dark",
            loginMethodsOrder: ["google", "facebook", "twitter", "discord", "email_passwordless"],
            logoLight: "https://web3auth.io/images/web3authlog.png",
            logoDark: "https://web3auth.io/images/web3authlogodark.png",
            defaultLanguage: "en",
            theme: {
              primary: "#9333ea", // Purple theme
            },
          },
        });

        await web3authInstance.init();
        setWeb3auth(web3authInstance);

        if (web3authInstance.connected) {
          setProvider(web3authInstance.provider);
          setLoggedIn(true);
          await getUserInfo(web3authInstance);
        }
      } catch (error) {
        console.error("Error initializing Web3Auth:", error);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const getUserInfo = async (web3authInstance: Web3Auth) => {
    try {
      const user = await web3authInstance.getUserInfo();
      setUserInfo(user);

      if (web3authInstance.provider) {
        const walletClient = createWalletClient({
          chain: arbitrum,
          transport: custom(web3authInstance.provider),
        });

        const addresses = await walletClient.getAddresses();
        if (addresses[0]) {
          setAddress(addresses[0]);
        }
      }
    } catch (error) {
      console.error("Error getting user info:", error);
    }
  };

  const login = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }

    try {
      const web3authProvider = await web3auth.connect();
      setProvider(web3authProvider);
      setLoggedIn(true);
      await getUserInfo(web3auth);
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const logout = async () => {
    if (!web3auth) {
      console.log("Web3Auth not initialized");
      return;
    }

    try {
      await web3auth.logout();
      setProvider(null);
      setLoggedIn(false);
      setUserInfo(null);
      setAddress("");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Initializing Web3Auth...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛡️ Hera
          </a>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          {!loggedIn ? (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                  Welcome to{" "}
                  <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Hera
                  </span>
                </h1>
                <p className="text-lg md:text-xl text-purple-200 mb-4">
                  Secure your digital inheritance with Web3 authentication
                </p>
                <div className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
                  🔒 Using Arbitrum One - Secure Layer 2 Network
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto">
                <div className="text-5xl mb-6">🔐</div>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  Connect Your Wallet
                </h2>
                
                <div className="space-y-4 mb-8">
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-2">🎯 Multiple Login Options</h3>
                    <p className="text-purple-200 text-sm">
                      Connect with social accounts, email, or your favorite Web3 wallet
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-2">🔒 Secure & Private</h3>
                    <p className="text-purple-200 text-sm">
                      Non-custodial solution with MPC technology - you control your keys
                    </p>
                  </div>
                  
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                    <h3 className="text-white font-bold mb-2">🌐 Multi-Wallet Support</h3>
                    <p className="text-purple-200 text-sm">
                      MetaMask, WalletConnect, Coinbase Wallet, and more
                    </p>
                  </div>
                </div>

                <button
                  onClick={login}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  Connect Wallet & Sign In 🚀
                </button>

                <div className="mt-6 text-purple-300 text-sm">
                  Powered by Web3Auth - Supporting Google, Facebook, Twitter, Discord, Email, and all major Web3 wallets
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Welcome Back! 👋
                </h1>
                <p className="text-lg text-purple-200">
                  You're successfully connected to Hera
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 max-w-2xl mx-auto mb-8">
                <div className="text-5xl mb-6">✅</div>
                
                {address && (
                  <div className="mb-6">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-purple-300 text-sm font-medium mb-2">Wallet Address</h3>
                      <p className="text-white font-mono text-sm break-all">{address}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="/"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                  >
                    Go to Dashboard 🚀
                  </a>
                  
                  <button
                    onClick={logout}
                    className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-lg transition-all border border-white/20"
                  >
                    Logout
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-2xl p-6 max-w-2xl mx-auto">
                <h3 className="text-white font-bold mb-2">🎉 You're all set!</h3>
                <p className="text-purple-200">
                  Your wallet is connected and you can now create your digital will to secure your assets.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="relative py-8 mt-12 border-t border-purple-500/20">
        <div className="container mx-auto px-6 text-center text-purple-400">
          <p>Made with 💜 by Hera | Secured by Web3Auth & Smart Contracts</p>
        </div>
      </footer>
    </div>
  );
}

