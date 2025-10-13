import { Address } from "viem";

// Replace with your deployed contract address
export const WILL_CONTRACT_ADDRESS = "0x..." as Address;

// Minimal ABI - only functions needed for Create Will feature
export const WILL_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "uint256", name: "_heartbeatInterval", type: "uint256" }],
    name: "createWill",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "_grantor", type: "address" }],
    name: "getWillInfo",
    outputs: [
      { internalType: "uint256", name: "lastCheckIn", type: "uint256" },
      { internalType: "uint256", name: "heartbeatInterval", type: "uint256" },
      { internalType: "enum DigitalWillFactory.ContractState", name: "state", type: "uint8" },
      { internalType: "uint256", name: "assetCount", type: "uint256" },
    ],
    stateMutability: "view",
    type: "function",
  },
  // Events
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "grantor", type: "address" },
      { indexed: false, internalType: "uint256", name: "heartbeatInterval", type: "uint256" },
    ],
    name: "WillCreated",
    type: "event",
  },
] as const;

export const CONTRACT_STATE = {
  0: "INACTIVE",
  1: "ACTIVE",
  2: "CLAIMABLE",
  3: "COMPLETED",
} as const;

