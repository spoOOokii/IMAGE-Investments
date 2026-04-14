import { getPublishedBlogPosts } from "@/lib/admin-blog-store";

const baseUrl = "https://www.imageinvestments-eg.com";

export async function GET() {
  const posts = await getPublishedBlogPosts();
  const items = posts
    .map(
      (post) => `
        <item>
          <title><![CDATA[${post.title.en}]]></title>
          <link>${baseUrl}/en/blog/${post.slug}</link>
          <guid>${baseUrl}/en/blog/${post.slug}</guid>
          <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
          <description><![CDATA[${post.excerpt.en}]]></description>
        </item>`,
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
    <rss version="2.0">
      <channel>
        <title>Image Investments Blog</title>
        <link>${baseUrl}/en/blog</link>
        <description>Latest market insights and property articles from Image Investments.</description>
        ${items}
      </channel>
    </rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
