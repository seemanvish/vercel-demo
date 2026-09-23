import styles from './PageBanner.module.css'

export default function PageBanner({
  eyebrow,
  heading,
  bannerUrl,
}: {
  eyebrow?: string
  heading?: string
  bannerUrl?: string | null
}) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.diagonalShape} />
      <div className="relative z-10">
        <p className="text-orange-500 font-semibold text-sm mb-2">
          {eyebrow || 'Automation Anywhere Press room'}
        </p>
        <h1 className="text-4xl font-bold text-gray-900 mb-6 max-w-2xl">
          {heading || 'All the Automation Anywhere news, all in one place.'}
        </h1>
      </div>

      {bannerUrl && (
        <img
          src={bannerUrl}
          alt=""
          className="w-full h-64 object-cover rounded-lg mt-6 relative z-10"
        />
      )}
    </div>
  )
}