import { Github, Twitter, Heart, Keyboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-6 px-6 mt-auto border-t border-[#646669] border-opacity-10 font-sans-swift">
      <div className="max-w-7xl mx-auto">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          {/* Logo & Description */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Keyboard className="w-6 h-6 text-[#e2b714]" strokeWidth={2} />
              <h3 className="text-xl">
                <span className="text-[#646669]">Swift</span>
                <span className="text-[#d1d0c5]">Type</span>
              </h3>
            </div>
            <p className="text-[#646669] text-sm">
              A minimalist typing speed test application designed to help you
              improve your typing skills.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-[#d1d0c5] font-medium">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="text-[#646669] hover:text-[#e2b714] transition-colors duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="text-[#646669] hover:text-[#e2b714] transition-colors duration-200"
                >
                  Leaderboard
                </Link>
              </li>

            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-3">
            <h4 className="text-[#d1d0c5] font-medium">Connect</h4>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/Ajay-1011-git/Swift-Type"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2c2e31] text-[#646669] hover:text-[#e2b714] hover:bg-[#323437] transition-all duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#2c2e31] text-[#646669] hover:text-[#e2b714] hover:bg-[#323437] transition-all duration-200"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-6 border-t border-[#646669] border-opacity-10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#646669]">
          <p>&copy; {currentYear} SwiftType. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with{' '}
            <Heart className="w-4 h-4 text-[#ca4754] fill-[#ca4754]" /> by the
            SwiftType team
          </p>
        </div>
      </div>
    </footer>
  );
}
