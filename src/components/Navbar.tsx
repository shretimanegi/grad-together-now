import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { GraduationCap, User, LogOut, Settings, Menu } from 'lucide-react';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavbarProps {
  userRole?: 'alumni' | 'student' | 'admin';
}

export default function Navbar({ userRole }: NavbarProps) {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = userRole === 'alumni' ? [
    { href: '/alumni/dashboard', label: 'Dashboard' },
    { href: '/alumni/directory', label: 'Directory' },
    { href: '/alumni/events', label: 'Events' },
    { href: '/alumni/jobs', label: 'Jobs' },
    { href: '/alumni/mentorship', label: 'Mentorship' },
    { href: '/alumni/donations', label: 'Donate' },
  ] : userRole === 'student' ? [
    { href: '/student/dashboard', label: 'Dashboard' },
    { href: '/student/alumni', label: 'Alumni' },
    { href: '/student/events', label: 'Events' },
    { href: '/student/jobs', label: 'Jobs' },
    { href: '/student/mentorship', label: 'Find Mentor' },
  ] : [];

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2 mr-6">
          <div className="rounded-lg hero-gradient p-2">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <span className="font-bold text-xl">AlumniConnect</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <div className="flex space-x-1">
            {navLinks.map((link) => (
              <Button key={link.href} variant="ghost" asChild>
                <Link to={link.href}>{link.label}</Link>
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {userRole === 'admin' && (
                  <Button variant="outline" asChild>
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">Sign In</Link>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="flex flex-1 items-center justify-end md:hidden">
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                {navLinks.map((link) => (
                  <Button 
                    key={link.href} 
                    variant="ghost" 
                    asChild 
                    className="justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to={link.href}>{link.label}</Link>
                  </Button>
                ))}
                {user && userRole === 'admin' && (
                  <Button 
                    variant="outline" 
                    asChild 
                    className="justify-start"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link to="/admin">Admin Panel</Link>
                  </Button>
                )}
                <div className="pt-4 border-t">
                  {user ? (
                    <>
                      <Button 
                        variant="ghost" 
                        asChild 
                        className="justify-start w-full"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/profile">
                          <User className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="justify-start w-full text-destructive"
                        onClick={() => {
                          signOut();
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <Button asChild className="w-full">
                      <Link to="/auth">Sign In</Link>
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
