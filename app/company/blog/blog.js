
import { client } from '../../lib/contentful'

export default async function BlogPage() {
  const response = await client.getEntries({
    content_type: "blog",
  });

  const blogs = response.items;

  return (
    <main>
      {/* Blog Header */}
      <section className="blog-header">
        <h1>Blog</h1>
        <p>Key insights on everything agentic process automation</p>
      </section>

      {/* Blog Listing */}
      <section className="blog-listing">
        {blogs.map((blog) => (
          <article key={blog.sys.id} className="blog-card">
            <h2>{blog.fields.title}</h2>
          </article>
        ))}
      </section>
    </main>
  );
}

