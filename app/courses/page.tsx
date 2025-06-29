'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
  Search, 
  Filter,
  Play,
  Lock,
  CheckCircle,
  ArrowRight,
  GraduationCap,
  Target
} from 'lucide-react';
import { db } from '@/lib/supabase/database';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { toast } from 'sonner';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail_url: string | null;
  is_free: boolean;
  price: number;
  preview_enabled: boolean;
  lessons?: { count: number }[];
  user_enrollments?: { count: number }[];
}

interface UserEnrollment {
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
}

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedTab, setSelectedTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Load courses
      const coursesData = await db.getCourses();
      setCourses(coursesData || []);

      // Load user enrollments if logged in
      if (currentUser) {
        const enrollmentsData = await db.getUserEnrollments(currentUser.id);
        setEnrollments(enrollmentsData || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async (courseId: string) => {
    if (!user) {
      toast.error('Please log in to enroll in courses');
      return;
    }

    try {
      await db.enrollInCourse(user.id, courseId);
      toast.success('Successfully enrolled in course!');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    }
  };

  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return enrollment?.progress_percentage || 0;
  };

  const subjects = ['all', ...Array.from(new Set(courses.map(c => c.subject)))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    
    if (selectedTab === 'enrolled') {
      return matchesSearch && matchesSubject && isEnrolled(course.id);
    }
    if (selectedTab === 'free') {
      return matchesSearch && matchesSubject && course.is_free;
    }
    
    return matchesSearch && matchesSubject;
  });

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground">Loading courses...</p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Explore Courses</h1>
            <p className="text-muted-foreground text-lg">
              Discover comprehensive courses designed for government exam preparation
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject}>
                    {subject === 'all' ? 'All Subjects' : subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Courses</TabsTrigger>
            <TabsTrigger value="enrolled">My Courses</TabsTrigger>
            <TabsTrigger value="free">Free Courses</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-6">
            <CoursesGrid 
              courses={filteredCourses} 
              user={user}
              enrollments={enrollments}
              onEnroll={handleEnroll}
            />
          </TabsContent>

          <TabsContent value="enrolled" className="space-y-6">
            {user ? (
              <CoursesGrid 
                courses={filteredCourses} 
                user={user}
                enrollments={enrollments}
                onEnroll={handleEnroll}
                showProgress={true}
              />
            ) : (
              <div className="text-center py-12">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Sign in to view your courses</h3>
                <p className="text-muted-foreground mb-4">
                  Track your progress and continue learning where you left off
                </p>
                <Button>Sign In</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="free" className="space-y-6">
            <CoursesGrid 
              courses={filteredCourses} 
              user={user}
              enrollments={enrollments}
              onEnroll={handleEnroll}
            />
          </TabsContent>
        </Tabs>

        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>
    </AppShell>
  );
}

interface CoursesGridProps {
  courses: Course[];
  user: any;
  enrollments: UserEnrollment[];
  onEnroll: (courseId: string) => void;
  showProgress?: boolean;
}

function CoursesGrid({ courses, user, enrollments, onEnroll, showProgress = false }: CoursesGridProps) {
  const isEnrolled = (courseId: string) => {
    return enrollments.some(e => e.course_id === courseId);
  };

  const getEnrollmentProgress = (courseId: string) => {
    const enrollment = enrollments.find(e => e.course_id === courseId);
    return enrollment?.progress_percentage || 0;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
          <CardHeader className="space-y-4">
            {/* Course Image Placeholder */}
            <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {course.subject}
                </Badge>
                {course.is_free ? (
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    Free
                  </Badge>
                ) : (
                  <Badge variant="outline">
                    ${course.price}
                  </Badge>
                )}
              </div>

              <CardTitle className="text-lg leading-tight group-hover:text-primary transition-colors">
                {course.title}
              </CardTitle>
              
              <CardDescription className="text-sm line-clamp-2">
                {course.description}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Course Stats */}
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.lessons?.[0]?.count || 0} lessons</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.user_enrollments?.[0]?.count || 0} students</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>4.8</span>
              </div>
            </div>

            {/* Progress Bar (for enrolled courses) */}
            {showProgress && isEnrolled(course.id) && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{getEnrollmentProgress(course.id)}%</span>
                </div>
                <Progress value={getEnrollmentProgress(course.id)} className="h-2" />
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isEnrolled(course.id) ? (
                <Button className="flex-1" size="sm">
                  <Play className="h-4 w-4 mr-2" />
                  Continue Learning
                </Button>
              ) : (
                <>
                  {course.preview_enabled && (
                    <Button variant="outline" size="sm">
                      <Play className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                  )}
                  <Button 
                    className="flex-1" 
                    size="sm"
                    onClick={() => onEnroll(course.id)}
                    disabled={!user}
                  >
                    {!user ? (
                      <>
                        <Lock className="h-4 w-4 mr-2" />
                        Sign in to Enroll
                      </>
                    ) : course.is_free ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Enroll Free
                      </>
                    ) : (
                      <>
                        <Target className="h-4 w-4 mr-2" />
                        Enroll Now
                      </>
                    )}
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}