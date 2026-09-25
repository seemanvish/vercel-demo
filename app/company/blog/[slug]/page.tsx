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

// =====================================================
// CONTENTFUL TYPES
// =====================================================

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
    shortBiography?: string
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

interface RelatedPost {
  sys: {
    id: string
  }
  fields: {
    title?: string
    slug?: string
    introContent?: string

    bannerImage?: {
      fields?: {
        file?: {
          url: string
        }
      }
    }
  }
}

interface SEO {
  sys: {
    id: string
  }
  fields: {
    metaTitle?: string
    metaDescription?: string
  }
}

interface BlogFields {
  title: string
  slug: string

  description?: any

  introContent?: string

  category?: Category

  author?: Author

  tags?: Tag[]

  bannerImage?: {
    fields?: {
      title?: string
      description?: string

      file?: {
        url: string
      }
    }
  }

  featured?: boolean

  editorPick?: boolean

  publishedDate?: string

  relatedPost?: RelatedPost[]

  authorableTitle?: string

  authorableURL?: string

  seo?: SEO
}

// =====================================================
// FETCH BLOG
// =====================================================

async function getBlog(slug: string) {
  const response = await client.getEntries({
    content_type: 'blog',

    'fields.slug': slug,

    /*
     * Resolve:
     *
     * Blog
     * ├── Category
     * ├── Author
     * ├── Tags
     * ├── Related Posts
     * └── SEO
     */
    include: 2,

    limit: 1,
  })

  return response.items[0] || null
}

// =====================================================
// SEO
// =====================================================

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

  const seo = fields.seo?.fields

  const title =
    seo?.metaTitle ||
    fields.authorableTitle ||
    fields.title ||
    'Blog'

  const description =
    seo?.metaDescription ||
    fields.introContent ||
    ''

  const image =
    seo?.ogImage?.fields?.file?.url ||
    fields.bannerImage?.fields?.file?.url

  return {
    title,

    description,

    
    openGraph: {
      

      type: 'article',

      publishedTime:
        fields.publishedDate,

      authors: fields.author
        ? [fields.author.fields.name]
        : undefined,

      images: image
        ? [
            {
              url: `https:${image}`,
            },
          ]
        : undefined,
    },
  }
}

// =====================================================
// BLOG DETAIL
// =====================================================

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  const fields = blog.fields as BlogFields

  // ===================================================
  // HERO IMAGE
  // ===================================================

  const heroImage =
    fields.bannerImage?.fields?.file?.url
      ? `https:${fields.bannerImage.fields.file.url}`
      : null

  // ===================================================
  // AUTHOR AVATAR
  // ===================================================

  const authorAvatar =
    fields.author?.fields?.authorImage?.fields?.file?.url
      ? `https:${fields.author.fields.authorImage.fields.file.url}`
      : null

  // ===================================================
  // PUBLISHED DATE
  // ===================================================

  const formattedDate = fields.publishedDate
    ? new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: '2-digit',
        year: 'numeric',
      }).format(
        new Date(fields.publishedDate)
      )
    : null

  // ===================================================
  // RICH TEXT
  // ===================================================

  const richTextOptions = {
    renderNode: {
      [BLOCKS.HEADING_2]: (
        node: any,
        children: React.ReactNode
      ) => {
        const text =
          node.content
            ?.map(
              (item: any) =>
                item.value
            )
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
        return (
          <h3>
            {children}
          </h3>
        )
      },
    },
  }

  return (
    <main className="page">

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">

        <div className="gold-lines" />

        <div className="hero-content">

          {/* Breadcrumb */}

          <div className="breadcrumbs">

            <span>Home</span>

            <span>›</span>

            <span>Blog</span>

            {fields.category && (
              <>
                <span>›</span>

                <span>
                  {fields.category.fields.name}
                </span>
              </>
            )}

            <span>›</span>

            <span>
              {fields.title}
            </span>

          </div>

          {/* Hero Grid */}

          <div className="hero-grid">

            {/* Hero Copy */}

            <div className="hero-copy">

              <h1>
                {fields.title}
              </h1>

              {fields.introContent && (
                <p className="hero-description">
                  {fields.introContent}
                </p>
              )}

              {/* Metadata */}

              <div className="meta">

                {/* Category */}

                {fields.category && (
                  <span className="meta-item">

                    <span className="meta-icon">
                      ✦
                    </span>

                    {fields.category.fields.name}

                  </span>
                )}

                {/* Author */}

                {fields.author && (
                  <span className="meta-item">

                    <span className="meta-icon">
                      ●
                    </span>

                    {fields.author.fields.name}

                  </span>
                )}

                {/* Published Date */}

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

            {/* Hero Image */}

            {heroImage && (
              <div className="hero-image-wrapper">

                <img
                  src={heroImage}
                  alt={
                    fields.bannerImage
                      ?.fields
                      ?.description ||
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

      {/* =================================================
          ARTICLE
      ================================================= */}

      <section className="article-section">

        {/* =================================================
            SIDEBAR
        ================================================= */}

        <aside className="article-sidebar">

          <div className="toc-container">

            <h2>
              In this article
            </h2>

            <nav>

              {/*
                Since there is no tableOfContents
                field in your Contentful model,
                we generate it from H2/H3 headings
                in Rich Text only if needed.

                For now this can be populated separately
                if you want a real TOC.
              */}

            </nav>

          </div>

        </aside>

        {/* =================================================
            ARTICLE CONTENT
        ================================================= */}

        <article className="blog-description">

          {fields.description && (
            <div className="rich-text">

              {documentToReactComponents(
                fields.description,
                richTextOptions
              )}

            </div>
          )}

          {/* =================================================
              AUTHOR
          ================================================= */}

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

          {/* =================================================
              TAGS
          ================================================= */}

          {fields.tags &&
            fields.tags.length > 0 && (
              <div className="tags">

                <span className="tags-title">
                  Tags
                </span>

                <div className="tag-list">

                  {fields.tags.map(
                    (tag) => (
                      <a
                        key={tag.sys.id}
                        href={`/tags/${
                          tag.fields.slug ||
                          tag.sys.id
                        }`}
                        className="tag"
                      >
                        {tag.fields.name}
                      </a>
                    )
                  )}

                </div>

              </div>
            )}

          {/* =================================================
              RELATED POSTS
          ================================================= */}

          {fields.relatedPost &&
            fields.relatedPost.length > 0 && (
              <section className="related-posts">

                <h2>
                  Related Posts
                </h2>

                <div className="related-posts-grid">

                  {fields.relatedPost.map(
                    (post) => {

                      const postImage =
                        post.fields
                          .bannerImage
                          ?.fields
                          ?.file
                          ?.url

                      return (
                        <a
                          key={post.sys.id}
                          href={`/blog/${
                            post.fields.slug
                          }`}
                          className="related-post"
                        >

                          {postImage && (
                            <img
                              src={`https:${postImage}`}
                              alt={
                                post.fields.title ||
                                ''
                              }
                            />
                          )}

                          <div>
                            <h3>
                              {
                                post.fields
                                  .title
                              }
                            </h3>

                            {post.fields
                              .introContent && (
                              <p>
                                {
                                  post.fields
                                    .introContent
                                }
                              </p>
                            )}
                          </div>

                        </a>
                      )
                    }
                  )}

                </div>

              </section>
            )}

        </article>

      </section>

    </main>
  )
}