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
  let lesson;
  try {
    lesson = await db.getLesson(lessonId);
  } catch (e) {
    lesson = null;
  }
  const blocks = lesson?.content?.blocks || demoLesson.content.blocks;
  const title = lesson?.title || demoLesson.title;
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <LessonRenderer blocks={blocks} />
    </div>
  );
} 