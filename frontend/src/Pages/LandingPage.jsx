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
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-blue-500/30 shadow-lg">
              I
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              InterviewHelper.ai
            </span>
          </Link>

          {user ? (
            <ProfileInfoCard />
          ) : (
            <div className="flex items-center gap-4">
              <button
                className="hidden md:block text-gray-600 hover:text-blue-600 font-medium transition-colors cursor-pointer"
                onClick={() => {
                  setCurrentPage("login");
                  setOpenAuthModal(true);
                }}
              >
                Log In
              </button>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
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
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute top-20 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl opacity-50 animate-blob1"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl opacity-50 animate-blob2"></div>

        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="text-left space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">
              <Sparkles size={14} />
              <span>AI-Powered Interview Prep</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
              Master Your Next <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Interview
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Generate role-specific questions, get instant AI explanations, and organize your prep like a pro.
              The ultimate toolkit to boost your confidence and land your dream job.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                className="group flex items-center justify-center gap-2 bg-blue-600 text-white text-lg font-semibold px-8 py-4 rounded-xl shadow-xl shadow-blue-500/30 hover:bg-blue-700 transition-all hover:-translate-y-1 cursor-pointer"
                onClick={handleCTA}
              >
                Start Preparing Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

          </div>

          <div className="relative lg:h-[600px] flex items-center justify-center">
            <InterviewAnimation />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase mb-2">Process</h2>
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h3>
            <p className="text-gray-600 text-lg">Three simple steps to interview mastery.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Smartphone className="w-8 h-8 text-white" />,
                to: "from-blue-400 to-blue-600",
                title: "1. Create Session",
                desc: "Tell us about the job role, experience level, and specific topics you want to target."
              },
              {
                icon: <Zap className="w-8 h-8 text-white" />,
                to: "from-indigo-400 to-indigo-600",
                title: "2. Get Questions",
                desc: "Our AI generates a curated list of potential interview questions tailored to your profile."
              },
              {
                icon: <TrendingUp className="w-8 h-8 text-white" />,
                to: "from-purple-400 to-purple-600",
                title: "3. Practice & Learn",
                desc: "Review answers, request detailed explanations, and track your readiness progress."
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-8 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.to} flex items-center justify-center mb-6 shadow-lg transform group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h4>
                <p className="text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Benefits Section */}
      {/* Benefits Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Background Bubbles */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-blue-50 blur-3xl opacity-60"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-indigo-50 blur-3xl opacity-60"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">

            {/* Text Content */}
            <div className="order-2 md:order-1">
              <h2 className="text-base text-blue-600 font-bold tracking-wide uppercase mb-3 flex items-center gap-2">
                <span className="w-8 h-[2px] bg-blue-600 rounded-full"></span>
                Benefits
              </h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
                Why Candidates <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Love Us</span>
              </h3>
              <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                Stop guessing what you'll be asked. Prepare with precision using tools designed to highlight your strengths and improve your weaknesses.
              </p>

              <div className="space-y-5">
                {[
                  "Personalized question banks for any role",
                  "Deep-dive AI explanations for complex concepts",
                  "Organized dashboard to track multiple applications",
                  "Mobile-friendly for on-the-go revision"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 group">
                    <div className="mt-1 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all duration-300">
                      <CheckCircle size={12} strokeWidth={3} />
                    </div>
                    <span className="text-gray-700 font-medium group-hover:text-gray-900 transition-colors">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Grid */}
            <div className="order-1 md:order-2 grid grid-cols-2 gap-6">
              <div className="space-y-6 mt-12">
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-yellow-50 rounded-xl flex items-center justify-center mb-4 text-yellow-500">
                    <Star className="w-6 h-6 fill-current" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Confidence</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Walk into interviews knowing you're prepared for anything.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 text-blue-500">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Growth</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Identify knowledge gaps and fill them fast.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4 text-purple-500">
                    <Zap className="w-6 h-6 fill-current" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Speed</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Get answers instantly. Don't waste time searching.</p>
                </div>
                <div className="p-6 bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 hover:shadow-2xl hover:border-blue-100 hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4 text-green-500">
                    <UserCheck className="w-6 h-6" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Hired</h4>
                  <p className="text-gray-500 text-sm leading-relaxed">Maximize your chances of getting the offer.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">Ready to Ace Your Interview?</h2>
          <p className="text-xl text-gray-600 mb-10">Join thousands of job seekers who are using AI to land their dream roles.</p>
          <button
            className="bg-blue-600 text-white text-lg font-bold px-10 py-4 rounded-full shadow-xl shadow-blue-500/30 hover:bg-blue-700 hover:scale-105 transition-all duration-300"
            onClick={handleCTA}
          >
            Get Started Now - It's Free
          </button>
        </div>
      </section>

      {/* Footer */}
      {/* Premium Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10 border-t border-slate-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-12 gap-12 mb-16">

            {/* Brand Column */}
            <div className="md:col-span-4 space-y-6">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/20">
                  I
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">
                  InterviewHelper.ai
                </span>
              </Link>
              <p className="text-slate-400 leading-relaxed max-w-sm">
                Empowering your career journey with AI-driven interview preparation. Master every question, land every role.
              </p>
              <div className="flex gap-4 pt-2">
                {[
                  { icon: <Twitter size={20} />, href: "#" },
                  { icon: <Linkedin size={20} />, href: "#" },
                  { icon: <Facebook size={20} />, href: "#" },
                  { icon: <Instagram size={20} />, href: "#" }
                ].map((social, idx) => (
                  <a
                    key={idx}
                    href={social.href}
                    className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white hover:-translate-y-1 transition-all duration-300"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="md:col-span-2 col-span-6">
              <h5 className="font-bold text-white mb-6 tracking-wide">Product</h5>
              <ul className="space-y-4 text-slate-400">
                {['Features', 'Pricing', 'Success Stories', 'Enterprises'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 hover:pl-1 transition-all duration-200 block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2 col-span-6">
              <h5 className="font-bold text-white mb-6 tracking-wide">Resources</h5>
              <ul className="space-y-4 text-slate-400">
                {['Blog', 'Interview Tips', 'Community', 'Help Center'].map((item) => (
                  <li key={item}>
                    <a href="#" className="hover:text-blue-400 hover:pl-1 transition-all duration-200 block">{item}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="md:col-span-4 space-y-4">
              <h5 className="font-bold text-white mb-2 tracking-wide">Stay Updated</h5>
              <p className="text-slate-400 text-sm mb-4">Get the latest interview trends and tips delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-slate-800 text-white px-4 py-3 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500 flex-grow transition-colors"
                />
                <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2">
                  Subscribe <ArrowRight size={16} />
                </button>
              </div>
            </div>

          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} InterviewHelper.ai. All rights reserved.</p>
            <div className="flex gap-8 text-sm text-slate-500">
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