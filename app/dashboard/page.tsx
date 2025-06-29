'use client';

import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Clock, Trophy, Target, ArrowRight, Play, FileText } from 'lucide-react';

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Welcome back!</h1>
          <p className="text-muted-foreground">
            Continue your learning journey and achieve your goals.
          </p>
        </div>

        {/* Resume Learning */}
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-5 w-5 text-primary" />
                  Continue Learning
                </CardTitle>
                <CardDescription>
                  Pick up where you left off
                </CardDescription>
              </div>
              <Badge variant="secondary">In Progress</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">English Grammar Fundamentals</span>
                <span className="text-muted-foreground">75% complete</span>
              </div>
              <Progress value={75} className="h-2" />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                Last lesson: Understanding Verbs
              </div>
              <Button size="sm">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

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
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">
                +1 from last month
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

        {/* Your Courses */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">English Grammar Fundamentals</CardTitle>
                  <Badge variant="outline">English</Badge>
                </div>
                <CardDescription>
                  Master the basics of English grammar with comprehensive lessons.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>75%</span>
                  </div>
                  <Progress value={75} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Continue Learning
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Educational Psychology Basics</CardTitle>
                  <Badge variant="outline">Psychology</Badge>
                </div>
                <CardDescription>
                  Understanding learning theories and cognitive development.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Progress</span>
                    <span>25%</span>
                  </div>
                  <Progress value={25} />
                </div>
                <div className="flex gap-2">
                  <Button size="sm" className="flex-1">
                    Continue Learning
                  </Button>
                  <Button size="sm" variant="outline">
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-3">
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