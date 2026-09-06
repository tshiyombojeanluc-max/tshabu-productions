export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // Escaping "<" prevents a value containing "</script>" (e.g. a gallery
  // title or description, which now comes from the database and is
  // editable through the dashboard) from prematurely closing this script
  // tag and getting the rest of its content parsed as real, executing
  // HTML/JS. < is a plain JSON string escape — identical content to
  // any JSON-LD consumer, invisible to search engines.
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
