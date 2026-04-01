/**
 * ContinuumLogic Framer Site Configuration
 *
 * Project URL: https://framer.com/projects/ContinuumLogic--fN7qYz4K72y1Sf7xGi80-6oaCl
 * Live site:   https://www.continuumlogic.ai
 */

export const FRAMER_PROJECT_URL =
  "https://framer.com/projects/ContinuumLogic--fN7qYz4K72y1Sf7xGi80-6oaCl"

// Get this from Framer → Settings → API (keep it out of version control — use .env in production)
export const FRAMER_API_TOKEN = process.env.FRAMER_API_TOKEN || "fr_7m5nrkep9q90xaa99tt2c2pm6y"

// ─── Collection IDs ──────────────────────────────────────────────────────────

export const BLOG_COLLECTION_ID = "HHDz1TjlM"
export const AUTHORS_COLLECTION_ID = "yNLvtf4Wn"

// ─── Blog CMS Field IDs ───────────────────────────────────────────────────────
// Use these when calling collection.addItems([{ fieldData: { ... } }])

export const BLOG_FIELDS = {
  title:            "cxNFEBWS0",  // string  — Headline of the blog post
  author:           "MIEpfbDDd",  // collectionReference — Must use author nodeId (not slug)
  date:             "MG70hvk3w",  // date    — ISO 8601 string e.g. "2026-03-31T00:00:00.000Z"
  blogBadge:        "v2a9a81gI",  // string  — Category label e.g. "Revenue Operations Strategy"
  shortDescription: "poJuAjULG",  // string  — Short summary shown in blog listing
  thumbnail:        "R9GMT80ZT",  // image   — Main blog image (set as URL string)
  thumbnailLg:      "Xrd_fJD2D",  // image   — Larger version of the image (set as URL string)
  featured:         "sORK_rd8F",  // boolean — Whether to feature the post
  content:          "jLSRvFuCr",  // formattedText — Full article body as HTML
}

// ─── Known Author Node IDs ───────────────────────────────────────────────────

export const AUTHORS = {
  kellyPronek: "HtLp25GBN",
}
