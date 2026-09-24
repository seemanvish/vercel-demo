export const revalidate = 3600

import HeroSection from '@/components/homepage/HeroSection'
import SolutionsSection from '@/components/homepage/SolutionsSection'
import CustomerLogosSection from '@/components/homepage/CustomerLogosSection'
import { client } from '@/app/lib/contentful'
import styles from '@/components/homepage/Homepage.module.css'

type Solution = {
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  videoUrl: string
  posterUrl: string
}

async function getHomepageContent() {
  const response = await client.getEntries({
    content_type: 'homepage',
    limit: 1,
  })

  return response.items[0]?.fields as {
    heroHeading?: string
    heroDescription?: string
    heroDesktopVideoUrl?: string
    heroMobileVideoUrl?: string
    solutions?: Solution[]
  } | undefined
}

export default async function Home() {
  const homepage = await getHomepageContent()

  return (
    <main className={styles.homepage}>
      <HeroSection
        heading={homepage?.heroHeading}
        description={homepage?.heroDescription}
        desktopVideoUrl={homepage?.heroDesktopVideoUrl}
        mobileVideoUrl={homepage?.heroMobileVideoUrl}
      />

      <SolutionsSection solutions={homepage?.solutions} />

      <CustomerLogosSection />
    </main>
  )
}