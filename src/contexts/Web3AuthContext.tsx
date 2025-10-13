"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Web3Auth } from "@web3auth/modal";
import { CHAIN_NAMESPACES, IProvider, WEB3AUTH_NETWORK } from "@web3auth/base";
import { EthereumPrivateKeyProvider } from "@web3auth/ethereum-provider";
import { createWalletClient, custom } from "viem";
import { arbitrum } from "viem/chains";

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

interface Web3AuthContextType {
  web3auth: Web3Auth | null;
  provider: IProvider | null;
  loggedIn: boolean;
  loading: boolean;
  userInfo: any;
  address: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

const Web3AuthContext = createContext<Web3AuthContextType>({
  web3auth: null,
  provider: null,
  loggedIn: false,
  loading: true,
  userInfo: null,
  address: "",
  login: async () => {},
  logout: async () => {},
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

  useEffect(() => {
    const init = async () => {
      try {
        const privateKeyProvider = new EthereumPrivateKeyProvider({
          config: { chainConfig },
        });

        const web3authInstance = new Web3Auth({
          clientId: "BPi5PB_UiIZ-cPz1GtV5i1I2iOSOHuimiXBI0e-Oe_u6X3oVAbCiAZOTEBtTXw4tsluTITPqA8zMsfxIKMjiqNQ",
          web3AuthNetwork: WEB3AUTH_NETWORK.SAPPHIRE_MAINNET,
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

  return (
    <Web3AuthContext.Provider
      value={{
        web3auth,
        provider,
        loggedIn,
        loading,
        userInfo,
        address,
        login,
        logout,
      }}
    >
      {children}
    </Web3AuthContext.Provider>
  );
}

