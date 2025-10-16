"use client";

import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [activeStep, setActiveStep] = useState(0);

  const features = [
    {
      icon: "🔐",
      title: "No Middlemen",
      description: "Like having a robot helper that follows your instructions exactly. No lawyers or banks needed!",
    },
    {
      icon: "💎",
      title: "Many Types of Treasures",
      description: "Store all your digital treasures: coins, tokens, and special NFT collectibles - all in one safe place!",
    },
    {
      icon: "🤫",
      title: "Keep it Private",
      description: "Your secret list of who gets what stays hidden until the right time. Only you know!",
    },
    {
      icon: "⚡",
      title: "Super Fast",
      description: "When it's time, your treasures move instantly - no waiting weeks or months!",
    },
  ];

  const steps = [
    {
      number: "1",
      title: "Create Your Digital Box",
      description: "Think of it like getting a magical treasure chest that only you can open and fill!",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "2",
      title: "Put Your Treasures Inside",
      description: "Add your crypto coins and digital collectibles to the chest. Tell it who should get each treasure.",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "3",
      title: "Say 'Hi' Regularly",
      description: "Every few months, press the 'I'm here!' button. It's like checking in to say you're doing great!",
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "4",
      title: "Magic Happens Automatically",
      description: "If you forget to check in for too long, the chest opens and gives your treasures to the people you chose!",
      color: "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
        </div>

        <nav className="relative z-10 container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 group">
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
            </div>
            <a href="/login" className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-full font-semibold transition-all transform hover:scale-105 shadow-lg shadow-purple-500/50 inline-block">
              Log in / Sign up
            </a>
          </div>
        </nav>

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block mb-6 px-4 py-2 bg-purple-500/20 backdrop-blur-sm border border-purple-500/30 rounded-full text-purple-300 text-sm font-medium">
              ✨ The Future of Digital Inheritance
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Your Digital Treasures,
              <br />
              <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Safe Forever
              </span>
            </h1>
            
            <p className="text-lg md:text-xl text-purple-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              Imagine a magical box that keeps your crypto safe and automatically gives it to your loved ones when you want. 
              No complicated stuff, just simple and safe! 🎁
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/login" className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50 inline-block">
                Create Your Digital Box 🚀
              </a>
              <button className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white rounded-full font-bold text-lg transition-all border border-white/20">
                Learn More 📚
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">100%</div>
                <div className="text-purple-300 text-sm md:text-base">Secure</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">0</div>
                <div className="text-purple-300 text-sm md:text-base">Middlemen</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">24/7</div>
                <div className="text-purple-300 text-sm md:text-base">Available</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Problem & Solution Section */}
      <div className="relative py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 backdrop-blur-sm border border-red-500/20 rounded-3xl p-8 md:p-12">
                <div className="text-5xl mb-4">😟</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Problem</h3>
                <p className="text-purple-200 text-lg leading-relaxed">
                  When someone goes away forever, their crypto treasures get stuck! 
                  The secret keys are lost, and families can't find the digital money. 
                  It's like having a treasure chest but no one knows where the key is! 🔑❌
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm border border-green-500/20 rounded-3xl p-8 md:p-12">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">The Solution</h3>
                <p className="text-purple-200 text-lg leading-relaxed">
                  Our smart robot helper knows exactly what to do! 
                  If you don't check in for a while, it automatically gives your treasures to the special people you picked. 
                  No lost keys, no confusion! ✨
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Why It's <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Awesome</span>
              </h2>
              <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
                Super powers that make protecting your treasures easy and fun! 🦸‍♂️
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-purple-900/30 to-pink-900/30 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 hover:scale-105 transition-all hover:shadow-2xl hover:shadow-purple-500/25"
                >
                  <div className="text-5xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-purple-200 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="relative py-20 bg-slate-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                How Does It <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Work?</span>
              </h2>
              <p className="text-purple-200 text-lg md:text-xl max-w-2xl mx-auto">
                It's as easy as 1-2-3-4! Even easier than tying your shoes! 👟
              </p>
            </div>

            <div className="space-y-6">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 md:p-8 transition-all cursor-pointer ${
                    activeStep === index ? 'ring-2 ring-purple-500 shadow-2xl shadow-purple-500/25' : 'hover:border-purple-500/40'
                  }`}
                  onClick={() => setActiveStep(index)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                    <div className={`flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-r ${step.color} flex items-center justify-center text-white text-2xl font-bold shadow-lg`}>
                      {step.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                      <p className="text-purple-200 text-lg leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* What You Can Store Section */}
      <div className="relative py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                What Can You <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Store?</span>
              </h2>
              <p className="text-purple-200 text-lg md:text-xl">
                All kinds of digital treasures! 🎁
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-all">
                <div className="text-6xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-white mb-2">ETH Coins</h3>
                <p className="text-purple-200">The main blockchain money!</p>
              </div>

              <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 backdrop-blur-sm border border-green-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-all">
                <div className="text-6xl mb-4">🪙</div>
                <h3 className="text-xl font-bold text-white mb-2">Token Coins</h3>
                <p className="text-purple-200">Special tokens like USDC!</p>
              </div>

              <div className="bg-gradient-to-br from-pink-500/20 to-red-500/20 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-8 text-center hover:scale-105 transition-all">
                <div className="text-6xl mb-4">🖼️</div>
                <h3 className="text-xl font-bold text-white mb-2">NFT Art</h3>
                <p className="text-purple-200">Your unique digital art!</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative py-20 bg-gradient-to-r from-purple-900/30 to-pink-900/30 backdrop-blur-sm">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Protect Your <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Treasures?</span>
            </h2>
            <p className="text-purple-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Join others who are keeping their digital wealth safe for the people they love! 💝
            </p>
            <a href="/login" className="px-10 py-5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-bold text-xl transition-all transform hover:scale-105 shadow-2xl shadow-purple-500/50 inline-block">
              Create Your Digital Box Now 🚀
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-12 border-t border-purple-500/20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="relative w-8 h-8">
                    <Image 
                      src="/HeraLogo.png" 
                      alt="Hera Logo" 
                      width={32} 
                      height={32}
                      className="object-contain drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]"
                    />
                  </div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Hera
                  </span>
                </div>
                <p className="text-purple-300">
                  Making digital inheritance simple and safe for everyone.
                </p>
              </div>

              <div>
                <h4 className="text-white font-bold mb-4">Quick Links</h4>
                <ul className="space-y-2 text-purple-300">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">How It Works</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Documentation</a></li>
                </ul>
              </div>

              <div>
                <h4 className="text-white font-bold mb-4">Community</h4>
                <ul className="space-y-2 text-purple-300">
                  <li><a href="#" className="hover:text-purple-400 transition-colors">GitHub</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Twitter</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition-colors">Discord</a></li>
                </ul>
              </div>
            </div>

            <div className="text-center text-purple-400 pt-8 border-t border-purple-500/20">
              <p>Made with 💜 by Hera | Secured by Smart Contracts</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
