import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, Users, MessageCircle, BookOpen, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    jobsAvailable: 0,
    mentorshipRequests: 0,
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user, loading, navigate]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*, department(dept_name), batch(batch_year)')
      .eq('id', user.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return;
    }

    if (data.role !== 'student' && data.role !== 'admin') {
      navigate('/alumni/dashboard');
      return;
    }

    setProfile(data);
  };

  const fetchStats = async () => {
    if (!user) return;

    const [eventsRes, jobsRes, mentorshipsRes] = await Promise.all([
      supabase.from('event_registration').select('reg_id', { count: 'exact' }).eq('alumni_id', user.id),
      supabase.from('job_post').select('job_id', { count: 'exact' }).eq('is_active', true),
      supabase.from('mentorship').select('mentor_id', { count: 'exact' }),
    ]);

    setStats({
      eventsRegistered: eventsRes.count || 0,
      jobsAvailable: jobsRes.count || 0,
      mentorshipRequests: mentorshipsRes.count || 0,
    });
  };

  if (loading || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const quickActions = [
    { 
      icon: Users, 
      label: 'Browse Alumni', 
      href: '/student/alumni',
      color: 'text-blue-600'
    },
    { 
      icon: Calendar, 
      label: 'Upcoming Events', 
      href: '/student/events',
      color: 'text-emerald-600'
    },
    { 
      icon: Briefcase, 
      label: 'Job Opportunities', 
      href: '/student/jobs',
      color: 'text-purple-600'
    },
    { 
      icon: MessageCircle, 
      label: 'Find a Mentor', 
      href: '/student/mentorship',
      color: 'text-orange-600'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="student" />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome, {profile.name}! 🎓</h1>
          <p className="text-lg text-muted-foreground">
            {profile.department?.dept_name} • Batch of {profile.batch?.batch_year}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Registered</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.eventsRegistered}</div>
              <p className="text-xs text-muted-foreground">Alumni events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Opportunities</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobsAvailable}</div>
              <p className="text-xs text-muted-foreground">Available positions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentorship Programs</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mentorshipRequests}</div>
              <p className="text-xs text-muted-foreground">Active mentors</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Explore opportunities and connect</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => (
                <Button
                  key={action.label}
                  variant="outline"
                  className="h-auto flex flex-col items-center justify-center p-6 gap-2"
                  asChild
                >
                  <Link to={action.href}>
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                    <span className="text-sm font-medium text-center">{action.label}</span>
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Career Resources</CardTitle>
              <CardDescription>Tools to help you succeed</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Alumni Network</p>
                  <p className="text-sm text-muted-foreground">Connect with alumni professionals</p>
                </div>
                <Button variant="ghost" asChild>
                  <Link to="/student/alumni">Browse</Link>
                </Button>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-secondary/10">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Your Profile</p>
                  <p className="text-sm text-muted-foreground">Update your information</p>
                </div>
                <Button variant="ghost" asChild>
                  <Link to="/profile">Edit</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
