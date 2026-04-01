/**
 * Upload a local image file to Framer's CDN.
 * Prints the resulting CDN URL — use it with set-post-image.mjs.
 *
 * Usage:
 *   node scripts/upload-image.mjs <path-to-image> "<alt text>"
 *
 * Example:
 *   node scripts/upload-image.mjs ~/Desktop/hero.jpg "ELG Partner Model diagram"
 */

import { connect } from "framer-api"
import { readFileSync } from "fs"
import { extname, basename } from "path"
import { FRAMER_PROJECT_URL, FRAMER_API_TOKEN } from "../config.mjs"

const [imagePath, altText = ""] = process.argv.slice(2)

if (!imagePath) {
  console.error("Usage: node scripts/upload-image.mjs <path-to-image> \"<alt text>\"")
  process.exit(1)
}

const ext = extname(imagePath).toLowerCase().replace(".", "")
const mimeTypes = { jpg: "image/jpeg", jpeg: "image/jpeg", png: "image/png", gif: "image/gif", webp: "image/webp", svg: "image/svg+xml" }
const mimeType = mimeTypes[ext] || "application/octet-stream"

const bytes = readFileSync(imagePath)

const framer = await connect(FRAMER_PROJECT_URL, FRAMER_API_TOKEN)
const result = await framer.uploadImage({ bytes, mimeType })

console.log(`✅ Image uploaded!`)
console.log(`   File:  ${basename(imagePath)}`)
console.log(`   URL:   ${result.url}`)
console.log()
console.log("Next step — set as post thumbnail:")
console.log(`  node scripts/set-post-image.mjs <slug> "${result.url}"`)
process.exit(0)
