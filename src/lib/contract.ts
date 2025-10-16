import { Address } from "viem";

// Get contract address from environment variable or use default
export const WILL_CONTRACT_ADDRESS = (process.env.NEXT_PUBLIC_WILL_CONTRACT_ADDRESS || "0x68eCEac93e1d8AB3c9082D1d7b4f7A768200F129") as Address;

// Complete ABI for DigitalWillFactory contract
export const WILL_CONTRACT_ABI = [
  {
    type: "constructor",
    inputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "receive",
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "acceptBeneficiary",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "approveContractBeneficiary",
    inputs: [
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "checkIn",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "claimAsset",
    inputs: [
      {
        name: "grantor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_assetIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "createWill",
    inputs: [
      {
        name: "_heartbeatInterval",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositERC20",
    inputs: [
      {
        name: "_tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "_amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositERC721",
    inputs: [
      {
        name: "_tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "_tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "depositEth",
    inputs: [
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "payable",
  },
  {
    type: "function",
    name: "emergencyWithdraw",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "extendHeartbeat",
    inputs: [
      {
        name: "newInterval",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "getAsset",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_assetIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [
      {
        name: "assetType",
        type: "uint8",
        internalType: "enum DigitalWillFactory.AssetType",
      },
      {
        name: "tokenAddress",
        type: "address",
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "beneficiary",
        type: "address",
        internalType: "address",
      },
      {
        name: "claimed",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getAssetCount",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getBeneficiaryAssets",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "uint256[]",
        internalType: "uint256[]",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "getWillInfo",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "lastCheckIn",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "heartbeatInterval",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "state",
        type: "uint8",
        internalType: "enum DigitalWillFactory.ContractState",
      },
      {
        name: "assetCount",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "hasBeneficiaryAccepted",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isApprovedBeneficiary",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "isClaimable",
    inputs: [
      {
        name: "grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "modifyHeartbeat",
    inputs: [
      {
        name: "newInterval",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "onERC721Received",
    inputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "address",
        internalType: "address",
      },
      {
        name: "",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "",
        type: "bytes",
        internalType: "bytes",
      },
    ],
    outputs: [
      {
        name: "",
        type: "bytes4",
        internalType: "bytes4",
      },
    ],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "owner",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "address",
        internalType: "address",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "pause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "paused",
    inputs: [],
    outputs: [
      {
        name: "",
        type: "bool",
        internalType: "bool",
      },
    ],
    stateMutability: "view",
  },
  {
    type: "function",
    name: "rejectBeneficiary",
    inputs: [
      {
        name: "_grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "removeAsset",
    inputs: [
      {
        name: "_assetIndex",
        type: "uint256",
        internalType: "uint256",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "renounceOwnership",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "revokeContractBeneficiary",
    inputs: [
      {
        name: "_beneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "transferOwnership",
    inputs: [
      {
        name: "newOwner",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "unpause",
    inputs: [],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateBeneficiary",
    inputs: [
      {
        name: "_assetIndex",
        type: "uint256",
        internalType: "uint256",
      },
      {
        name: "_newBeneficiary",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "function",
    name: "updateState",
    inputs: [
      {
        name: "grantor",
        type: "address",
        internalType: "address",
      },
    ],
    outputs: [],
    stateMutability: "nonpayable",
  },
  {
    type: "event",
    name: "AssetClaimed",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assetType",
        type: "uint8",
        indexed: false,
        internalType: "enum DigitalWillFactory.AssetType",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetDeposited",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetType",
        type: "uint8",
        indexed: false,
        internalType: "enum DigitalWillFactory.AssetType",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "AssetRemoved",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "assetType",
        type: "uint8",
        indexed: false,
        internalType: "enum DigitalWillFactory.AssetType",
      },
      {
        name: "tokenAddress",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "tokenId",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "amount",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeneficiaryAccepted",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeneficiaryRejected",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "BeneficiaryUpdated",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetIndex",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "oldBeneficiary",
        type: "address",
        indexed: false,
        internalType: "address",
      },
      {
        name: "newBeneficiary",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "CheckIn",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "timestamp",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ContractBeneficiaryApproved",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "ContractBeneficiaryRevoked",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "beneficiary",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "EmergencyWithdraw",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "assetsReturned",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "HeartbeatExtended",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newInterval",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "HeartbeatModified",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "oldInterval",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
      {
        name: "newInterval",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "OwnershipTransferred",
    inputs: [
      {
        name: "previousOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newOwner",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Paused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "StateUpdated",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "newState",
        type: "uint8",
        indexed: false,
        internalType: "enum DigitalWillFactory.ContractState",
      },
      {
        name: "updater",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "Unpaused",
    inputs: [
      {
        name: "account",
        type: "address",
        indexed: false,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WillCompleted",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "WillCreated",
    inputs: [
      {
        name: "grantor",
        type: "address",
        indexed: true,
        internalType: "address",
      },
      {
        name: "heartbeatInterval",
        type: "uint256",
        indexed: false,
        internalType: "uint256",
      },
    ],
    anonymous: false,
  },
  {
    type: "error",
    name: "EnforcedPause",
    inputs: [],
  },
  {
    type: "error",
    name: "ExpectedPause",
    inputs: [],
  },
  {
    type: "error",
    name: "OwnableInvalidOwner",
    inputs: [
      {
        name: "owner",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "OwnableUnauthorizedAccount",
    inputs: [
      {
        name: "account",
        type: "address",
        internalType: "address",
      },
    ],
  },
  {
    type: "error",
    name: "ReentrancyGuardReentrantCall",
    inputs: [],
  },
  {
    type: "error",
    name: "SafeERC20FailedOperation",
    inputs: [
      {
        name: "token",
        type: "address",
        internalType: "address",
      },
    ],
  },
] as const;

export const CONTRACT_STATE = {
  0: "INACTIVE",
  1: "ACTIVE",
  2: "CLAIMABLE",
  3: "COMPLETED",
} as const;

