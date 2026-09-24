export const revalidate = 3600

import HeroSection from '@/components/homepage/HeroSection'
import SolutionsSection from '@/components/homepage/SolutionsSection'
import CustomerLogosSection from '@/components/homepage/CustomerLogosSection'
import IndustrySection from '@/components/homepage/IndustrySection'
import OutcomesSection from '@/components/homepage/OutcomesSection'
import RoadmapSection from '@/components/homepage/RoadmapSection'
import CustomerQuoteSection from '@/components/homepage/CustomerQuoteSection'
import TrustCenterSection from '@/components/homepage/TrustCenterSection'
import CtaSection from '@/components/homepage/CtaSection'
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

type IndustrySectionData = {
  title?: string
  items?: {
    title: string
    description: string
    url: string
    icon: string
  }[]
  images?: string[]
}

type OutcomesData = {
  title?: string
  ctaText?: string
  ctaUrl?: string
  items?: {
    percentage: string
    title: string
    description: string
    ctaText: string
    ctaUrl: string
  }[]
}

type RoadmapData = {
  title?: string
  description?: string
  items?: string[]
  ctaText?: string
  ctaUrl?: string
  imageUrl?: string
}

type CustomerQuoteData = {
  quote?: string
  name?: string
  role?: string
  imageUrl?: string
}

type TrustCenterData = {
  title?: string
  description?: string
  badges?: {
    name: string
    imageUrl: string
  }[]
  ctaText?: string
  ctaUrl?: string
}

type CtaData = {
  title?: string
  description?: string
  ctaText?: string
  ctaUrl?: string
  backgroundImage?: string
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
    homepageIndustrySections?: IndustrySectionData
    homepageOutcomes?: OutcomesData
    homepageRoadmap?: RoadmapData
    homepageCustomerQuote?: CustomerQuoteData
    homepageTrustCenter?: TrustCenterData
    homepageCta?: CtaData
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

      <IndustrySection
        data={homepage?.homepageIndustrySections}
      />

      <OutcomesSection
  data={homepage?.homepageOutcomes}
/>

<RoadmapSection
  data={homepage?.homepageRoadmap}
/>

<CustomerQuoteSection
  data={homepage?.homepageCustomerQuote}
/>

<TrustCenterSection
  data={homepage?.homepageTrustCenter}
/>
<CtaSection
  data={homepage?.homepageCta}
/>

    </main>
  )
}