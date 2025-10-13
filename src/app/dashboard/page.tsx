"use client";

import { useState, useEffect } from "react";
import { useWeb3Auth } from "@/contexts/Web3AuthContext";
import { useWillContract } from "@/hooks/useWillContract";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const { provider, address, loggedIn, loading: authLoading, logout } = useWeb3Auth();
  
  // Form state
  const [heartbeatDays, setHeartbeatDays] = useState("30");

  // Only use contract hook if logged in
  const contractHook = useWillContract(loggedIn ? provider : null, loggedIn ? address : "");
  
  const {
    willInfo,
    loading: contractLoading,
    createWill,
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
      alert("Failed to create will");
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
            /* Will Created Success */
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-3xl p-8 md:p-12 max-w-3xl mx-auto">
              <div className="text-center">
                <div className="text-6xl md:text-7xl mb-6">✅</div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Will Created Successfully!</h2>
                <p className="text-green-200 text-lg mb-8">
                  Your digital will is now active and ready to protect your assets.
                </p>
                
                <div className="bg-slate-800/50 border border-purple-500/20 rounded-2xl p-6 mb-8">
                  <h3 className="text-white font-bold text-xl mb-4">Will Details</h3>
                  <div className="grid md:grid-cols-2 gap-6 text-left">
                    <div>
                      <div className="text-purple-300 text-sm mb-1">Status</div>
                      <div className="text-white text-lg font-medium">
                        {willInfo.state}
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-300 text-sm mb-1">Heartbeat Interval</div>
                      <div className="text-white text-lg font-medium">
                        {Number(willInfo.heartbeatInterval / BigInt(86400))} days
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-300 text-sm mb-1">Last Check-In</div>
                      <div className="text-white text-lg font-medium">
                        {new Date(Number(willInfo.lastCheckIn) * 1000).toLocaleDateString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-purple-300 text-sm mb-1">Total Assets</div>
                      <div className="text-white text-lg font-medium">
                        {willInfo.assetCount.toString()}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-6">
                  <div className="flex items-start gap-3 text-left">
                    <div className="text-2xl">💡</div>
                    <div>
                      <h3 className="text-white font-bold mb-2">Next Steps</h3>
                      <p className="text-blue-200 text-sm">
                        Your will is now active! Remember to check in every {Number(willInfo.heartbeatInterval / BigInt(86400))} days to keep it active. 
                        You can now add assets and beneficiaries to your will.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
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

