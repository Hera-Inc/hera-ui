import { useState, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, Address, http } from "viem";
import { arbitrum } from "viem/chains";
import { WILL_CONTRACT_ADDRESS, WILL_CONTRACT_ABI, CONTRACT_STATE } from "@/lib/contract";

export type ContractState = "INACTIVE" | "ACTIVE" | "CLAIMABLE" | "COMPLETED";

export interface WillInfo {
  lastCheckIn: bigint;
  heartbeatInterval: bigint;
  state: ContractState;
  assetCount: bigint;
}

export function useWillContract(provider: any, address: string) {
  const [willInfo, setWillInfo] = useState<WillInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const publicClient = createPublicClient({
    chain: arbitrum,
    transport: http(),
  });

  const getWalletClient = () => {
    if (!provider) throw new Error("Wallet is not connected. Please connect your wallet first.");
    return createWalletClient({
      chain: arbitrum,
      transport: custom(provider),
    });
  };

  const loadWillInfo = async () => {
    if (!address || !provider) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Get will info
      const info = await publicClient.readContract({
        address: WILL_CONTRACT_ADDRESS,
        abi: WILL_CONTRACT_ABI,
        functionName: "getWillInfo",
        args: [address as Address],
      });

      const [lastCheckIn, heartbeatInterval, stateNum, assetCount] = info;
      
      setWillInfo({
        lastCheckIn,
        heartbeatInterval,
        state: CONTRACT_STATE[stateNum as keyof typeof CONTRACT_STATE],
        assetCount,
      });
    } catch (error) {
      console.error("Error loading will info:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (address && provider) {
      loadWillInfo();
    } else {
      setLoading(false);
    }
  }, [address, provider]);

  const createWill = async (heartbeatIntervalSeconds: bigint) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "createWill",
      args: [heartbeatIntervalSeconds],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await loadWillInfo();
    return hash;
  };

  return {
    willInfo,
    loading,
    createWill,
    refreshWillInfo: loadWillInfo,
  };
}
