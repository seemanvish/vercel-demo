
interface BlogDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogDetailPage({
  params,
}: BlogDetailPageProps) {
  const { slug } = await params

  return (
    <div
      style={{
        padding: '50px',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h1>Blog Route Works</h1>

      <p>
        Slug: <strong>{slug}</strong>
      </p>
    </div>
  )
}

