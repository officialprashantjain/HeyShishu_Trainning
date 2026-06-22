'use client'

import Link from 'next/link'
import { FaGraduationCap, FaCheckCircle, FaStar } from 'react-icons/fa'
import {
  MdPlayCircle,
  MdAssignment,
  MdVerified,
  MdWork,
  MdArrowForward,
  MdLock,
  MdSupportAgent,
  MdMenuBook,
} from 'react-icons/md'
import { HiSparkles } from 'react-icons/hi'

// ── Feature cards data ──────────────────────────────────────
const features = [
  {
    icon:  <MdMenuBook size={24} />,
    title: 'Structured Courses',
    desc:  'Role-specific training modules designed by childcare experts — go at your own pace.',
    color: 'bg-primary-500/10 text-primary-600',
  },
  {
    icon:  <MdAssignment size={24} />,
    title: 'Module Tests',
    desc:  "MCQ-based tests after every module ensure you've truly mastered the content.",
    color: 'bg-info-50 text-info-600',
  },
  {
    icon:  <MdSupportAgent size={24} />,
    title: 'Counselor Review',
    desc:  'A certified counselor personally reviews your progress and conducts a Zoom session.',
    color: 'bg-warning-50 text-warning-600',
  },
  {
    icon:  <MdVerified size={24} />,
    title: 'Admin Approval',
    desc:  'Once approved, you receive official HeyShishu credentials and can start working.',
    color: 'bg-success-50 text-success-600',
  },
]

// ── How it works steps ──────────────────────────────────────
const steps = [
  {
    step:  '01',
    title: 'Register & Select Role',
    desc:  'Create your account, choose your role (Nanny, Counselor, etc.) and fill in your details.',
    icon:  <FaGraduationCap size={22} />,
  },
  {
    step:  '02',
    title: 'Make Payment',
    desc:  'Complete a one-time secure payment via Razorpay to unlock your training courses.',
    icon:  <MdLock size={22} />,
  },
  {
    step:  '03',
    title: 'Complete Training',
    desc:  'Study all assigned modules, watch videos, and pass the MCQ test for each chapter.',
    icon:  <MdPlayCircle size={22} />,
  },
  {
    step:  '04',
    title: 'Get Certified & Hired',
    desc:  'Counselor review → Admin approval → Receive your HeyShishu app credentials.',
    icon:  <MdWork size={22} />,
  },
]

const stats = [
  { value: '500+', label: 'Trained Nannies' },
  { value: '4.9★', label: 'Average Rating' },
  { value: '12',   label: 'Expert Courses' },
  { value: '100%', label: 'Job Placement' },
]

