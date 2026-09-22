import { client } from '../../lib/contentful'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'  

export const revalidate = 60;

export default async function BlogPage() {
  const res = await client.getEntries({
    content_type: 'blog',
    include: 2,
  })

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Blog</h1>

      <div className="space-y-10">
        {res.items.map((item) => {
          const author = item.fields.author as any
          const dateValue = item.fields.dateAndTime as string | undefined
          const image = item.fields.blogImage as any

          return (
            <article
              key={item.sys.id}
              className="border border-gray-200 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {image && (
                <img
                  src={'https:' + image.fields.file.url}
                  alt={item.fields.title as string}
                  className="w-full h-48 object-cover rounded-md mb-4"
                />
              )}

              <h2 className="text-xl font-semibold mb-2">
                {item.fields.title as string}
              </h2>

              <div className="text-gray-700 prose prose-sm mb-4">
                {documentToReactComponents(item.fields.description as any)}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
                <span>By {author?.fields?.authorName || 'Unknown'}</span>
                <span>
                  {dateValue ? new Date(dateValue).toLocaleDateString() : 'No date'}
                </span>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}