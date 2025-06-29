'use client';

import React, { useState, useEffect, useRef } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Clock, 
  Users, 
  Star, 
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
const getSubjectIcon = (subject: string) => {
  switch (subject) {
    case 'English': return BookOpen;
    case 'Psychology': return Brain;
    case 'Mathematics': return Calculator;
    case 'Science': return FlaskConical;
    case 'History': return Landmark;
    case 'Current Affairs': return Newspaper;
    case 'Reasoning': return Lightbulb;
    default: return BookOpen;
  }
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrollments, setEnrollments] = useState<UserEnrollment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  
  // Refs for smooth scrolling
  const enrolledRef = useRef<HTMLDivElement>(null);
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
  const subjects = Array.from(new Set(courses.map(c => c.subject))).sort();

  // Group courses by subject
  const enrolledCourses = courses.filter(c => enrollments.some(e => e.course_id === c.id));
  const coursesBySubject = subjects.reduce((acc, subject) => {
    acc[subject] = courses.filter(c => c.subject === subject);
    return acc;
  }, {} as { [key: string]: Course[] });

  // Tab data for navigation
  const tabs = [
    {
      key: 'enrolled',
      label: 'Enrolled',
      icon: GraduationCap,
      count: enrolledCourses.length,
      ref: enrolledRef,
    },
    ...subjects.map(subject => ({
      key: subject.toLowerCase(),
      label: subject,
      icon: getSubjectIcon(subject),
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
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-muted-foreground">Explore our comprehensive course catalog</p>
        </div>

        {/* Sticky Tab Navigation */}
        <div className="sticky top-0 z-30 bg-background py-4 border-b">
          <div className="flex gap-2 items-center overflow-x-auto scrollbar-hide pb-2">
            {tabs.map(tab => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabClick(tab.ref)}
                  className="flex items-center px-4 py-2 rounded-full bg-muted hover:bg-primary/10 transition text-sm font-medium whitespace-nowrap min-w-fit"
                >
                  <IconComponent className="h-4 w-4 mr-2" />
                  {tab.label}
                  <span className="ml-2 text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Enrolled Section */}
        <div ref={enrolledRef} className="space-y-6 pt-4">
          <div className="flex items-center gap-3">
            <GraduationCap className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold">Enrolled Courses</h2>
          </div>
          {enrolledCourses.length > 0 ? (
            <CoursesGrid 
              courses={enrolledCourses} 
              user={user}
              enrollments={enrollments}
              onEnroll={handleEnroll}
              showProgress={true}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No enrolled courses yet</h3>
              <p>Start learning by enrolling in a course below!</p>
            </div>
          )}
        </div>

        {/* Subject-wise Sections */}
        {subjects.map(subject => {
          const subjectCourses = coursesBySubject[subject] || [];
          const SubjectIcon = getSubjectIcon(subject);
          
          return (
            <div 
              key={subject}
              ref={el => subjectRefs.current[subject] = el}
              className="space-y-6 pt-8"
            >
              <div className="flex items-center gap-3">
                <SubjectIcon className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">{subject} Courses</h2>
                <Badge variant="outline" className="ml-auto">
                  {subjectCourses.length} course{subjectCourses.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              {subjectCourses.length > 0 ? (
                <CoursesGrid 
                  courses={subjectCourses} 
                  user={user}
                  enrollments={enrollments}
                  onEnroll={handleEnroll}
                />
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <SubjectIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No {subject.toLowerCase()} courses available</h3>
                  <p>New courses will be added soon!</p>
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
        <p>No courses found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => {
        const SubjectIcon = getSubjectIcon(course.subject);
        
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