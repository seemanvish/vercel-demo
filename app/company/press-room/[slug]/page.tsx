import { client } from '../../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'
import { notFound } from 'next/navigation'

export const revalidate = 10

async function getEntry(slug: string) {
  const res = await client.getEntries({
    content_type: 'pressRelease',
    'fields.slug': slug,
    locale: 'en-US',
    limit: 1,
  })
  const entry = res.items[0]
  if (!entry || !(entry.fields as any).body) return null
  return entry
}

export default async function PressReleaseDetail({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = await getEntry(slug)
  if (!entry) return notFound()

  const { title, subtitle, body, releaseDate, location } = entry.fields as any

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-orange-500 text-sm font-bold uppercase mb-2">
        Press Release
        {location?.length > 0 && <span className="text-gray-400 normal-case font-normal"> | {location.join(', ')}</span>}
      </p>
      <h1 className="text-3xl font-bold text-gray-900 mb-3">{title}</h1>
      {subtitle && <p className="text-lg text-gray-600 mb-2">{subtitle}</p>}
      <p className="text-sm text-gray-400 mb-8">
        {new Date(releaseDate).toLocaleDateString('en-US', {
          month: 'long',
          day: '2-digit',
          year: 'numeric',
        })}
      </p>
      <div className="prose max-w-none">
        {body ? documentToReactComponents(body) : null}
      </div>
    </div>
  )
}