
import '../blog.css'

interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  try {
    const { slug } = await params

    return (
      <main className="page">
        <section className="hero">
          <div className="gold-lines" />

          <div className="hero-content">
            <div className="breadcrumbs">
              <span>Home</span>
              <span>›</span>
              <span>Blog</span>
              <span>›</span>
              <span>{slug}</span>
            </div>

            <div className="hero-grid">
              <div className="hero-copy">
                <h1>Blog Page Is Working</h1>

                <p className="hero-description">
                  Slug received from URL:
                </p>

                <p className="hero-description">
                  <strong>{slug}</strong>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('PAGE ERROR:', error)

    return (
      <main style={{ padding: '40px' }}>
        <h1>Page Error</h1>

        <pre style={{ whiteSpace: 'pre-wrap' }}>
          {error instanceof Error
            ? error.stack || error.message
            : JSON.stringify(error, null, 2)}
        </pre>
      </main>
    )
  }
}

