'use client';

import { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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

// Subject icons mapping
const subjectIcons: { [key: string]: any } = {
  'English': BookOpen,
  'Psychology': Brain,
  'Mathematics': Calculator,
  'Science': FlaskConical,
  'History': Landmark,
  'Current Affairs': Newspaper,
  'Reasoning': Lightbulb,
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  
  // Refs for smooth scrolling
  const enrolledRef = useRef<HTMLDivElement>(null);
  const allCoursesRef = useRef<HTMLDivElement>(null);
  const subjectRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

  // Get unique subjects from courses
  const subjects = ['all', ...Array.from(new Set(courses.map(c => c.subject)))];

  // Group courses by subject
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const coursesBySubject = subjects.slice(1).reduce((acc, subject) => {
    acc[subject] = courses.filter(c => c.subject === subject);
    return acc;
  }, {} as { [key: string]: Course[] });

  // Filter courses based on search and subject
  const getFilteredCourses = (coursesToFilter: Course[]) => {
    return coursesToFilter.filter(course => {
      const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           course.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSubject = selectedSubject === 'all' || course.subject === selectedSubject;
      return matchesSearch && matchesSubject;
    });
  };

  // Tab data for navigation
  const tabs = [
    {
      key: 'enrolled',
      label: 'Enrolled',
      icon: <GraduationCap className="h-4 w-4 mr-1" />,
      count: enrolledCourses.length,
      ref: enrolledRef,
    },
    {
      key: 'all',
      label: 'All Courses',
      icon: <BookOpen className="h-4 w-4 mr-1" />,
      count: courses.length,
      ref: allCoursesRef,
    },
    ...subjects.slice(1).map(subject => ({
      key: subject.toLowerCase(),
      label: subject,
      icon: React.createElement(subjectIcons[subject] || BookOpen, { className: "h-4 w-4 mr-1" }),
      count: coursesBySubject[subject]?.length || 0,
      ref: { current: subjectRefs.current[subject] },
    })),
  ];

  const handleTabClick = (ref: React.RefObject<HTMLDivElement> | { current: HTMLDivElement | null }) => {
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
        {/* Header with Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Courses</h1>
            <p className="text-muted-foreground">Explore our comprehensive course catalog</p>
          </div>
          
          <div className="flex gap-2">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h4 className="font-medium">Search Courses</h4>
                  <Input
                    placeholder="Search by title or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </PopoverContent>
            </Popover>

            <Popover open={filterOpen} onOpenChange={setFilterOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Subject</h4>
                    <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
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
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 bg-background py-2 border-b">
          <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => handleTabClick(tab.ref)}
                className="flex items-center px-3 py-1 rounded-full bg-muted hover:bg-primary/10 transition text-sm font-medium whitespace-nowrap"
              >
                {tab.icon}
                {tab.label}
                <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Enrolled Section */}
        <div ref={enrolledRef} className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <GraduationCap className="h-5 w-5" /> Enrolled Courses
          </h2>
          {enrolledCourses.length > 0 ? (
            <CoursesGrid 
              courses={getFilteredCourses(enrolledCourses)} 
              user={user}
              enrollments={enrollments}
              onEnroll={handleEnroll}
              showProgress={true}
            />
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <GraduationCap className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No enrolled courses yet. Start learning by enrolling in a course!</p>
            </div>
          )}
        </div>

        {/* All Courses Section */}
        <div ref={allCoursesRef} className="space-y-4 pt-8">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="h-5 w-5" /> All Courses
          </h2>
          <CoursesGrid 
            courses={getFilteredCourses(courses)} 
            user={user}
            enrollments={enrollments}
            onEnroll={handleEnroll}
          />
        </div>

        {/* Subject-wise Sections */}
        {subjects.slice(1).map(subject => {
          const subjectCourses = coursesBySubject[subject] || [];
          const filteredSubjectCourses = getFilteredCourses(subjectCourses);
          const SubjectIcon = subjectIcons[subject] || BookOpen;
          
          return (
            <div 
              key={subject}
              ref={el => subjectRefs.current[subject] = el}
              className="space-y-4 pt-8"
            >
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <SubjectIcon className="h-5 w-5" /> {subject} Courses
              </h2>
              {filteredSubjectCourses.length > 0 ? (
                <CoursesGrid 
                  courses={filteredSubjectCourses} 
                  user={user}
                  enrollments={enrollments}
                  onEnroll={handleEnroll}
                />
              ) : subjectCourses.length > 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No {subject.toLowerCase()} courses match your search criteria.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedSubject('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <SubjectIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No {subject.toLowerCase()} courses available yet.</p>
                </div>
              )}
            </div>
          );
        })}
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
        <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
        <p>No courses found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const SubjectIcon = subjectIcons[course.subject] || BookOpen;
        
        return (
          <Card key={course.id} className="group hover:shadow-lg transition-all duration-200 border-0 shadow-md">
            <CardHeader className="space-y-4">
              {/* Course Image Placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center group-hover:from-primary/15 group-hover:to-primary/10 transition-colors">
                <SubjectIcon className="h-8 w-8 text-primary" />
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
        );
      })}
    </div>
  );
}