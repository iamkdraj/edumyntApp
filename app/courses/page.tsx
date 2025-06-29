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
  Brain,
  Calculator,
  FlaskConical,
  Landmark,
  Newspaper,
  Lightbulb
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
  const allCoursesRef = useRef<HTMLDivElement>(null);

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
      console.log('Loaded courses:', coursesData);
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
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
    
    if (selectedTab === 'enrolled') {
      return matchesSearch && matchesSubject && isEnrolled(course.id);
    }
    if (selectedTab === 'free') {
      return matchesSearch && matchesSubject && course.is_free;
    }
    
    return matchesSearch && matchesSubject;
  });

  // Group courses by subject for better organization
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const coursesBySubject = courses.reduce((acc, course) => {
    if (!acc[course.subject]) {
      acc[course.subject] = [];
    }
    acc[course.subject].push(course);
    return acc;
  }, {} as Record<string, Course[]>);

  // Get subject icon
  const getSubjectIcon = (subject: string) => {
    switch (subject.toLowerCase()) {
      case 'english': return <BookOpen className="h-5 w-5" />;
      case 'psychology': return <Brain className="h-5 w-5" />;
      case 'mathematics': return <Calculator className="h-5 w-5" />;
      case 'science': return <FlaskConical className="h-5 w-5" />;
      case 'history': return <Landmark className="h-5 w-5" />;
      case 'current affairs': return <Newspaper className="h-5 w-5" />;
      case 'reasoning': return <Lightbulb className="h-5 w-5" />;
      default: return <BookOpen className="h-5 w-5" />;
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
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Courses</h1>
              <p className="text-muted-foreground">
                Explore our comprehensive course catalog
              </p>
            </div>
            
            {/* Search and Filter */}
            <div className="flex items-center gap-2">
              <Popover open={searchOpen} onOpenChange={setSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-2">
                    <h4 className="font-medium">Search Courses</h4>
                    <Input
                      placeholder="Search by title, description, or subject..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </PopoverContent>
              </Popover>

              <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-60">
                  <div className="space-y-4">
                    <h4 className="font-medium">Filter Courses</h4>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Subject</label>
                      <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {subjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject === 'all' ? 'All Subjects' : subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Quick Filter Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="all">All Courses ({courses.length})</TabsTrigger>
              <TabsTrigger value="enrolled">Enrolled ({enrolledCourses.length})</TabsTrigger>
              <TabsTrigger value="free">Free Courses ({courses.filter(c => c.is_free).length})</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Enrolled Courses Section */}
        {user && enrolledCourses.length > 0 && (
          <div ref={enrolledRef} className="space-y-4">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Your Enrolled Courses</h2>
            </div>
            <CoursesGrid 
              courses={enrolledCourses} 
              user={user}
              enrollments={enrollments}
              onEnroll={handleEnroll}
              showProgress={true}
            />
          </div>
        )}

        {/* All Courses by Subject */}
        <div ref={allCoursesRef} className="space-y-8">
          {selectedTab === 'all' ? (
            // Show courses grouped by subject
            Object.entries(coursesBySubject).map(([subject, subjectCourses]) => (
              <div key={subject} className="space-y-4">
                <div className="flex items-center gap-2">
                  {getSubjectIcon(subject)}
                  <h2 className="text-xl font-semibold">{subject} Courses</h2>
                  <Badge variant="secondary">{subjectCourses.length}</Badge>
                </div>
                <CoursesGrid 
                  courses={subjectCourses.filter(course => {
                    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
                    const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
                    return matchesSearch && matchesSubject;
                  })} 
                  user={user}
                  enrollments={enrollments}
                  onEnroll={handleEnroll}
                />
              </div>
            ))
          ) : (
            // Show filtered courses
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                <h2 className="text-xl font-semibold">
                  {selectedTab === 'enrolled' ? 'Enrolled Courses' : 'Free Courses'}
                </h2>
                <Badge variant="secondary">{filteredCourses.length}</Badge>
              </div>
              <CoursesGrid 
                courses={filteredCourses} 
                user={user}
                enrollments={enrollments}
                onEnroll={handleEnroll}
                showProgress={selectedTab === 'enrolled'}
              />
            </div>
          )}
        </div>

        {/* No courses message */}
        {filteredCourses.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No courses found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedSubject !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No courses are available at the moment'
              }
            </p>
            {(searchQuery || selectedSubject !== 'all') && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSubject('all');
                  setSelectedTab('all');
                }}
              >
                Clear Filters
              </Button>
            )}
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

  if (courses.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No courses in this category
      </div>
    );
  }

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
                <span>{course.lessons?.[0]?.count || 1} lessons</span>
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