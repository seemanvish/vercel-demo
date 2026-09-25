import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DOMPurify from 'isomorphic-dompurify';

import "../blog.css";

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
console.log(response);
  const blog = response.items[0]

  if (!blog) {
    notFound()
  }
console.log(blog);
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
   <main className="page">
      {/* Hero */}
      <section className="hero">
        <div className="gold-lines" />

        <div className="hero-content">
          <div className="breadcrumbs">
            <span>Home</span>
            <span>›</span>
            <span>Blog</span>
            <span>›</span>
            <span>{fields.title}</span>
          </div>

          <div className="hero-grid">
            <div className="hero-copy">
              <h1>
                {fields.title}
              </h1>

              <p className="hero-description">
                {fields.introContent}
              </p>

              
            </div>

            <div className="hero-image-wrapper">
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

              
            </div>
          </div>
        </div>
      </section>

      {/* Article */}
      <section className="article-section">

        <article className="blog-description">
          <div
              className="blog-description"
              dangerouslySetInnerHTML={{
                __html: cleanHtml,
              }}
            />
        </article>
      </section>
    </main>
  )
}