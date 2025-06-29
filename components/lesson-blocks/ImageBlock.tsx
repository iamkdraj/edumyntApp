import React from 'react';

export function ImageBlock({ data }: { data: { url: string, alt?: string, caption?: string } }) {
  return (
    <figure className="my-4">
      <img src={data.url} alt={data.alt || ''} className="rounded shadow" />
      {data.caption && <figcaption className="text-center text-sm text-muted-foreground">{data.caption}</figcaption>}
    </figure>
  );
} 