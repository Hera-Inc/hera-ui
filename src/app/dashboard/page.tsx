"use client";

import { useState, useEffect } from "react";
import { useWeb3Auth} from "@/contexts/Web3AuthContext";
import { useWillContract, BeneficiaryAsset } from "@/hooks/useWillContract";
import { useNotification } from "@/contexts/NotificationContext";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Address } from "viem";

type TabType = "overview" | "assets" | "beneficiaries" | "settings";
type BeneficiaryTabType = "overview" | "assets" | "pending";

export default function DashboardPage() {
  const router = useRouter();
  const { provider, address, loggedIn, loading: authLoading, logout, currentChainId, switchChain, userRole, setUserRole } = useWeb3Auth();
  const notification = useNotification();
  
  // Form state
  const [heartbeatDays, setHeartbeatDays] = useState("30");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [beneficiaryTab, setBeneficiaryTab] = useState<BeneficiaryTabType>("overview");
  
  // Asset deposit form state
  const [assetType, setAssetType] = useState<"ETH" | "ERC20" | "ERC721">("ETH");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");
  
  // Beneficiary state
  const [beneficiaryAssets, setBeneficiaryAssets] = useState<BeneficiaryAsset[]>([]);
  const [loadingBeneficiaryAssets, setLoadingBeneficiaryAssets] = useState(false);
  const [grantorAddress, setGrantorAddress] = useState("");

  // Settings state
  const [newHeartbeatDays, setNewHeartbeatDays] = useState("");
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  // Only use contract hook if logged in
  const contractHook = useWillContract(loggedIn ? provider : null, loggedIn ? address : "");
  
  const {
    willInfo,
    loading: contractLoading,
    createWill,
    depositEth,
    depositERC20,
    depositERC721,
    checkIn,
    // Beneficiary methods
    getBeneficiaryAssets,
    acceptBeneficiary,
    rejectBeneficiary,
    claimAsset,
    isApprovedBeneficiary,
    approveContractBeneficiary,
    revokeContractBeneficiary,
    // Grantor management methods
    emergencyWithdraw,
    modifyHeartbeat,
  } = contractHook;

  // Redirect if not logged in or no role selected
  useEffect(() => {
    if (!authLoading && (!loggedIn || !userRole)) {
      router.push("/login");
    }
  }, [authLoading, loggedIn, userRole, router]);

  const handleCreateWill = async () => {
    try {
      const intervalSeconds = BigInt(Number.parseInt(heartbeatDays) * 24 * 60 * 60);
      await createWill(intervalSeconds);
      notification.success("Will created successfully! 🎉");
    } catch (error) {
      notification.error("Failed to create will. " + (error as Error).message);
    }
  };

  const handleDepositAsset = async () => {
    try {
      if (!beneficiaryAddress) {
        notification.warning("Please enter a beneficiary address");
        return;
      }

      if (assetType === "ETH") {
        if (!ethAmount) {
          notification.warning("Please enter an amount");
          return;
        }
        const amountWei = BigInt(Math.floor(parseFloat(ethAmount) * 1e18));
        await depositEth(beneficiaryAddress as any, amountWei);
        notification.success("ETH deposited successfully! 💰");
        setEthAmount("");
        setBeneficiaryAddress("");
      } else if (assetType === "ERC20") {
        if (!tokenAddress || !tokenAmount) {
          notification.warning("Please enter token address and amount");
          return;
        }
        const amount = BigInt(tokenAmount);
        await depositERC20(tokenAddress as any, amount, beneficiaryAddress as any);
        notification.success("ERC20 token deposited successfully! 🪙");
        setTokenAddress("");
        setTokenAmount("");
        setBeneficiaryAddress("");
      } else if (assetType === "ERC721") {
        if (!tokenAddress || !tokenId) {
          notification.warning("Please enter token address and token ID");
          return;
        }
        await depositERC721(tokenAddress as any, BigInt(tokenId), beneficiaryAddress as any);
        notification.success("NFT deposited successfully! 🎨");
        setTokenAddress("");
        setTokenId("");
        setBeneficiaryAddress("");
      }
    } catch (error) {
      notification.error("Failed to deposit asset. " + (error as Error).message);
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
      notification.success("Check-in successful! ✅ Your will is now updated.");
    } catch (error) {
      notification.error("Failed to check in. " + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      notification.info("Successfully logged out");
      router.push("/");
    } catch (error) {
      notification.error((error as Error).message || "Failed to logout");
    }
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (authLoading) return; // Don't navigate while loading auth state
    
    if (loggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  // Beneficiary handlers
  const loadBeneficiaryAssets = async (grantorAddr: string) => {
    if (!grantorAddr) return;
    
    try {
      setLoadingBeneficiaryAssets(true);
      const assets = await getBeneficiaryAssets(grantorAddr as Address);
      setBeneficiaryAssets(assets);
    } catch (error) {
      notification.error("Failed to load beneficiary assets: " + (error as Error).message);
    } finally {
      setLoadingBeneficiaryAssets(false);
    }
  };

  const handleAcceptBeneficiary = async (grantorAddr: string) => {
    try {
      await acceptBeneficiary(grantorAddr as Address);
      notification.success("You have accepted the beneficiary designation! 🎉");
      await loadBeneficiaryAssets(grantorAddr);
    } catch (error) {
      notification.error("Failed to accept beneficiary designation: " + (error as Error).message);
    }
  };

  const handleRejectBeneficiary = async (grantorAddr: string) => {
    try {
      await rejectBeneficiary(grantorAddr as Address);
      notification.info("You have rejected the beneficiary designation.");
      await loadBeneficiaryAssets(grantorAddr);
    } catch (error) {
      notification.error("Failed to reject beneficiary designation: " + (error as Error).message);
    }
  };

  const handleClaimAsset = async (grantorAddr: string, assetIndex: bigint) => {
    try {
      await claimAsset(grantorAddr as Address, assetIndex);
      notification.success("Asset claimed successfully! 🎉");
      await loadBeneficiaryAssets(grantorAddr);
    } catch (error) {
      notification.error("Failed to claim asset: " + (error as Error).message);
    }
  };

  const handleApproveContractBeneficiary = async (beneficiaryAddr: string) => {
    try {
      await approveContractBeneficiary(beneficiaryAddr as Address);
      notification.success("Contract beneficiary approved successfully! ✅");
    } catch (error) {
      notification.error("Failed to approve contract beneficiary: " + (error as Error).message);
    }
  };

  const handleRevokeContractBeneficiary = async (beneficiaryAddr: string) => {
    try {
      await revokeContractBeneficiary(beneficiaryAddr as Address);
      notification.info("Contract beneficiary approval revoked.");
    } catch (error) {
      notification.error("Failed to revoke contract beneficiary: " + (error as Error).message);
    }
  };

  const handleEmergencyWithdraw = async () => {
    try {
      await emergencyWithdraw();
      notification.success("Emergency withdrawal successful! All assets have been returned to you. 🎉");
      setShowEmergencyConfirm(false);
    } catch (error) {
      notification.error("Failed to perform emergency withdrawal: " + (error as Error).message);
    }
  };

  const handleModifyHeartbeat = async () => {
    try {
      if (!newHeartbeatDays || Number(newHeartbeatDays) < 1) {
        notification.warning("Please enter a valid number of days (at least 1)");
        return;
      }
      const intervalSeconds = BigInt(Number.parseInt(newHeartbeatDays) * 24 * 60 * 60);
      await modifyHeartbeat(intervalSeconds);
      notification.success("Heartbeat interval updated successfully! ⏰");
      setNewHeartbeatDays("");
    } catch (error) {
      notification.error("Failed to modify heartbeat interval: " + (error as Error).message);
    }
  };

  // Show loading only during initial auth check
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-purple-200 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not logged in (will redirect)
  if (!loggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 container mx-auto px-6 py-6">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogoClick}
            className="flex items-center gap-3 group cursor-pointer bg-transparent border-none p-0"
          >
            <div className="relative w-10 h-10 transition-all transform group-hover:scale-110">
              <Image 
                src="/HeraLogo.png" 
                alt="Hera Logo" 
                width={40} 
                height={40}
                className="object-contain drop-shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                priority
              />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Hera
            </span>
          </button>
          <div className="flex items-center gap-4">
            {address && (
              <div className="px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-mono">
                {address.slice(0, 6)}...{address.slice(-4)}
              </div>
            )}
            <button onClick={handleLogout} className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold transition-all">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Chain Warning */}
      {currentChainId && currentChainId !== "0x14a34" && (
        <div className="relative z-10 container mx-auto px-6 py-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⚠️</span>
                <div>
                  <p className="text-red-200 font-semibold">Wrong Network</p>
                  <p className="text-red-300 text-sm">
                    Please switch to Base Sepolia network. Currently on chain ID: {parseInt(currentChainId, 16)}
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  try {
                    await switchChain();
                    notification.success("Successfully switched to Base Sepolia!");
                  } catch (error) {
                    notification.error((error as Error).message || "Failed to switch network");
                  }
                }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all whitespace-nowrap"
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
              {userRole === "grantor" ? "Create Your Digital Will" : "Beneficiary Dashboard"}
            </h1>
            <p className="text-purple-200 text-lg">
              {userRole === "grantor" 
                ? "Set up your digital inheritance in minutes 🛡️"
                : "View and manage assets assigned to you 🎁"
              }
            </p>
            <div className="mt-2">
              <span className="inline-block px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
                Role: {userRole === "grantor" ? "👑 Grantor" : "🎁 Beneficiary"}
              </span>
            </div>
          </div>

          {/* Role-based content */}
          {userRole === "grantor" ? (
            /* Grantor Interface */
            <>
              {/* Loading state */}
              {contractLoading ? (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-purple-200 text-lg">Loading your will information...</p>
                  </div>
                </div>
              ) : !willInfo || willInfo.state === "INACTIVE" ? (
            /* Create Will Form */
            <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <div className="text-6xl md:text-7xl mb-6">📝</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Create Your Digital Will</h2>
                <p className="text-purple-200 text-lg mb-4">
                  Start protecting your digital assets by creating your will.
                </p>
                <p className="text-purple-300">
                  Set up a heartbeat interval to ensure your assets are distributed according to your wishes.
                </p>
              </div>
              
              <div className="max-w-md mx-auto">
                <label className="block text-left text-purple-200 mb-3 font-medium text-lg">
                  Heartbeat Interval (days)
                </label>
                <input
                  type="number"
                  value={heartbeatDays}
                  onChange={(e) => setHeartbeatDays(e.target.value)}
                  className="w-full px-6 py-4 bg-slate-800/50 border-2 border-purple-500/30 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-4"
                  placeholder="30"
                  min="1"
                />
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 mb-6">
                  <p className="text-blue-200 text-sm">
                    💡 You'll need to check in every <strong>{heartbeatDays || "30"}</strong> days. If you miss a check-in, your assets become claimable by beneficiaries.
                  </p>
                </div>
                <button
                  onClick={handleCreateWill}
                  disabled={!heartbeatDays || Number(heartbeatDays) < 1}
                  className="w-full px-8 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  Create Will 🚀
                </button>
              </div>
            </div>
          ) : (
            /* Will Management Dashboard */
            <div>
              {/* Tabs Navigation */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: "📊" },
                  { id: "assets", label: "Add Assets", icon: "💰" },
                  { id: "beneficiaries", label: "Beneficiaries", icon: "👥" },
                  { id: "settings", label: "Settings", icon: "⚙️" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                        : "bg-white/5 text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Overview Tab */}
              {activeTab === "overview" && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">✅</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Your Will is Active</h2>
                    <p className="text-purple-200">Managing your digital inheritance</p>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                      <div className="text-purple-300 text-sm mb-1">Status</div>
                      <div className="text-white text-2xl font-bold">{willInfo.state}</div>
                    </div>
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                      <div className="text-purple-300 text-sm mb-1">Total Assets</div>
                      <div className="text-white text-2xl font-bold">{willInfo.assetCount.toString()}</div>
                    </div>
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                      <div className="text-purple-300 text-sm mb-1">Check-in Interval</div>
                      <div className="text-white text-2xl font-bold">
                        {Number(willInfo.heartbeatInterval / BigInt(86400))}d
                      </div>
                    </div>
                    <div className="bg-slate-800/50 border border-purple-500/20 rounded-xl p-5">
                      <div className="text-purple-300 text-sm mb-1">Last Check-In</div>
                      <div className="text-white text-lg font-bold">
                        {new Date(Number(willInfo.lastCheckIn) * 1000).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  {/* Check-in Button */}
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="text-left">
                        <h3 className="text-white font-bold text-xl mb-2">⏰ Regular Check-In</h3>
                        <p className="text-blue-200">
                          Check in to confirm you're active and keep your will from becoming claimable.
                        </p>
                      </div>
                      <button
                        onClick={handleCheckIn}
                        className="px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
                      >
                        Check In Now ✓
                      </button>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-6">
                      <div className="text-3xl mb-3">💰</div>
                      <h3 className="text-white font-bold text-lg mb-2">Add Assets</h3>
                      <p className="text-green-200 text-sm mb-4">
                        Deposit ETH, ERC20 tokens, or NFTs to your will
                      </p>
                      <button
                        onClick={() => setActiveTab("assets")}
                        className="text-green-300 hover:text-green-200 font-semibold"
                      >
                        Go to Assets →
                      </button>
                    </div>
                    <div className="bg-gradient-to-br from-pink-500/10 to-rose-500/10 border border-pink-500/20 rounded-xl p-6">
                      <div className="text-3xl mb-3">👥</div>
                      <h3 className="text-white font-bold text-lg mb-2">Manage Beneficiaries</h3>
                      <p className="text-pink-200 text-sm mb-4">
                        Add or update people who will inherit your assets
                      </p>
                      <button
                        onClick={() => setActiveTab("beneficiaries")}
                        className="text-pink-300 hover:text-pink-200 font-semibold"
                      >
                        Manage →
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Assets Tab */}
              {activeTab === "assets" && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">💰 Add Assets to Your Will</h2>
                  
                  {/* Asset Type Selector */}
                  <div className="flex gap-3 mb-6">
                    {["ETH", "ERC20", "ERC721"].map((type) => (
                      <button
                        key={type}
                        onClick={() => setAssetType(type as any)}
                        className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                          assetType === type
                            ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                            : "bg-white/5 text-purple-200 hover:bg-white/10"
                        }`}
                      >
                        {type === "ETH" && "💎"} {type === "ERC20" && "🪙"} {type === "ERC721" && "🎨"} {type}
                      </button>
                    ))}
                  </div>

                  {/* Deposit Form */}
                  <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6 space-y-4">
                    {assetType === "ETH" && (
                      <>
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">Amount (ETH)</label>
                          <input
                            type="number"
                            value={ethAmount}
                            onChange={(e) => setEthAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0.1"
                            step="0.001"
                          />
                        </div>
                      </>
                    )}

                    {assetType === "ERC20" && (
                      <>
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">Token Contract Address</label>
                          <input
                            type="text"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0x..."
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">Amount (in token units)</label>
                          <input
                            type="text"
                            value={tokenAmount}
                            onChange={(e) => setTokenAmount(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="1000000000000000000"
                          />
                        </div>
                      </>
                    )}

                    {assetType === "ERC721" && (
                      <>
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">NFT Contract Address</label>
                          <input
                            type="text"
                            value={tokenAddress}
                            onChange={(e) => setTokenAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0x..."
                          />
                        </div>
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">Token ID</label>
                          <input
                            type="text"
                            value={tokenId}
                            onChange={(e) => setTokenId(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="1"
                          />
                        </div>
                      </>
                    )}

                    <div>
                      <label className="block text-purple-200 mb-2 font-medium">Beneficiary Address</label>
                      <input
                        type="text"
                        value={beneficiaryAddress}
                        onChange={(e) => setBeneficiaryAddress(e.target.value)}
                        className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        placeholder="0x..."
                      />
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <p className="text-blue-200 text-sm">
                        💡 This asset will be claimable by the beneficiary if you miss your check-in deadline.
                        {assetType === "ERC20" && " Make sure to approve the contract to spend your tokens first!"}
                        {assetType === "ERC721" && " Make sure to approve the contract to transfer your NFT first!"}
                      </p>
                    </div>

                    <button
                      onClick={handleDepositAsset}
                      className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-lg"
                    >
                      Deposit {assetType} 🚀
                    </button>
                  </div>
                </div>
              )}

              {/* Beneficiaries Tab */}
              {activeTab === "beneficiaries" && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">👥 Manage Beneficiaries</h2>
                  
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Add Contract Beneficiaries */}
                    <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6">
                      <h3 className="text-white font-bold text-xl mb-4">Approve Contract Beneficiaries</h3>
                      <p className="text-purple-200 text-sm mb-6">
                        Before assigning assets to contract addresses, you must approve them as beneficiaries.
                      </p>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-purple-200 mb-2 font-medium">Contract Address</label>
                          <input
                            type="text"
                            value={beneficiaryAddress}
                            onChange={(e) => setBeneficiaryAddress(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                            placeholder="0x..."
                          />
                        </div>
                        
                        <button
                          onClick={async () => {
                            if (!beneficiaryAddress) {
                              notification.warning("Please enter a contract address");
                              return;
                            }
                            try {
                              await handleApproveContractBeneficiary(beneficiaryAddress);
                              setBeneficiaryAddress("");
                            } catch (error) {
                              notification.error("Failed to approve contract beneficiary");
                            }
                          }}
                          className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all"
                        >
                          Approve Contract Beneficiary ✅
                        </button>
                      </div>
                    </div>

                    {/* Info Section */}
                    <div className="space-y-6">
                      <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                        <h4 className="text-blue-200 font-bold mb-2">💡 How Beneficiaries Work</h4>
                        <ul className="text-blue-200 text-sm space-y-2">
                          <li>• Regular addresses (EOAs) can be assigned assets directly</li>
                          <li>• Contract addresses must be approved first</li>
                          <li>• Beneficiaries can accept/reject their designation</li>
                          <li>• Assets become claimable if you miss check-ins</li>
                        </ul>
                      </div>
                      
                      <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6">
                        <h4 className="text-green-200 font-bold mb-2">✅ Adding Beneficiaries</h4>
                        <p className="text-green-200 text-sm">
                          Go to the "Add Assets" tab and deposit assets with beneficiary addresses. 
                          They will automatically be notified and can accept their designation.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">⚙️ Will Settings</h2>
                  
                  <div className="space-y-6">
                    {/* Current Settings */}
                    <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6">
                      <h3 className="text-white font-bold text-xl mb-4">📊 Current Settings</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                          <span className="text-purple-200">Heartbeat Interval:</span>
                          <span className="text-white font-semibold text-lg">
                            {Number(willInfo.heartbeatInterval / BigInt(86400))} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-purple-500/10">
                          <span className="text-purple-200">Will Status:</span>
                          <span className={`font-semibold text-lg ${
                            willInfo.state === 'ACTIVE' ? 'text-green-400' : 
                            willInfo.state === 'CLAIMABLE' ? 'text-orange-400' : 
                            'text-gray-400'
                          }`}>
                            {willInfo.state}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-purple-200">Total Assets:</span>
                          <span className="text-white font-semibold text-lg">{willInfo.assetCount.toString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Modify Heartbeat */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">⏰</span>
                        <div>
                          <h3 className="text-white font-bold text-xl">Modify Heartbeat Interval</h3>
                          <p className="text-blue-200 text-sm">Change how often you need to check in</p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                          <p className="text-blue-200 text-sm mb-2">
                            💡 <strong>Note:</strong> The new interval must be at least 1 day.
                          </p>
                          <p className="text-blue-200 text-sm">
                            If you decrease the interval, your last check-in time will be reset to give you fair time.
                          </p>
                        </div>

                        <div>
                          <label className="block text-blue-200 mb-2 font-medium">
                            New Interval (days)
                          </label>
                          <input
                            type="number"
                            value={newHeartbeatDays}
                            onChange={(e) => setNewHeartbeatDays(e.target.value)}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-blue-500/30 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder={`Current: ${Number(willInfo.heartbeatInterval / BigInt(86400))} days`}
                            min="1"
                          />
                        </div>

                        <button
                          onClick={handleModifyHeartbeat}
                          disabled={!newHeartbeatDays || Number(newHeartbeatDays) < 1}
                          className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                        >
                          Update Heartbeat Interval
                        </button>
                      </div>
                    </div>

                    {/* Emergency Withdraw */}
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="text-3xl">🚨</span>
                        <div>
                          <h3 className="text-white font-bold text-xl">Emergency Withdrawal</h3>
                          <p className="text-red-200 text-sm">Reclaim all your assets and close your will</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                          <p className="text-red-200 text-sm mb-2">
                            ⚠️ <strong>Warning:</strong> This action will:
                          </p>
                          <ul className="text-red-200 text-sm space-y-1 ml-4">
                            <li>• Return all unclaimed assets to you</li>
                            <li>• Mark your will as COMPLETED</li>
                            <li>• Cannot be undone</li>
                            <li>• Only available while your will is ACTIVE</li>
                          </ul>
                        </div>

                        {!showEmergencyConfirm ? (
                          <button
                            onClick={() => setShowEmergencyConfirm(true)}
                            disabled={willInfo.state !== 'ACTIVE'}
                            className="w-full px-6 py-4 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg transition-all transform hover:scale-[1.02] shadow-lg"
                          >
                            {willInfo.state !== 'ACTIVE' 
                              ? `Cannot Withdraw (Will is ${willInfo.state})`
                              : 'Request Emergency Withdrawal'
                            }
                          </button>
                        ) : (
                          <div className="space-y-3">
                            <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-4">
                              <p className="text-red-100 font-semibold text-center">
                                Are you absolutely sure? This cannot be undone!
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                onClick={() => setShowEmergencyConfirm(false)}
                                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-all"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={handleEmergencyWithdraw}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all transform hover:scale-105 shadow-lg"
                              >
                                Confirm Withdrawal
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info Card */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
                      <h4 className="text-purple-200 font-bold mb-2">💡 Settings Tips</h4>
                      <ul className="text-purple-200 text-sm space-y-2">
                        <li>• You can modify your heartbeat interval at any time while your will is active</li>
                        <li>• Emergency withdrawal is a safety feature for urgent situations</li>
                        <li>• Once withdrawn, you'll need to create a new will to resume protection</li>
                        <li>• Consider your schedule when setting the heartbeat interval</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
            </>
          ) : (
            /* Beneficiary Interface */
            <div>
              {/* Grantor Address Input */}
              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-white mb-6">🔍 Find Assets</h2>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-purple-200 mb-2 font-medium">Grantor Address</label>
                    <input
                      type="text"
                      value={grantorAddress}
                      onChange={(e) => setGrantorAddress(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-xl text-white font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Enter the grantor's address..."
                    />
                  </div>
                  <button
                    onClick={() => loadBeneficiaryAssets(grantorAddress)}
                    disabled={!grantorAddress || loadingBeneficiaryAssets}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-xl font-semibold transition-all"
                  >
                    {loadingBeneficiaryAssets ? "Loading..." : "Search"}
                  </button>
                </div>
              </div>

              {/* Beneficiary Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: "📊" },
                  { id: "assets", label: "My Assets", icon: "💰" },
                  { id: "pending", label: "Pending", icon: "⏳" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setBeneficiaryTab(tab.id as BeneficiaryTabType)}
                    className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                      beneficiaryTab === tab.id
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                        : "bg-white/5 text-purple-200 hover:bg-white/10"
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              {/* Beneficiary Overview Tab */}
              {beneficiaryTab === "overview" && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/20 rounded-3xl p-8">
                  <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🎁</div>
                    <h2 className="text-3xl font-bold text-white mb-2">Beneficiary Overview</h2>
                    <p className="text-green-200">View and manage assets assigned to you</p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-5">
                      <div className="text-green-300 text-sm mb-1">Total Assets</div>
                      <div className="text-white text-2xl font-bold">{beneficiaryAssets.length}</div>
                    </div>
                    <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-5">
                      <div className="text-green-300 text-sm mb-1">Claimable</div>
                      <div className="text-white text-2xl font-bold">
                        {beneficiaryAssets.filter(asset => asset.isClaimable && !asset.assetInfo.claimed).length}
                      </div>
                    </div>
                    <div className="bg-slate-800/50 border border-green-500/20 rounded-xl p-5">
                      <div className="text-green-300 text-sm mb-1">Already Claimed</div>
                      <div className="text-white text-2xl font-bold">
                        {beneficiaryAssets.filter(asset => asset.assetInfo.claimed).length}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <h3 className="text-blue-200 font-bold mb-2">💡 How it works</h3>
                    <p className="text-blue-200 text-sm">
                      As a beneficiary, you can view assets assigned to you, accept your designation, 
                      and claim assets when they become available (if the grantor misses their check-in deadline).
                    </p>
                  </div>
                </div>
              )}

              {/* Beneficiary Assets Tab */}
              {beneficiaryTab === "assets" && (
                <div className="bg-gradient-to-br from-green-900/30 to-emerald-900/30 backdrop-blur-sm border border-green-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">💰 My Assets</h2>
                  
                  {loadingBeneficiaryAssets ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <p className="text-green-200 text-lg">Loading assets...</p>
                    </div>
                  ) : beneficiaryAssets.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">🔍</div>
                      <h3 className="text-xl font-bold text-white mb-2">No assets found</h3>
                      <p className="text-green-200">
                        {grantorAddress 
                          ? "No assets assigned to you by this grantor."
                          : "Enter a grantor address above to search for assigned assets."
                        }
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {beneficiaryAssets.map((asset, index) => (
                        <div key={index} className="bg-slate-800/30 border border-green-500/20 rounded-xl p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl">
                                  {asset.assetInfo.assetType === 0 ? "💎" : 
                                   asset.assetInfo.assetType === 1 ? "🪙" : "🎨"}
                                </span>
                                <span className="text-white font-bold text-lg">
                                  {asset.assetInfo.assetType === 0 ? "ETH" : 
                                   asset.assetInfo.assetType === 1 ? "ERC20 Token" : "ERC721 NFT"}
                                </span>
                                {asset.assetInfo.claimed && (
                                  <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-medium">
                                    Claimed ✅
                                  </span>
                                )}
                              </div>
                              <div className="text-green-300 text-sm font-mono mb-1">
                                Amount: {asset.assetInfo.assetType === 2 ? `Token ID: ${asset.assetInfo.tokenId}` : `${Number(asset.assetInfo.amount) / 1e18} ${asset.assetInfo.assetType === 0 ? 'ETH' : 'tokens'}`}
                              </div>
                              {asset.assetInfo.assetType !== 0 && (
                                <div className="text-purple-300 text-sm font-mono">
                                  Contract: {asset.assetInfo.tokenAddress}
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="text-green-300 text-sm mb-2">
                                Status: {asset.isClaimable ? "Claimable 🎉" : "Waiting ⏳"}
                              </div>
                              {asset.timeUntilClaimable && (
                                <div className="text-purple-300 text-xs">
                                  Time until claimable: {Math.floor(Number(asset.timeUntilClaimable) / 86400)} days
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex gap-3">
                            {!asset.hasAccepted && (
                              <>
                                <button
                                  onClick={() => handleAcceptBeneficiary(asset.grantor)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                >
                                  Accept Designation ✅
                                </button>
                                <button
                                  onClick={() => handleRejectBeneficiary(asset.grantor)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                  Reject ❌
                                </button>
                              </>
                            )}
                            {asset.hasAccepted && asset.isClaimable && !asset.assetInfo.claimed && (
                              <button
                                onClick={() => handleClaimAsset(asset.grantor, asset.assetIndex)}
                                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg font-semibold transition-all"
                              >
                                Claim Asset 🎉
                              </button>
                            )}
                            {asset.hasAccepted && !asset.isClaimable && (
                              <span className="px-4 py-2 bg-gray-600 text-gray-300 rounded-lg font-semibold">
                                Waiting for claimable status
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Pending Tab */}
              {beneficiaryTab === "pending" && (
                <div className="bg-gradient-to-br from-amber-900/30 to-yellow-900/30 backdrop-blur-sm border border-amber-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">⏳ Pending Actions</h2>
                  
                  <div className="space-y-4">
                    {beneficiaryAssets.filter(asset => !asset.hasAccepted).length === 0 ? (
                      <div className="text-center py-12">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-xl font-bold text-white mb-2">All caught up!</h3>
                        <p className="text-amber-200">No pending beneficiary designations.</p>
                      </div>
                    ) : (
                      beneficiaryAssets
                        .filter(asset => !asset.hasAccepted)
                        .map((asset, index) => (
                          <div key={index} className="bg-slate-800/30 border border-amber-500/20 rounded-xl p-6">
                            <div className="flex justify-between items-center">
                              <div>
                                <h4 className="text-white font-bold">
                                  Beneficiary Designation from {asset.grantor.slice(0, 6)}...{asset.grantor.slice(-4)}
                                </h4>
                                <p className="text-amber-200 text-sm mt-1">
                                  You need to accept or reject this designation to proceed.
                                </p>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => handleAcceptBeneficiary(asset.grantor)}
                                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all"
                                >
                                  Accept ✅
                                </button>
                                <button
                                  onClick={() => handleRejectBeneficiary(asset.grantor)}
                                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-all"
                                >
                                  Reject ❌
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-8 mt-12 border-t border-purple-500/20">
        <div className="container mx-auto px-6 text-center text-purple-400">
          <p>Made with 💜 by Hera | Secured by Smart Contracts</p>
        </div>
      </footer>
    </div>
  );
}

