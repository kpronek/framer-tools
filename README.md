# ContinuumLogic Framer Tools

CLI scripts for managing the [continuumlogic.ai](https://www.continuumlogic.ai) blog via the Framer CMS API. No browser required — all operations run headlessly from the terminal.

## Setup

```bash
cd framer-tools
npm install
```

Set your API token (or leave the default in `config.mjs`):

```bash
export FRAMER_API_TOKEN=fr_7m5nrkep9q90xaa99tt2c2pm6y
```

## Workflow: Publishing a New Post

```bash
# 1. Upload your hero image
node scripts/upload-image.mjs ~/Desktop/my-hero.jpg "Alt text for image"
# → prints a CDN URL like https://framerusercontent.com/images/abc123.jpg

# 2. Create the draft post (edit POST object in create-post.mjs first)
node scripts/create-post.mjs

# 3. Set the thumbnail
node scripts/set-post-image.mjs your-post-slug "https://framerusercontent.com/images/abc123.jpg"

# 4. Update the article body from an HTML file (optional)
node scripts/update-post-body.mjs your-post-slug article-body.html

# 5. Publish when ready
node scripts/publish-post.mjs your-post-slug
```

## Scripts

| Script | Usage | Description |
|--------|-------|-------------|
| `list-posts.mjs` | `node scripts/list-posts.mjs` | List all posts (drafts and published) with IDs and slugs |
| `create-post.mjs` | `node scripts/create-post.mjs` | Create a new draft post — edit the `POST` object in the file first |
| `upload-image.mjs` | `node scripts/upload-image.mjs <path> "<alt>"` | Upload a local image to Framer CDN, returns URL |
| `set-post-image.mjs` | `node scripts/set-post-image.mjs <slug> <url>` | Set Thumbnail and Thumbnail LG fields on a post |
| `update-post-body.mjs` | `node scripts/update-post-body.mjs <slug> <html-file>` | Replace a post's article body from a local HTML file |
| `publish-post.mjs` | `node scripts/publish-post.mjs <slug> [--unpublish]` | Publish a draft, or revert a live post to draft |

## CMS Field Reference

| Field | ID | Type | Notes |
|-------|----|------|-------|
| Title | `cxNFEBWS0` | string | Post headline |
| Author | `MIEpfbDDd` | collectionReference | Use author node ID (see `AUTHORS` in config) |
| Date | `MG70hvk3w` | date | ISO 8601, e.g. `"2026-03-31T00:00:00.000Z"` |
| Blog Badge | `v2a9a81gI` | string | Category label shown on listing page |
| Short Description | `poJuAjULG` | string | Summary shown in blog listing card |
| Thumbnail | `R9GMT80ZT` | image | CDN URL string |
| Thumbnail LG | `Xrd_fJD2D` | image | CDN URL string (same as Thumbnail is fine) |
| Featured | `sORK_rd8F` | boolean | Show post in featured slot |
| Content | `jLSRvFuCr` | formattedText | Full article body as HTML |

## Blog Badge Values

Use one of these exact strings for the `blogBadge` field:

- `Revenue Operations Strategy`
- `AI-Powered Revenue Operations`
- `Partner-Led Growth`
- `Ecosystem-Led Growth`
- `Customer Success Operations`

## Known Author IDs

| Name | Node ID |
|------|---------|
| Kelly Pronek | `HtLp25GBN` |

## Config

All IDs and tokens live in `config.mjs`. The API token is also readable from `process.env.FRAMER_API_TOKEN` — use a `.env` file (gitignored) in production.

**Project:** [ContinuumLogic Framer project](https://framer.com/projects/ContinuumLogic--fN7qYz4K72y1Sf7xGi80-6oaCl)
**Live site:** https://www.continuumlogic.ai
**Blog collection:** `HHDz1TjlM`
**Authors collection:** `yNLvtf4Wn`
