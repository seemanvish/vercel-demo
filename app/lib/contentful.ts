
import { createClient } from 'contentful'

const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN

if (!space) {
  throw new Error(
    'CONTENTFUL_SPACE_ID is missing. Check your .env.local file.'
  )
}

if (!accessToken) {
  throw new Error(
    'CONTENTFUL_ACCESS_TOKEN is missing. Check your .env.local file.'
  )
}

export const client = createClient({
  space,
  accessToken,
})

