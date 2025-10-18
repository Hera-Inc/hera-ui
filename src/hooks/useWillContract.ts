import { useState, useEffect } from "react";
import { createPublicClient, createWalletClient, custom, Address, http } from "viem";
import { baseSepolia } from "viem/chains";
import { WILL_CONTRACT_ADDRESS, WILL_CONTRACT_ABI, CONTRACT_STATE } from "@/lib/contract";

export type ContractState = "INACTIVE" | "ACTIVE" | "CLAIMABLE" | "COMPLETED";

export interface WillInfo {
  lastCheckIn: bigint;
  heartbeatInterval: bigint;
  state: ContractState;
  assetCount: bigint;
}

export interface AssetInfo {
  assetType: number;
  tokenAddress: string;
  tokenId: bigint;
  amount: bigint;
  beneficiary: string;
  claimed: boolean;
}

export interface BeneficiaryAsset {
  grantor: string;
  assetIndex: bigint;
  assetInfo: AssetInfo;
  timeUntilClaimable: bigint | null;
  isClaimable: boolean;
  hasAccepted: boolean;
}

export function useWillContract(provider: any, address: string) {
  const [willInfo, setWillInfo] = useState<WillInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const publicClient = createPublicClient({
    chain: baseSepolia,
    transport: http(),
  });

  const getWalletClient = () => {
    if (!provider) throw new Error("Wallet is not connected. Please connect your wallet first.");
    return createWalletClient({
      chain: baseSepolia,
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
      // Silent fail for loading will info - component will show empty state
      setWillInfo(null);
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

  const depositEth = async (beneficiary: Address, amount: bigint) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "depositEth",
      args: [beneficiary],
      account,
      value: amount,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await loadWillInfo();
    return hash;
  };

  const depositERC20 = async (tokenAddress: Address, amount: bigint, beneficiary: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "depositERC20",
      args: [tokenAddress, amount, beneficiary],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await loadWillInfo();
    return hash;
  };

  const depositERC721 = async (tokenAddress: Address, tokenId: bigint, beneficiary: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "depositERC721",
      args: [tokenAddress, tokenId, beneficiary],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await loadWillInfo();
    return hash;
  };

  const checkIn = async () => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "checkIn",
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    await loadWillInfo();
    return hash;
  };

  // Beneficiary-related methods
  const getBeneficiaryAssets = async (grantorAddress: Address) => {
    try {
      const assetIndices = await publicClient.readContract({
        address: WILL_CONTRACT_ADDRESS,
        abi: WILL_CONTRACT_ABI,
        functionName: "getBeneficiaryAssets",
        args: [grantorAddress, address as Address],
      });

      const assets: BeneficiaryAsset[] = [];
      
      for (const assetIndex of assetIndices) {
        // Get asset details
        const assetInfo = await publicClient.readContract({
          address: WILL_CONTRACT_ADDRESS,
          abi: WILL_CONTRACT_ABI,
          functionName: "getAsset",
          args: [grantorAddress, assetIndex],
        });

        const [assetType, tokenAddress, tokenId, amount, beneficiary, claimed] = assetInfo;

        // Check if beneficiary has accepted
        const hasAccepted = await publicClient.readContract({
          address: WILL_CONTRACT_ADDRESS,
          abi: WILL_CONTRACT_ABI,
          functionName: "hasBeneficiaryAccepted",
          args: [grantorAddress, address as Address],
        });

        // Check if will is claimable
        const isClaimableWill = await publicClient.readContract({
          address: WILL_CONTRACT_ADDRESS,
          abi: WILL_CONTRACT_ABI,
          functionName: "isClaimable",
          args: [grantorAddress],
        });

        // Get will info to calculate time until claimable
        const grantorWillInfo = await publicClient.readContract({
          address: WILL_CONTRACT_ADDRESS,
          abi: WILL_CONTRACT_ABI,
          functionName: "getWillInfo",
          args: [grantorAddress],
        });

        const [lastCheckIn, heartbeatInterval] = grantorWillInfo;
        const currentTime = BigInt(Math.floor(Date.now() / 1000));
        const claimableTime = lastCheckIn + heartbeatInterval;
        const timeUntilClaimable = claimableTime > currentTime ? claimableTime - currentTime : BigInt(0);

        assets.push({
          grantor: grantorAddress,
          assetIndex,
          assetInfo: {
            assetType: Number(assetType),
            tokenAddress,
            tokenId,
            amount,
            beneficiary,
            claimed,
          },
          timeUntilClaimable: timeUntilClaimable > 0 ? timeUntilClaimable : null,
          isClaimable: isClaimableWill,
          hasAccepted,
        });
      }

      return assets;
    } catch (error) {
      console.error("Error fetching beneficiary assets:", error);
      return [];
    }
  };

  const acceptBeneficiary = async (grantorAddress: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "acceptBeneficiary",
      args: [grantorAddress],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  };

  const rejectBeneficiary = async (grantorAddress: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "rejectBeneficiary",
      args: [grantorAddress],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  };

  const claimAsset = async (grantorAddress: Address, assetIndex: bigint) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "claimAsset",
      args: [grantorAddress, assetIndex],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  };

  const isApprovedBeneficiary = async (grantorAddress: Address, beneficiaryAddress: Address) => {
    return await publicClient.readContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "isApprovedBeneficiary",
      args: [grantorAddress, beneficiaryAddress],
    });
  };

  const approveContractBeneficiary = async (beneficiaryAddress: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "approveContractBeneficiary",
      args: [beneficiaryAddress],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  };

  const revokeContractBeneficiary = async (beneficiaryAddress: Address) => {
    const walletClient = getWalletClient();
    const [account] = await walletClient.getAddresses();

    const hash = await walletClient.writeContract({
      address: WILL_CONTRACT_ADDRESS,
      abi: WILL_CONTRACT_ABI,
      functionName: "revokeContractBeneficiary",
      args: [beneficiaryAddress],
      account,
    });

    await publicClient.waitForTransactionReceipt({ hash });
    return hash;
  };

  return {
    willInfo,
    loading,
    createWill,
    depositEth,
    depositERC20,
    depositERC721,
    checkIn,
    refreshWillInfo: loadWillInfo,
    // Beneficiary methods
    getBeneficiaryAssets,
    acceptBeneficiary,
    rejectBeneficiary,
    claimAsset,
    isApprovedBeneficiary,
    approveContractBeneficiary,
    revokeContractBeneficiary,
  };
}
