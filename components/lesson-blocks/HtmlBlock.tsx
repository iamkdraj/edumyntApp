"use client";

import React, { useEffect, useState } from 'react';

export function HtmlBlock({ data }: { data: { html: string } }) {
  const [sanitized, setSanitized] = useState('');

  useEffect(() => {
    let isMounted = true;
    import('dompurify').then((DOMPurify) => {
      // Some environments require .default, others work directly
      const purify = DOMPurify.default || DOMPurify;
      if (isMounted) {
        setSanitized(purify.sanitize(data.html));
      }
    });
    return () => { isMounted = false; };
  }, [data.html]);

  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
} 