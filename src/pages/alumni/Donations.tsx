import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Heart, TrendingUp, Users, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AlumniDonations() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<any[]>([]);
  const [totalDonated, setTotalDonated] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newDonation, setNewDonation] = useState({
    amount: '',
    message: '',
  });

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchDonations();
      fetchTotal();
    }
  }, [user, loading, navigate]);

  const fetchDonations = async () => {
    const { data, error } = await supabase
      .from('donation')
      .select('*, donor:profiles(name)')
      .order('donation_date', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching donations:', error);
      return;
    }

    setDonations(data || []);
  };

  const fetchTotal = async () => {
    const { data, error } = await supabase
      .from('donation')
      .select('amount');

    if (error) {
      console.error('Error fetching total:', error);
      return;
    }

    const total = data?.reduce((sum, d) => sum + Number(d.amount), 0) || 0;
    setTotalDonated(total);
  };

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const amount = parseFloat(newDonation.amount);
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('donation').insert({
        alumni_id: user.id,
        amount: amount,
        message: newDonation.message,
      });

      if (error) throw error;

      toast.success('Thank you for your generous donation!');
      setNewDonation({ amount: '', message: '' });
      fetchDonations();
      fetchTotal();
    } catch (error: any) {
      toast.error(error.message || 'Error processing donation');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar userRole="alumni" />
      
      <div className="container py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Support Your Alma Mater</h1>
          <p className="text-lg text-muted-foreground">
            Make a difference in the lives of current and future students
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="hero-gradient text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Total Raised
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalDonated.toLocaleString()}</div>
              <p className="text-white/80 text-sm mt-1">From our generous alumni</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Total Donors
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{donations.length}</div>
              <p className="text-muted-foreground text-sm mt-1">Alumni contributors</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">100%</div>
              <p className="text-muted-foreground text-sm mt-1">Goes to student support</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Make a Donation</CardTitle>
              <CardDescription>
                Your contribution helps provide scholarships, improve facilities, and support student programs
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (USD) *</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="1"
                    value={newDonation.amount}
                    onChange={(e) => setNewDonation({ ...newDonation, amount: e.target.value })}
                    placeholder="100.00"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message (Optional)</Label>
                  <Textarea
                    id="message"
                    value={newDonation.message}
                    onChange={(e) => setNewDonation({ ...newDonation, message: e.target.value })}
                    placeholder="Leave a message of support..."
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 100, 250].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      onClick={() => setNewDonation({ ...newDonation, amount: amount.toString() })}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Heart className="mr-2 h-4 w-4" />
                      Donate Now
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Thank you to our generous supporters</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {donations.slice(0, 8).map((donation) => (
                  <div key={donation.donation_id} className="flex items-start justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{donation.donor?.name}</p>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground line-clamp-2">{donation.message}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(donation.donation_date), 'PPP')}
                      </p>
                    </div>
                    <div className="text-lg font-bold text-primary">
                      ${Number(donation.amount).toLocaleString()}
                    </div>
                  </div>
                ))}
                {donations.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    No donations yet. Be the first!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
