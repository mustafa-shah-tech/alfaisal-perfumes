# 🌸 Alfaisal Perfumes — Custom Private-Label Perfume Website & Admin Portal

> **"Your Name. Your Scent. Your Perfume Brand."**  
> Private-label spray perfume manufacturing (EDP / EDT) based in **Malakand, Khyber Pakhtunkhwa (KPK), Pakistan**.

Alfaisal Perfumes creates custom-branded spray perfumes for boutiques, salons, clothing brands, retailers, gift companies, and visionary entrepreneurs. This website is an award-grade, high-conversion consultation and quote-request platform with a **complete, beginner-friendly Admin Panel** that allows the business owner to manage all content, fragrances, and quote requests without touching code.

---

## 🌟 Key Features

### Public Website
- **Luxury Minimal Aesthetics**: Cormorant Garamond serif headings, Inter typography, warm ivory/sand surfaces (`#FAF7F2`, `#EFE8DC`), charcoal typography (`#1A1A1A`), and muted gold accents (`#B08D57`).
- **Private-Label Business Focus**: No cart, no checkout. Clear focus on consultations, sample requests, and wholesale quote inquiries in PKR.
- **10 Complete Pages**:
  1. **Home**: Hero with customizable text/image, Trust Strip, What We Do, 5-Step Process Timeline, Featured Fragrance Cards, Why Choose Us, Portfolio Preview, Client Testimonials, and Final CTA Band.
  2. **Services**: Comprehensive breakdown of private-label Eau de Parfum / Eau de Toilette formulation, bottle options, and "What's Included" turnkey features.
  3. **Fragrance Library**: Olfactory showcase filtered by Gender (Men, Women, Unisex), Fragrance Family (Floral, Woody, Oriental, Fresh, Citrus, Musk, Gourmand, Spicy, Aquatic), and Search. Includes detailed fragrance modal with notes pyramid (top, heart, base) and direct "Request This Fragrance" & "Ask on WhatsApp" actions.
  4. **Packaging Options**: Flacons, weighted caps, atomisers, foil labels, and rigid luxury gift presentation boxes.
  5. **Portfolio / Brands We've Built**: Case studies showing real private-label concepts.
  6. **About Page**: Warm brand story, mission, 4 guiding values, and Malakand, KPK location showcase.
  7. **FAQ**: 10 animated accordion questions on MOQs, lead times, sample approvals, and delivery across Pakistan.
  8. **Contact & Quote Consultation**: Anti-spam protected quotation form with multi-select fragrance picker, quantity ranges, dynamic admin-driven contact details, and direct WhatsApp links.
  9. **Privacy Policy**: Editable legal notice.
  10. **Terms of Service**: Editable commercial private-label terms.
- **Floating WhatsApp Button**: High-conversion floating WhatsApp action button configured with your number and customizable pre-filled message.
- **Mobile-First & Accessible**: Seamless responsive design tested from 360px phones up to 4K displays. Respects `prefers-reduced-motion` and WCAG AA contrast.

### Full Admin Panel (`/admin`)
- **Secure Authentication**: Firebase Email & Password authentication guarding all administrative routes.
- **Dashboard**: Stats on inquiries, active fragrances, and portfolio brands; quick action buttons; latest 5 quote requests.
- **Site Settings**: Business name, logo (text or image upload), tagline, sub-headline, phone, WhatsApp number, email, facility address, social links (Instagram, Facebook, TikTok), and footer copyright.
- **Theme Editor**: Visual color pickers for all design tokens with a real-time live preview card and one-click "Reset to Default" button.
- **Home Content Manager**: Hero text/image, Trust Strip items (add/edit/delete), What We Do text, CTA text, and Section Visibility checkboxes.
- **Fragrance CRUD**: Add, edit, delete, and reorder fragrances with image upload, notes pyramid, gender tag, family, and visibility toggle.
- **Packaging CRUD**: Add, edit, and delete packaging hardware options.
- **Portfolio CRUD**: Manage client brand case studies.
- **Testimonials CRUD**: Add, edit, and manage client quotes.
- **Services & Process Steps**: Edit turnkey service features and reorder the 5 process steps.
- **About Page Editor**: Edit brand narrative, mission statement, and core values.
- **FAQ Manager**: Add, edit, and reorder accordion questions.
- **Inquiries Inbox**: Complete customer relationship workflow. Filter by status (`New`, `Contacted`, `Quoted`, `Won`, `Closed`), mark as read/unread, write private internal staff notes, and **Export to CSV**.
- **SEO Manager**: Custom Google page titles, meta descriptions, and Open Graph social share images for each individual page.
- **Media Asset Library**: Upload, browse, copy URLs, and delete images.
- **Legal Pages Editor**: In-browser editing of Privacy Policy and Terms of Service.

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase (Firestore, Authentication, Storage)
- **Icons**: Lucide React + custom inline SVGs

---

## 🚀 Beginner-Friendly Setup Guide

Follow these steps to set up and run the website:

