import React from 'react';

export function HeadingBlock({ data }: { data: { level: number, text: string } }) {
  const Tag = `h${data.level}` as keyof JSX.IntrinsicElements;
  return <Tag className={`mt-6 mb-2 font-bold text-${data.level === 1 ? '2xl' : data.level === 2 ? 'xl' : 'lg'}`}>{data.text}</Tag>;
} 