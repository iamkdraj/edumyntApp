import DOMPurify from 'dompurify';

export function HtmlBlock({ data }: { data: { html: string } }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(data.html) }} />;
} 