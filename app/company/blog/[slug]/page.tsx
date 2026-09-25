import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
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
// CONTENTFUL TYPES
// =========================

interface Category {
  sys: {
    id: string
  }
  fields: {
    name: string
    slug?: string
    description?: string
  }
}

interface Author {
  sys: {
    id: string
  }
  fields: {
    name: string
    slug?: string
    shortBiography: string
    authorImage?: {
      fields?: {
        title?: string
        description?: string
        file?: {
          url: string
        }
      }
    }
  }
}

interface Tag {
  sys: {
    id: string
  }
  fields: {
    name: string
    slug?: string
  }
}

interface TableOfContentsItem {
  id: string
  title: string
}

interface BlogFields {
  title: string
  slug: string
  introContent?: string

  bannerImage?: {
    fields?: {
      title?: string
      description?: string
      file?: {
        url: string
      }
    }
  }

  description?: any

  category?: Category
  author?: Author
  tags?: Tag[]

  publishedDate?: string

  tableOfContents?: TableOfContentsItem[]
}

// =========================
// CONTENTFUL FETCH
// =========================

async function getBlog(slug: string) {
  const response = await client.getEntries({
    content_type: 'blog',

    'fields.slug': slug,

    /*
     * Include referenced Contentful entries:
     *
     * Blog
     * ├── category → Category
     * ├── author   → Author
     * └── tags[]   → Tag
     */
    include: 2,

    limit: 1,
  })

  return response.items[0]
}

// =========================
// SEO METADATA
// =========================

