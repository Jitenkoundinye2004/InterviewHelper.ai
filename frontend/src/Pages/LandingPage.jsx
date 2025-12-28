import React, { useContext, useState } from "react";
import iprep from "../assets/iprep.png";
import { useNavigate, Link } from "react-router-dom";
import { Sparkles, UserCheck, TrendingUp, Zap, Star, ArrowRight, CheckCircle, Smartphone, Twitter, Linkedin, Facebook, Instagram, Mail } from "lucide-react";
import Modal from "../components/Modal";
import Login from "../Pages/Auth/Login";
import SignUp from "../Pages/Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";
import InterviewAnimation from "../components/InterviewAnimation";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login"); // default login

  const handleCTA = () => {
    if (!user) {
      setCurrentPage("signup");
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      {/* Sticky Navbar with Glassmorphism */}
      <header className="sticky top-0 z-40 w-full backdrop-blur-lg bg-white/70 border-b border-gray-100 transition-all">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-1.5 sm:gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-blue-500/30 shadow-lg">
              I
            </div>
            <span className="text-base sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              InterviewHelper.ai
            </span>
          </Link>

          {user ? (
            <ProfileInfoCard />
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                className="hidden sm:block text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer text-sm"
                onClick={() => {
                  setCurrentPage("login");
                  setOpenAuthModal(true);
                }}
              >
                Log In
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer text-xs sm:text-sm"
                onClick={() => {
                  setCurrentPage("signup");
                  setOpenAuthModal(true);
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 sm:pt-20 pb-16 sm:pb-32 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-20 right-0 -mr-20 -mt-20 w-64 sm:w-96 h-64 sm:h-96 rounded-full bg-blue-500/10 blur-3xl opacity-50 animate-blob1"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-56 sm:w-80 h-56 sm:h-80 rounded-full bg-indigo-500/10 blur-3xl opacity-50 animate-blob2"></div>

        <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
          <div className="text-left space-y-6 sm:space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-[10px] sm:text-xs font-bold px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wide">
              <Sparkles size={12} className="sm:w-3.5 sm:h-3.5" />
              <span>AI-Powered Interview Prep</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
              Master Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Interview
              </span>
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Generate role-specific questions, get instant AI explanations, and organize your prep like a pro.
              The ultimate toolkit to boost your confidence and land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                className="group flex items-center justify-center gap-2 bg-blue-600 text-white text-base sm:text-lg font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1 cursor-pointer"
                onClick={handleCTA}
              >
                Start Preparing Free
                <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <InterviewAnimation />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 sm:py-24 bg-white relative">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <h2 className="text-xs sm:text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">Process</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">How It Works</h3>
            <p className="text-gray-600 text-base sm:text-lg">Three simple steps to interview mastery.</p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {[
              {
                icon: <Smartphone className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                to: "from-blue-400 to-blue-600",
                title: "1. Create Session",
                desc: "Tell us about the job role, experience level, and specific topics you want to target."
              },
              {
                icon: <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                to: "from-indigo-400 to-indigo-600",
                title: "2. Get Questions",
                desc: "Our AI generates a curated list of potential interview questions tailored to your profile."
              },
              {
                icon: <TrendingUp className="w-6 h-6 sm:w-8 sm:h-8 text-white" />,
                to: "from-purple-400 to-purple-600",
                title: "3. Practice & Learn",
                desc: "Review answers, request detailed explanations, and track your readiness progress."
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-6 sm:p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${item.to} flex items-center justify-center mb-4 sm:mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{item.title}</h4>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      <section className="py-16 sm:py-24 bg-white relative overflow-hidden">
        {/* Background Bubbles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-blue-50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-60 sm:w-80 h-60 sm:h-80 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 sm:gap-16 items-center">

            {/* Text Content */}
            <div className="order-2 md:order-1">
              <h2 className="text-xs sm:text-base text-blue-600 font-bold tracking-wide uppercase mb-3 flex items-center gap-2">
                <span className="w-6 sm:w-8 h-[2px] bg-blue-600 rounded-full"></span>
                Benefits
              </h2>
              <h3 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 sm:mb-6 leading-tight">
                Why Candidates <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Love Us</span>
              </h3>
              <p className="text-gray-600 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed">
                Stop guessing what you'll be asked. Prepare with precision using tools designed to highlight your strengths and improve your weaknesses.
              </p>

              <div className="space-y-4 sm:space-y-5">
                {[
                  "Personalized question banks for any role",
                  "Deep-dive AI explanations for complex concepts",
                  "Organized dashboard to track multiple applications",
                  "Mobile-friendly for on-the-go revision"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3 group">
                    <div className="mt-0.5 sm:mt-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      <CheckCircle size={12} strokeWidth={3} className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-sm sm:text-base text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Grid */}
            <div className="order-1 md:order-2 grid grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-4 sm:space-y-6 mt-8 sm:mt-12">
                <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-yellow-500">
                    <Star className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Confidence</h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Walk into interviews knowing you're prepared for anything.</p>
                </div>
                <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-blue-500">
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Growth</h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Identify knowledge gaps and fill them fast.</p>
                </div>
              </div>
              <div className="space-y-4 sm:space-y-6">
                <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-purple-500">
                    <Zap className="w-5 h-5 sm:w-6 sm:h-6 fill-current" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Speed</h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Get answers instantly. Don't waste time searching.</p>
                </div>
                <div className="p-4 sm:p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-green-500">
                    <UserCheck className="w-5 h-5 sm:w-6 sm:h-6" />
                  </div>
                  <h4 className="text-base sm:text-lg font-bold text-gray-900 mb-1.5 sm:mb-2">Hired</h4>
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">Maximize your chances of getting the offer.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24 bg-white text-center">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Ready to Ace Your Interview?</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10">Join thousands of job seekers who are using AI to land their dream roles.</p>
          <button
            className="bg-blue-600 text-white text-base sm:text-lg font-bold px-8 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={handleCTA}
          >
            Get Started Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white pt-12 sm:pt-20 pb-8 sm:pb-10 border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-12 gap-8 sm:gap-12 mb-12 sm:mb-16">

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-4 sm:space-y-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg sm:text-xl shadow-lg shadow-blue-500/20">
                  I
                </div>
                <span className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  InterviewHelper.ai
                </span>
              </Link>
              <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-sm">
                Empowering your career journey with AI-driven interview preparation. Master every question, land every role.
              </p>
              <div className="flex gap-3 sm:gap-4 pt-2">
                {[
                  { icon: <Twitter size={18} className="sm:w-5 sm:h-5" />, href: "#" },
                  { icon: <Linkedin size={18} className="sm:w-5 sm:h-5" />, href: "#" },
                  { icon: <Facebook size={18} className="sm:w-5 sm:h-5" />, href: "#" },
                  { icon: <Instagram size={18} className="sm:w-5 sm:h-5" />, href: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 col-span-1">
              <h5 className="font-bold text-white mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">Product</h5>
              <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm sm:text-base">
                {['Features', 'Pricing', 'Success Stories', 'Enterprises'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 hover:pl-1 transition-all duration-200 block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 col-span-1">
              <h5 className="font-bold text-white mb-4 sm:mb-6 tracking-wide text-sm sm:text-base">Resources</h5>
              <ul className="space-y-3 sm:space-y-4 text-slate-400 text-sm sm:text-base">
                {['Blog', 'Interview Tips', 'Community', 'Help Center'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 hover:pl-1 transition-all duration-200 block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 sm:col-span-2 space-y-3 sm:space-y-4">
              <h5 className="font-bold text-white mb-2 tracking-wide text-sm sm:text-base">Stay Updated</h5>
              <p className="text-slate-400 text-xs sm:text-sm mb-3 sm:mb-4">Get the latest interview trends and tips delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 text-white px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 flex-grow transition-colors text-sm"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-sm">
                  Subscribe <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs sm:text-sm text-slate-500 text-center md:text-left">© {new Date().getFullYear()} InterviewHelper.ai. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-4 sm:gap-8 text-xs sm:text-sm text-slate-500">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <Modal isOpen={openAuthModal} onClose={() => setOpenAuthModal(false)} hideHider>
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={setCurrentPage} />}
        </div>
      </Modal>
    </div>
  );
};

export default LandingPage;