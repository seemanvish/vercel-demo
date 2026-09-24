type HeroSectionProps = {
  heading?: string
  description?: string
  desktopVideoUrl?: string
  mobileVideoUrl?: string
}

export default function HeroSection({
  heading = 'The #1 provider of agentic automation',
  description = 'Providing agentic automation to autonomously run mission-critical processes, empowering employees to focus on what matters most.',
  desktopVideoUrl = 'https://aai.widen.net/content/srtwxfawaw/mp4/Hero.mp4?quality=hd&u=dsnumm',
  mobileVideoUrl = 'https://aai.widen.net/content/gf5kj5ecte/mp4/Hero-Mograph-Desktop_v1-Mockup.mp4?quality=hd&u=dsnumm',
}: HeroSectionProps) {
  return (
    <div className="coh-container banner-section">

      <div className="banner-bg-video-wrap">

        <video
          className="desk-vid"
          playsInline
          autoPlay
          loop
          muted
          preload="metadata"
          poster="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-banner-video-bg_en.jpg"
        >
          <source src={desktopVideoUrl} />
        </video>

        <video
          className="mb-vid"
          playsInline
          autoPlay
          loop
          muted
          preload="metadata"
          poster="https://www.automationanywhere.com/sites/default/files/images/homepage/hp-banner-video-bg_en.jpg"
        >
          <source src={mobileVideoUrl} />
        </video>

      </div>

      <div className="coh-container coh-container-boxed banner-inner">

        <div className="coh-row">

          <div className="coh-row-inner">

            <div className="coh-column coh-col-ps-12 coh-col-sm-12 coh-col-md-12 coh-col-lg-12 coh-col-xl-12 banner-left-box">

              <h1>{heading}</h1>

              <p>{description}</p>

            </div>

            <div className="coh-column coh-col-ps-12 coh-col-sm-12 coh-col-md-12 coh-col-lg-12 coh-col-xl-12 banner-right-box">
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}