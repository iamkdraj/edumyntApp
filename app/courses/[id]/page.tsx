'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  Star, 
  Play,
  Lock,
  CheckCircle,
  BookOpen,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Target,
  Trophy,
  FileText
} from 'lucide-react';
import { db } from '@/lib/supabase/database';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

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

interface Module {
  id: string;
  title: string;
  description: string;
  order_index: number;
  is_preview: boolean;
  estimated_duration: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  lesson_type: string;
  order_index: number;
  is_preview: boolean;
  estimated_duration: number;
}

interface UserEnrollment {
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
}

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.id as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [enrollment, setEnrollment] = useState<UserEnrollment | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [openModules, setOpenModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadCourseData();
  }, [courseId]);

  const loadCourseData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      // Load course details
      const courseData = await db.getCourse(courseId);
      setCourse(courseData);

      // Load course modules with lessons
      const modulesData = await loadCourseModules(courseId);
      setModules(modulesData);

      // Load user enrollment if logged in
      if (currentUser) {
        const enrollmentsData = await db.getUserEnrollments(currentUser.id);
        const courseEnrollment = enrollmentsData?.find(e => e.course_id === courseId);
        setEnrollment(courseEnrollment || null);
      }

      // Open first module by default
      if (modulesData.length > 0) {
        setOpenModules(new Set([modulesData[0].id]));
      }
    } catch (error) {
      console.error('Error loading course data:', error);
      toast.error('Failed to load course details');
    } finally {
      setIsLoading(false);
    }
  };

  const loadCourseModules = async (courseId: string): Promise<Module[]> => {
    // This would be a new database method to get modules with lessons
    // For now, we'll simulate the data structure
    const supabase = db['supabase'];
    
    const { data: modulesData, error: modulesError } = await supabase
      .from('course_modules')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index');

    if (modulesError) throw modulesError;

    const modulesWithLessons = await Promise.all(
      (modulesData || []).map(async (module) => {
        const { data: lessonsData } = await supabase
          .from('lessons')
          .select('id, title, lesson_type, order_index, is_preview, estimated_duration')
          .eq('module_id', module.id)
          .order('order_index');

        return {
          ...module,
          lessons: lessonsData || []
        };
      })
    );

    return modulesWithLessons;
  };

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Please log in to enroll in this course');
      router.push('/auth/login');
      return;
    }

    try {
      setIsEnrolling(true);
      await db.enrollInCourse(user.id, courseId);
      toast.success('Successfully enrolled in course!');
      loadCourseData(); // Refresh data
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Failed to enroll in course');
    } finally {
      setIsEnrolling(false);
    }
  };

  const toggleModule = (moduleId: string) => {
    const newOpenModules = new Set(openModules);
    if (newOpenModules.has(moduleId)) {
      newOpenModules.delete(moduleId);
    } else {
      newOpenModules.add(moduleId);
    }
    setOpenModules(newOpenModules);
  };

  const canAccessLesson = (lesson: Lesson, module: Module) => {
    return lesson.is_preview || module.is_preview || !!enrollment;
  };

  const getTotalDuration = () => {
    return modules.reduce((total, module) => total + module.estimated_duration, 0);
  };

  const getTotalLessons = () => {
    return modules.reduce((total, module) => total + module.lessons.length, 0);
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <CourseDetailSkeleton />
        </div>
      </AppShell>
    );
  }

  if (!course) {
    return (
      <AppShell>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Course not found</h2>
            <p className="text-muted-foreground">The course you're looking for doesn't exist.</p>
            <Link href="/courses">
              <Button>Browse Courses</Button>
            </Link>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link href="/courses" className="hover:text-foreground">Courses</Link>
            <span>/</span>
            <span>{course.subject}</span>
            <span>/</span>
            <span className="text-foreground">{course.title}</span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="space-y-4">
              {/* Course Image */}
              <div className="aspect-video relative overflow-hidden rounded-lg">
                {course.thumbnail_url ? (
                  <img 
                    src={course.thumbnail_url} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                    <BookOpen className="h-16 w-16 text-primary" />
                  </div>
                )}
                {/* Overlay badges */}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
                    {course.subject}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  {course.is_free ? (
                    <Badge variant="outline" className="text-green-600 border-green-200 bg-background/90 backdrop-blur-sm">
                      Free
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                      ₹{course.price}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Course Info */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{course.title}</h1>
                  <p className="text-lg text-muted-foreground">{course.description}</p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{Math.floor(getTotalDuration() / 60)}h {getTotalDuration() % 60}m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span>{getTotalLessons()} lessons</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{course.user_enrollments?.[0]?.count || 0} students</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>4.8 (124 reviews)</span>
                  </div>
                </div>

                {/* Progress Bar for enrolled users */}
                {enrollment && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Progress</span>
                      <span className="font-medium">{enrollment.progress_percentage}%</span>
                    </div>
                    <Progress value={enrollment.progress_percentage} className="h-2" />
                  </div>
                )}
              </div>
            </div>

            {/* Course Modules */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Course Content</h2>
              <div className="space-y-3">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id} className="overflow-hidden">
                    <Collapsible 
                      open={openModules.has(module.id)}
                      onOpenChange={() => toggleModule(module.id)}
                    >
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-2">
                                {openModules.has(module.id) ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronRight className="h-4 w-4" />
                                )}
                                <span className="text-sm font-medium text-muted-foreground">
                                  Module {moduleIndex + 1}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <CardTitle className="text-lg">{module.title}</CardTitle>
                                <CardDescription>{module.description}</CardDescription>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{module.estimated_duration}m</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />
                                <span>{module.lessons.length} lessons</span>
                              </div>
                              {module.is_preview && (
                                <Badge variant="outline" className="text-green-600 border-green-200">
                                  Preview
                                </Badge>
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const lessonUrl = `/courses/${courseId}/lesson/${lesson.id}`;
                              const content = (
                                <div 
                                  className={`flex items-center justify-between p-3 rounded-lg border ${
                                    canAccessLesson(lesson, module) 
                                      ? 'hover:bg-muted/50 cursor-pointer' 
                                      : 'opacity-60'
                                  }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                      {canAccessLesson(lesson, module) ? (
                                        <Play className="h-4 w-4" />
                                      ) : (
                                        <Lock className="h-4 w-4" />
                                      )}
                                    </div>
                                    <div className="space-y-1">
                                      <p className="font-medium">{lesson.title}</p>
                                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="capitalize">{lesson.lesson_type}</span>
                                        <div className="flex items-center gap-1">
                                          <Clock className="h-3 w-3" />
                                          <span>{lesson.estimated_duration}m</span>
                                        </div>
                                        {lesson.is_preview && (
                                          <Badge variant="outline" className="text-xs">Preview</Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {canAccessLesson(lesson, module) && (
                                    <Button variant="ghost" size="sm">
                                      <Play className="h-4 w-4" />
                                    </Button>
                                  )}
                                </div>
                              );
                              return canAccessLesson(lesson, module) ? (
                                <Link key={lesson.id} href={lessonUrl}>
                                  {content}
                                </Link>
                              ) : (
                                <div key={lesson.id}>{content}</div>
                              );
                            })}
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enrollment Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {enrollment ? 'Continue Learning' : 'Start Learning'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {course.is_free ? (
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">Free</div>
                    <p className="text-sm text-muted-foreground">No cost to enroll</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-3xl font-bold">₹{course.price}</div>
                    <p className="text-sm text-muted-foreground">One-time payment</p>
                  </div>
                )}

                {enrollment ? (
                  <Button className="w-full" size="lg">
                    <Play className="h-4 w-4 mr-2" />
                    Continue Course
                  </Button>
                ) : (
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={handleEnroll}
                    disabled={isEnrolling || !user}
                  >
                    {isEnrolling ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Enrolling...
                      </>
                    ) : !user ? (
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
                )}

                {course.preview_enabled && !enrollment && (
                  <Button variant="outline" className="w-full">
                    <Play className="h-4 w-4 mr-2" />
                    Preview Course
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Course Features */}
            <Card>
              <CardHeader>
                <CardTitle>What you'll get</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <span className="text-sm">{getTotalLessons()} comprehensive lessons</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="text-sm">{Math.floor(getTotalDuration() / 60)}+ hours of content</span>
                </div>
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span className="text-sm">Downloadable resources</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="h-5 w-5 text-primary" />
                  <span className="text-sm">Certificate of completion</span>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <span className="text-sm">Lifetime access</span>
                </div>
              </CardContent>
            </Card>

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle>Instructor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">EDUMYNT Team</p>
                    <p className="text-sm text-muted-foreground">Expert Educators</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Our team of experienced educators and subject matter experts have designed this course to help you succeed in your learning journey.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function CourseDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Image */}
          <Skeleton className="aspect-video w-full rounded-lg" />
          
          {/* Course Info */}
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Modules */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-4 w-4" />
                      <div className="space-y-2">
                        <Skeleton className="h-5 w-48" />
                        <Skeleton className="h-4 w-64" />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Skeleton className="h-4 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mx-auto" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-8 w-24 mx-auto" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}