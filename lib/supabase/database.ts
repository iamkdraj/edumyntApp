import { createClient } from './client'
import { Database } from './types'

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

// Helper functions for common database operations
export class DatabaseService {
  private supabase = createClient()

  // Profile operations
  async getProfile(userId: string) {
    const { data, error } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  }

  async insertProfile(profileData: Partial<Tables<'profiles'>>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async updateProfile(userId: string, updates: Partial<Tables<'profiles'>>) {
    const { data, error } = await this.supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  // Course operations
  async getCourses(filters?: { subject?: string; status?: string }) {
    let query = this.supabase
      .from('courses')
      .select(`
        *,
        lessons(count),
        user_enrollments(count)
      `)
      .eq('status', 'published')

    if (filters?.subject) {
      query = query.eq('subject', filters.subject)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async getCourse(courseId: string) {
    const { data, error } = await this.supabase
      .from('courses')
      .select(`
        *,
        lessons(*),
        tests(*),
        notes(*)
      `)
      .eq('id', courseId)
      .single()
    
    if (error) throw error
    return data
  }

  // Course modules operations
  async getCourseModules(courseId: string) {
    const { data, error } = await this.supabase
      .from('course_modules')
      .select(`
        *,
        lessons(*)
      `)
      .eq('course_id', courseId)
      .order('order_index')
    
    if (error) throw error
    return data
  }

  async getModule(moduleId: string) {
    const { data, error } = await this.supabase
      .from('course_modules')
      .select(`
        *,
        lessons(*),
        courses(*)
      `)
      .eq('id', moduleId)
      .single()
    
    if (error) throw error
    return data
  }

  // Enrollment operations
  async enrollInCourse(userId: string, courseId: string) {
    const { data, error } = await this.supabase
      .from('user_enrollments')
      .insert({
        user_id: userId,
        course_id: courseId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserEnrollments(userId: string) {
    const { data, error } = await this.supabase
      .from('user_enrollments')
      .select(`
        *,
        courses(*)
      `)
      .eq('user_id', userId)
    
    if (error) throw error
    return data
  }

  async isUserEnrolled(userId: string, courseId: string) {
    const { data, error } = await this.supabase
      .from('user_enrollments')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .single()
    
    return { enrolled: !!data, error }
  }

  // Lesson operations
  async getLessons(courseId: string) {
    const { data, error } = await this.supabase
      .from('lessons')
      .select('*')
      .eq('course_id', courseId)
      .order('order_index')
    
    if (error) throw error
    return data
  }

  async getLesson(lessonId: string) {
    const { data, error } = await this.supabase
      .from('lessons')
      .select(`
        *,
        courses(*),
        notes(*),
        course_modules(*)
      `)
      .eq('id', lessonId)
      .single()
    
    if (error) throw error
    return data
  }

  // Progress tracking
  async updateLessonProgress(userId: string, lessonId: string, updates: Partial<Tables<'lesson_progress'>>) {
    const { data, error } = await this.supabase
      .from('lesson_progress')
      .upsert({
        user_id: userId,
        lesson_id: lessonId,
        ...updates
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getLessonProgress(userId: string, lessonId: string) {
    const { data, error } = await this.supabase
      .from('lesson_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()
    
    return { data, error }
  }

  async getCourseProgress(userId: string, courseId: string) {
    const { data, error } = await this.supabase
      .from('lesson_progress')
      .select(`
        *,
        lessons!inner(course_id)
      `)
      .eq('user_id', userId)
      .eq('lessons.course_id', courseId)
    
    if (error) throw error
    return data
  }

  // Test operations
  async getTests(courseId?: string, testType?: string) {
    let query = this.supabase
      .from('tests')
      .select(`
        *,
        questions(count),
        courses(*)
      `)

    if (courseId) {
      query = query.eq('course_id', courseId)
    }

    if (testType) {
      query = query.eq('test_type', testType)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async getTest(testId: string) {
    const { data, error } = await this.supabase
      .from('tests')
      .select(`
        *,
        questions(*),
        courses(*)
      `)
      .eq('id', testId)
      .single()
    
    if (error) throw error
    return data
  }

  // Test attempt operations
  async createTestAttempt(userId: string, testId: string, totalQuestions: number) {
    const { data, error } = await this.supabase
      .from('test_attempts')
      .insert({
        user_id: userId,
        test_id: testId,
        total_questions: totalQuestions
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async submitTestAttempt(attemptId: string, updates: Partial<Tables<'test_attempts'>>) {
    const { data, error } = await this.supabase
      .from('test_attempts')
      .update({
        ...updates,
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('id', attemptId)
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async saveUserAnswer(attemptId: string, questionId: string, userAnswer: any, isCorrect: boolean, timeTaken?: number) {
    const { data, error } = await this.supabase
      .from('user_answers')
      .upsert({
        attempt_id: attemptId,
        question_id: questionId,
        user_answer: userAnswer,
        is_correct: isCorrect,
        time_taken: timeTaken
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getTestAttempts(userId: string, testId?: string) {
    let query = this.supabase
      .from('test_attempts')
      .select(`
        *,
        tests(*),
        user_answers(*)
      `)
      .eq('user_id', userId)

    if (testId) {
      query = query.eq('test_id', testId)
    }

    const { data, error } = await query.order('started_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Bookmark operations
  async toggleBookmark(userId: string, lessonId: string, note?: string) {
    // Check if bookmark exists
    const { data: existing } = await this.supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('lesson_id', lessonId)
      .single()

    if (existing) {
      // Remove bookmark
      const { error } = await this.supabase
        .from('bookmarks')
        .delete()
        .eq('id', existing.id)
      
      if (error) throw error
      return { bookmarked: false }
    } else {
      // Add bookmark
      const { data, error } = await this.supabase
        .from('bookmarks')
        .insert({
          user_id: userId,
          lesson_id: lessonId,
          note
        })
        .select()
        .single()
      
      if (error) throw error
      return { bookmarked: true, data }
    }
  }

  async getUserBookmarks(userId: string) {
    const { data, error } = await this.supabase
      .from('bookmarks')
      .select(`
        *,
        lessons(*, courses(*))
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  // Discussion operations
  async createDiscussion(userId: string, content: string, lessonId?: string, questionId?: string, title?: string) {
    const { data, error } = await this.supabase
      .from('discussions')
      .insert({
        user_id: userId,
        content,
        lesson_id: lessonId,
        question_id: questionId,
        title
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getDiscussions(lessonId?: string, questionId?: string) {
    let query = this.supabase
      .from('discussions')
      .select(`
        *,
        profiles(username, avatar_url),
        discussion_replies(count)
      `)

    if (lessonId) {
      query = query.eq('lesson_id', lessonId)
    }

    if (questionId) {
      query = query.eq('question_id', questionId)
    }

    const { data, error } = await query.order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  }

  async getDiscussionReplies(discussionId: string) {
    const { data, error } = await this.supabase
      .from('discussion_replies')
      .select(`
        *,
        profiles(username, avatar_url)
      `)
      .eq('discussion_id', discussionId)
      .order('created_at', { ascending: true })
    
    if (error) throw error
    return data
  }

  // AI interaction logging
  async logAIInteraction(userId: string, query: string, response: string, interactionType: string = 'general', lessonId?: string, questionId?: string) {
    const { data, error } = await this.supabase
      .from('ai_interactions')
      .insert({
        user_id: userId,
        query,
        response,
        interaction_type: interactionType,
        lesson_id: lessonId,
        question_id: questionId
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  }

  async getUserAIHistory(userId: string, limit: number = 50) {
    const { data, error } = await this.supabase
      .from('ai_interactions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  }
}

export const db = new DatabaseService()