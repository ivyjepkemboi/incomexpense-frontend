import React, { useState } from "react";
import { useNavigate } from "react-router"; // Import useNavigate

const Landing = () => {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate(); // React Router navigation function

  return (
    <div className="w-full min-h-screen overflow-x-hidden ml-0">
      <div className="antialiased bg-body text-body font-body">
        {/* Hero Section with Background Image */}
        <section className="relative bg-blue-400 h-screen flex flex-col overflow-hidden w-full">
          <img
            className="absolute top-0 left-0 w-full h-full object-cover"
            src="/images/bg-waves.png"
            alt="Background"
          />

          {/* Navigation */}
          <nav className="relative py-6 z-10 w-full">
            <div className="container mx-auto px-4 flex justify-between items-center">
              <a href="#">
                <img className="h-8" src="/images/logo.png" alt="Logo" />
              </a>
              <ul className="hidden md:flex space-x-8 text-white">
                <li><a className="hover:text-lime-500" href="about.html">About us</a></li>
                <li><a className="hover:text-lime-500" href="pricing.html">Pricing</a></li>
                <li><a className="hover:text-lime-500" href="contact.html">Contact us</a></li>
                <li><a className="hover:text-lime-500" href="blog.html">Blog</a></li>
              </ul>
              <div className="hidden md:block">
                <a
                  href="contact.html"
                  className="py-2.5 px-4 border border-white text-white hover:bg-white hover:text-teal-900 rounded-full transition"
                >
                  Get in touch
                </a>
              </div>
              {/* Mobile Menu Button */}
              <button
                className="md:hidden text-white hover:text-lime-500"
                onClick={() => setMobileNavOpen(!mobileNavOpen)}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M5.2 23.2H26.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.2 16H26.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5.2 8.8H26.8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </nav>

          {/* Hero Text */}
          <div className="relative pt-20 pb-24 sm:pb-32 lg:pt-36 lg:pb-48 text-center text-white z-10">
            <h1 className="text-5xl sm:text-7xl xl:text-8xl tracking-tight mb-8">
              Track your finances
            </h1>
            <p className="max-w-md mx-auto text-lg opacity-80 mb-10">
              Our commitment to help you keep track of your finances keeps us going
            </p>

            {/* Sign Up & Sign In Buttons */}
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate("/signup")}
                className="py-2 px-4 bg-lime-500 border border-lime-500 hover:bg-white hover:border-white text-teal-900 rounded-full transition"
              >
                Sign Up
              </button>
                or
              <button
                onClick={() => navigate("/signin")}
                className="py-2 px-6 bg-lime-500 border border-lime-500 hover:bg-white hover:border-white text-teal-900 rounded-full transition"
              >
                Sign In
              </button>
            </div>

            <div className="p-4">
              <p>to get started</p>
            </div>
          </div>
        </section>

        {/* Mobile Navigation Menu */}
        {mobileNavOpen && (
          <div className="fixed top-0 left-0 bottom-0 w-4/6 max-w-sm bg-white z-50 p-7 shadow-lg">
            <button
              className="text-gray-700 text-2xl absolute top-5 right-5"
              onClick={() => setMobileNavOpen(false)}
            >
              &times;
            </button>
            <ul className="mt-10 space-y-6">
              <li><a className="text-teal-900 hover:text-teal-700" href="about.html">About us</a></li>
              <li><a className="text-teal-900 hover:text-teal-700" href="pricing.html">Pricing</a></li>
              <li><a className="text-teal-900 hover:text-teal-700" href="contact.html">Contact us</a></li>
              <li><a className="text-teal-900 hover:text-teal-700" href="blog.html">Blog</a></li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Landing;
