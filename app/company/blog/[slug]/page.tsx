

import { client } from '../../../lib/contentful'

import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

export const revalidate = 10
interface BlogDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params;

  const response = await client.getEntries({
    content_type: "blog",
    "fields.slug": slug,
    limit: 1,
  });

  const blog = response.items[0];

  if (!blog) {
    notFound();
  }

  return (
    <main>
      <h1>Blog</h1>

      {blogs.map((blog: any) => {
        const htmlContent = blog.fields.descrption;

        // Extract HTML from Contentful Rich Text text nodes
        const html = htmlContent?.content
          ?.map((block: any) =>
            block.content
              ?.map((item: any) => item.value || '')
              .join('')
          )
          .join('');

        const cleanHtml = DOMPurify.sanitize(html || '');

        return (
          <article key={blog.sys.id}>
            {blog.fields.bannerImage && (
                <img
                    src={`https:${blog.fields.bannerImage.fields.file.url}`}
                    alt={blog.fields.bannerImage.fields.title || blog.title}
                    className="blog-featured-image"
                />
                )}
            <h2>{blog.fields.title}</h2>

            <div
              className="blog-description"
              dangerouslySetInnerHTML={{
                __html: cleanHtml,
              }}
            />
          </article>
        );
      })}
    </main>
  );
}

