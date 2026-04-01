# ContinuumLogic Publishing Workflows

This document describes the systems and workflows involved in publishing content to the continuumlogic.ai website.

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         continuumlogic.ai Website                           │
│                      (Live Published Blog + Content)                        │
└─────────────────────────────────────────────────────────────────────────────┘
                                      ▲
                                      │ reads & renders
                                      │
                    ┌─────────────────┴─────────────────┐
                    │                                   │
         ┌──────────▼──────────┐          ┌────────────▼────────────┐
         │   Framer CMS        │          │   Framer CDN            │
         │  (Blog Data Store)  │          │  (Image Hosting)        │
         │                     │          │                         │
         │ • Posts (draft/live)│◄─────────┤ • Hero images           │
         │ • Metadata          │  URLs    │ • Thumbnails            │
         │ • Content HTML      │          │ • Featured images       │
         │ • Authors           │          │                         │
         └──────────▲──────────┘          └─────────────────────────┘
                    │
                    │ API calls (WebSocket)
                    │
         ┌──────────┴──────────┐
         │                     │
         │  framer-tools CLI   │
         │  (Local Node.js)    │
         │                     │
         │ Scripts:            │
         │ • upload-image      │
         │ • create-post       │
         │ • set-post-image    │
         │ • update-post-body  │
         │ • publish-post      │
         │ • list-posts        │
         └──────────▲──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼────┐           ┌────▼────┐
    │ GitHub  │           │ Local   │
    │ Repo    │           │ Content │
    │         │           │ Files   │
    │ Code    │           │         │
    │ History │           │ HTML    │
    │ Docs    │           │ Images  │
    └─────────┘           └────────┘
```

## Content Publishing Workflow

The typical flow for publishing a new blog post:

```
1. PREPARE LOCAL CONTENT
   └─> Create or edit:
       • article-body.html (post content)
       • hero-image.jpg (featured image)
       • any supporting assets

2. UPLOAD HERO IMAGE
   $ node scripts/upload-image.mjs ~/path/to/hero.jpg "Alt text"
   └─> Returns: CDN URL

3. CREATE DRAFT POST
   $ node scripts/create-post.mjs
   └─> Creates post in Framer CMS (draft status)
   └─> Returns: post slug

4. SET POST THUMBNAIL
   $ node scripts/set-post-image.mjs <slug> "https://framerusercontent.com/..."
   └─> Updates Thumbnail & Thumbnail LG fields in Framer CMS

5. UPDATE ARTICLE BODY (optional)
   $ node scripts/update-post-body.mjs <slug> article-body.html
   └─> Reads HTML file
   └─> Updates Content field in Framer CMS

6. REVIEW IN FRAMER UI
   └─> Log in to Framer project
   └─> Review post metadata, preview on live site

7. PUBLISH TO LIVE
   $ node scripts/publish-post.mjs <slug>
   └─> Sets draft: false in Framer CMS
   └─> Post appears on continuumlogic.ai website

8. VERSION CONTROL (optional)
   $ git add scripts/ README.md config.mjs
   $ git commit -m "Update scripts or docs"
   $ git push origin feature/branch-name
   └─> Create PR to main
   └─> Keep GitHub up-to-date with tool changes
```

## Code Management Workflow

How framer-tools code is managed and deployed:

```
1. LOCAL DEVELOPMENT
   ├─> Create feature branch
   │   $ git checkout -b feature/new-script
   ├─> Edit/add scripts in scripts/
   ├─> Test locally
   │   $ node scripts/my-script.mjs --test
   └─> Verify against framer-tools README

2. VERSION CONTROL
   ├─> Stage changes
   │   $ git add scripts/ config.mjs README.md
   ├─> Commit with descriptive message
   │   $ git commit -m "Add new feature or fix"
   └─> Push to GitHub
       $ git push origin feature/new-script

3. CODE REVIEW (optional but recommended)
   ├─> Create Pull Request on GitHub
   │   • framer-tools repository
   │   • Target: main branch
   │   • Describe changes and rationale
   └─> Review changes in PR UI
       • Code diff review
       • Usage examples
       • Update to README if needed

4. DEPLOYMENT
   ├─> Merge PR to main (via GitHub UI)
   └─> Pull main locally to get latest
       $ git pull origin main
       $ npm install (if deps changed)
```

## Data Flow: Local → Framer → Public

### Image Publishing Flow
```
local file (jpg/png)
    ↓
[upload-image.mjs reads bytes]
    ↓
[framer-api sends to Framer CMS]
    ↓
[Framer uploads to CDN]
    ↓
CDN URL returned
    ↓
[set-post-image.mjs updates post]
    ↓
Framer CMS stores URL in Thumbnail field
    ↓
