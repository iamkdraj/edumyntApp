"use client";

import React, { useState } from 'react';

export function MCQBlock({ data }: { data: { question: string, options: string[], correct: number } }) {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div className="my-4 p-4 border rounded">
      <div className="font-medium mb-2">{data.question}</div>
      {data.options.map((opt, i) => (
        <button
          key={i}
          className={`block w-full text-left p-2 rounded ${selected === i ? (i === data.correct ? 'bg-green-100' : 'bg-red-100') : 'hover:bg-muted'}`}
          onClick={() => setSelected(i)}
        >
          {opt}
        </button>
      ))}
      {selected !== null && (
        <div className="mt-2 text-sm">
          {selected === data.correct ? 'Correct!' : 'Try again.'}
        </div>
      )}
    </div>
  );
} 