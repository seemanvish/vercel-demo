import { client } from '../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

export default async function BlogPage() {
  const res = await client.getEntries({
    content_type: 'blog',
    include: 2,
  })

  return (
    <div>
      {res.items.map((item) => {
        const author = item.fields.author as any
        const dateValue = item.fields.dateAndTime as string | undefined

        return (
          <div key={item.sys.id} style={{ marginBottom: '2rem' }}>
            <h2>{item.fields.title as string}</h2>

            <div>{documentToReactComponents(item.fields.description as any)}</div>

            <p>By {author?.fields?.authorName || 'Unknown'}</p>

            <p>
              {dateValue
                ? new Date(dateValue).toLocaleDateString()
                : 'No date set'}
            </p>
          </div>
        )
      })}
    </div>
  )
}