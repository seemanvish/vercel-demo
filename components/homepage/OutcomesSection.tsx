type OutcomeItem = {
  percentage: string
  title: string
  description: string
  ctaText: string
  ctaUrl: string
}

type OutcomesData = {
  title?: string
  ctaText?: string
  ctaUrl?: string
  items?: OutcomeItem[]
}

type OutcomesSectionProps = {
  data?: OutcomesData
}

export default function OutcomesSection({
  data,
}: OutcomesSectionProps) {
  if (!data) return null

  return (
    <section className="three-cards-section common-section">
      <div className="coh-container coh-container-boxed">

        <div className="outcomes-header">

          <div className="section-intro-wrap">
            <h2>{data.title}</h2>
          </div>

          {data.ctaText && data.ctaUrl && (
            <div className="cta-box">
              <a
                href={data.ctaUrl}
                className="coh-link coh-style-solid-black-button"
              >
                {data.ctaText}
              </a>
            </div>
          )}

        </div>

        <div className="outcomes-grid">

          {data.items?.map((item, index) => (
            <div
              className="tc-module"
              key={`${item.title}-${index}`}
            >

              <div className="tc-header-box">
                <p className="tc-title">
                  <span>{item.percentage}</span>
                  {item.title}
                </p>
              </div>

              <div className="tc-content-box">

                <p>{item.description}</p>

                <a
                  className="tc-link cta-text-link"
                  href={item.ctaUrl}
                >
                  {item.ctaText}
                  <span aria-hidden="true">›</span>
                </a>

              </div>

            </div>
          ))}

        </div>

      </div>
    </section>
  )
}