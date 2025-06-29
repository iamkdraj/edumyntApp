import React from 'react';
import ReactMarkdown from 'react-markdown';

export function TextBlock({ data }: { data: { content: string } }) {
  return <div className="prose max-w-none"><ReactMarkdown>{data.content}</ReactMarkdown></div>;
} 