import { Link, useNavigate } from "react-router-dom";
import { useUserStore } from "@/backend/store/userStore";
import { logOut } from "@/backend/services/firebase";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/frontend/components/ui/dropdown-menu";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/frontend/components/ui/tooltip";
function Navbar() {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    await logOut();
    navigate("/login");
  };
  return <nav className="w-full px-8 py-5">
      <div className="flex items-center justify-between">
        {
    /* Left side - Logo + nav */
  }
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#e2b714] rounded-lg flex items-center justify-center transition-all duration-200 group-hover:scale-105 group-hover:shadow-[0_0_15px_rgba(226,183,20,0.3)]">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#323437" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <path d="M6 10h.01M10 10h.01M14 10h.01M18 10h.01M8 14h8" />
              </svg>
            </div>
            <span className="text-[28px] font-bold tracking-tight">
              <span className="text-[#646669] group-hover:text-[#d1d0c5] transition-colors duration-200">swift</span>
              <span className="text-[#d1d0c5]">type</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1 ml-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Link to="/about" className="p-2 rounded-lg text-[#646669] hover:text-[#d1d0c5] transition-colors outline-none" title="About">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" /></svg>
                </Link>
              </TooltipTrigger>
              <TooltipContent className="bg-[#2c2e31] text-[#d1d0c5] border-[#363739]">
                <p>About</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {
    /* Right side - Auth (flush right, no max-width constraint) */
  }
        <div className="flex items-center gap-3">
          {user ? <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
    className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-[#2c2e31] transition-all duration-200 group outline-none"
  >
                  <div className="w-9 h-9 bg-gradient-to-br from-[#e2b714] to-[#c9a312] rounded-full flex items-center justify-center text-[#323437] font-bold text-sm shadow-lg">
                    {(user.displayName || user.email || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm text-[#646669] group-hover:text-[#d1d0c5] transition-colors duration-200 hidden sm:block max-w-[120px] truncate">
                    {user.displayName || user.email?.split("@")[0]}
                  </span>
                  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className="text-[#646669] group-hover:text-[#d1d0c5] transition-all duration-200"
  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-48 bg-[#2c2e31] border-[#363739] text-[#d1d0c5] rounded-xl shadow-2xl overflow-hidden mt-1 p-0">
                <DropdownMenuItem asChild className="cursor-pointer focus:bg-[#363739] focus:text-[#d1d0c5] px-4 py-3 rounded-none">
                  <Link to="/profile" className="flex items-center gap-3 w-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={handleLogout} className="cursor-pointer focus:bg-[#363739] text-[#ca4754] focus:text-[#ca4754] px-4 py-3 rounded-none">
                  <div className="flex items-center gap-3 w-full">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                      <polyline points="16 17 21 12 16 7" />
                      <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> : <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm text-[#646669] hover:text-[#d1d0c5] transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 text-sm bg-[#e2b714] text-[#323437] rounded-lg font-semibold hover:bg-[#c9a312] transition-all duration-200 hover:shadow-[0_0_12px_rgba(226,183,20,0.3)]">
                Sign Up
              </Link>
            </div>}
        </div>
      </div>
    </nav>;
}
export {
  Navbar as default
};
