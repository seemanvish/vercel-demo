type RoadmapData = {
  title?: string
  description?: string
  items?: string[]
  ctaText?: string
  ctaUrl?: string
  imageUrl?: string
}

type RoadmapSectionProps = {
  data?: RoadmapData
}

export default function RoadmapSection({
  data,
}: RoadmapSectionProps) {
  if (!data) return null

  return (
    <section className="roadmap-section common-section">
      <div className="coh-container coh-container-boxed">
        <div className="roadmap-grid">

          <div className="rd-content-wrap">

            <div className="section-intro-wrap">
              <h2>{data.title}</h2>

              <p>{data.description}</p>
            </div>

            {data.items && data.items.length > 0 && (
              <ul>
                {data.items.map((item, index) => (
                  <li key={`${item}-${index}`}>
                    {item}
                  </li>
                ))}
              </ul>
            )}

            {data.ctaText && data.ctaUrl && (
              <a
                href={data.ctaUrl}
                className="coh-link coh-style-solid-black-button"
              >
                {data.ctaText}
              </a>
            )}

          </div>

          <div className="rd-img-box">
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="Roadmap"
              />
            )}
          </div>

        </div>
      </div>
    </section>
  )
}