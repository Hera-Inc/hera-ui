"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Auth, UserRole } from "@/contexts/Web3AuthContext";
import { useNotification } from "@/contexts/NotificationContext";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const { loggedIn, loading, address, login, logout, currentChainId, switchChain, userRole, setUserRole } = useWeb3Auth();
  const notification = useNotification();

  // Redirect to dashboard if already logged in and role is selected
  useEffect(() => {
    if (!loading && loggedIn && userRole) {
      router.push("/dashboard");
    }
  }, [loading, loggedIn, userRole, router]);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (loading) return; // Don't navigate while loading auth state
    
    if (loggedIn) {
      router.push("/dashboard");
    } else {
      router.push("/");
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
                  🔒 Using Base Sepolia - Secure Layer 2 Network
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
                  onClick={async () => {
                    try {
                      await login();
                      notification.success("Successfully connected!");
                    } catch (error) {
                      notification.error((error as Error).message || "Failed to connect wallet");
                    }
                  }}
                  className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  Connect Wallet & Sign In 🚀
                </button>

                <div className="mt-6 text-purple-300 text-sm">
                  Powered by Web3Auth - Supporting Google, Facebook, Twitter, Discord, Email, and all major Web3 wallets
                </div>
              </div>
            </div>
          ) : userRole ? (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Welcome Back! 👋
                </h1>
                <p className="text-lg text-purple-200">
                  You're successfully connected to Hera as a {userRole}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
                <button
                  onClick={() => router.push("/dashboard")}
                  className="flex-1 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50"
                >
                  Go to Dashboard 🚀
                </button>
                
                <button
                  onClick={async () => {
                    try {
                      await logout();
                      notification.info("Successfully logged out");
                    } catch (error) {
                      notification.error((error as Error).message || "Failed to logout");
                    }
                  }}
                  className="flex-1 px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-xl font-bold text-lg transition-all border border-white/20"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <div className="mb-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Choose Your Role 🎯
                </h1>
                <p className="text-lg text-purple-200">
                  How would you like to use Hera?
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Grantor Option */}
                  <div 
                    onClick={() => setUserRole("grantor")}
                    className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-2xl p-6 cursor-pointer hover:from-blue-500/30 hover:to-purple-500/30 transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-4">👑</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Grantor</h3>
                    <p className="text-blue-200 mb-4">
                      Create a digital will and manage your assets. Add beneficiaries and set up inheritance rules.
                    </p>
                    <ul className="text-blue-300 text-sm space-y-2 mb-6">
                      <li>• Create and manage your digital will</li>
                      <li>• Add assets (ETH, ERC20, NFTs)</li>
                      <li>• Assign beneficiaries to assets</li>
                      <li>• Set heartbeat intervals</li>
                      <li>• Approve contract beneficiaries</li>
                    </ul>
                    <div className="text-blue-200 font-semibold">
                      Click to continue as Grantor →
                    </div>
                  </div>

                  {/* Beneficiary Option */}
                  <div 
                    onClick={() => setUserRole("beneficiary")}
                    className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 rounded-2xl p-6 cursor-pointer hover:from-green-500/30 hover:to-emerald-500/30 transition-all transform hover:scale-105"
                  >
                    <div className="text-5xl mb-4">🎁</div>
                    <h3 className="text-2xl font-bold text-white mb-3">Beneficiary</h3>
                    <p className="text-green-200 mb-4">
                      View and claim assets that have been assigned to you in someone's will.
                    </p>
                    <ul className="text-green-300 text-sm space-y-2 mb-6">
                      <li>• View assigned assets</li>
                      <li>• Accept beneficiary designation</li>
                      <li>• Claim assets when claimable</li>
                      <li>• Track time until claimable</li>
                      <li>• See asset types and values</li>
                    </ul>
                    <div className="text-green-200 font-semibold">
                      Click to continue as Beneficiary →
                    </div>
                  </div>
                </div>

                {address && (
                  <div className="mt-8">
                    <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                      <h3 className="text-purple-300 text-sm font-medium mb-2">Wallet Address</h3>
                      <p className="text-white font-mono text-sm break-all">{address}</p>
                    </div>
                  </div>
                )}

                {currentChainId && currentChainId !== "0x14a34" && (
                  <div className="mt-6">
                    <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">⚠️</span>
                        <div>
                          <p className="text-red-200 font-semibold">Wrong Network</p>
                          <p className="text-red-300 text-sm">
                            Please switch to Base Sepolia (Chain ID: 84532). Currently on: {parseInt(currentChainId, 16)}
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
                        className="w-full px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                      >
                        Switch to Base Sepolia
                      </button>
                    </div>
                  </div>
                )}
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

