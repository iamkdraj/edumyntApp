'use client';

import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BookOpen, 
  Clock, 
  Trophy, 
  Target, 
  ArrowRight, 
  Play, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Users,
  Star
} from 'lucide-react';
import { db } from '@/lib/supabase/database';
import { getCurrentUser } from '@/lib/auth/auth-helpers';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '@/components/ui/carousel';

interface Course {
  id: string;
  title: string;
  description: string;
  subject: string;
  thumbnail_url: string | null;
  is_free: boolean;
  price: number;
  lessons?: { count: number }[];
  user_enrollments?: { count: number }[];
}

interface UserEnrollment {
  course_id: string;
  progress_percentage: number;
  enrolled_at: string;
  courses: Course;
}

interface Test {
  id: string;
  title: string;
  description: string;
  test_type: string;
  time_limit: number | null;
  total_questions: number;
  course_id: string;
  courses?: Course;
}

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<UserEnrollment[]>([]);
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Get current user
      const currentUser = await getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        // Load user's enrolled courses with progress
        const enrollmentsData = await db.getUserEnrollments(currentUser.id);
        setEnrolledCourses(enrollmentsData || []);
      }

      // Load all published courses
      const coursesData = await db.getCourses();
      setAllCourses(coursesData || []);

      // Load available tests
      const testsData = await db.getTests();
      setTests(testsData || []);

    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const continueCourses = enrolledCourses.filter(enrollment => 
    enrollment.progress_percentage > 0 && enrollment.progress_percentage < 100
  );

  // Recently visited: sort enrolledCourses by enrolled_at descending
  const recentlyVisitedCourses = [...enrolledCourses]
    .sort((a, b) => new Date(b.enrolled_at).getTime() - new Date(a.enrolled_at).getTime())
    .slice(0, 8); // Show up to 8

  const recommendedCourses = allCourses.filter(course => 
    !enrolledCourses.some(enrollment => enrollment.course_id === course.id)
  ).slice(0, 6);

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex-1 space-y-6 p-4 md:p-6">
          <DashboardSkeleton />
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ''}!
          </h1>
          <p className="text-muted-foreground">
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        {/* Recently Visited Courses Carousel */}
        {recentlyVisitedCourses.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recently Visited Courses</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel opts={{ align: 'start', slidesToScroll: 1 }} className="-mx-2">
              <CarouselContent className="pl-2">
                {recentlyVisitedCourses.map((enrollment) => (
                  <CarouselItem key={enrollment.course_id} className="basis-[85%] md:basis-[45%] lg:basis-[30%] pr-4">
                    <CourseCard course={enrollment.courses} progress={enrollment.progress_percentage} type="continue" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* Continue Courses Carousel */}
        {continueCourses.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Continue Courses</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel opts={{ align: 'start', slidesToScroll: 1 }} className="-mx-2">
              <CarouselContent className="pl-2">
                {continueCourses.map((enrollment) => (
                  <CarouselItem key={enrollment.course_id} className="basis-[85%] md:basis-[45%] lg:basis-[30%] pr-4">
                    <CourseCard course={enrollment.courses} progress={enrollment.progress_percentage} type="continue" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* All Courses Carousel */}
        {allCourses.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Courses</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  Browse All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel opts={{ align: 'start', slidesToScroll: 1 }} className="-mx-2">
              <CarouselContent className="pl-2">
                {allCourses.map((course) => (
                  <CarouselItem key={course.id} className="basis-[85%] md:basis-[45%] lg:basis-[30%] pr-4">
                    <CourseCard course={course} type="all" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* All Tests Carousel */}
        {tests.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">All Tests</h2>
              <Link href="/tests">
                <Button variant="ghost" size="sm">
                  View All Tests
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel opts={{ align: 'start', slidesToScroll: 1 }} className="-mx-2">
              <CarouselContent className="pl-2">
                {tests.map((test) => (
                  <CarouselItem key={test.id} className="basis-[85%] md:basis-[45%] lg:basis-[30%] pr-4">
                    <TestCard test={test} />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Courses Enrolled
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses.length}</div>
              <p className="text-xs text-muted-foreground">
                Active learning paths
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Study Streak
              </CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">7</div>
              <p className="text-xs text-muted-foreground">
                days in a row
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Time Studied
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12h</div>
              <p className="text-xs text-muted-foreground">
                this week
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Tests Completed
              </CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                avg score: 85%
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recommended Courses Carousel */}
        {recommendedCourses.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Recommended Courses</h2>
              <Link href="/courses">
                <Button variant="ghost" size="sm">
                  Browse All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <Carousel opts={{ align: 'start', slidesToScroll: 1 }} className="-mx-2">
              <CarouselContent className="pl-2">
                {recommendedCourses.map((course) => (
                  <CarouselItem key={course.id} className="basis-[85%] md:basis-[45%] lg:basis-[30%] pr-4">
                    <CourseCard course={course} type="recommended" />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </section>
        )}

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/courses">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <BookOpen className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">Browse Courses</h3>
                    <p className="text-sm text-muted-foreground">
                      Explore new courses and subjects
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tests">
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="text-center space-y-2">
                    <Trophy className="h-8 w-8 mx-auto text-primary" />
                    <h3 className="font-medium">Take a Test</h3>
                    <p className="text-sm text-muted-foreground">
                      Practice with mock tests
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="text-center space-y-2">
                  <Target className="h-8 w-8 mx-auto text-primary" />
                  <h3 className="font-medium">Daily Practice</h3>
                  <p className="text-sm text-muted-foreground">
                    Quick daily questions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

// CourseCard component for both carousels
function CourseCard({ course, progress, type }: { course: any, progress?: number, type: 'continue' | 'all' | 'recommended' }) {
  return (
    <Card className="flex-shrink-0 w-80 hover:shadow-lg transition-all duration-200 overflow-hidden">
      <CardHeader className="space-y-4 p-0">
        {/* Course Image */}
        <div className="aspect-video relative overflow-hidden">
          {course.thumbnail_url ? (
            <img 
              src={course.thumbnail_url} 
              alt={course.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-primary" />
            </div>
          )}
          {/* Overlay with subject badge */}
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="text-xs bg-background/90 backdrop-blur-sm">
              {course.subject}
            </Badge>
          </div>
          {/* Price badge */}
          <div className="absolute top-3 right-3">
            {course.is_free ? (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-background/90 backdrop-blur-sm">
                Free
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-background/90 backdrop-blur-sm">
                ${course.price}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-2 p-4 pb-0">
          <CardTitle className="text-lg leading-tight line-clamp-2">
            {course.title}
          </CardTitle>
          <CardDescription className="text-sm line-clamp-2">
            {course.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{course.lessons?.[0]?.count || 0} lessons</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{course.user_enrollments?.[0]?.count || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.8</span>
          </div>
        </div>
        {type === 'continue' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}
        <Button className="w-full" size="sm">
          {type === 'continue' ? (
            <>
              <Play className="h-4 w-4 mr-2" />
              Continue Learning
            </>
          ) : type === 'recommended' ? (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              View Course
            </>
          ) : (
            <>
              <BookOpen className="h-4 w-4 mr-2" />
              View Course
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}

// TestCard component for tests carousel
function TestCard({ test }: { test: any }) {
  return (
    <Card className="flex-shrink-0 w-80 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="capitalize">
            {test.test_type.replace('_', ' ')}
          </Badge>
          {test.time_limit && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{test.time_limit}m</span>
            </div>
          )}
        </div>
        <CardTitle className="text-lg leading-tight line-clamp-2 mt-2">
          {test.title}
        </CardTitle>
        <CardDescription className="text-sm line-clamp-2">
          {test.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileText className="h-4 w-4" />
            <span>{test.total_questions} questions</span>
          </div>
          {test.courses && (
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />
              <span>{test.courses.title}</span>
            </div>
          )}
        </div>
        <Button className="w-full" size="sm">
          <Play className="h-4 w-4 mr-2" />
          Start Test
        </Button>
      </CardContent>
    </Card>
  );
}

// Dashboard Skeleton Component
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Welcome Section Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Continue Learning Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-8 w-20" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-shrink-0 w-80">
              <CardHeader className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-8 mb-1" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommended Courses Skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-8 w-24" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex-shrink-0 w-80">
              <CardHeader className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-12" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}