/**
 * Create a new blog post in the Framer CMS.
 *
 * Edit the POST object below, then run:
 *   node scripts/create-post.mjs
 *
 * The post is created as a DRAFT by default.
 * Run publish-post.mjs when ready to go live.
 */

import { connect } from "framer-api"
import {
  FRAMER_PROJECT_URL,
  FRAMER_API_TOKEN,
  BLOG_COLLECTION_ID,
  BLOG_FIELDS,
  AUTHORS,
} from "../config.mjs"

// ─── Edit this section for each new post ─────────────────────────────────────

const POST = {
  slug: "your-post-slug-here",          // URL-friendly, lowercase, hyphens only
  title: "Your Post Title Here",
  author: AUTHORS.kellyPronek,           // nodeId from config.mjs
  date: "2026-04-01T00:00:00.000Z",      // ISO 8601
  blogBadge: "Revenue Operations Strategy", // Category label
  shortDescription: "A one-paragraph summary shown in the blog listing.",
  featured: false,
  // Write full article HTML here. Use <h2>, <p>, <strong>, <a href="...">, <ul><li> etc.
  content: `
<h2 dir="auto">Section One</h2>
<p dir="auto">Your content here.</p>
`.trim(),
}

// ─────────────────────────────────────────────────────────────────────────────

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const collection = await framer.getCollection(BLOG_COLLECTION_ID)

await collection.addItems([{
  slug: POST.slug,
  draft: true,
  fieldData: {
    [BLOG_FIELDS.title]:            { type: "string",              value: POST.title },
    [BLOG_FIELDS.author]:           { type: "collectionReference", value: POST.author },
    [BLOG_FIELDS.date]:             { type: "date",                value: POST.date },
    [BLOG_FIELDS.blogBadge]:        { type: "string",              value: POST.blogBadge },
    [BLOG_FIELDS.shortDescription]: { type: "string",              value: POST.shortDescription },
    [BLOG_FIELDS.featured]:         { type: "boolean",             value: POST.featured },
    [BLOG_FIELDS.content]:          { type: "formattedText",       value: POST.content },
  }
}])

console.log(`✅ Draft post created!`)
console.log(`   Slug:  ${POST.slug}`)
console.log(`   Title: ${POST.title}`)
console.log()
console.log("Next steps:")
console.log(`  1. Upload hero image:   node scripts/upload-image.mjs <path> "<alt text>"`)
console.log(`  2. Set thumbnail:       node scripts/set-post-image.mjs ${POST.slug} <image-url>`)
console.log(`  3. Publish when ready:  node scripts/publish-post.mjs ${POST.slug}`)
process.exit(0)
