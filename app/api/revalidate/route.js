import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

// Map each Contentful content type ID to the page path(s) that should
// refresh when an entry of that type is published. To support a new page
// later (Blog, Awards, etc.), just add one line here — nothing else changes.
const CONTENT_TYPE_PATHS: Record<string, string[]> = {
  pressRelease: ['/company/press-room', '/company/press-room/[slug]'],
  pageHeader: ['/company/press-room'],
}

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CONTENTFUL_REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  let contentTypeId: string | undefined
  try {
    const body = await request.json()
    contentTypeId = body?.sys?.contentType?.sys?.id
  } catch {
    // no/invalid body — nothing to look up
  }

  const paths = contentTypeId ? CONTENT_TYPE_PATHS[contentTypeId] : undefined

  if (!paths) {
    return NextResponse.json({
      revalidated: false,
      reason: 'Unmapped content type — add it to CONTENT_TYPE_PATHS if this should trigger a refresh',
      contentTypeId,
    })
  }

  for (const path of paths) {
    if (path.includes('[slug]')) {
      revalidatePath(path, 'page')
    } else {
      revalidatePath(path)
    }
  }

  return NextResponse.json({ revalidated: true, contentTypeId, paths, now: Date.now() })
}