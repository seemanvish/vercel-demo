'use client'

import {
  Bank,
  FirstAidKit,
  DesktopTower,
  Package,
} from '@phosphor-icons/react'

type IndustryItem = {
  title: string
  description: string
  url: string
  icon: string
}

type IndustrySectionProps = {
  data?: {
    title?: string
    items?: IndustryItem[]
    images?: string[]
  }
}

export default function IndustrySection({
  data,
}: IndustrySectionProps) {
  if (!data) return null

  return (
    <section className="industry-section common-section">
      <div className="coh-container coh-container-boxed">

        <div className="coh-row">
          <div className="coh-row-inner">
            <div className="coh-column coh-col-ps-12 coh-col-sm-12 coh-col-xl-12 section-intro-wrap">
              <h2>{data.title}</h2>
            </div>
          </div>
        </div>

        <div className="coh-row">
          <div className="coh-row-inner">
            {data.items?.map((item) => (
              <div
                key={item.title}
                className="coh-column coh-col-xs-12 coh-col-ps-6 coh-col-sm-6 coh-col-xl-3"
              >
                <div className="ind-info-wrap">

                  <div className="industry-icon" aria-hidden="true">
  {item.icon === 'bank' && <Bank size={42} weight="regular" />}
  {item.icon === 'healthcare' && <FirstAidKit size={42} weight="regular" />}
  {item.icon === 'desktop' && <DesktopTower size={42} weight="regular" />}
  {item.icon === 'package' && <Package size={42} weight="regular" />}
</div>

                  <p className="ind-title">
                    {item.title}
                  </p>

                  <p>{item.description}</p>

                  <a
                    className="link-wrap"
                    href={item.url}
                  >
                    {item.title}
                  </a>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="coh-row">
          <div className="coh-row-inner">
            <div className="coh-column coh-col-ps-12 coh-col-sm-12 coh-col-xl-12 ind-assets-wrap">
              <div className="ind-asset-row">
                {data.images?.slice(0, 3).map((image, index) => (
                  <div
                    className="ind-asset-item"
                    key={`${image}-${index}`}
                  >
                    <img
                      src={image}
                      alt="Industry"
                    />
                  </div>
                ))}
              </div>

              <div className="ind-asset-row">
                {data.images?.slice(3, 6).map((image, index) => (
                  <div
                    className="ind-asset-item"
                    key={`${image}-${index + 3}`}
                  >
                    <img
                      src={image}
                      alt="Industry"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}