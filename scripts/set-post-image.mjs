/**
 * Set the thumbnail and thumbnail-lg image for a blog post.
 *
 * Usage:
 *   node scripts/set-post-image.mjs <slug> <image-url>
 *
 * Example:
 *   node scripts/set-post-image.mjs elg-partner-model "https://framerusercontent.com/images/abc123.jpg"
 *
 * Both the Thumbnail and Thumbnail LG fields are set to the same URL.
 * Run upload-image.mjs first to get the CDN URL.
 */

import { connect } from "framer-api"
import { FRAMER_PROJECT_URL, FRAMER_API_TOKEN, BLOG_COLLECTION_ID, BLOG_FIELDS } from "../config.mjs"

const [slug, imageUrl] = process.argv.slice(2)

if (!slug || !imageUrl) {
  console.error("Usage: node scripts/set-post-image.mjs <slug> <image-url>")
  process.exit(1)
}

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const collection = await framer.getCollection(BLOG_COLLECTION_ID)
const items = await collection.getItems()

const item = items.find(i => i.slug === slug)
if (!item) {
  console.error(`❌ No post found with slug: ${slug}`)
  process.exit(1)
}

await collection.addItems([{
  id: item.id,
  slug: item.slug,
  draft: item.draft,
  fieldData: {
    [BLOG_FIELDS.thumbnail]:   { type: "image", value: imageUrl },
    [BLOG_FIELDS.thumbnailLg]: { type: "image", value: imageUrl },
  }
}])

console.log(`✅ Thumbnail set for: ${slug}`)
console.log(`   URL: ${imageUrl}`)
process.exit(0)
