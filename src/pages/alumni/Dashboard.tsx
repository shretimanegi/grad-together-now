import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Briefcase, Heart, MessageCircle, Users, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AlumniDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    events: 0,
    donations: 0,
    jobPosts: 0,
    mentorships: 0,
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

    if (data.role !== 'alumni' && data.role !== 'admin') {
      navigate('/student/dashboard');
      return;
    }

    setProfile(data);
  };

  const fetchStats = async () => {
    if (!user) return;

    const [eventsRes, donationsRes, jobPostsRes, mentorshipsRes] = await Promise.all([
      supabase.from('event').select('event_id', { count: 'exact' }).eq('organizer_id', user.id),
      supabase.from('donation').select('donation_id', { count: 'exact' }).eq('alumni_id', user.id),
      supabase.from('job_post').select('job_id', { count: 'exact' }).eq('alumni_id', user.id),
      supabase.from('mentorship').select('mentor_id', { count: 'exact' }).eq('alumni_id', user.id),
    ]);

    setStats({
      events: eventsRes.count || 0,
      donations: donationsRes.count || 0,
      jobPosts: jobPostsRes.count || 0,
      mentorships: mentorshipsRes.count || 0,
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
      icon: Calendar, 
      label: 'Browse Events', 
      href: '/alumni/events',
      color: 'text-blue-600'
    },
    { 
      icon: Briefcase, 
      label: 'Post a Job', 
      href: '/alumni/jobs',
      color: 'text-emerald-600'
    },
    { 
      icon: MessageCircle, 
      label: 'Become a Mentor', 
      href: '/alumni/mentorship',
      color: 'text-purple-600'
    },
    { 
      icon: Heart, 
      label: 'Make a Donation', 
      href: '/alumni/donations',
      color: 'text-red-600'
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="alumni" />
      
      <div className="container py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {profile.name}! 👋</h1>
          <p className="text-lg text-muted-foreground">
            {profile.department?.dept_name} • Batch of {profile.batch?.batch_year}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Events Organized</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.events}</div>
              <p className="text-xs text-muted-foreground">Alumni events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Job Posts</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.jobPosts}</div>
              <p className="text-xs text-muted-foreground">Active listings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mentorships</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.mentorships}</div>
              <p className="text-xs text-muted-foreground">Mentees guided</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Donations</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.donations}</div>
              <p className="text-xs text-muted-foreground">Contributions made</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and features</CardDescription>
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
              <CardTitle>Network Growth</CardTitle>
              <CardDescription>Your impact on the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">Alumni Directory</p>
                  <p className="text-sm text-muted-foreground">Connect with fellow alumni</p>
                </div>
                <Button variant="ghost" asChild>
                  <Link to="/alumni/directory">Browse</Link>
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
