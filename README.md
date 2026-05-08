# Feisty - Street Food Web App

Webapp untuk brand Feisty, FnB street food/kaki lima yang tersedia di depan minimarket.

## Tech Stack

- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Edge Functions)
- **Payment**: ipaymu (QRIS, VA)
- **Notifications**: Whacenter (WhatsApp)
- **Deployment**: Vercel (Frontend) + Supabase (Backend)
- **Domain**: feisty.my.id

## Project Structure

```
feisty-app/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with Navbar & Footer
│   ├── page.tsx            # Landing page (Hero)
│   ├── globals.css         # Global styles
│   └── ...                 # Other pages (menu, cart, checkout, orders)
├── components/             # Reusable UI components
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   └── Footer.tsx
├── lib/                    # Utilities & configurations
│   ├── supabase.ts         # Supabase client (browser)
│   ├── supabase-server.ts  # Supabase client (server-side)
│   └── database.types.ts   # TypeScript types for database
├── types/                  # TypeScript type definitions
│   └── index.ts            # Menu, CartItem, Order, OrderItem interfaces
├── public/                 # Static assets (images, icons)
└── supabase-schema.sql     # Database schema untuk Supabase
```

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Vercel account (untuk deployment)

### Local Development

1. **Clone & install dependencies**
   ```bash
   cd feisty-app
   npm install
   ```

2. **Setup Supabase**
   - Buat project di supabase.com
   - Copy `.env.local.example` ke `.env.local`
   - Isi environment variables dengan Supabase credentials
   - Run SQL schema di `supabase-schema.sql` pada Supabase SQL Editor

3. **Run dev server**
   ```bash
   npm run dev
   ```
   Buka http://localhost:3010 (port diubah dari 3000 agar tidak konflik)

### Build & Production

```bash
npm run build    # Build untuk production
npm run start    # Run production server
npm run lint     # Check code quality
```

## Database Schema

### Tables
- **menus** - Data menu makanan/minuman
- **orders** - Header pesanan
- **order_items** - Detail item pesanan
- **payments** - Informasi pembayaran (ipaymu)

### Indexes & Policies
- RLS enabled untuk semua tables
- Public bisa lihat menu yang available
- Customer bisa create order (tanpa auth)
- Order record terlink ke phone number customer

## Environment Variables

See `.env.local.example` for all required variables.

**Required:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)

**Optional (untuk later phases):**
- `IPAYMU_API_KEY`, `IPAYMU_VA`
- `WHACENTER_API_KEY`, `WHACENTER_PHONE_NUMBER`

## Deployment

### Vercel (Frontend)

1. Push ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Add custom domain `feisty.my.id`
5. Deploy!

### Supabase (Backend)

Sudah included dalam Vercel deployment. Cukup isi env variables.

### Domain Setup (feisty.my.id)

Jika domain仍在 Cloudflare atau registrar lain:

**CNAME (jika via Cloudflare/nameserver lain):**
```
Type: CNAME
Name: @  (atau www)
Value: cname.vercel-dns.com
```

**A Records (jika tidak menggunakan Cloudflare):**
```
Type: A
Name: @
Value: 76.76.21.21
```

TTL: Auto (3600)

## Features (Planned)

- ✅ Landing page dengan brand Feisty
- ✅ Menus listing (fetch dari Supabase)
- ⏳ Cart with localStorage
- ⏳ Checkout form
- ⏳ Payment integration (ipaymu)
- ⏳ Order tracking by phone number
- ⏳ WhatsApp notifications (Whacenter)
- ⏳ Admin panel untuk manage orders & menu

## API Routes (Future)

```
POST   /api/orders          - Create new order
GET    /api/orders/:id      - Get order detail
PUT    /api/orders/:id      - Update order status
POST   /api/payment/callback - ipaymu webhook
POST   /api/whatsapp/send   - Send WA notification
GET    /api/menu            - Fetch active menus
```

## Testing Checklist

- [ ] Landing page renders correctly di mobile & desktop
- [ ] Navbar links navigasi ke respective pages
- [ ] Supabase connection established
- [ ] Build success without errors
- [ ] Lint passing
- [ ] Deploy ke Vercel (preview)
- [ ] Domain configured

## Troubleshooting

**Build error "Turbopack not supported"** → Use `npm run build -- --webpack`

**Supabase connection failed** → Check env variables, project active state

**TypeScript errors** → Run `npm run typecheck`

**Vercel build failed** → Check logs, ensure env variables set correctly

---

Made with by Feisty Team 🍔