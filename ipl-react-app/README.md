# IPL Ticket Booking

## Supabase setup

1. Create a Supabase project.
2. In the Supabase dashboard, open **SQL Editor**, paste the contents of `supabase/activity11.sql`, and run it. The script creates the tables and booking function, adds the six sample matches only when their IDs are absent, and enables the `matches` table in Realtime when the default publication is available.
3. Copy `.env.example` to `.env`. In **Project Settings → API**, copy the **Project URL** into `VITE_SUPABASE_URL` and the **Publishable key** into `VITE_SUPABASE_PUBLISHABLE_KEY`.
4. Restart the Vite development server after editing `.env`.

The browser uses only the publishable key. Never put a database password, `service_role` key, or secret key in this app.

## Run the app

```sh
npm install
npm run dev
```

Run `npm run build` to create a production build.

## Booking and security notes

The `book_ticket` PostgreSQL function inserts a booking and reduces available seats in one transaction. Row-level security lets visitors read matches; booking writes are performed through this function rather than direct table writes. The anonymous publishable key is public by design, so this educational app does not verify customer identity and is vulnerable to spam or fake bookings. Add authentication, rate limiting, and payment/booking verification before using it for real sales.

Realtime requires the `matches` table to be included in the `supabase_realtime` publication. The SQL script adds it when that publication exists; otherwise enable it for `matches` in the Supabase dashboard.
