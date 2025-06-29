'use client';

import { useState, useEffect, useRef } from 'react';
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
  Target,
  Brain
} from 'lucide-react';
import { db } from '@/lib/supabase/database';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const enrolledRef = useRef<HTMLDivElement>(null);
  const englishRef = useRef<HTMLDivElement>(null);
  const psychologyRef = useRef<HTMLDivElement>(null);

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

  // Group courses by subject
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const englishCourses = courses.filter(c => c.subject.toLowerCase() === 'english');
  const psychologyCourses = courses.filter(c => c.subject.toLowerCase() === 'psychology');

  // Tab data
  const tabs = [
    {
      key: 'enrolled',
      label: 'Enrolled',
      icon: <GraduationCap className="h-4 w-4 mr-1" />,
      count: enrolledCourses.length,
      ref: enrolledRef,
    },
    {
      key: 'english',
      label: 'English',
      icon: <BookOpen className="h-4 w-4 mr-1" />,
      count: englishCourses.length,
      ref: englishRef,
    },
    {
      key: 'psychology',
      label: 'Psychology',
      icon: <Brain className="h-4 w-4 mr-1" />,
      count: psychologyCourses.length,
      ref: psychologyRef,
    },
  ];

  const handleTabClick = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

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
        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 bg-background py-2 border-b flex gap-2 items-center">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => handleTabClick(tab.ref)}
              className="flex items-center px-3 py-1 rounded-full bg-muted hover:bg-primary/10 transition text-sm font-medium"
            >
              {tab.icon}
              {tab.label}
              <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Enrolled Section */}
        <div ref={enrolledRef} className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Enrolled Courses
          </h2>
          <CoursesGrid 
            courses={enrolledCourses} 
            user={user}
            enrollments={enrollments}
            onEnroll={handleEnroll}
            showProgress={true}
          />
        </div>

        {/* English Section */}
        <div ref={englishRef} className="space-y-4 pt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> English Courses
          </h2>
          <CoursesGrid 
            courses={englishCourses} 
            user={user}
            enrollments={enrollments}
            onEnroll={handleEnroll}
          />
        </div>

        {/* Psychology Section */}
        <div ref={psychologyRef} className="space-y-4 pt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Brain className="h-5 w-5" /> Psychology Courses
          </h2>
          <CoursesGrid 
            courses={psychologyCourses} 
            user={user}
            enrollments={enrollments}
            onEnroll={handleEnroll}
          />
        </div>
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