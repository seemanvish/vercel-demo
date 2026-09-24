import BlogCard from '../../../components/BlogListing';
import { client } from '../../lib/contentful'
import type { Metadata } from 'next'
import { buildHreflang } from '../../lib/seo'
import "./blog.css";
import "./blog.js";

export const revalidate = 10

async function getBlogs() {
  const response = await contentfulClient.getEntries({
    content_type: "blog",

    order: ["-fields.publishedDate"],

    include: 2,

    limit: 100,
  });

  return response.items;
}

export default async function BlogPage() {

  const blogs = await getBlogs();

  return (
    <main className="blog-page">
      {/* ========================= BLOG PAGE HEADER ========================== */} 
      <section className="blog-page-header"> 
        <h1>Blog</h1> 
        <p>Key insights on everything agentic process automation</p> 
        </section> 
        {/* ========================= BLOG LISTING ========================== */}

      <section className="blog-listing">

        <div className="blog-container">

          <div className="blog-grid">

            {blogs.map((blog: any) => (
              <BlogCard
                key={blog.sys.id}
                blog={blog}
              />
            ))}

          </div>

        </div>

      </section>

    </main>
  );
}