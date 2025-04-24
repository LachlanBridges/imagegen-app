# 🖼️ ImageGen

A lightweight React + Express app for generating and editing images using OpenAI's new `gpt-image-1` model.

## ✨ Features

- Text-to-image generation using GPT-based image model
- Image editing with optional image upload
- Per-user history (stored locally as JSON)
- Auth via Nginx basic auth (`X-User` header)
- Fully self-contained — no external database
- Fast, clean UI built with Vite, Tailwind, and React

---

## 🛠️ Tech Stack

- **Frontend**: React + Vite + TailwindCSS
- **Backend**: Node.js + Express + Axios + Multer
- **Auth**: Nginx (via HTTP Basic Auth → passes `X-User`)
- **Image API**: `https://api.openai.com/v1/images/generations`  
  and `.../images/edits` using `gpt-image-1`

---

## 🚀 Getting Started

### Frontend

```bash
pnpm install
pnpm dev
```

Runs at: `http://localhost:5173`

### Backend

```bash
cd backend
cp .env.example .env  # Add your OPENAI_API_KEY
npm install
node server.js
```

Runs at: `http://127.0.0.1:3001` (only accessible locally)

---

## 🔐 Auth Notes

Authentication is handled by Nginx:
- You must setup basic auth (`.htpasswd`)
- Nginx forwards the username as an `X-User` header
- The app uses that as the `user` for saving history

There is **no login screen** — Nginx handles access.

---

## 🧱 Project Structure

```
.
├── backend/
│   ├── routes/
│   ├── middleware/
│   ├── uploads/
│   └── server.js
├── src/
│   ├── pages/
│   ├── components/
│   └── lib/
└── public/
```

---

## 📦 Deployment

We recommend:
- Hosting frontend via Nginx or Vercel
- Running backend behind Nginx with `localhost`-only binding
- Securing backend with Nginx basic auth
- Using `.env` for secrets

---

## License
MIT License