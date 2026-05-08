# Feisty Street Food - Setup Guide

## 1. Supabase Setup

### Create Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign up/login
2. Click "New Project"
3. Enter project details:
   - **Name**: feisty
   - **Database Password**: (simpan password ini)
   - **Region**: Asia Pacific (Singapore) - untuk latency lebih baik
4. Wait for project to be created (~2 min)

### Get API Keys
1. Go to Project Settings → API
2. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (tampilkan dengan klik "reveal")

### Setup Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy contents of `supabase-schema.sql` (ada di root project)
4. Paste and click "Run"
5. Schema akan ter-create: `menus`, `orders`, `order_items`, `payments`

### Storage (Optional untuk gambar menu)
1. Go to Storage → Create bucket
2. **Name**: `menu-images`
3. **Public bucket**: ON
4. Upload gambar menu ke bucket ini

## 2. Environment Variables

Buat file `.env.local` di root project:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ipaymu (belum tersedia, skip dulu)
IPAYMU_API_KEY=
IPAYMU_VA=
IPAYMU_CALLBACK_URL=https://feisty.my.id/api/payment/callback

# Whacenter (belum tersedia, skip dulu)
WHACENTER_API_KEY=
WHACENTER_PHONE_NUMBER=

# App
NEXT_PUBLIC_APP_URL=https://feisty.my.id
```

> **Note**: ipaymu dan Whacender bisa diisi nanti setelah frontend & Supabase jalan.

## 3. Vercel Deployment

### Connect GitHub
1. Push code ke GitHub repository
2. Go to [vercel.com](https://vercel.com)
3. Import project dari GitHub
4. Vercel auto-detect Next.js, klik "Deploy"

### Environment di Vercel
1. Setelah deploy, go to Project Settings → Environment Variables
2. Add semua env variables yang di `.env.local`
3. Redeploy untuk apply env variables

### Custom Domain
1. Project Settings → Domains
2. Add domain: `feisty.my.id`
3. Vercel akan kasih DNS records (CNAME atau A records)
4. Configure di domain registrar (atau Cloudflare):

   **Jika domain di Cloudflare:**
   ```
   Type: CNAME
   Name: @  (atau feisty)
   Value: cname.vercel-dns.com
   Proxy: DNS only (orange → gray)
   ```

   **Atau A records (jika tanpa Cloudflare):**
   ```
   Type: A
   Name: @
   Values: 76.76.21.21
   ```

5. Wait ~5-30 min, Vercel akan verify domain dan issue SSL

## 4. Testing Locally

```bash
cd feisty-app
npm run dev
```

Buka http://localhost:3000. Harus muncul landing page Feisty.

Test Supabase connection (bisa di console browser):
```javascript
fetch('/api/test-supabase').then(r => r.json())
```

## 5. Next Development Steps (Setelah Setup)

1. **Menu Page** (`/menu`): Fetch menus dari Supabase, display grid
2. **Cart**: React Context + localStorage
3. **Checkout**: Form (name, phone, address, order type) → create order di Supabase
4. **Payment**: Redirect ke ipaymu, webhook update status
5. **Order Tracking**: Cek status order lewat phone number
6. **Admin Panel**: Manage orders & menu (simple CRUD)

## Troubleshooting

- **Env variable not loaded**: Pastikan `.env.local` ada di root (sama level dengan `package.json`)
- **Supabase connection error**: Cek URL & key, pastikan project active
- **TypeScript errors**: Run `npm run typecheck`
- **Build error di Vercel**: Check Vercel logs di dashboard

## Need Help?

- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- Vercel Docs: https://vercel.com/docs

---

**Status**: Frontend & Supabase schema siap. Sekarang:
1. Buat Supabase project
2. Run SQL schema
3. Setup env variables
4. Deploy ke Vercel
5. Configure domain