
import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

import '../blog.css'

export const revalidate = 10

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

// =========================
// SEO METADATA
// =========================
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

// =========================
// BLOG DETAIL PAGE
// =========================
export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  console.log('==============================')
  console.log('BLOG REQUEST')
  console.log('Slug:', slug)
  // =========================
  // FETCH BLOG FROM CONTENTFUL
  // =========================
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

  // =========================
  // GET BLOG
  // =========================
  const blog = response.items[0]

  if (!blog) {
    console.log('Blog not found:', slug)
    notFound()
  }

  const fields = blog.fields as any

  console.log('Blog found:', {
    title: fields.title,
    slug: fields.slug,
  })

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
          {fields.description && (
            <div className="blog-description">
              {documentToReactComponents(fields.description)}
            </div>
          )}
        </article>
      </section>
    </main>
  )
}

