import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  GraduationCap, 
  Users, 
  Calendar, 
  Briefcase, 
  Heart, 
  MessageCircle,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Users,
      title: 'Alumni Network',
      description: 'Connect with thousands of alumni worldwide and expand your professional network'
    },
    {
      icon: Calendar,
      title: 'Events & Reunions',
      description: 'Stay updated on upcoming events, reunions, and networking opportunities'
    },
    {
      icon: Briefcase,
      title: 'Career Opportunities',
      description: 'Explore job postings and career opportunities shared by fellow alumni'
    },
    {
      icon: MessageCircle,
      title: 'Mentorship Program',
      description: 'Connect with experienced mentors or become one to guide the next generation'
    },
    {
      icon: Heart,
      title: 'Give Back',
      description: 'Support your alma mater through donations and contribute to student success'
    },
    {
      icon: CheckCircle,
      title: 'Easy Management',
      description: 'Manage your profile, track donations, and stay connected effortlessly'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden hero-gradient py-20 md:py-32">
        <div className="container relative z-10">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="inline-flex items-center justify-center p-2 mb-6 rounded-full bg-white/10 backdrop-blur-sm">
              <GraduationCap className="h-8 w-8" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to AlumniConnect
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
              Building lasting connections, fostering growth, and creating opportunities for our alumni community
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/auth?role=alumni">
                  Alumni Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to="/auth?role=student">
                  Student Portal
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/10" />
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Everything You Need to Stay Connected
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform provides all the tools you need to engage with your alumni community
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 hover:shadow-elevated transition-smooth">
                <div className="inline-flex p-3 rounded-lg hero-gradient mb-4">
                  <feature.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container">
          <Card className="p-8 md:p-12 text-center hero-gradient">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 text-white/90 max-w-2xl mx-auto">
              Join thousands of alumni and students already using AlumniConnect to build meaningful connections
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" asChild className="text-lg px-8">
                <Link to="/auth?role=alumni">
                  Sign Up as Alumni
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8 bg-white/10 text-white border-white/20 hover:bg-white/20">
                <Link to="/auth?role=student">
                  Sign Up as Student
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <div className="rounded-lg hero-gradient p-2">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg">AlumniConnect</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 AlumniConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