export async function generateMetadata({
  params,
}: BlogDetailPageProps): Promise<Metadata> {
  const { slug } = await params

  const blog = await getBlog(slug)

  if (!blog) {
    return {
      title: 'Blog Not Found',
    }
  }

  const fields = blog.fields as BlogFields

  return {
    title: fields.title || 'Blog',

    description:
      fields.introContent || '',

    openGraph: {
      title: fields.title || 'Blog',

      description:
        fields.introContent || '',

      images: fields.bannerImage?.fields?.file?.url
        ? [
            {
              url: `https:${fields.bannerImage.fields.file.url}`,
            },
          ]
        : undefined,
    },
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
  // FETCH BLOG
  // =========================

  const blog = await getBlog(slug)

  if (!blog) {
    console.log('Blog not found:', slug)

    notFound()
  }

  const fields = blog.fields as BlogFields

  console.log('Blog found:', {
    title: fields.title,
    slug: fields.slug,
    category: fields.category?.fields?.name,
    author: fields.author?.fields?.name,
    tags: fields.tags?.map(
      (tag) => tag.fields.name
    ),
  })

  // =========================
  // HERO IMAGE
  // =========================

  const heroImageUrl =
    fields.bannerImage?.fields?.file?.url
      ? `https:${fields.bannerImage.fields.file.url}`
      : null

  // =========================
  // AUTHOR AVATAR
  // =========================

  const authorAvatar =
    fields.author?.fields?.authorImage?.fields?.file?.url
      ? `https:${fields.author.fields.authorImage.fields.file.url}`
      : null

  // =========================
  // DATE
  // =========================

  const formattedDate = fields.publishedDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(
        new Date(fields.publishedDate)
      )
    : null

  // =========================
  // RICH TEXT OPTIONS
  // =========================

  const richTextOptions = {
    renderNode: {
      [BLOCKS.HEADING_2]: (
        node: any,
        children: React.ReactNode
      ) => {
        /*
         * Generate anchor ID from heading text.
         *
         * Example:
         *
         * "What is autonomous healthcare?"
         *
         * becomes:
         *
         * #what-is-autonomous-healthcare
         */

        const text =
          node.content
            ?.map((item: any) => item.value)
            .join('') || ''

        const id = text
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '')

        return (
          <h2 id={id}>
            {children}
          </h2>
        )
      },

      [BLOCKS.HEADING_3]: (
        _node: any,
        children: React.ReactNode
      ) => {
        return <h3>{children}</h3>
      },
    },
  }

  return (
    <main className="page">

      {/* =========================
          HERO SECTION
      ========================== */}

      <section className="hero">

        <div className="gold-lines" />

        <div className="hero-content">

          {/* =========================
              BREADCRUMBS
          ========================== */}

          <div className="breadcrumbs">

            <span>Home</span>

            <span>›</span>

            <span>Blog</span>

            <span>›</span>

            <span>{fields.title}</span>

          </div>

          {/* =========================
              HERO GRID
          ========================== */}

          <div className="hero-grid">

            {/* HERO CONTENT */}

            <div className="hero-copy">

              <h1>{fields.title}</h1>

              {fields.introContent && (
                <p className="hero-description">
                  {fields.introContent}
                </p>
              )}

              {/* =========================
                  META
              ========================== */}

              <div className="meta">

                {/* CATEGORY */}

                {fields.category && (
                  <span className="meta-item">
                    <span className="meta-icon">
                      ✦
                    </span>

                    {fields.category.fields.name}
                  </span>
                )}

                {/* AUTHOR */}

                {fields.author && (
                  <span className="meta-item">
                    <span className="meta-icon">
                      ●
                    </span>

                    {fields.author.fields.name}
                  </span>
                )}

                {/* DATE */}

                {formattedDate && (
                  <span className="meta-item">
                    <span className="meta-icon">
                      ▣
                    </span>

                    {formattedDate}
                  </span>
                )}

                

              </div>

            </div>

            {/* =========================
                HERO IMAGE
            ========================== */}

            {heroImageUrl && (
              <div className="hero-image-wrapper">

                <img
                  src={heroImageUrl}
                  alt={
                    fields.bannerImage?.fields
                      ?.description ||
                    fields.bannerImage?.fields
                      ?.title ||
                    fields.title ||
                    'Blog banner'
                  }
                  className="blog-featured-image"
                />

              </div>
            )}

          </div>

        </div>

      </section>

      {/* =========================
          ARTICLE SECTION
      ========================== */}

      <section className="article-section">

        {/* =========================
            SIDEBAR
        ========================== */}

        <aside className="article-sidebar">

          <div className="toc-container">

            <h2>In this article</h2>

            <nav>

              {fields.tableOfContents?.map(
                (item) => (
                  <a
                    key={item.id}
                    href={`#${item.id}`}
                    className="toc-link"
                  >
                    {item.title}
                  </a>
                )
              )}

            </nav>

          </div>

        </aside>

        {/* =========================
            ARTICLE
        ========================== */}

        <article className="blog-description">

          {fields.description && (
            <div className="rich-text">

              {documentToReactComponents(
                fields.description,
                richTextOptions
              )}

            </div>
          )}

          {/* =========================
              AUTHOR
          ========================== */}

          {fields.author && (
            <section className="author-card">

              {authorAvatar && (
                <img
                  src={authorAvatar}
                  alt={
                    fields.author.fields.name
                  }
                  className="author-avatar"
                />
              )}

              <div className="author-content">

                <div className="author-label">
                  Written by
                </div>

                <h3>
                  {fields.author.fields.name}
                </h3>

                {fields.author.fields.shortBiography && (
                  <p className="author-bio">
                    {
                      fields.author.fields
                        .shortBiography
                    }
                  </p>
                )}

              </div>

            </section>
          )}

          {/* =========================
              TAGS
          ========================== */}

          {fields.tags &&
            fields.tags.length > 0 && (
              <div className="tags">

                <span className="tags-title">
                  Tags
                </span>

                <div className="tag-list">

                  {fields.tags.map((tag) => (
                    <a
                      key={tag.sys.id}
                      href={`/tags/${tag.fields.slug || tag.sys.id}`}
                      className="tag"
                    >
                      {tag.fields.name}
                    </a>
                  ))}

                </div>

              </div>
            )}

        </article>

      </section>

    </main>
  )
}