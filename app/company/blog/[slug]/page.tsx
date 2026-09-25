
import { client } from '../../../lib/contentful'
import {
  documentToReactComponents,
} from '@contentful/rich-text-react-renderer'
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
// CREATE HEADING ID
// =====================================================

function createHeadingId(
  text: string,
  index: number
): string {
  const slug = text
    .toLowerCase()
    .trim()
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, 'and')
    .replace(/&#39;|&#x27;/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return slug || `heading-${index + 1}`
}

// =====================================================
// GET TABLE OF CONTENTS FROM CONTENTFUL RICH TEXT
// =====================================================

function getTableOfContents(description: any) {
  const tableOfContents: {
    id: string
    title: string
  }[] = []

  if (!description?.content) {
    return tableOfContents
  }

  const usedIds = new Set<string>()

  description.content.forEach(
    (node: any, index: number) => {

      /*
       * Only get H2 / heading-2 nodes
       */
      if (node.nodeType !== BLOCKS.HEADING_2) {
        return
      }

      /*
       * Get text from H2
       */
      const title =
        node.content
          ?.map(
            (item: any) =>
              item.value || ''
          )
          .join('')
          .trim() || ''

      if (!title) {
        return
      }

      /*
       * Create unique ID
       */
      const baseId = createHeadingId(
        title,
        index
      )

      let id = baseId
      let counter = 2

      while (usedIds.has(id)) {
        id = `${baseId}-${counter}`
        counter++
      }

      usedIds.add(id)

      /*
       * Add to Table of Contents
       */
      tableOfContents.push({
        id,
        title,
      })
    }
  )

  return tableOfContents
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
  // TABLE OF CONTENTS
  // ===================================================

  const tableOfContents =
    getTableOfContents(
      fields.description
    )

  // ===================================================
  // RICH TEXT
  // ===================================================

  /*
   * Keep a counter so the generated IDs in the
   * rendered H2s match the IDs in the TOC.
   */
  let headingIndex = 0

  const richTextOptions = {
    renderNode: {

      // =================================================
      // H2
      // =================================================

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
            .join('')
            .trim() || ''

        const id = createHeadingId(
          text,
          headingIndex
        )

        headingIndex++

        return (
          <h2
            id={id}
            className="blog-heading-2"
          >
            {children}
          </h2>
        )
      },

      // =================================================
      // H3
      // =================================================

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

  // ===================================================
  // RENDER
  // ===================================================

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
            SIDEBAR / TABLE OF CONTENTS
        ================================================= */}

        <aside className="article-sidebar">

          {tableOfContents.length > 0 && (

            <div className="toc-container">

              <h2>
                In this article
              </h2>

              <div className="highlighted-field-content">

                <ul>

                  {tableOfContents.map(
                    (item, index) => (

                      <li
                        key={item.id}
                        className="activesection"
                      >

                        <a
                          href={`#${item.id}`}
                          className="blog-scroll-link toc-link"
                        >
                          {item.title}
                        </a>

                      </li>

                    )
                  )}

                </ul>

              </div>

            </div>

          )}

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
