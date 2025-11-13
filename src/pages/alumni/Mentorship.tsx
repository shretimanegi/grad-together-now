import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MessageCircle } from 'lucide-react';

export default function AlumniMentorship() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mentorships, setMentorships] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) navigate('/auth');
    if (user) fetchMentorships();
  }, [user, loading, navigate]);

  const fetchMentorships = async () => {
    const { data } = await supabase
      .from('mentorship')
      .select('*')
      .eq('alumni_id', user?.id)
      .order('created_at', { ascending: false });
    setMentorships(data || []);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="alumni" />
      <div className="container py-8">
        <h1 className="text-4xl font-bold mb-2">Mentorship Requests</h1>
        <p className="text-lg text-muted-foreground mb-8">Guide the next generation</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentorships.map((m) => (
            <Card key={m.mentor_id}>
              <CardHeader>
                <CardTitle>{m.mentee_name}</CardTitle>
                <CardDescription>{m.mentee_email}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-2">Domain: {m.domain}</p>
                <Badge>{m.status}</Badge>
              </CardContent>
            </Card>
          ))}
          {mentorships.length === 0 && (
            <div className="col-span-full text-center py-12">
              <MessageCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No mentorship requests yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