### Step 1: Install Dependencies
Open your terminal inside the project directory:
```bash
cd alfaisal-perfumes
npm install
```

### Step 2: Create a Free Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/) and click **"Add project"**.
2. Name your project (e.g. `alfaisal-perfumes`). You can disable Google Analytics or leave it on. Click **"Create project"**.
3. Once created, click on the **Web icon (`</>`)** on the Project Overview page to register a Web App.
4. Give your web app a nickname (e.g. `Alfaisal Web`) and click **"Register app"**.
5. Firebase will show your `firebaseConfig` object with keys like `apiKey`, `authDomain`, `projectId`, etc. Keep this tab open.

### Step 3: Enable Firebase Authentication
1. In the Firebase Console left sidebar, click **Build** → **Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, click **Email/Password**.
4. Enable the first toggle (**Email/Password**) and click **Save**.
5. Switch to the **Users** tab and click **"Add user"**.
6. Enter the administrator's email and password (e.g., `admin@alfaisalperfumes.com` and a secure password). This will be your admin login.

### Step 4: Create Cloud Firestore Database
1. In the Firebase Console left sidebar, click **Build** → **Firestore Database**.
2. Click **Create database**.
3. Choose a location (e.g., `nam5 (us-central)` or nearest to your users) and click **Next**.
4. Choose **Start in production mode** and click **Create**.
5. Click on the **Rules** tab in Firestore and paste the contents of `firestore.rules` from this repository, then click **Publish**.

### Step 5: Enable Firebase Storage (for Images)
1. In the Firebase Console left sidebar, click **Build** → **Storage**.
2. Click **Get Started**, choose **Start in production mode**, and click **Done**.
3. Click on the **Rules** tab in Storage and paste the contents of `storage.rules` from this repository, then click **Publish**.

### Step 6: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your Firebase credentials from Step 2:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Step 7: Run the Database Seed Script
Populate your database with rich, luxury placeholder data (12 fragrances, 10 FAQs, 5 process steps, 6 packaging options, 4 brands, etc.):
```bash
npm run seed
```
You should see:
```text
🌱 Starting Alfaisal Perfumes Database Seed...
→ Seeding settings/general...
→ Seeding theme/colors...
→ Seeding homeContent/main...
→ Seeding processSteps...
→ Seeding fragrances (12 items)...
...
✅ SEEDING COMPLETE! All collections populated with professional private-label content.
```

### Step 8: Run Locally
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.  
To access the admin panel, navigate to [http://localhost:3000/admin](http://localhost:3000/admin) and log in with the admin user created in Step 3!

---

## 🚢 Deploying to Production (Vercel)

The easiest and recommended way to deploy this Next.js website is on **Vercel**:

1. Push your code to a GitHub, GitLab, or Bitbucket repository.
2. Sign in to [Vercel](https://vercel.com/) and click **"Add New Project"**.
3. Import your `alfaisal-perfumes` repository.
4. Under **Environment Variables**, add the 6 variables from your `.env.local` (`NEXT_PUBLIC_FIREBASE_API_KEY`, etc.).
5. Click **Deploy**. In under two minutes, your luxury website will be live with full SSL, global CDN, and automated preview deployments!

---

## 📋 Checklist for the Business Owner

Before launching publicly, log in to `/admin` and customize the following real-world details:

- [ ] **Site Settings (`/admin/settings`)**:
  - Enter your official WhatsApp number (in international format without plus or spaces, e.g. `923001234567`).
  - Enter your direct telephone number and official business email address.
  - Confirm your physical workshop/office address in Malakand, KPK.
  - Add your official Instagram, Facebook, and TikTok page URLs.
  - Upload your official logo if you have an image flacon badge.
- [ ] **Fragrance Library (`/admin/fragrances`)**:
  - Upload high-resolution photos of your actual perfume bottles and bottles in sample sets.
  - Adjust any notes (Top, Heart, Base) to match your current production formulas.
- [ ] **Packaging Options (`/admin/packaging`)**:
  - Upload real photos of your bottles, atomisers, and rigid presentation boxes.
- [ ] **FAQ (`/admin/faq`)**:
  - Update Question #2 with your current Minimum Order Quantity (e.g. 50 units, 100 units).
  - Update Question #3 with your exact lead times.
- [ ] **About Page (`/admin/about`)**:
  - Review your brand story and upload any authentic photos of your facility in Malakand, KPK.
- [ ] **Theme (`/admin/theme`)**:
  - If your brand uses a different shade of gold, silver, or emerald, adjust the color tokens and click Save!

---

## 🔒 Security Summary

- **Firestore Rules (`firestore.rules`)**:
  - Public visitors can **only read** published site content and **create** new inquiries.
  - Public visitors can **never** view inquiries, read other customers' data, or alter content.
  - Only authenticated administrators have full read/write access.
- **Storage Rules (`storage.rules`)**:
  - Public can view uploaded images.
  - Only authenticated admins can upload/delete files (restricted to image MIME types and 5MB limit).
- **Spam Protection**: The public quotation form includes an automated honeypot trap and client-side submission rate limiting.
