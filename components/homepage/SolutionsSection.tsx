'use client'

type Solution = {
  title: string
  description: string
  ctaText: string
  ctaUrl: string
  videoUrl: string
  posterUrl: string
}

type SolutionsSectionProps = {
  solutions?: Solution[]
}

export default function SolutionsSection({
  solutions = [],
}: SolutionsSectionProps) {
  return (
    <section className="two-blocks-section common-section">
      <div className="coh-container coh-container-boxed">
        <div className="coh-row">
          <div className="coh-row-inner">
            {solutions.map((solution, index) => (
              <div
                className="coh-column coh-col-ps-12 coh-col-sm-6 coh-col-xl-6"
                key={`${solution.title}-${index}`}
              >
                <div className="tb-module-wrap">
                  <div className="tb-content-box">
                    <h3>{solution.title}</h3>

                    <p>{solution.description}</p>

                    <a
                      href={solution.ctaUrl}
                      className="coh-link coh-style-solid-black-button"
                      title={solution.ctaText}
                    >
                      {solution.ctaText}
                    </a>
                  </div>

                  <div
                    className="tb-img-box"
                    onMouseEnter={(event) => {
                      event.currentTarget
                        .querySelector('video')
                        ?.play()
                    }}
                    onMouseLeave={(event) => {
                      const video =
                        event.currentTarget.querySelector('video')

                      video?.pause()
                    }}
                  >
                    <video
                      playsInline
                      loop
                      muted
                      preload="metadata"
                      poster={solution.posterUrl}
                    >
                      <source
                        src={solution.videoUrl}
                        type="video/mp4"
                      />
                    </video>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}