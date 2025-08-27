import { useNavigate } from "react-router-dom";
import { Cover } from "../components/ui/cover";
import {
  Brain,
  BookOpen,
  Users,
  Rocket,
  Clock,
  BarChart3,
  Mic,
  Smartphone,
  Award,
  UserCheck,
  Bookmark,
  Zap,
} from "lucide-react";
import { AnimatedTestimonials } from "../components/ui/animated-testimonials";
import { LampDemo } from "../components/Lamp";
import GifSection from "../components/GifSection";
import { Feature } from "../components/Feature";
const testimonials = [
  {
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    name: "Shubhendu Halder",
    designation: "Leader",
    src: "https://avatars.githubusercontent.com/u/141364632?v=4",
  },
  {
    quote:
      "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
    name: "Akash Das",
    designation: "Member",
    src: "https://avatars.githubusercontent.com/u/228867924?v=4",
  },
  {
    quote:
      "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
    name: "Asfak Ulla Molla",
    designation: "Member",
    src: "https://avatars.githubusercontent.com/u/193912692?v=4",
  },
];
export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-100 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/4 w-60 h-60 bg-indigo-600 rounded-full filter blur-3xl opacity-20 animate-pulse-slow"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden z-10">
        <div className="max-w-7xl mx-auto px-6 py-24 grid md:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className="">
            <h1 className="text-4xl md:text-4xl lg:text-6xl font-semibold max-w-7xl mx-auto mt-6 relative z-20 py-6 bg-clip-text text-transparent bg-gradient-to-b from-neutral-800 via-neutral-700 to-neutral-700 dark:from-neutral-800 dark:via-white dark:to-white leading-tight">
              Master Any Topic
              <br /> With{" "}
              <Cover>
                {" "}
                <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                  {" "}
                  AI Exams
                </span>
              </Cover>
            </h1>
            <p className="mt-6 text-lg text-gray-300">
              Generate quizzes in seconds. Learn smarter, prepare faster, and
              stay ahead with AI-powered assessments.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <button
                onClick={() => navigate("/exam")}
                className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
              >
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl tracking-wide">
                  Try Exam Now 👉
                </span>
              </button>
            </div>
          </div>

          {/* Right */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <img
                src="https://i.pinimg.com/originals/b2/20/2b/b2202b869db4830a108266ba060c49c4.gif"
                alt="AI Exam"
                className="w-80 md:w-96 rounded-2xl relative z-10 border border-white/20 shadow-2xl shadow-blue-500/30"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 relative z-10">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          🧠 How It Works
        </h2>
        <div className="flex justify-center gap-8 relative flex-wrap px-6">
          {[
            {
              icon: BookOpen,
              title: "Choose Topic",
              desc: "Select any subject you want to test yourself on",
            },
            {
              icon: Rocket,
              title: "Set Difficulty",
              desc: "Pick from Easy, Medium, or Hard levels",
            },
            {
              icon: Brain,
              title: "Get Instant Quiz",
              desc: "AI generates personalized questions in seconds",
            },
          ].map((step, i) => (
            <div
              key={i}
              className="flex flex-col items-center max-w-[280px] text-center bg-white/5 backdrop-blur-lg p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition transform hover:-translate-y-2 shadow-lg"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-5 rounded-full mb-4 shadow-lg">
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h4 className="font-semibold text-lg text-gray-200 mb-2">
                {step.title}
              </h4>
              <p className="text-gray-400 text-sm">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <Feature/>

      {/* Who It's For */}
      <section className="py-20 relative z-10">
        <div className="absolute inset-0 "></div>
        <h2 className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-purple-400">
          🎯 Who Is This For?
        </h2>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-6 px-6">
          {[
            {
              icon: BookOpen,
              title: "📚 Students",
              desc: "Prepare exams faster & smarter.",
            },
            {
              icon: UserCheck,
              title: "👨‍🏫 Teachers",
              desc: "Create instant assessments.",
            },
            {
              icon: Award,
              title: "🧑‍💼 Professionals",
              desc: "Refresh skills for interviews.",
            },
            {
              icon: Brain,
              title: "🌍 Learners",
              desc: "Explore knowledge on any topic.",
            },
          ].map((a, i) => (
            <div
              key={i}
              className="bg-white/10 backdrop-blur-lg p-6 rounded-xl border border-white/10 hover:bg-white/20 transition transform hover:-translate-y-1 flex items-start"
            >
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-lg mr-4">
                <a.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-xl font-semibold mb-2 text-gray-100">
                  {a.title}
                </h4>
                <p className="text-gray-300">{a.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="text-center py-24 relative z-10">
        {/* <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/20 -z-10"></div>
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Start Your First AI Exam Today 🚀
          </h2>
          <p className="mb-8 text-lg text-gray-300">
            It's free, instant, and smarter than any study tool you've tried.
          </p>
          <button
            onClick={() => navigate("/exam")}
            className="px-10 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold rounded-xl shadow-lg hover:opacity-90 transition transform hover:scale-105"
          >
            Launch Exam Generator
          </button>
        </div> */}
        <LampDemo />
      </section>
      <AnimatedTestimonials testimonials={testimonials} />
      <GifSection />

      <style jsx>{`
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </div>
  );
}
