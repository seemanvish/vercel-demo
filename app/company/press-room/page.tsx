import { client } from '../../lib/contentful'
import PressReleaseListing from '../../../components/PressReleaseListing'
import type { Metadata } from 'next'
import { buildHreflang } from '../../lib/seo'

export const metadata: Metadata = {
  alternates: { languages: buildHreflang({ en: '/company/press-room' }) },
}

export const revalidate = 10

function richTextToPlainText(doc: any): string {
  if (!doc || !doc.content) return ''
  return doc.content
    .map((node: any) => {
      if (node.nodeType === 'text') return node.value
      if (node.content) return richTextToPlainText(node)
      return ''
    })
    .join(' ')
    .trim()
}

export default async function PressReleasesPage() {
  const [prRes, headerRes] = await Promise.all([
    client.getEntries({
      content_type: 'pressRelease',
      order: ['-fields.releaseDate'],
      locale: 'en-US',
      include: 2,
    }),
    client.getEntries({
      content_type: 'pageHeader',
      'fields.identifier': 'press-room',
      locale: 'en-US',
      limit: 1,
    }),
  ])

  const items = prRes.items
    .filter((item: any) => item.fields.body)
    .map((item: any) => ({
      id: item.sys.id,
      title: item.fields.title,
      slug: item.fields.slug,
      releaseDate: item.fields.releaseDate,
      location: item.fields.location || [],
    }))

  const header = headerRes.items[0]?.fields as any
  const bannerUrl = header?.bannerImage?.fields?.file?.url
    ? 'https:' + header.bannerImage.fields.file.url
    : null

  return (
    <PressReleaseListing
      items={items}
      eyebrow={header?.eyebrow}
      heading={header?.heading}
      sectionHeading={richTextToPlainText(header?.description)}
      bannerUrl={bannerUrl}
    />
  )
}