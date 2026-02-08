'use client'

import {
  ArrowRight,
  Brain,
  Calendar,
  CheckCircle2,
  Menu,
  Users,
  X,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white pb-0 mb-0">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
          scrolled
            ? 'bg-white/80 backdrop-blur-md border-gray-200 py-2'
            : 'bg-white border-transparent py-3'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div
              className="flex items-center space-x-3 cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              <div className="relative h-14 w-56">
                <Image
                  src="/EDU_WM2.png"
                  alt="EduServe AI"
                  fill
                  className="object-contain object-left"
                  priority
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => scrollToSection('students')}
                className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer text-sm tracking-wide uppercase"
              >
                For Students
              </button>
              <button
                onClick={() => scrollToSection('instructors')}
                className="text-gray-600 hover:text-black font-medium transition-colors cursor-pointer text-sm tracking-wide uppercase"
              >
                For Instructors
              </button>
              <Link
                href="/login"
                className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-all cursor-pointer text-sm"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-gray-100 ${
            mobileMenuOpen ? 'max-h-60' : 'max-h-0'
          }`}
        >
          <div className="px-4 py-4 space-y-3">
            <button
              onClick={() => scrollToSection('students')}
              className="block w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black font-medium transition-colors cursor-pointer"
            >
              For Students
            </button>
            <button
              onClick={() => scrollToSection('instructors')}
              className="block w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-black font-medium transition-colors cursor-pointer"
            >
              For Instructors
            </button>
            <Link
              href="/login"
              className="block w-full text-center px-4 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors cursor-pointer mt-4"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-24">
        {/* Main Hero */}
        <section className="relative py-16 sm:py-24 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-4xl mx-auto">
              <span className="inline-block py-1.5 px-4 rounded-full bg-blue-50 text-sm font-bold tracking-wide uppercase mb-6 text-blue-600 border border-blue-100 shadow-sm">
                IITM BS Data Science Platform
              </span>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                Master Your Degree with <br className="hidden sm:block" />
                <span className="block mt-2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent pb-3">
                  Human & AI Intelligence
                </span>
              </h1>
              <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto leading-relaxed font-light">
                The ultimate learning companion combining personalized
                mentorship and 24/7 AI assistance tailored for the modern data
                science curriculum.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link
                  href="/student"
                  className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2 group shadow-lg hover:shadow-xl"
                >
                  I&apos;m a Student
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/instructor"
                  className="px-8 py-4 bg-white text-black border-2 border-gray-200 rounded-full font-medium hover:border-black transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
                >
                  I&apos;m an Instructor
                </Link>
              </div>
            </div>
          </div>

          {/* subtle background pattern */}
          <div className="absolute inset-0 -z-10 opacity-30 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full blur-3xl transform -translate-y-1/2"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full blur-3xl transform translate-y-1/2"></div>
          </div>
        </section>

        {/* Students Section */}
        <section id="students" className="py-20 bg-gray-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-2 md:order-1 relative">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl group">
                  <Image
                    src="/Human_Assistance.jpg"
                    alt="Student Learning"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500"></div>
                </div>
                {/* Floating Card */}
                <div className="absolute -bottom-6 -right-6 md:right-[-20px] bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs z-20">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">Top Mentors</p>
                      <p className="text-xs text-gray-500">
                        From IITM Alumni Network
                      </p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-4/5 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="order-1 md:order-2">
                <span className="text-sm font-semibold tracking-widest text-blue-600 uppercase mb-2 block">
                  For Students
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Learn Better, Faster.
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Struggling with Statistics or Programming? EduServe connects
                  you instantly with experts and AI tools designed specifically
                  for your curriculum.
                </p>

                <div className="space-y-8">
                  <div className="flex gap-4 group cursor-default">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">
                        Human Mentorship
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Book 1-on-1 sessions with alumni who&apos;ve aced the
                        exact courses you&apos;re taking. Get strategic advice,
                        exam tips, and deep concept clarification.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 group cursor-default">
                    <div className="w-12 h-12 flex-shrink-0 rounded-full border border-gray-200 flex items-center justify-center group-hover:border-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300">
                      <Brain className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl mb-2">AI Tutoring</h3>
                      <p className="text-gray-500 text-sm leading-relaxed">
                        Stuck on a problem at 2 AM? Our AI tutor provides
                        instant, step-by-step explanations for Python code
                        errors, math proofs, and more.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10">
                  <Link
                    href="/student"
                    className="text-blue-600 font-semibold border-b border-blue-600 pb-1 hover:text-blue-800 hover:border-blue-800 transition-all cursor-pointer flex items-center gap-2 group w-fit"
                  >
                    Explore Student Features
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects Grid */}
        <section className="py-20 bg-white border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold mb-12">
              Covering Your Core Curriculum
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                'Statistics I & II',
                'Python Programming',
                'Machine Learning',
                'Deep Learning',
                'DBMS & SQL',
                'Mathematics',
                'Business Analytics',
                'System Commands',
              ].map((subject, idx) => (
                <div
                  key={idx}
                  className="p-6 border border-gray-100 rounded-xl hover:border-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:-translate-y-1"
                >
                  <p className="text-gray-800 group-hover:text-blue-600 font-bold">
                    {subject}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Instructors Section */}
        <section id="instructors" className="py-20 bg-gray-50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
              <div className="order-1">
                <span className="text-sm font-semibold tracking-widest text-purple-600 uppercase mb-2 block">
                  For Instructors
                </span>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                  Share Knowledge, <br />
                  Earn & Impact.
                </h2>
                <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                  Join a community of educators. Whether you&apos;re an industry
                  expert or a high-performing peer, your knowledge is valuable.
                </p>

                <div className="space-y-6">
                  <BenefitItem
                    icon={<Calendar className="w-5 h-5" />}
                    title="Flexible Schedule"
                    desc="Set your availability. Teach when you want, where you want."
                  />
                  <BenefitItem
                    icon={<CheckCircle2 className="w-5 h-5" />}
                    title="Smart Tools"
                    desc="AI-assisted lesson planning and student progress tracking."
                  />
                  <BenefitItem
                    icon={<Users className="w-5 h-5" />}
                    title="Community"
                    desc="Connect with motivated students and build your professional network."
                  />
                </div>

                <div className="mt-10">
                  <Link
                    href="/instructor"
                    className="bg-black text-white px-8 py-3 rounded-full font-medium hover:bg-gray-800 transition-all cursor-pointer shadow-lg hover:shadow-xl hover:-translate-y-1 inline-block"
                  >
                    Apply as Instructor
                  </Link>
                </div>
              </div>

              <div className="order-2 relative">
                <div className="relative overflow-hidden rounded-2xl aspect-[4/3] shadow-2xl group">
                  <Image
                    src="/Instructor.jpeg"
                    alt="Instructor Teaching"
                    fill
                    className="object-cover transition-transform duration-700 ease-in-out scale-105 group-hover:scale-100"
                  />
                  <div className="absolute inset-0 bg-transparent transition-colors duration-500"></div>
                </div>
                {/* Floating Stat */}
                <div className="absolute -top-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-gray-100 max-w-xs z-20 hidden md:block">
                  <p className="text-3xl font-bold mb-1 text-purple-600">
                    500+
                  </p>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">
                    Active Sessions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-white">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold mb-8">
              Ready to transform your learning?
            </h2>
            <p className="text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
              Join thousands of IITM BS students mastering data science with
              EduServe AI today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/login"
                className="px-10 py-4 bg-black text-white rounded-full font-bold text-lg hover:bg-gray-900 transition-all cursor-pointer shadow-2xl hover:shadow-black/20"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="relative h-10 w-48 mb-6">
                {/* Footer logo size increased also */}
                <Image
                  src="/EDU_WM2.png"
                  alt="Logo"
                  fill
                  className="object-contain object-left opacity-80"
                />
              </div>
              <p className="text-gray-500 max-w-sm mb-6">
                Bridging the gap between students and success through human
                connection and artificial intelligence.
              </p>
              <div className="flex gap-4">
                {/* Social placeholders */}
                <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 hover:bg-black hover:text-white transition-colors cursor-pointer flex items-center justify-center">
                  <span className="sr-only">LinkedIn</span>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold mb-6">Platform</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">
                  For Students
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  For Instructors
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Pricing
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Features
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-6">Support</h4>
              <ul className="space-y-4 text-sm text-gray-500">
                <li className="hover:text-black cursor-pointer transition-colors">
                  Contact Us
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  FAQ
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Privacy Policy
                </li>
                <li className="hover:text-black cursor-pointer transition-colors">
                  Terms of Service
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>© 2026 EduServe AI. All rights reserved.</p>
            <p className="mt-2 md:mt-0">
              Designed for IITM BS Data Science Community
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function BenefitItem({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex gap-4 group cursor-default">
      <div className="w-10 h-10 flex-shrink-0 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 group-hover:border-black group-hover:bg-black group-hover:text-white transition-all duration-300">
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">{desc}</p>
      </div>
    </div>
  )
}
