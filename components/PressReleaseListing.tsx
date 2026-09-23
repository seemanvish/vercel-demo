'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import PageBanner from './PageBanner'

type PressRelease = {
  id: string
  title: string
  slug: string
  releaseDate: string
  location: string[]
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  })
}

export default function PressReleaseListing({
  items,
  eyebrow,
  heading,
  sectionHeading,
  bannerUrl,
}: {
  items: PressRelease[]
  eyebrow?: string
  heading?: string
  sectionHeading?: string
  bannerUrl?: string | null
}) {
  const years = useMemo(() => {
    const unique = Array.from(
      new Set(items.map((item) => new Date(item.releaseDate).getFullYear()))
    )
    return unique.sort((a, b) => b - a)
  }, [items])

  const [selectedYear, setSelectedYear] = useState<number | 'all'>('all')

  const filtered = useMemo(() => {
    if (selectedYear === 'all') return items
    return items.filter(
      (item) => new Date(item.releaseDate).getFullYear() === selectedYear
    )
  }, [items, selectedYear])

  const latest = items.slice(0, 3)

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <PageBanner eyebrow={eyebrow} heading={heading} bannerUrl={bannerUrl} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-16">
        {latest.map((item) => (
          <Link
            key={item.id}
            href={`/company/press-room/${item.slug}`}
            className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
          >
            <p className="text-orange-500 text-xs font-bold uppercase mb-1">
              Latest Press Release{' '}
              <span className="text-gray-400 font-normal normal-case">
                | {formatDate(item.releaseDate)}
              </span>
            </p>
            <p className="text-gray-900 font-semibold leading-snug">{item.title}</p>
          </Link>
        ))}
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {sectionHeading || 'Catch the latest announcements in the world of Agentic Process Automation.'}
      </h2>

      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedYear('all')}
          className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
            selectedYear === 'all'
              ? 'bg-orange-500 text-white border-orange-500'
              : 'text-gray-700 border-gray-300 hover:border-orange-400'
          }`}
        >
          All
        </button>
        {years.map((year) => (
          <button
            key={year}
            onClick={() => setSelectedYear(year)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold border ${
              selectedYear === year
                ? 'bg-orange-500 text-white border-orange-500'
                : 'text-gray-700 border-gray-300 hover:border-orange-400'
            }`}
          >
            {year}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <Link
            key={item.id}
            href={`/company/press-room/${item.slug}`}
            className="border border-gray-200 rounded-lg p-6 flex justify-between items-start gap-4 hover:shadow-md transition-shadow"
          >
            <div>
              <p className="text-orange-500 text-xs font-bold uppercase mb-2">
                Press Release{' '}
                <span className="text-gray-400 font-normal normal-case">
                  | {formatDate(item.releaseDate)}
                </span>
              </p>
              <p className="text-gray-900 font-semibold leading-snug">{item.title}</p>
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-gray-500 mt-8">No press releases found for this year.</p>
      )}
    </div>
  )
}