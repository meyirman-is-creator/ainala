"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  FaCheckCircle,
  FaMapMarkerAlt,
  FaComments,
  FaChartBar,
  FaArrowRight,
} from "react-icons/fa";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  const { data: session } = useSession();
  const [showVideo, setShowVideo] = useState(false);

  const features = [
    {
      title: "Report Issues",
      description:
        "Submit problems in your city with photos and detailed descriptions",
      icon: <FaMapMarkerAlt className="h-6 w-6 text-ainala-blue" />,
    },
    {
      title: "Track Progress",
      description:
        "Follow the status of your reports from submission to resolution",
      icon: <FaCheckCircle className="h-6 w-6 text-ainala-blue" />,
    },
    {
      title: "Engage in Discussions",
      description: "Comment on issues and collaborate with other citizens",
      icon: <FaComments className="h-6 w-6 text-ainala-blue" />,
    },
    {
      title: "Improve Your City",
      description:
        "See real-time statistics on resolved issues in your neighborhood",
      icon: <FaChartBar className="h-6 w-6 text-ainala-blue" />,
    },
  ];

  const stats = [
    { value: "10,000+", label: "Active Users" },
    { value: "25,000+", label: "Issues Reported" },
    { value: "18,000+", label: "Issues Resolved" },
    { value: "90%", label: "Resolution Rate" },
  ];

  const testimonials = [
    {
      quote:
        "Ainala has transformed how our city handles citizen reports. The platform provides clear visibility and accountability.",
      author: "Sarah Johnson",
      role: "City Administrator",
      avatar: "/images/avatar1.png",
    },
    {
      quote:
        "I reported a broken street light that had been out for months. It was fixed within a week after using Ainala!",
      author: "Michael Chen",
      role: "Local Resident",
      avatar: "/images/avatar2.png",
    },
    {
      quote:
        "The tracking feature is amazing. I can actually see when someone is assigned to fix the problem I reported.",
      author: "Elena Martinez",
      role: "Community Organizer",
      avatar: "/images/avatar3.png",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white py-4 px-6 border-b border-gray-200">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-ainala-blue">Ainala</h1>
          </div>
          <div className="flex items-center space-x-4">
            {session ? (
              <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                <Link href="/dashboard">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" className="text-gray-700">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
                <Button asChild className="bg-ainala-blue hover:bg-blue-700">
                  <Link href="/sign-up">Sign Up</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-blue-50 to-indigo-50 py-16 md:py-24">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Breaking & Beyond <br />
                <span className="text-ainala-blue">
                  Solving Problems Together
                </span>
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                Ainala connects citizens with city administrators to report,
                track, and resolve urban issues. Make your voice heard and
                contribute to a better community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-ainala-blue hover:bg-blue-700"
                >
                  <Link href={session ? "/add-issues" : "/sign-up"}>
                    {session ? "Report an Issue" : "Get Started"}
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/issue-details">See Issues</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <Image
                src="/images/collaboration.svg"
                alt="City collaboration"
                fill
                className="object-contain"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                How It Works
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Ainala provides a simple and effective way for citizens and
                administrators to collaborate on improving urban spaces.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100"
                >
                  <div className="rounded-full bg-blue-50 w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {stats.map((stat, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                  <p className="text-3xl md:text-4xl font-bold text-ainala-blue mb-2">
                    {stat.value}
                  </p>
                  <p className="text-gray-600">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                What People Are Saying
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Hear from citizens and administrators who are using Ainala to
                improve their communities.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-md border border-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4">
                      <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium">
                        {testimonial.author[0]}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold">{testimonial.author}</h4>
                      <p className="text-sm text-gray-600">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700 italic">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-ainala-blue text-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">
              Ready to Improve Your City?
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Join thousands of citizens making a difference in their
              communities.
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-ainala-blue hover:bg-gray-100"
            >
              <Link href={session ? "/add-issues" : "/sign-up"}>
                {session ? "Report Your First Issue" : "Sign Up Now"}{" "}
                <FaArrowRight className="ml-2" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Ainala</h3>
              <p className="text-gray-400">
                A platform for civic engagement and urban issue resolution.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Report Issues
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Track Progress
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Community Engagement
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Analytics
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    API
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Guides
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="#" className="hover:text-white">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white">
                    Press
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-400">
            <p>
              &copy; {new Date().getFullYear()} Ainala. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
