# Webkit — Project Plan

A reusable Next.js starter template for small business websites. Clone, customize, deploy.

---

## 1. Tech Stack

| Layer          | Choice                                | Why                                                      |
| -------------- | ------------------------------------- | -------------------------------------------------------- |
| Framework      | Next.js 16 (App Router + Server Actions) | Industry standard, great DX, self-hostable            |
| Language       | TypeScript 5.7+                       | Type safety, better AI-assisted development              |
| Database       | PostgreSQL 17 + Prisma 7              | Ecosystem, Prisma Studio, strong community               |
| Media Storage  | Local filesystem + storage abstraction | Simple now, swap to S3/MinIO later without rewriting     |
| Admin UI       | shadcn/ui (v4, RTL) + Tailwind CSS 4  | Accessible, customizable, native RTL support             |
| Auth           | Custom (bcrypt + iron-session v8)     | ~50 lines, admin-only, no library opinions to fight      |
| Email          | Google SMTP + Resend fallback         | Redundancy, Gmail for primary, Resend as safety net      |
| i18n           | next-intl v4                          | Built for App Router, clean RTL, proxy.ts compatible     |
| Validation     | Zod                                   | Server action validation, pairs with Prisma + shadcn     |
| Image Processing | sharp                               | Server-side resize/compress before storage               |
| Deployment     | Docker Compose (Nginx + App + PG + Backup) | Single command deploy on VPS                        |

---

## 2. Features

### Public-facing (custom design per client)
- Landing page (hero, features, testimonials)
- Services page (data from CMS)
- Photo gallery (data from CMS)
- Contact form (email notification + saved to DB)
- WhatsApp lead capture (visitor enters number → saved → redirected to wa.me)
- SEO: dynamic meta/OG tags, auto sitemap, JSON-LD local business schema

### Admin panel (shadcn, reusable across clients)
- Login page (admin-only, no registration)
- Dashboard overview
- Site settings (business name, phone, address, socials, WhatsApp number, logo)
- Services CRUD (create, edit, delete, reorder, publish/unpublish)
- Gallery management (upload, delete, reorder)
- Form submissions log (contact + WhatsApp leads, mark as read)
- i18n: English + Arabic with RTL

---

## 3. Database Schema

### AdminUser
| Column       | Type     | Notes                |
| ------------ | -------- | -------------------- |
| id           | String   | cuid, primary key    |
| email        | String   | unique               |
| passwordHash | String   |                      |
| name         | String   |                      |
| createdAt    | DateTime | auto                 |
| updatedAt    | DateTime | auto                 |

### SiteSettings (singleton — single row, always upsert)
| Column             | Type    | Notes                          |
| ------------------ | ------- | ------------------------------ |
| id                 | String  | default "default"              |
| businessName       | String  |                                |
| businessNameAr     | String? | Arabic translation             |
| phone              | String? |                                |
| whatsappNumber     | String? |                                |
| email              | String? |                                |
| address            | String? |                                |
| addressAr          | String? |                                |
| logoUrl            | String? |                                |
| socialFacebook     | String? |                                |
| socialInstagram    | String? |                                |
| socialTwitter      | String? |                                |
| socialLinkedin     | String? |                                |
| metaTitle          | String? |                                |
| metaTitleAr        | String? |                                |
| metaDescription    | String? |                                |
| metaDescriptionAr  | String? |                                |
| updatedAt          | DateTime | auto                          |

### Service
| Column        | Type     | Notes                |
| ------------- | -------- | -------------------- |
| id            | String   | cuid, primary key    |
| slug          | String   | unique               |
| title         | String   |                      |
| titleAr       | String   |                      |
| description   | String   | text                 |
| descriptionAr | String   | text                 |
| imageUrl      | String?  |                      |
| sortOrder     | Int      | default 0, indexed   |
| isPublished   | Boolean  | default true         |
| createdAt     | DateTime | auto                 |
| updatedAt     | DateTime | auto                 |

### GalleryImage
| Column    | Type     | Notes                |
| --------- | -------- | -------------------- |
| id        | String   | cuid, primary key    |
| url       | String   |                      |
| altText   | String?  |                      |
| altTextAr | String?  |                      |
| sortOrder | Int      | default 0, indexed   |
| createdAt | DateTime | auto                 |

### ContactSubmission
| Column    | Type     | Notes                |
| --------- | -------- | -------------------- |
| id        | String   | cuid, primary key    |
| name      | String   |                      |
| email     | String?  |                      |
| phone     | String?  |                      |
| message   | String   | text                 |
| isRead    | Boolean  | default false        |
| createdAt | DateTime | auto, indexed        |

### WhatsAppLead
| Column    | Type     | Notes                |
| --------- | -------- | -------------------- |
| id        | String   | cuid, primary key    |
| name      | String?  |                      |
| phone     | String   |                      |
| source    | String?  | which page they came from |
| createdAt | DateTime | auto, indexed        |

