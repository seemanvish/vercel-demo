
import { client } from '../../../lib/contentful'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import DOMPurify from 'isomorphic-dompurify'

import '../blog.css'

export const revalidate = 10

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// Optional: generate SEO metadata
export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const response = await client.getEntries({
    content_type: 'blog',
    'fields.slug': slug,
    limit: 1,
  })

  const blog = response.items[0]

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  const fields = blog.fields as any

  return {
    title: fields.title || 'Blog',
    description: fields.introContent || '',
  }
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  // Get slug from URL
  const { slug } = await params

  console.log('Requested slug:', slug)

  // Fetch blog from Contentful
  const response = await client.getEntries({
    content_type: 'blog',
    'fields.slug': slug,
    limit: 1,
  })

  console.log(
    'Contentful results:',
    response.items.map((item: any) => ({
      id: item.sys.id,
      slug: item.fields.slug,
      title: item.fields.title,
    }))
  )

  // Get first matching blog
  const blog = response.items[0]

  // Show Next.js 404 if blog doesn't exist
  if (!blog) {
    notFound()
  }

  const fields = blog.fields as any

  /*
   * Contentful Rich Text
   *
   * The description field may contain Contentful Rich Text.
   * Convert the text nodes to HTML.
   */
  const htmlContent = fields.description

  const html =
    htmlContent?.content
      ?.map((block: any) => {
        return (
          block.content
            ?.map((item: any) => {
              return item.value || ''
            })
            .join('') || ''
        )
      })
      .join('') || ''

  // Sanitize generated HTML before rendering
  const cleanHtml = DOMPurify.sanitize(html)

  return (
    <main className="page">
      {/* =========================
          HERO SECTION
      ========================== */}
      <section className="hero">
        <div className="gold-lines" />

        <div className="hero-content">
          {/* Breadcrumbs */}
          <div className="breadcrumbs">
            <span>Home</span>
            <span>›</span>
            <span>Blog</span>
            <span>›</span>
            <span>{fields.title}</span>
          </div>

          {/* Hero Grid */}
          <div className="hero-grid">
            {/* Hero Content */}
            <div className="hero-copy">
              <h1>{fields.title}</h1>

              {fields.introContent && (
                <p className="hero-description">
                  {fields.introContent}
                </p>
              )}
            </div>

            {/* Hero Image */}
            <div className="hero-image-wrapper">
              {fields.bannerImage?.fields?.file?.url && (
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

      {/* =========================
          ARTICLE SECTION
      ========================== */}
      <section className="article-section">
        <article className="blog-description">
          {cleanHtml && (
            <div
              className="blog-description"
              dangerouslySetInnerHTML={{
                __html: cleanHtml,
              }}
            />
          )}
        </article>
      </section>
    </main>
  )
}

