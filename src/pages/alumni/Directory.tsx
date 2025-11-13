import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, Mail, Briefcase, MapPin, GraduationCap } from 'lucide-react';

export default function AlumniDirectory() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [alumni, setAlumni] = useState<any[]>([]);
  const [filteredAlumni, setFilteredAlumni] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [departments, setDepartments] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      fetchAlumni();
      fetchFilters();
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    filterAlumni();
  }, [searchTerm, selectedDept, selectedBatch, alumni]);

  const fetchAlumni = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, department(dept_name), batch(batch_year)')
      .eq('role', 'alumni')
      .order('name');

    if (error) {
      console.error('Error fetching alumni:', error);
      return;
    }

    setAlumni(data || []);
    setFilteredAlumni(data || []);
  };

  const fetchFilters = async () => {
    const [deptRes, batchRes] = await Promise.all([
      supabase.from('department').select('*').order('dept_name'),
      supabase.from('batch').select('*').order('batch_year', { ascending: false }),
    ]);

    setDepartments(deptRes.data || []);
    setBatches(batchRes.data || []);
  };

  const filterAlumni = () => {
    let filtered = alumni;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.profession?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedDept !== 'all') {
      filtered = filtered.filter(a => a.department_id === selectedDept);
    }

    if (selectedBatch !== 'all') {
      filtered = filtered.filter(a => a.batch_id === selectedBatch);
    }

    setFilteredAlumni(filtered);
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
          <h1 className="text-4xl font-bold mb-2">Alumni Directory</h1>
          <p className="text-lg text-muted-foreground">
            Connect with {alumni.length} alumni from our community
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, or profession..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDept} onValueChange={setSelectedDept}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.dept_id} value={dept.dept_id}>
                      {dept.dept_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-full md:w-[200px]">
                  <SelectValue placeholder="Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  {batches.map((batch) => (
                    <SelectItem key={batch.batch_id} value={batch.batch_id}>
                      {batch.batch_year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
        </Card>

        {/* Alumni Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlumni.map((person) => (
            <Card key={person.id} className="hover:shadow-medium transition-smooth">
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                    {person.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{person.name}</h3>
                    {person.profession && (
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3 w-3" />
                        {person.profession}
                      </p>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {person.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{person.company}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {person.department?.dept_name} • {person.batch?.batch_year}
                  </span>
                </div>
                {person.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{person.bio}</p>
                )}
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <a href={`mailto:${person.email}`}>
                    <Mail className="h-4 w-4 mr-2" />
                    Contact
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAlumni.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No alumni found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
