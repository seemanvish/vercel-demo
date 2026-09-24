'use client'

import { useEffect } from 'react'

export default function CustomerLogosSection() {
  useEffect(() => {
    let $: any
    let handleResize: (() => void) | null = null
    let cancelled = false

    const loadSlider = async () => {
      // Load jQuery only in the browser
      const jqueryModule = await import('jquery')

      // Handle both CommonJS and ES module exports
      $ = (jqueryModule as any).default || jqueryModule

      // Make jQuery available globally for Slick
      ;(window as any).jQuery = $
      ;(window as any).$ = $

      // Load Slick after jQuery has been initialized
      await import('slick-carousel')

      if (cancelled) return

      const initSliders = () => {
        const groups = ['.cs-group1', '.cs-group2']

        groups.forEach((selector, index) => {
          const slider = $(selector)

          if (!slider.length) return

          const element = slider as any

          // Destroy existing Slick instance before reinitializing
          if (element.hasClass('slick-initialized')) {
            element.slick('unslick')
          }

          element.slick({
            autoplay: true,
            autoplaySpeed: 0,
            speed: 15000,
            cssEase: 'linear',
            infinite: true,
            slidesToShow: 5,
            centerMode: true,
            variableWidth: true,
            pauseOnHover: false,
            pauseOnFocus: false,
            arrows: false,
            dots: false,
            rtl: index === 1,

            responsive: [
              {
                breakpoint: 993,
                settings: {
                  slidesToShow: 4,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 3,
                },
              },
              {
                breakpoint: 481,
                settings: {
                  slidesToShow: 2,
                },
              },
              {
                breakpoint: 420,
                settings: {
                  slidesToShow: 1,
                },
              },
            ],
          })
        })
      }

      // Initialize both logo sliders
      initSliders()

      // Reinitialize on resize
      handleResize = () => {
        initSliders()
      }

      window.addEventListener('resize', handleResize)
    }

    loadSlider()

    // Cleanup
    return () => {
      cancelled = true

      if (handleResize) {
        window.removeEventListener('resize', handleResize)
      }

      if ($) {
        $('.cs-group1, .cs-group2').each(function (this: HTMLElement) {
  const slider = $(this) as any

          if (slider.hasClass('slick-initialized')) {
            slider.slick('unslick')
          }
        })
      }
    }
  }, [])

  return (
    <section className="coh-container customer-logos-section common-section">
      <div className="coh-container coh-container-boxed">
        <div className="coh-row">
          <div className="coh-row-inner">
            <div className="coh-column coh-col-ps-12 coh-col-sm-12 coh-col-xl-12 section-intro-wrap">
              <h2 className="coh-style-h2-x-large-bold">
                Powering AI-driven automation for global leaders.
              </h2>
            </div>
          </div>
        </div>
      </div>

      <div className="coh-container">
        <div className="coh-row">
          <div className="coh-row-inner">

            {/* First customer logo row */}
            <div className="customer-logo-wrap cs-group1">

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/softbank">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-softbank-logo-dark_en.svg"
                    width="185"
                    height="27"
                    alt="SoftBank"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/petrobras">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-petrobras-logo-dark_en.png"
                    width="153"
                    height="30"
                    alt="Petrobras"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/keybank">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-keybank-logo-dark_en.svg"
                    width="195"
                    height="34"
                    alt="KeyBank"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <span
                  className="vid-link yt-video-btn"
                  data-yt-video="GjOEihJww6E"
                >
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-nhs-logo-dark_en.svg"
                    width="83"
                    height="33"
                    alt="NHS"
                  />
                </span>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/the-washington-post">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-washington-post-logo-dark_en.png"
                    width="258"
                    height="41"
                    alt="The Washington post"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/alight-aws">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-alight-logo-dark_en.png"
                    width="95"
                    height="41"
                    alt="Alight"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/dell-uses-rpa-for-hr-processes">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-dell-logo-dark_en.svg"
                    width="60"
                    height="60"
                    alt="Dell"
                  />
                </a>
              </div>

              <div className="cst-logo-box">
                <a href="/resources/customer-stories/kpmg">
                  <img
                    src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-kpmg-logo-dark_en.svg"
                    width="99"
                    height="59"
                    alt="KPMG"
                  />
                </a>
              </div>

            </div>

            {/* Second customer logo row */}
            <div className="customer-logo-wrap cs-group2">

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-adobe-logo-dark-lt_en.svg"
                  width="140"
                  height="34"
                  alt="Adobe"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-bdo-logo-dark-lt_en.svg"
                  width="100"
                  height="39"
                  alt="BDO"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-bnsf-logo-dark-lt_en.svg"
                  width="180"
                  height="35"
                  alt="BNSF"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-cisco-logo-dark-lt_en.svg"
                  width="110"
                  height="56"
                  alt="Cisco"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-gilead-logo-dark-lt_en.svg"
                  width="200"
                  height="54"
                  alt="Gilead"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-nokia-logo-dark-lt_en.svg"
                  width="150"
                  height="36"
                  alt="Nokia"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-sp-global-logo-dark-lt_en.svg"
                  width="200"
                  height="43"
                  alt="S&P Global"
                />
              </div>

              <div className="cst-logo-box">
                <img
                  src="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-workday-logo-dark-lt_en.svg"
                  width="150"
                  height="60"
                  alt="Workday"
                />
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  )
}