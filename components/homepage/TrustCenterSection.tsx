type TrustBadge = {
  name: string
  imageUrl: string
}

type TrustCenterData = {
  title?: string
  description?: string
  badges?: TrustBadge[]
  ctaText?: string
  ctaUrl?: string
}

type TrustCenterSectionProps = {
  data?: TrustCenterData
}

export default function TrustCenterSection({
  data,
}: TrustCenterSectionProps) {
  if (!data) return null

  return (
    <section className="trust-center-section common-section">
      <div className="coh-container coh-container-boxed">

        <div className="trust-center-intro">
          <h2>{data.title}</h2>
          <p>{data.description}</p>
        </div>

        <div className="trust-center-badges">
          {data.badges?.map((badge) => (
            <div
              className="trust-badge"
              key={badge.name}
            >
              <img
                src={badge.imageUrl}
                alt={badge.name}
              />

              <p>{badge.name}</p>
            </div>
          ))}
        </div>

        {data.ctaText && data.ctaUrl && (
          <div className="trust-center-cta">
            <a
              href={data.ctaUrl}
              className="cta-text-link"
            >
              {data.ctaText}
              <span aria-hidden="true">›</span>
            </a>
          </div>
        )}

      </div>
    </section>
  )
}