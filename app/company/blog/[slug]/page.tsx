
import { client } from '../../../lib/contentful'

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  let response

  try {
    response = await client.getEntries({
      content_type: 'blog',
      limit: 100,
    })
  } catch (error) {
    console.error('CONTENTFUL ERROR:', error)

    return (
      <main style={{ padding: '40px' }}>
        <h1>Contentful Error</h1>
        <pre>
          {error instanceof Error
            ? error.message
            : JSON.stringify(error, null, 2)}
        </pre>
      </main>
    )
  }

  const blogs = response.items as any[]

  const blog = blogs.find(
    (item) => item.fields?.slug === slug
  )

  return (
    <main style={{ padding: '40px' }}>
      <h1>Contentful Debug</h1>

      <h2>Requested slug</h2>
      <pre>{slug}</pre>

      <h2>Blogs returned</h2>

      <pre>
        {JSON.stringify(
          blogs.map((item) => ({
            id: item.sys?.id,
            contentType:
              item.sys?.contentType?.sys?.id,
            slug: item.fields?.slug,
            title: item.fields?.title,
          })),
          null,
          2
        )}
      </pre>

      <h2>Matching blog</h2>

      <pre>
        {JSON.stringify(
          blog
            ? {
                id: blog.sys?.id,
                slug: blog.fields?.slug,
                title: blog.fields?.title,
              }
            : null,
          null,
          2
        )}
      </pre>
    </main>
  )
}

