# Kanav Engineering — Business Profile Website

Responsive React + Vite + Tailwind CSS single-page business website based on the supplied Kanav Engineering company profile.

## Requirements
- Node.js 18 or newer
- npm

## Run locally
```bash
npm install
npm run dev
```
Open the local URL printed by Vite.

## Production build
```bash
npm run build
npm run preview
```
The production website is generated in `dist/`.

## Customize business details
Edit `src/data/siteData.js`:
- Replace `REPLACE_WITH_PHONE`, `REPLACE_WITH_WHATSAPP`, and `REPLACE_WITH_EMAIL`.
- Add real project photos and company logo when available.
- Confirm the workshop/facility size before publishing. The source PDF lists 30,000 sq. ft. in most sections but 22,000 sq. ft. in one section, so the figure is deliberately shown as “30,000 sq. ft.*” with a note in the site data.
- Client and partner names are included from the supplied company profile. Confirm you have permission to display them publicly.

## Deploy free using GitHub + Vercel
1. Create a GitHub repository and upload this project.
2. Sign in to Vercel and choose **Add New → Project**.
3. Import the GitHub repository.
4. Vercel should detect Vite automatically. Use:
   - Build command: `npm run build`
   - Output directory: `dist`
5. Click **Deploy**. Vercel provides a public URL. A custom domain is optional and may cost extra.

No backend or database is required for this static business profile site. The contact form currently opens the visitor's email application; add your actual email in `src/data/siteData.js` before publishing.
