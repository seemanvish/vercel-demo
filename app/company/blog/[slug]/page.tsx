import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DOMPurify from 'isomorphic-dompurify';

export const revalidate = 10

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  const response = await client.getEntries({
    content_type: 'blog',
    'fields.slug': slug,
    limit: 1,
  })

  const blog = response.items[0]

  if (!blog) {
    notFound()
  }

  const fields = blog.fields as any
const htmlContent = fields.description;

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
    <main>
      <h1>Blog</h1>

      <article>
        {fields.bannerImage && (
          <img
            src={`https:${fields.bannerImage.fields.file.url}`}
            alt={
              fields.bannerImage.fields.title ||
              fields.title ||
              'Blog banner'
            }
            className="blog-featured-image"
          />
        )}

        <h2>{fields.title}</h2>

        <div
              className="blog-description"
              dangerouslySetInnerHTML={{
                __html: cleanHtml,
              }}
            />
      </article>
    </main>
  )
}