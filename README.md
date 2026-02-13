# 💍 Wedding Wishes – Full Stack Digital Wedding Platform

A production-ready digital wedding platform built with **Next.js 16**, **Supabase**, and **Cloudinary**.

Guests can submit wedding wishes with a 15–60 second video (<150MB).  
Wishes are reviewed and approved by admins before becoming publicly visible.

This project implements secure authentication, role-based access control (RLS), admin moderation, and featured content management.

---

## 🚀 Live Demo

🔗 Live Website: https://wedding-wishes-aman.vercel.app

---


# 📸 Features

## 🌍 Public Website

### Main Pages
- Home (Hero, Our Story, Featured Gallery, Featured Wishes)
- Gallery
- Wishes
- Submit Wish (Form)

### Public Capabilities
- Submit name + message + 15–60 sec video (<150MB)
- Real-time upload progress indicator
- Only approved wishes are visible
- Featured wishes & gallery items managed by admin
- Responsive modern UI

---

## 🔐 Admin Dashboard

### Secure Authentication
- Supabase Auth
- Session-based cookies
- Admin role stored in database
- Protected routes

### Admin Pages
- Dashboard Overview
- Manage Gallery
- Manage Wishes

### Admin Capabilities
- Approve / reject wishes
- Feature approved wishes
- Delete wishes
- Upload gallery images
- Feature gallery images
- Delete gallery images
- Search & filter wishes and gallery

---

# 🏗 Tech Stack

- **Frontend:** Next.js 16 (App Router)
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Video Storage:** Cloudinary
- **Deployment:** Vercel
- **Security:** Row Level Security (RLS)

---

# 📂 Project Structure

```
app/
 ├── admin/
 │   ├── dashboard/
 │   ├── gallery/
 │   ├── wishes/
 │   ├── layout.tsx
 │   ├── page.tsx
 │   └── not-found.tsx
 ├── login/
 ├── gallery/
 ├── submit-wish/
 ├── wishes/
 ├── layout.tsx
 ├── page.tsx
 ├── not-found.tsx
 └── globals.css

components/
 ├── ConditionalLayout.tsx
 ├── Header.tsx
 ├── VideoModal.tsx
 └── WishesList.tsx

lib/
 ├── supabaseAction.ts
 ├── supabaseClient.ts
 └── supabaseServer.ts
```

---

# 🗄 Database Schema & Security (Supabase)

This project uses PostgreSQL (via Supabase) with **Row Level Security (RLS)** fully enabled.

All access control is enforced at the database level — not just in frontend logic.

---

## 🧾 1️⃣ Wishes Table

```sql
create table if not exists wishes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  video_url text not null,
  is_approved boolean default false,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);
```

---

## 🖼 2️⃣ Gallery Images Table

```sql
create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  is_featured boolean default false,
  created_at timestamp with time zone default now()
);
```

---

## 👑 3️⃣ Admins Table

```sql
create table if not exists admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamp with time zone default now()
);
```

This table determines who has administrative privileges.

If a user's UID exists in this table → they are an admin.

---

# 🔐 Row Level Security (RLS)

RLS is enabled on all tables.

---

## 🌍 Public Policies

### ✅ Public Insert Wishes

Anyone can submit a wish.

```sql
create policy "Public insert wishes"
on wishes
for insert
with check (true);
```

---

### ✅ Public Read Approved Wishes Only

```sql
create policy "Public read approved wishes"
on wishes
for select
using (is_approved = true);
```

Public users cannot see unapproved wishes.

---

### ✅ Public Read Gallery

```sql
create policy "Public read gallery"
on gallery_images
for select
using (true);
```

---

# 👑 Admin Policies

Admin access is verified using:

```sql
exists (
  select 1 from admins
  where admins.user_id = auth.uid()
)
```

---

## 📖 Admin Read Wishes

```sql
create policy "Admins read wishes"
on wishes
for select
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

## ✏️ Admin Update Wishes

```sql
create policy "Admins update wishes"
on wishes
for update
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

## ❌ Admin Delete Wishes

```sql
create policy "Admins delete wishes"
on wishes
for delete
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

## ⭐ Admin Feature Approved Wishes Only

Ensures only approved wishes can be featured.

```sql
create policy "Admins feature approved wishes only"
on wishes
for update
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
)
with check (
  is_featured = false OR is_approved = true
);
```

---

## 🖼 Admin Insert Gallery Images

```sql
create policy "Admins insert gallery images"
on gallery_images
for insert
with check (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

## ✏️ Admin Update Gallery Images

```sql
create policy "Admins update gallery images"
on gallery_images
for update
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

## ❌ Admin Delete Gallery Images

```sql
create policy "Admins delete gallery images"
on gallery_images
for delete
using (
  exists (
    select 1 from admins
    where admins.user_id = auth.uid()
  )
);
```

---

# 👤 Creating an Admin User

Admin users are created manually in Supabase.

### Step 1️⃣ Create User in Supabase Auth

1. Go to Supabase Dashboard
2. Navigate to **Authentication → Users**
3. Click **Add User**
4. Create email & password
5. Copy the generated **UID**

---

### Step 2️⃣ Insert UID into Admins Table

```sql
insert into admins (user_id)
values ('YOUR_ADMIN_UID');
```

Once inserted:

- The user can log in
- The user gains admin dashboard access
- RLS policies automatically grant admin privileges

---

# 🔒 Security Philosophy

- Authorization is enforced at the database level
- Frontend cannot bypass RLS
- Admin role is not based on email — only on UID presence
- Featured content requires prior approval
- Public users never access unapproved data

This ensures production-grade security architecture.


---

# 🔐 Row Level Security (RLS)

### Public Permissions
- Anyone can insert wishes
- Public can only read approved wishes
- Public can read gallery images

### Admin Permissions
- Update / delete wishes
- Feature approved wishes only
- Insert / update / delete gallery images
- Read all wishes
- Read own admin record

Admin role is determined by checking if the authenticated user's UID exists in the `admins` table.

---

# ⚙️ Environment Variables

Create a `.env.local` file:

```
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

Do NOT commit `.env.local`.

---

# 🛠 Setup Instructions

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yourusername/wedding-wishes.git
cd wedding-wishes
npm install
```

---

## 2️⃣ Supabase Setup

1. Create a new Supabase project
2. Enable Authentication (Email login)
3. Run the SQL schema (tables + RLS policies)
4. Create an admin user in Supabase Auth
5. Insert the user's UID into the `admins` table:

```sql
insert into admins (user_id)
values ('YOUR_ADMIN_UID');
```

---

## 3️⃣ Cloudinary Setup

1. Create Cloudinary account
2. Create unsigned upload preset
3. Add credentials to `.env.local`

Videos uploaded by users are stored in Cloudinary.  
The returned `video_url` is stored in Supabase.

---

## 4️⃣ Run Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# 🌍 Deployment

- Push to GitHub
- Import project into Vercel
- Add environment variables in Vercel dashboard
- Every push to `main` auto-deploys

---

# 🔥 Security Design

- RLS enforced at database level
- Admin-only mutation policies
- Session-based authentication
- No direct admin logic on client
- Featured content restricted to approved items

---

# 📈 Future Improvements

- Pagination (server-side)
- Email notification after approval
- Rate limiting on submissions
- Admin activity logs
- Analytics dashboard
- CDN optimization for videos

---

# 👨‍💻 Author

Tesfab Tefera  
Software Engineer 
Focused on building secure, production-ready systems.

---

# 📜 License

For educational and portfolio purposes.
