import Link from "next/link";

interface BlogCardProps {
  blog: any;
}

export default function BlogCard({ blog }: BlogCardProps) {
  const {
    title,
    slug,
    bannerImage,
    author,
    publishedDate,
    category,
  } = blog.fields;

  const imageUrl = bannerImage?.fields?.file?.url
    ? `https:${bannerImage.fields.file.url}`
    : "";

  const authorImage =
    author?.fields?.image?.fields?.file?.url
      ? `https:${author.fields.image.fields.file.url}`
      : "";

  const authorName = author?.fields?.name || "";

  const categoryName = category?.fields?.name || "";

  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : "";

  return (
    <article className="blog-card">

      {/* Banner */}
      <div className="blog-card-image-wrapper">

        <Link href={`/company/blog/${slug}`}>
          {imageUrl && (
            <img
              src={imageUrl}
              alt={bannerImage?.fields?.title || title}
              className="blog-card-image"
            />
          )}
        </Link>

        {/* Author Avatar */}
        {authorImage && (
          <div className="blog-author-avatar">
            <img
              src={authorImage}
              alt={authorName}
            />
          </div>
        )}

      </div>

      {/* Content */}
      <div className="blog-card-content">

        <h2 className="blog-card-title">
          <Link href={`/company/blog/${slug}`}>
            {title}
          </Link>
        </h2>

        {/* Bottom metadata */}
        <div className="blog-card-meta">

          {formattedDate && (
            <span>{formattedDate}</span>
          )}

          {categoryName && (
            <>
              <span className="meta-separator">
                •
              </span>

              <span>{categoryName}</span>
            </>
          )}

        </div>

      </div>

    </article>
  );
}