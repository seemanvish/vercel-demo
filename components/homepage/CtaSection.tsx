type CtaData = {
  title?: string
  description?: string
  ctaText?: string
  ctaUrl?: string
  backgroundImage?: string
}

type CtaSectionProps = {
  data?: CtaData
}

export default function CtaSection({
  data,
}: CtaSectionProps) {
  if (!data) return null

  return (
    <section className="cta-section common-section">
      <div className="coh-container coh-container-boxed">

        <div
          className="cta-section-inner-wrap"
          style={{
            backgroundImage: data.backgroundImage
              ? `url("${data.backgroundImage}")`
              : undefined,
          }}
        >
          <h2>{data.title}</h2>

          <p className="subhead">
            {data.description}
          </p>

          {data.ctaText && data.ctaUrl && (
            <a
              href={data.ctaUrl}
              className="coh-style-solid-black-button"
            >
              {data.ctaText}
            </a>
          )}
        </div>

      </div>
    </section>
  )
}