Website renders <img src="CDN_URL">
    ↓
continuumlogic.ai displays hero image
```

### Content Publishing Flow
```
local article-body.html file
    ↓
[update-post-body.mjs reads HTML]
    ↓
[framer-api sends to Framer CMS]
    ↓
Framer CMS stores in Content field (formattedText)
    ↓
Website renders HTML from Content field
    ↓
continuumlogic.ai displays article body
```

### Post Lifecycle Flow
```
[CREATE: draft → Framer CMS, draft: true]
    ↓
[EDIT: metadata via set-post-image, update-post-body]
    ↓
[REVIEW: preview in Framer UI or site]
    ↓
[PUBLISH: publish-post.mjs sets draft: false]
    ↓
[LIVE: post appears on continuumlogic.ai]
    ↓
[UNPUBLISH (if needed): publish-post.mjs --unpublish reverts draft: true]
```

## System Connections & Dependencies

### Framer CMS ↔ framer-tools
- **Connection:** Framer Server API (WebSocket)
- **Authentication:** FRAMER_API_TOKEN (configured in config.mjs)
- **Operations:**
  - Query posts by slug
  - Create new items
  - Update field data
  - Toggle draft status

### Framer CMS ↔ Framer CDN
- **Connection:** Internal (Framer's infrastructure)
- **Data:** Image URLs stored in Framer CMS fields
- **Result:** Website can reference CDN URLs in post metadata

### Framer CMS ↔ continuumlogic.ai Website
- **Connection:** Framer's hosted site reads from CMS
- **Data:** All post data (title, content, metadata, images)
- **Update Frequency:** Real-time (when post published/draft status changes)

### GitHub ↔ Local Development
- **Connection:** Git (version control)
- **Data:** Source code, scripts, documentation
- **Purpose:**
  - Track changes to framer-tools
  - Collaborate & review code
  - Maintain history of tool updates
  - Portfolio visibility

### Local Content ↔ framer-tools ↔ Framer CMS
- **Connection:** Node.js scripts
- **Data Flow:** Local files → framer-api → Framer CMS API
- **User Controls:** Manual script execution in terminal

## Key Integration Points

| System | Role | Updated By | Read By |
|--------|------|-----------|---------|
| **Local Files** | Source for content & images | Author (you) | framer-tools scripts |
| **framer-tools** | Publishing orchestration | Developer (you) | Author (you) via CLI |
| **Framer CMS** | Data store & versioning | framer-tools scripts | Website renderer |
| **Framer CDN** | Image hosting | Framer CMS | Website <img> tags |
| **GitHub** | Code history & visibility | git commits | Team + public |
| **continuumlogic.ai** | Public interface | Framer CMS (auto) | Readers |

## Typical Content Creation Session

```
Morning: Content Creation
├─ Write article in Markdown or HTML
├─ Create hero image (design tool)
└─ Save to local directory

Afternoon: Publishing
├─ Upload hero image
│  $ node scripts/upload-image.mjs hero.jpg "Alt text"
│  → Copy returned CDN URL
├─ Create draft post
│  $ node scripts/create-post.mjs
│  → Edit POST object for metadata, get back slug
├─ Set thumbnail
│  $ node scripts/set-post-image.mjs elg-partner-model "https://..."
├─ Update body from HTML file
│  $ node scripts/update-post-body.mjs elg-partner-model article.html
├─ Preview in Framer UI
├─ Publish when ready
│  $ node scripts/publish-post.mjs elg-partner-model
└─ Website updates automatically

Evening: Document Changes (optional)
└─ Commit tool updates if any
   $ git add scripts/ && git commit -m "..."
   $ git push origin feature/branch
   └─ Create PR for code review
```

## Emergency Workflows

### If a post needs unpublishing
```bash
$ node scripts/publish-post.mjs <slug> --unpublish
# Post reverts to draft, disappears from live site
```

### If a post needs urgent content update
```bash
$ node scripts/update-post-body.mjs <slug> updated-body.html
# No need to unpublish/republish — just update the content
```

### If you need to review draft posts
```bash
$ node scripts/list-posts.mjs
# Shows all posts with IDs, slugs, and draft status
```

## Notes

- **No Manual CMS Access Required** — framer-tools handles all API calls; you don't need to log into Framer's UI for routine publishing
- **Idempotent Updates** — You can run update scripts multiple times without side effects
- **Version Control** — Keep framer-tools scripts in GitHub for accountability and rollback capability
- **Author Assignment** — Posts default to Kelly Pronek (node ID `HtLp25GBN`); modify in create-post.mjs if needed
- **Images Are Permanent** — Once uploaded to CDN, they persist even if post is unpublished
