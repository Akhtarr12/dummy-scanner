import { Link } from "wouter";
import { Button } from "./ui/button";

export default function Navbar() {
  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/">
            <div className="flex items-center space-x-4 cursor-pointer">
            <img
                src="/assets/logo.png"
                alt="Skin Nexus Logo"
                className="h-16 w-16 object-contain"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Skin Nexus
              </span>
            </div>
          </Link>

          <div className="hidden md:flex space-x-6">
            <Link href="/">
              <a className="text-gray-600 hover:text-blue-600">Home</a>
            </Link>
            <Link href="/analysis">
              <a className="text-gray-600 hover:text-blue-600">Try Demo</a>
            </Link>
            <a href="#features" className="text-gray-600 hover:text-blue-600">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-blue-600">How it Works</a>
            <a href="#feedback" className="text-gray-600 hover:text-blue-600">Feedback</a>
          </div>

          <div className="hidden md:block">
            <Link href="/analysis">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Try Analysis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}