import { client } from '../../../lib/contentful'
import { notFound } from 'next/navigation'
import Link from 'next/link'
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

  // =========================
  // BLOG AUTHOR
  // =========================
  const authorName =
    fields.author?.fields?.name ||
    fields.author?.fields?.title ||
    fields.authorName ||
    ''

  // =========================
  // BLOG DATE
  // =========================
  let formattedDate = ''

  if (fields.date) {
    const date = new Date(fields.date)

    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    }
  }

  // =========================
  // BANNER IMAGE
  // =========================
  const bannerImageUrl =
    fields.bannerImage?.fields?.file?.url || ''

  const bannerImageAlt =
    fields.bannerImage?.fields?.title ||
    fields.title ||
    'Blog banner'

  return (
    <main className="page">

      {/* =========================================
          HERO SECTION
      ========================================== */}
      <section className="hero">

        {/* Decorative gold lines */}
        <div className="gold-lines" />

        <div className="hero-content">

          {/* =========================================
              BREADCRUMBS
          ========================================== */}
          <nav
            className="breadcrumbs"
            aria-label="Breadcrumb"
          >
            <Link href="/">
              Home
            </Link>

            <span className="breadcrumb-arrow">
              ›
            </span>

            <Link href="/company/blog">
              Blog
            </Link>

            <span className="breadcrumb-arrow">
              ›
            </span>

            <span className="breadcrumb-current">
              {fields.title}
            </span>
          </nav>

          {/* =========================================
              HERO GRID
          ========================================== */}
          <div className="hero-grid">

            {/* =========================================
                HERO COPY
            ========================================== */}
            <div className="hero-copy">

              <h1>
                {fields.title}
              </h1>

              {fields.introContent && (
                <p className="hero-description">
                  {fields.introContent}
                </p>
              )}

              {/* =========================================
                  BLOG META
              ========================================== */}
              {(authorName ||
                formattedDate ||
                fields.readTime) && (
                <div className="blog-meta">

                  {/* AUTHOR */}
                  {authorName && (
                    <div className="blog-meta-item">

                      <span className="meta-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="7"
                            r="4"
                          />

                          <path
                            d="M4 21C4.8 16.8 7.5 14 12 14C16.5 14 19.2 16.8 20 21"
                          />
                        </svg>
                      </span>

                      <span>
                        {authorName}
                      </span>

                    </div>
                  )}

                  {/* DATE */}
                  {formattedDate && (
                    <div className="blog-meta-item">

                      <span className="meta-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <rect
                            x="3"
                            y="5"
                            width="18"
                            height="16"
                            rx="2"
                          />

                          <path d="M16 3V7" />

                          <path d="M8 3V7" />

                          <path d="M3 10H21" />
                        </svg>
                      </span>

                      <span>
                        {formattedDate}
                      </span>

                    </div>
                  )}

                  {/* READING TIME */}
                  {fields.readTime && (
                    <div className="blog-meta-item">

                      <span className="meta-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                          />

                          <path d="M12 7V12L15 14" />
                        </svg>
                      </span>

                      <span>
                        {fields.readTime}
                      </span>

                    </div>
                  )}

                </div>
              )}

            </div>

            {/* =========================================
                HERO IMAGE
            ========================================== */}
            <div className="hero-image-wrapper">

              {bannerImageUrl && (
                <img
                  src={`https:${bannerImageUrl}`}
                  alt={bannerImageAlt}
                  className="blog-featured-image"
                />
              )}

            </div>

          </div>

        </div>
      </section>

      {/* =========================================
          ARTICLE SECTION
      ========================================== */}
      <section className="article-section">

        <article className="blog-description">

          {fields.description && (
            <div
              dangerouslySetInnerHTML={{
                __html: fields.description,
              }}
            />
          )}

        </article>

      </section>

    </main>
  )
}