### Design notes
- cuid() for all primary keys (URL-safe, sortable, no sequential exposure)
- i18n fields as separate columns (title + titleAr) — simple for two languages, full Prisma type safety
- SiteSettings as singleton: always query with `where: { id: "default" }`, use `upsert` for writes
- If 3+ languages needed in future, migrate to a translation table pattern

---

## 4. Architecture

### Project Structure
```
webkit/
├── docker-compose.yml
├── Dockerfile
├── .env.example
├── nginx/
│   └── nginx.conf
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
├── src/
│   ├── proxy.ts                    # next-intl locale routing + auth protection
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── (public)/           # landing, gallery, contact, services
│   │   │   │   ├── page.tsx        # landing
│   │   │   │   ├── services/
│   │   │   │   ├── gallery/
│   │   │   │   └── contact/
│   │   │   ├── (admin)/
│   │   │   │   ├── admin/
│   │   │   │   │   ├── layout.tsx  # admin shell (sidebar, header)
│   │   │   │   │   ├── page.tsx    # dashboard
│   │   │   │   │   ├── settings/
│   │   │   │   │   ├── services/
│   │   │   │   │   ├── gallery/
│   │   │   │   │   ├── submissions/
│   │   │   │   │   └── login/
│   │   │   │   └── layout.tsx
│   │   │   └── layout.tsx          # root locale layout (html dir, fonts)
│   │   └── api/                    # API routes if needed
│   ├── components/
│   │   ├── admin/                  # shadcn CMS components (reusable)
│   │   └── public/                 # client-facing (custom per project)
│   ├── lib/
│   │   ├── auth/
│   │   │   ├── session.ts          # iron-session config + helpers
│   │   │   └── password.ts         # bcrypt hash/verify
│   │   ├── db/
│   │   │   └── client.ts           # Prisma singleton
│   │   ├── storage/
│   │   │   ├── types.ts            # StorageProvider interface
│   │   │   ├── local.ts            # local filesystem implementation
│   │   │   ├── s3.ts               # future S3/MinIO implementation
│   │   │   └── index.ts            # exports active provider based on env
│   │   ├── email/
│   │   │   ├── types.ts            # EmailProvider interface
│   │   │   ├── smtp.ts             # Google SMTP via nodemailer
│   │   │   ├── resend.ts           # Resend SDK
│   │   │   └── index.ts            # primary + fallback orchestration
│   │   └── i18n/
│   │       ├── config.ts           # next-intl setup
│   │       └── request.ts          # getRequestConfig
│   └── messages/
│       ├── en.json
│       └── ar.json
├── uploads/                        # local file storage (Docker volume)
└── backups/                        # pg_dump output (Docker volume)
```

### Proxy Chain (src/proxy.ts)

Next.js 16 uses `proxy.ts` (not `middleware.ts`). Two concerns chained:

1. **next-intl** runs first — detects locale from URL prefix (`/en/...`, `/ar/...`), redirects if missing
2. **Auth check** runs second — if path matches `/[locale]/admin/*` (except login), verify iron-session cookie. Redirect to login if invalid.

Admin routes live under the locale prefix (`/en/admin`, `/ar/admin`) to avoid fighting next-intl's matcher.

### Storage Abstraction

```typescript
interface StorageProvider {
  upload(file: Buffer, filename: string, mimeType: string): Promise<StorageResult>
  delete(key: string): Promise<void>
  getUrl(key: string): string
  exists(key: string): Promise<boolean>
}

interface StorageResult {
  key: string    // e.g., "gallery/abc123.jpg"
  url: string    // public URL
  size: number
}
```

- Local implementation stores in `uploads/` directory
- File naming: `${cuid()}-${sanitizedOriginalName}` to prevent collisions
- Selection via `STORAGE_PROVIDER=local|s3` env var
- Images processed with sharp (resize/compress) before storage
- Max upload size: 5MB (configured in next.config.ts `serverActions.bodySizeLimit`)

### Email Abstraction

```typescript
interface EmailProvider {
  send(options: EmailOptions): Promise<EmailResult>
}
```

- Google SMTP primary (nodemailer, App Password, ~100-150 emails/day limit)
- Resend fallback (API-based, free tier available)
- Try primary → on failure → try fallback → log result
- Selection via `EMAIL_PRIMARY=smtp`, `EMAIL_FALLBACK=resend` env vars

---

## 5. Docker Stack

### Services
| Service | Image              | Purpose                           |
| ------- | ------------------ | --------------------------------- |
| nginx   | nginx:alpine       | Reverse proxy, SSL, static cache  |
| app     | Custom (Dockerfile) | Next.js application              |
| db      | postgres:17-alpine | Database                          |
| backup  | Custom (Alpine + cron) | Automated pg_dump backups      |

### Dockerfile (multi-stage)
1. **base** — `node:22-slim` (not Alpine — sharp compatibility)
2. **deps** — `npm ci` + `prisma generate`
3. **builder** — `next build` with `output: 'standalone'`
4. **runner** — Clean image, non-root user, copy standalone + static + public

