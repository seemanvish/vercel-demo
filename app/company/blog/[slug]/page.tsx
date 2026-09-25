import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { BLOCKS } from '@contentful/rich-text-types'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'

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

interface ImageFields {
  title?: string
  description?: string
  file?: {
    url?: string
  }
}

interface CategoryFields {
  name?: string
  slug?: string
  description?: string
}

interface AuthorFields {
  name?: string
  slug?: string
  shortBiography?: string
  authorImage?: {
    fields?: ImageFields
  }
}

interface TagFields {
  name?: string
  slug?: string
}

interface RelatedPostFields {
  title?: string
  slug?: string
  introContent?: string
  bannerImage?: {
    fields?: ImageFields
  }
}

interface SEOFields {
  /*
   * These are the fields currently available
   * on your SEO Contentful reference according
   * to the TypeScript error.
   */
  metaTitle?: string
  metaDescription?: string
}

interface BlogFields {
  title?: string
  slug?: string

  description?: any

  introContent?: string

  category?: {
    fields?: CategoryFields
  }

  author?: {
    fields?: AuthorFields
  }

  tags?: Array<{
    sys: {
      id: string
    }
    fields?: TagFields
  }>

  bannerImage?: {
    fields?: ImageFields
  }

  featured?: boolean

  editorPick?: boolean

  publishedDate?: string

  relatedPost?: Array<{
    sys: {
      id: string
    }
    fields?: RelatedPostFields
  }>

  authorableTitle?: string

  authorableURL?: string

  seo?: {
    fields?: SEOFields
  }
}

// =====================================================
// HELPER
// =====================================================

function getFields<T>(fields: unknown): T {
  return fields as T
}

// =====================================================
// GET BLOG
// =====================================================

async function getBlog(slug: string) {
  const response = await client.getEntries({
    content_type: 'blog',
    'fields.slug': slug,
    include: 2,
    limit: 1,
  })

  return response.items[0] || null
}

// =====================================================
// SEO METADATA
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

  /*
   * Contentful returns a generic fields object.
   * Convert it explicitly through unknown.
   */
  const fields = getFields<BlogFields>(
    blog.fields
  )

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

  return {
    title,
    description,
  }
}

// =====================================================
// BLOG DETAIL PAGE
// =====================================================

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  // ===================================================
  // FETCH BLOG
  // ===================================================

  const blog = await getBlog(slug)

  if (!blog) {
    notFound()
  }

  /*
   * IMPORTANT:
   *
   * Contentful's SDK types fields generically.
   *
   * We intentionally convert through unknown.
   */
  const fields = getFields<BlogFields>(
    blog.fields
  )

  // ===================================================
  // HERO IMAGE
  // ===================================================

  const heroImage =
    fields.bannerImage?.fields?.file?.url
      ? `https:${fields.bannerImage.fields.file.url}`
      : null

  // ===================================================
  // AUTHOR IMAGE
  // ===================================================

  const authorAvatar =
    fields.author?.fields?.authorImage?.fields?.file?.url
      ? `https:${fields.author.fields.authorImage.fields.file.url}`
      : null

  // ===================================================
  // CATEGORY
  // ===================================================

  const categoryName =
    fields.category?.fields?.name || null

  // ===================================================
  // AUTHOR
  // ===================================================

  const authorName =
    fields.author?.fields?.name || null

  // ===================================================
  // DATE
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
        children: ReactNode
      ) => {
        const text =
          node.content
            ?.map(
              (item: any) =>
                item.value || ''
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
        children: ReactNode
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

          {/* Breadcrumbs */}

          <div className="breadcrumbs">

            <span>Home</span>

            <span>›</span>

            <span>Blog</span>

           

            <span>›</span>

            <span>
              {fields.title}
            </span>

          </div>

          {/* Hero Grid */}

          <div className="hero-grid">

            {/* Hero Content */}

            <div className="hero-copy">

              <h1>
                {fields.title}
              </h1>

              {fields.introContent && (
                <p className="hero-description">
                  {fields.introContent}
                </p>
              )}

              {/* Meta */}

              <div className="meta">

                {/* Category */}

                {categoryName && (
                  <span className="meta-item">

                    <span className="meta-icon">
                      ✦
                    </span>

                    {categoryName}

                  </span>
                )}

                {/* Author */}

                {authorName && (
                  <span className="meta-item">

                    <span className="meta-icon">
                      ●
                    </span>

                    {authorName}

                  </span>
                )}

                {/* Date */}

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

            {/*
              We can populate this automatically
              from H2 headings later.
            */}

            <nav />

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
                    (tag) => {

                      const tagName =
                        tag.fields
                          ?.name

                      const tagSlug =
                        tag.fields
                          ?.slug

                      if (!tagName) {
                        return null
                      }

                      return (
                        <a
                          key={tag.sys.id}
                          href={
                            tagSlug
                              ? `/tags/${tagSlug}`
                              : '#'
                          }
                          className="tag"
                        >
                          {tagName}
                        </a>
                      )
                    }
                  )}

                </div>

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
                    authorName ||
                    'Author'
                  }
                  className="author-avatar"
                />
              )}

              <div className="author-content">

                <div className="author-label">
                  Written by
                </div>

                <h3>
                  {authorName}
                </h3>

               

                {fields.author.fields
                  ?.shortBiography && (
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

                      const postFields =
                        post.fields

                      if (!postFields) {
                        return null
                      }

                      const image =
                        postFields
                          .bannerImage
                          ?.fields
                          ?.file
                          ?.url

                      return (
                        <a
                          key={post.sys.id}
                          href={
                            postFields.slug
                              ? `/blog/${postFields.slug}`
                              : '#'
                          }
                          className="related-post"
                        >

                          {image && (
                            <img
                              src={`https:${image}`}
                              alt={
                                postFields.title ||
                                ''
                              }
                            />
                          )}

                          <div>

                            <h3>
                              {
                                postFields.title
                              }
                            </h3>

                            {postFields
                              .introContent && (
                              <p>
                                {
                                  postFields
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