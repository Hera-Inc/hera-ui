"use client";

import { useState, useEffect } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { useWillContract } from "@/hooks/useWillContract";
import { useRouter } from "next/navigation";

type TabType = "overview" | "assets" | "beneficiaries" | "settings";

export default function DashboardPage() {
  const router = useRouter();
  const { provider, address, loggedIn, loading: authLoading, logout, currentChainId, switchChain } = useWeb3Auth();
  
  // Form state
  const [heartbeatDays, setHeartbeatDays] = useState("30");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  
  // Asset deposit form state
  const [assetType, setAssetType] = useState<"ETH" | "ERC20" | "ERC721">("ETH");
  const [ethAmount, setEthAmount] = useState("");
  const [tokenAddress, setTokenAddress] = useState("");
  const [tokenAmount, setTokenAmount] = useState("");
  const [tokenId, setTokenId] = useState("");
  const [beneficiaryAddress, setBeneficiaryAddress] = useState("");

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
  } = contractHook;

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !loggedIn) {
      router.push("/login");
    }
  }, [authLoading, loggedIn, router]);

  const handleCreateWill = async () => {
    try {
      const intervalSeconds = BigInt(Number.parseInt(heartbeatDays) * 24 * 60 * 60);
      await createWill(intervalSeconds);
      alert("Will created successfully! 🎉");
    } catch (error) {
      console.error("Error creating will:", error);
      alert("Failed to create will. " + (error as Error).message);
    }
  };

  const handleDepositAsset = async () => {
    try {
      if (!beneficiaryAddress) {
        alert("Please enter a beneficiary address");
        return;
      }

      if (assetType === "ETH") {
        if (!ethAmount) {
          alert("Please enter an amount");
          return;
        }
        const amountWei = BigInt(Math.floor(parseFloat(ethAmount) * 1e18));
        await depositEth(beneficiaryAddress as any, amountWei);
        alert("ETH deposited successfully! 💰");
        setEthAmount("");
        setBeneficiaryAddress("");
      } else if (assetType === "ERC20") {
        if (!tokenAddress || !tokenAmount) {
          alert("Please enter token address and amount");
          return;
        }
        const amount = BigInt(tokenAmount);
        await depositERC20(tokenAddress as any, amount, beneficiaryAddress as any);
        alert("ERC20 token deposited successfully! 🪙");
        setTokenAddress("");
        setTokenAmount("");
        setBeneficiaryAddress("");
      } else if (assetType === "ERC721") {
        if (!tokenAddress || !tokenId) {
          alert("Please enter token address and token ID");
          return;
        }
        await depositERC721(tokenAddress as any, BigInt(tokenId), beneficiaryAddress as any);
        alert("NFT deposited successfully! 🎨");
        setTokenAddress("");
        setTokenId("");
        setBeneficiaryAddress("");
      }
    } catch (error) {
      console.error("Error depositing asset:", error);
      alert("Failed to deposit asset. " + (error as Error).message);
    }
  };

  const handleCheckIn = async () => {
    try {
      await checkIn();
      alert("Check-in successful! ✅ Your will is now updated.");
    } catch (error) {
      console.error("Error checking in:", error);
      alert("Failed to check in. " + (error as Error).message);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
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
          <a href="/" className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            🛡️ Hera
          </a>
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
                onClick={switchChain}
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
              Create Your Digital Will
            </h1>
            <p className="text-purple-200 text-lg">
              Set up your digital inheritance in minutes 🛡️
            </p>
          </div>

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
                  <h2 className="text-3xl font-bold text-white mb-4">👥 Manage Beneficiaries</h2>
                  <p className="text-purple-200 mb-8">
                    Beneficiaries are added automatically when you deposit assets. They will be able to claim their designated assets if you miss your check-in deadline.
                  </p>
                  
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                    <p className="text-blue-200">
                      💡 To add a beneficiary, go to the "Add Assets" tab and deposit an asset with their address.
                    </p>
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === "settings" && (
                <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8">
                  <h2 className="text-3xl font-bold text-white mb-6">⚙️ Will Settings</h2>
                  
                  <div className="space-y-6">
                    <div className="bg-slate-800/30 border border-purple-500/20 rounded-2xl p-6">
                      <h3 className="text-white font-bold text-xl mb-4">Current Settings</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Heartbeat Interval:</span>
                          <span className="text-white font-semibold">
                            {Number(willInfo.heartbeatInterval / BigInt(86400))} days
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Will Status:</span>
                          <span className="text-white font-semibold">{willInfo.state}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-purple-200">Total Assets:</span>
                          <span className="text-white font-semibold">{willInfo.assetCount.toString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-6">
                      <h3 className="text-yellow-200 font-bold mb-2">⚠️ Advanced Features Coming Soon</h3>
                      <p className="text-yellow-200/80 text-sm">
                        Features like modifying heartbeat interval, emergency withdrawal, and asset removal will be available in future updates.
                      </p>
                    </div>
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

