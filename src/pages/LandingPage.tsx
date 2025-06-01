import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun } from 'lucide-react';
import { BackgroundPaths } from '@/components/ui/background-paths';
import { useTheme } from '@/contexts/ThemeContext';

const features = [
  {
    icon: '💸',
    title: 'Track Expenses',
    desc: 'Log daily spending with categories and notes.',
  },
  {
    icon: '🎯',
    title: 'Set Savings Goals',
    desc: 'Stay motivated with monthly targets and progress.',
  },
  {
    icon: '📊',
    title: 'Visual Insights',
    desc: 'Pie charts, bar graphs, and a calendar for clarity.',
  },
];

const steps = [
  { icon: '📝', title: 'Sign Up' },
  { icon: '➕', title: 'Add Expenses' },
  { icon: '🎯', title: 'Set a Goal' },
  { icon: '📈', title: 'See Insights' },
];

const testimonials = [
  {
    quote: "BudgetBloom made me realize where my money was going. Now I save every month!",
    name: "Aarav",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote: "The calendar and charts are so easy to use. I love the gentle nudges!",
    name: "Priya",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote: "I finally feel in control of my spending. The analytics are super clear!",
    name: "Rohan",
    avatar: "https://randomuser.me/api/portraits/men/65.jpg",
  },
  {
    quote: "Setting a savings goal each month keeps me motivated. Highly recommend!",
    name: "Meera",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const isDark = theme === 'dark';
  
  return (
    <div className="min-h-screen flex flex-col relative bg-white dark:bg-black">
      {/* Background Paths covering only the hero section */}
      <div className="absolute top-0 left-0 right-0 h-screen z-0 overflow-hidden">
        <BackgroundPaths title="" />
      </div>
      
      {/* Header - Positioned over the BackgroundPaths */}
      <header className="relative z-20 flex justify-between items-center px-6 py-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-3xl">🌱</span>
            <span className="text-2xl font-bold text-[#87a96b] dark:text-[#87a96b]">BudgetBloom</span>
          </div>
          <a 
            href="#features" 
            className="text-white bg-gradient-to-r from-[#87a96b] to-[#F4A261] hover:from-[#87a96b]/90 hover:to-[#F4A261]/90 font-medium transition-all duration-300 hover:scale-105 px-4 py-1.5 rounded-md shadow-sm hover:shadow-md border border-[#87a96b]/20 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Features</span>
          </a>
        </div>
        <div className="flex items-center gap-6">
          <button
            className="rounded-full p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white transition-all duration-300 hover:rotate-12"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <div className="flex gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-[#87a96b] text-white font-semibold shadow hover:bg-[#87a96b]/80 dark:hover:bg-[#87a96b]/90 hover:scale-105 hover:shadow-md transition-all duration-300"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-bloom-coral text-white font-semibold shadow hover:bg-bloom-coral/80 dark:hover:bg-bloom-coral/90 hover:scale-105 hover:shadow-md transition-all duration-300"
              onClick={() => navigate('/register')}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="w-full h-screen flex flex-col items-center justify-start pt-32 md:pt-40">
        <div className="text-center z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 leading-tight drop-shadow-lg tracking-tighter font-serif">
            <span className="text-[#87a96b]">Financial</span> <span className="text-[#F4A261]">Growth</span>
          </h1>
          <p className="text-lg md:text-xl text-black/80 dark:text-white/80 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Empowering your financial future, one smart decision at a time
          </p>
          <button
            className="px-8 py-3 rounded-lg bg-black text-white dark:bg-white dark:text-black font-bold text-lg shadow-lg hover:bg-black/80 dark:hover:bg-white/80 hover:scale-105 hover:shadow-xl transition-all duration-300 mb-4"
            onClick={() => navigate('/register')}
          >
            Start Your Journey
          </button>
        </div>
      </div>

      {/* Content Sections */}
      <div className="relative z-10">
        {/* Intro Section */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 pt-8 pb-4 text-center">
          <p className="text-lg md:text-xl text-black dark:text-white mb-8 max-w-xl mx-auto bg-white dark:bg-black p-6 rounded-xl border border-black/10 dark:border-white/10">
            BudgetBloom helps you track spending, set savings goals, and visualize your financial journey—all in a clean, beginner-friendly app.
          </p>
        </div>

        {/* Powerful Features Section */}
        <div id="features" className="bg-white dark:bg-black py-8 border-t border-black/10 dark:border-white/10">
          <section className="w-full max-w-4xl mx-auto px-4 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">Powerful Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((f) => (
                <div
                  key={f.title}
                  className="mt-6 bg-white dark:bg-black rounded-2xl shadow-soft p-8 border border-black/10 dark:border-white/20 text-center text-black dark:text-white transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50"
                >
                  <div className="text-5xl mb-6 flex justify-center">{f.icon}</div>
                  <h3 className="font-bold text-xl mb-4 text-black dark:text-white text-center">{f.title}</h3>
                  <p className="text-gray-700 dark:text-gray-200 text-base text-center leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Why Choose BudgetBloom */}
        <div className="bg-white dark:bg-black py-8 border-t border-black/10 dark:border-white/10">
          <section className="w-full max-w-5xl mx-auto mb-8 px-4">
            <h2 className="text-3xl font-bold mb-6 text-black dark:text-white text-left">Why Choose BudgetBloom?</h2>
            <div className="flex flex-col gap-6 w-full">
              <div className="flex items-start gap-5 bg-white dark:bg-black rounded-xl shadow p-6 w-full border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:translate-x-1 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50">
                <span className="text-4xl mt-1">🌱</span>
                <div className="text-left">
                  <div className="font-bold text-xl text-black dark:text-white mb-1">Gain True Control Over Your Money</div>
                  <div className="text-gray-700 dark:text-gray-200 text-base">No more guesswork—see exactly where your money goes and make smarter decisions every day.</div>
                </div>
              </div>
              <div className="flex items-start gap-5 bg-white dark:bg-black rounded-xl shadow p-6 w-full border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:translate-x-1 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50">
                <span className="text-4xl mt-1">🧠</span>
                <div className="text-left">
                  <div className="font-bold text-xl text-black dark:text-white mb-1">Build Healthy Financial Habits</div>
                  <div className="text-gray-700 dark:text-gray-200 text-base">Set savings goals, track your progress, and celebrate milestones to stay motivated long-term.</div>
                </div>
              </div>
              <div className="flex items-start gap-5 bg-white dark:bg-black rounded-xl shadow p-6 w-full border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:translate-x-1 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50">
                <span className="text-4xl mt-1">📊</span>
                <div className="text-left">
                  <div className="font-bold text-xl text-black dark:text-white mb-1">Instant Clarity With Beautiful Charts</div>
                  <div className="text-gray-700 dark:text-gray-200 text-base">Visualize your spending and savings with easy-to-understand graphs and a calendar view.</div>
                </div>
              </div>
              <div className="flex items-start gap-5 bg-white dark:bg-black rounded-xl shadow p-6 w-full border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:translate-x-1 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50">
                <span className="text-4xl mt-1">💡</span>
                <div className="text-left">
                  <div className="font-bold text-xl text-black dark:text-white mb-1">Stay Motivated With Gentle Nudges</div>
                  <div className="text-gray-700 dark:text-gray-200 text-base">Get positive reminders and encouragement—never guilt or pressure.</div>
                </div>
              </div>
              <div className="flex items-start gap-5 bg-white dark:bg-black rounded-xl shadow p-6 w-full border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:translate-x-1 hover:border-[#87a96b]/50 dark:hover:border-[#87a96b]/50">
                <span className="text-4xl mt-1">🔒</span>
                <div className="text-left">
                  <div className="font-bold text-xl text-black dark:text-white mb-1">All-in-One, Privacy-First, and Beginner-Friendly</div>
                  <div className="text-gray-700 dark:text-gray-200 text-base">Your data is yours alone. BudgetBloom is designed for everyone—no jargon, no clutter, just results.</div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white dark:bg-black py-4 border-t border-black/10 dark:border-white/10">
          <section className="w-full max-w-6xl mx-auto mb-4 px-4">
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white text-center">What Users Say</h2>
            <div className="flex flex-wrap justify-between gap-8 w-full">
              {testimonials.map((t, idx) => (
                <div key={t.name + idx} className="bg-white dark:bg-black rounded-xl shadow p-6 flex flex-col items-center flex-1 min-w-[220px] max-w-xs mx-auto border border-black/10 dark:border-white/20 transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#F4A261]/50">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-14 h-14 rounded-full object-cover mb-2 border-2 border-white/30 shadow"
                  />
                  <div className="italic text-gray-700 dark:text-gray-200 mb-2 text-center">{t.quote}</div>
                  <div className="text-black dark:text-white font-semibold">{t.name}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-8 bg-white dark:bg-black border-t border-black/10 dark:border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌱</span>
              <span className="text-xl font-bold text-[#87a96b]">BudgetBloom</span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              Empowering thoughtful financial decisions through beautifully crafted tools.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} BudgetBloom. All rights reserved.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-black dark:text-white">Platform</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Features</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Pricing</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">FAQ</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-black dark:text-white">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">About</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Blog</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-black dark:text-white">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-[#87a96b] dark:hover:text-[#87a96b] transition-all duration-300 hover:translate-x-1 inline-block">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  );
} 