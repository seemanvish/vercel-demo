type CustomerQuoteData = {
  quote?: string
  name?: string
  role?: string
  imageUrl?: string
}

type CustomerQuoteSectionProps = {
  data?: CustomerQuoteData
}

export default function CustomerQuoteSection({
  data,
}: CustomerQuoteSectionProps) {
  if (!data) return null

  return (
    <section className="cs-quote-section common-section">
      <div className="coh-container coh-container-boxed">

        <div className="customer-quote-grid">

          <div className="cs-img-box">
            {data.imageUrl && (
              <img
                src={data.imageUrl}
                alt="Customer Quote"
              />
            )}
          </div>

          <div className="cs-quote-box">

            <h3>{data.quote}</h3>

            <p>
              <span>{data.name}</span>
              <br />
              {data.role}
            </p>

          </div>

        </div>

      </div>
    </section>
  )
}