
import { notFound } from "next/navigation";
import { contentfulClient } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  const response = await contentfulClient.getEntries({
    content_type: "blog",
    "fields.slug": slug,
    limit: 1,
  });

  const blog = response.items[0];

  if (!blog) {
    notFound();
  }

  return (
    <main className="blog-detail">

      <header className="blog-detail-header">
        <h1>{blog.fields.title as string}</h1>
      </header>

      <article className="blog-content">
        {blog.fields.content && (
          <pre>
            {JSON.stringify(blog.fields.content, null, 2)}
          </pre>
        )}
      </article>

    </main>
  );
}

