"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from "viem";
import { baseSepolia } from "viem/chains";

const chainConfig = {
  chainNamespace: CHAIN_NAMESPACES.EIP155,
  chainId: process.env.NEXT_PUBLIC_CHAIN_ID || "0x14a34", // Base Sepolia
  rpcTarget: process.env.NEXT_PUBLIC_RPC_TARGET || "https://sepolia.base.org",
  displayName: process.env.NEXT_PUBLIC_CHAIN_NAME || "Base Sepolia",
  blockExplorerUrl: process.env.NEXT_PUBLIC_BLOCK_EXPLORER_URL || "https://sepolia.basescan.org",
  ticker: "ETH",
  tickerName: "Ethereum",
  logo: "https://cryptologos.cc/logos/base-logo.png",
};

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  loggedIn: boolean;
  loading: boolean;
  userInfo: any;
  address: string;
  currentChainId: string | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchChain: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  loggedIn: false,
  loading: true,
  userInfo: null,
  address: "",
  currentChainId: null,
  login: async () => {},
  logout: async () => {},
  switchChain: async () => {},
});

export function useWeb3Auth() {
  return useContext(Web3AuthContext);
}

export function Web3AuthProvider({ children }: { children: ReactNode }) {
  const [web3auth, setWeb3auth] = useState<Web3Auth | null>(null);
  const [provider, setProvider] = useState<IProvider | null>(null);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [address, setAddress] = useState<string>("");
  const [currentChainId, setCurrentChainId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const clientId = process.env.NEXT_PUBLIC_WEB3AUTH_CLIENT_ID;
        if (!clientId) {
          throw new Error("NEXT_PUBLIC_WEB3AUTH_CLIENT_ID is not set");
        }

        const web3authInstance = new Web3Auth({
          clientId,
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_DEVNET,
          privateKeyProvider: privateKeyProvider as any,
          uiConfig: {
            appName: "Hera - Digital Inheritance",
            mode: "dark",
            loginMethodsOrder: ["google", "facebook", "twitter", "discord", "email_passwordless"],
            logoLight: "https://web3auth.io/images/web3authlog.png",
            logoDark: "https://web3auth.io/images/web3authlogodark.png",
            defaultLanguage: "en",
            theme: {
              primary: "#9333ea",
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

  const checkChainId = async (providerInstance: IProvider) => {
    try {
      const chainId = await providerInstance.request({ method: "eth_chainId" }) as string;
      setCurrentChainId(chainId);
      return chainId;
    } catch (error) {
      console.error("Error checking chain ID:", error);
      return null;
    }
  };

  const switchChain = async () => {
    if (!provider) {
      console.log("Provider not available");
      return;
    }

    try {
      const targetChainId = "0x14a34"; // Base Sepolia (84532 in hex)
      
      await provider.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: targetChainId }],
      });
      
      await checkChainId(provider);
    } catch (error: any) {
      // If the chain hasn't been added to the wallet, add it
      if (error.code === 4902) {
        try {
          await provider.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x14a34",
                chainName: "Base Sepolia",
                nativeCurrency: {
                  name: "Ethereum",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["https://sepolia.base.org"],
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
          
          await checkChainId(provider);
        } catch (addError) {
          console.error("Error adding chain:", addError);
        }
      } else {
        console.error("Error switching chain:", error);
      }
    }
  };

  const getUserInfo = async (web3authInstance: Web3Auth) => {
    try {
      const user = await web3authInstance.getUserInfo();
      setUserInfo(user);

      if (web3authInstance.provider) {
        // Check current chain
        await checkChainId(web3authInstance.provider);

        const walletClient = createWalletClient({
          chain: baseSepolia,
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
      setCurrentChainId(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        provider,
        loggedIn,
        loading,
        userInfo,
        address,
        currentChainId,
        login,
        logout,
        switchChain,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}

