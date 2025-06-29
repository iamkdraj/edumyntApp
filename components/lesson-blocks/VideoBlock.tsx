import React from 'react';

export function VideoBlock({ data }: { data: { url: string, title?: string } }) {
  return (
    <div className="aspect-video my-4">
      <video controls src={data.url} title={data.title} className="w-full h-full rounded" />
    </div>
  );
} 