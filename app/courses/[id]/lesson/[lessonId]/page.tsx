import { db } from '@/lib/supabase/database';
import { LessonRenderer } from '@/components/LessonRenderer';

// Demo JSON with all block types (for fallback/testing)
const demoLesson = {
  title: 'Demo Lesson: All Block Types',
  content: {
    blocks: [
      { id: '1', type: 'heading', data: { level: 1, text: 'Welcome to the Demo Lesson' } },
      { id: '2', type: 'text', data: { content: 'This is a **markdown** text block. You can use _formatting_ and lists:\n- Item 1\n- Item 2' } },
      { id: '3', type: 'image', data: { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb', alt: 'Nature', caption: 'A beautiful nature scene' } },
      { id: '4', type: 'video', data: { url: 'https://www.w3schools.com/html/mov_bbb.mp4', title: 'Sample Video' } },
      { id: '5', type: 'html', data: { html: '<div style=\"color:blue;font-weight:bold\">This is a custom HTML block!</div>' } },
      { id: '6', type: 'mcq', data: { question: 'What is 2 + 2?', options: ['3', '4', '5'], correct: 1 } },
    ]
  }
};

export default async function CourseLessonPage({ params }: { params: { id: string; lessonId: string } }) {
  // Await the params object before destructuring in Next.js 15+
  const { lessonId } = await params;
  console.log('Rendering lesson page with ID:', lessonId);
  
  let lesson;
  try {
    console.log('Fetching lesson data...');
    lesson = await db.getLesson(lessonId);
    console.log('Lesson data received:', {
      id: lesson?.id,
      title: lesson?.title,
      hasContent: !!lesson?.content,
      contentKeys: lesson?.content ? Object.keys(lesson.content) : []
    });
  } catch (e) {
    console.error('Error fetching lesson:', e);
    lesson = null;
  }
  
  // Determine which content to use
  const blocks = lesson?.content?.blocks || demoLesson.content.blocks;
  const title = lesson?.title || demoLesson.title;
  
  console.log('Rendering with blocks:', {
    source: lesson?.content ? 'database' : 'demo',
    blockCount: blocks.length,
    blockTypes: blocks.map((b: any) => b.type)
  });

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      {!lesson?.content && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Showing demo content as no lesson content was found in the database.
              </p>
            </div>
          </div>
        </div>
      )}
      <LessonRenderer blocks={blocks} />
      
      {/* Debug information (visible in development) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg text-sm text-gray-600">
          <h3 className="font-medium mb-2">Debug Information</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({
              lessonId,
              hasLessonData: !!lesson,
              lessonTitle: lesson?.title,
              hasContent: !!lesson?.content,
              contentKeys: lesson?.content ? Object.keys(lesson.content) : [],
              blocksSource: lesson?.content ? 'database' : 'demo',
              blockCount: blocks.length,
              blockTypes: blocks.map((b: any) => b.type)
            }, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}