const roles = ['Nanny', 'Senior Nanny', 'Infant Specialist', 'Child Counselor']

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans">

      {/* ═══════════════════════════════════════════════════════
          NAV BAR
      ═══════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow">
                <FaGraduationCap size={18} className="text-white" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-neutral-900">HeyShishu</p>
                <p className="text-xs text-neutral-400 -mt-0.5">Training Portal</p>
              </div>
            </div>

            {/* Nav links — hidden on mobile */}
            <div className="hidden md:flex items-center gap-6 text-sm text-neutral-500 font-medium">
              <a href="#features"  className="hover:text-primary-600 transition-colors">Features</a>
              <a href="#how"       className="hover:text-primary-600 transition-colors">How It Works</a>
              <a href="#roles"     className="hover:text-primary-600 transition-colors">Roles</a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-semibold
                           text-neutral-700 hover:text-primary-600 transition-colors"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500
                           hover:bg-primary-600 text-white text-sm font-semibold rounded-xl
                           transition-colors shadow-sm"
              >
                Get Started
                <MdArrowForward size={16} />
              </Link>
            </div>

          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-neutral-50 to-white pt-16 pb-20 lg:pt-24 lg:pb-28">

        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/8 rounded-full blur-3xl" />
          <div className="absolute top-20 -left-20 w-72 h-72 bg-accent-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* Left — Text */}
            <div>
              {/* Pill badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50
                              border border-primary-200 rounded-full text-xs font-semibold
                              text-primary-700 mb-5">
                <HiSparkles size={13} className="text-primary-500" />
                Official HeyShishu Nanny Certification Program
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.25rem] font-extrabold
                             text-neutral-900 leading-tight tracking-tight mb-5">
                Become a{' '}
                <span className="text-primary-500">Certified</span>{' '}
                Professional Nanny
              </h1>

              <p className="text-lg text-neutral-500 leading-relaxed mb-8 max-w-lg">
                Complete our structured training program, pass expert-designed module tests,
                and get personally reviewed by a certified counselor — all online.
              </p>

              {/* Feature checks */}
              <ul className="space-y-2 mb-9">
                {[
                  'Expert-designed childcare courses',
                  'MCQ tests after every module',
                  'Counselor video review via Zoom',
                  'HeyShishu App credentials on approval',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5 text-sm text-neutral-600">
                    <FaCheckCircle className="text-primary-500 flex-shrink-0" size={15} />
                    {item}
                  </li>
                ))}
              </ul>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500
                             hover:bg-primary-600 active:bg-primary-700 text-white
                             font-bold rounded-xl transition-colors shadow-md
                             text-sm sm:text-base"
                >
                  Start Your Training
                  <MdArrowForward size={18} />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2
                             border-neutral-200 hover:border-primary-300
                             hover:bg-primary-50 text-neutral-700 hover:text-primary-600
                             font-bold rounded-xl transition-colors text-sm sm:text-base"
                >
                  Already registered? Login
                </Link>
              </div>
            </div>

            {/* Right — Visual card */}
            <div className="hidden lg:flex flex-col gap-4">

              {/* Main card */}
              <div className="bg-dark-900 rounded-3xl p-6 shadow-2xl text-white">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center
                                  justify-center flex-shrink-0">
                    <FaGraduationCap size={20} />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Training Dashboard</p>
                    <p className="text-neutral-400 text-xs">In Progress</p>
                  </div>
                  <span className="ml-auto text-xs bg-primary-500/20 text-primary-400
                                   px-2.5 py-1 rounded-full font-semibold">
                    In Training
                  </span>
                </div>

                {/* Progress bar */}
                <p className="text-xs text-neutral-400 mb-1">Overall Progress</p>
                <div className="bg-white/10 rounded-full h-2.5 mb-1">
                  <div className="bg-primary-500 h-2.5 rounded-full w-[60%]" />
                </div>
                <p className="text-xs text-neutral-400 text-right">60% complete</p>

                {/* Mini course list */}
                <div className="mt-5 space-y-3">
                  {[
                    { name: 'Child Development Basics',     done: true  },
                    { name: 'Nutrition & Feeding',          done: true  },
                    { name: 'Safety & First Aid',           done: false },
                    { name: 'Communication with Parents',   done: false },
                  ].map((c) => (
                    <div key={c.name} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center
                                       flex-shrink-0 text-xs
                                       ${c.done
                                         ? 'bg-primary-500 text-white'
                                         : 'bg-white/10 text-neutral-500'}`}>
                        {c.done ? '✓' : ''}
                      </div>
                      <span className={`text-sm ${c.done ? 'text-white' : 'text-neutral-400'}`}>
                        {c.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="grid grid-cols-2 gap-3">
                {stats.map((s) => (
                  <div key={s.label}
                       className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-card text-center">
                    <p className="text-xl font-extrabold text-primary-600">{s.value}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          SOCIAL PROOF STRIP
      ═══════════════════════════════════════════════════════ */}
      <section className="bg-primary-500 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-3xl font-extrabold text-white">{s.value}</p>
                <p className="text-primary-100 text-sm mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FEATURES SECTION
      ═══════════════════════════════════════════════════════ */}
      <section id="features" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section header */}
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
              Why HeyShishu Training?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
              Everything you need to become a certified professional
            </h2>
            <p className="text-neutral-500 mt-4 leading-relaxed">
              Our end-to-end training program takes you from registration to
              certification with expert guidance at every step.
            </p>
          </div>

          {/* Feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title}
                   className="bg-neutral-50 border border-neutral-100 rounded-2xl p-6
                              hover:border-primary-200 hover:shadow-card-md
                              transition-all duration-200 group">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center
                                 mb-4 ${f.color}`}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-neutral-800 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════ */}
      <section id="how" className="py-20 lg:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
              The Process
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2">
              How it works
            </h2>
            <p className="text-neutral-500 mt-4">
              Four simple steps from registration to getting your HeyShishu credentials.
            </p>
          </div>

          {/* Steps grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            {/* Connector line — desktop only */}
            <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%]
                            h-0.5 bg-neutral-200 z-0" />

            {steps.map((s, i) => (
              <div key={s.step} className="relative z-10 flex flex-col items-center text-center">

                {/* Circle */}
                <div className="w-16 h-16 rounded-2xl bg-dark-900 text-white flex flex-col
                                items-center justify-center mb-4 shadow-lg flex-shrink-0">
                  <span className="text-xs text-neutral-400 font-bold leading-tight">{s.step}</span>
                  <span className="text-primary-400">{s.icon}</span>
                </div>

                <h3 className="font-bold text-neutral-800 mb-2">{s.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          ROLES SECTION
      ═══════════════════════════════════════════════════════ */}
      <section id="roles" className="py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            {/* Left */}
            <div>
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                Who Can Apply
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-neutral-900 mt-2 mb-5">
                Training is open for all childcare roles
              </h2>
              <p className="text-neutral-500 leading-relaxed mb-8">
                Whether you&apos;re a first-time nanny or an experienced child counselor,
                our role-specific course tracks are designed for your career path.
              </p>

              <div className="grid grid-cols-2 gap-3">
                {roles.map((role) => (
                  <div key={role}
                       className="flex items-center gap-2.5 bg-neutral-50 border
                                  border-neutral-100 rounded-xl px-4 py-3">
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0" />
                    <span className="text-sm font-semibold text-neutral-700">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — testimonial card */}
            <div className="bg-gradient-to-br from-primary-500 to-primary-700
                            rounded-3xl p-8 text-white shadow-xl">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <FaStar key={i} size={16} className="text-yellow-300" />
                ))}
              </div>
              <blockquote className="text-lg font-medium leading-relaxed mb-6">
                &ldquo;HeyShishu&apos;s training program gave me the structure and credibility
                I needed. The counselor session was incredibly helpful and I landed
                my first childcare job within a week of certification.&rdquo;
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center
                                justify-center text-white font-bold">
                  P
                </div>
                <div>
                  <p className="font-semibold">Priya Sharma</p>
                  <p className="text-primary-200 text-sm">Certified HeyShishu Nanny, Delhi</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════ */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-500/20
                          border border-primary-500/30 rounded-full text-xs font-semibold
                          text-primary-400 mb-5">
            <HiSparkles size={12} />
            Limited Seats Available
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to start your childcare career?
          </h2>
          <p className="text-neutral-400 text-lg mb-9 leading-relaxed">
            Join hundreds of certified nannies who built their careers through the
            HeyShishu Training Portal.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4
                         bg-primary-500 hover:bg-primary-600 active:bg-primary-700
                         text-white font-bold rounded-2xl transition-colors
                         shadow-lg shadow-primary-500/25 text-base"
            >
              Register Now — It&apos;s Free to Apply
              <MdArrowForward size={20} />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4
                         border-2 border-neutral-700 hover:border-neutral-500
                         text-neutral-300 hover:text-white font-bold rounded-2xl
                         transition-colors text-base"
            >
              Already have an account? Login
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════ */}
      <footer className="bg-dark-950 border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center
                              justify-center">
                <FaGraduationCap size={15} className="text-white" />
              </div>
              <span className="text-white font-bold text-sm">HeyShishu Training</span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="#features" className="hover:text-neutral-300 transition-colors">Features</a>
              <a href="#how"      className="hover:text-neutral-300 transition-colors">How It Works</a>
              <Link href="/login"    className="hover:text-neutral-300 transition-colors text-neutral-500">Login</Link>
              <Link href="/register" className="hover:text-primary-400 transition-colors text-primary-500 font-semibold">
                Register
              </Link>
            </div>

            {/* Copyright */}
            <p className="text-xs text-neutral-600">
              © {new Date().getFullYear()} HeyShishu. All rights reserved.
            </p>

          </div>
        </div>
      </footer>

    </div>
  )
}