### Nginx config highlights
- Proxy to `app:3000`
- SSL termination
- `client_max_body_size 10M` for uploads
- Cache `/_next/static/` with `immutable` headers
- Serve `/uploads/` directly from shared volume
- Proxy headers: `X-Forwarded-For`, `X-Forwarded-Proto`, `X-Real-IP`, `Host`

### Backup strategy
- `pg_dump` on daily cron (2 AM)
- Compressed output to `./backups/` bind mount
- Retention: 7 daily, 4 weekly
- Accessible from host for offsite copy

### Volumes
- `postgres_data` — named volume for DB persistence
- `./backups:/backups` — bind mount for backup files
- `./uploads:/app/public/uploads` — bind mount shared between app + nginx

---

## 6. Developer Experience

### .env.example
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/webkit

# Auth
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=changeme
SESSION_SECRET=generate-a-32-char-random-string

# Site
SITE_NAME=My Business
SITE_URL=https://example.com
WHATSAPP_NUMBER=+1234567890

# Storage
STORAGE_PROVIDER=local
UPLOAD_DIR=./uploads

# Email — Primary (Google SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password

# Email — Fallback (Resend)
RESEND_API_KEY=re_xxxxx
EMAIL_FROM=noreply@example.com

# i18n
DEFAULT_LOCALE=en
```

### Setup script (`npm run setup`)
Interactive prompts for:
- Client/business name
- Admin email + password
- WhatsApp number
- Default locale

Writes `.env`, runs `prisma migrate deploy`, runs `prisma db seed`.

### Seed data (`prisma/seed.ts`)
Creates:
- Admin user (from env vars)
- Default site settings
- 3 sample services with placeholder images
- 5 sample gallery images
- 2 sample contact submissions

---

## 7. Known Gotchas

| Issue | Detail | Mitigation |
| ----- | ------ | ---------- |
| proxy.ts rename | Next.js 16 uses `proxy.ts` not `middleware.ts` | Never create middleware.ts, follow next-intl v4 migration docs |
| Prisma 7 driver adapters | Must install `@prisma/adapter-pg` + `pg` separately | Include in package.json from the start |
| Prisma singleton | Hot reload creates new clients, exhausts DB connections | Store PrismaClient on `globalThis` in dev |
| sharp + Alpine | sharp breaks on Alpine Linux | Use `node:22-slim` (Debian) for Docker |
| shadcn RTL | Must initialize with `--rtl` flag | Run `npx shadcn@latest init --rtl` in step 1 |
| Server Action body size | Default 1MB limit blocks image uploads | Set `serverActions.bodySizeLimit: '5mb'` in next.config.ts |
| iron-session in proxy | Needs `cookies()` from next/headers | Works in Next.js 16 (Node.js runtime, not Edge) |
| Google SMTP rate limit | ~100-150 emails/day | Fine for admin notifications; Resend fallback covers overflow |
| CSS logical properties | RTL requires `ps-4` not `pl-4`, `text-start` not `text-left` | Use logical properties everywhere in custom Tailwind classes |
| Uploads volume | Not baked into Docker image — runtime data | Must be a persistent bind mount shared between app + nginx |
| next-intl admin routes | Admin under locale prefix to avoid fighting matcher | `/en/admin`, `/ar/admin` — not `/admin` |

---

## 8. Build Order

| #  | Step                      | What                                                              | Depends on |
| -- | ------------------------- | ----------------------------------------------------------------- | ---------- |
| 1  | Project setup             | Next.js 16 + TS + Tailwind 4 + shadcn (--rtl) + Postgres + Prisma 7 | —        |
| 2  | Auth                      | bcrypt + iron-session, login page, proxy.ts route protection      | 1          |
| 3  | Admin panel + site settings | Admin layout (sidebar, header), site settings CRUD              | 1, 2       |
| 4  | Services CRUD             | Create, edit, delete, reorder, publish/unpublish from admin       | 3          |
| 5  | Media + gallery           | Storage abstraction, upload, display grid, delete                 | 3          |
| 6  | Lead capture              | Contact form + WhatsApp flow + submissions log in admin           | 3          |
| 7  | Email                     | Google SMTP + Resend fallback, contact form notifications         | 6          |
| 8  | Public page templates     | Landing, services, gallery, contact (pulling CMS data)            | 4, 5, 6    |
| 9  | SEO                       | Dynamic meta/OG, sitemap, JSON-LD local business                  | 8          |
| 10 | i18n                      | next-intl config, locale routing, RTL, translations               | 8          |
| 11 | Seed data + setup script  | `npm run setup`, admin user + dummy content                       | all above  |
| 12 | Docker + Nginx + backup   | Dockerfile, docker-compose.yml, nginx.conf, pg_dump cron          | all above  |

### Build order rationale
- Auth before admin panel — need session infrastructure before protecting routes
- Admin CMS first, public pages later — the reusable part is the admin; public pages are custom per client anyway
- i18n late — architecture is i18n-ready from step 1 (shadcn RTL, locale routing structure) but actual translations added near the end to avoid slowing down every step
- Docker last — develop locally, containerize when everything works
