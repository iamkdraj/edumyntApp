import React from 'react';
import { TextBlock } from './lesson-blocks/TextBlock';
import { HtmlBlock } from './lesson-blocks/HtmlBlock';
import { HeadingBlock } from './lesson-blocks/HeadingBlock';
import { ImageBlock } from './lesson-blocks/ImageBlock';
import { VideoBlock } from './lesson-blocks/VideoBlock';
import { MCQBlock } from './lesson-blocks/MCQBlock';
// Add more imports as you add more block types

const blockMap: Record<string, React.FC<{ data: any }>> = {
  text: TextBlock,
  html: HtmlBlock,
  heading: HeadingBlock,
  image: ImageBlock,
  video: VideoBlock,
  mcq: MCQBlock,
  // Add more mappings as you add more block types
};

export function LessonRenderer({ blocks }: { blocks: any[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block) => {
        const BlockComponent = blockMap[block.type];
        if (!BlockComponent) return <div key={block.id}>Unknown block type: {block.type}</div>;
        return <BlockComponent key={block.id} data={block.data} />;
      })}
    </div>
  );
} 