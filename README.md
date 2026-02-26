Here is a **complete, well-structured, and professional README.md** for your NyayaVidya project.

You can just copy-paste this entire content into your `README.md` file (overwrite the existing one if needed).

```markdown
# NyayaVidya – AI-Powered Vernacular Legal Rights Awareness Platform

**NyayaVidya** is an **AI-powered, Tamil-first legal decision support platform** designed specifically for youth in Tamil Nadu.

It helps users understand their legal rights, avoid common scams, and take correct first steps in real-life legal situations — all in simple Tamil (with English support).

The platform combines **voice-enabled chat**, **retrieval-augmented generation (RAG)**, **gamified learning**, and **legal aid location mapping** to make legal awareness accessible, engaging, and actionable.

---

## 🌟 Problem We Are Solving

Many students, job seekers, and young workers in Tamil Nadu face:

- Fake job offers and advance-fee scams
- Wage theft and workplace exploitation
- Ragging, harassment, and landlord issues
- Cyber fraud, sextortion, and investment scams
- Lack of awareness about free legal aid (DLSA, 15100, 1930, etc.)

Legal information is often:

- Written in complex English
- Hard to understand
- Not available in Tamil
- Difficult to act upon quickly

NyayaVidya solves this by providing **fast, trustworthy, Tamil-first guidance** with clear next steps.

---

## ✨ Core Features

| # | Feature                        | Description                                                                                     |
|---|--------------------------------|-------------------------------------------------------------------------------------------------|
| 1 | **Tamil-first AI Legal Chatbot** | Voice + text input, structured step-by-step action plans, risk tagging, strong disclaimers     |
| 2 | **Retrieval-Augmented Generation (RAG)** | Answers grounded in real legal documents (no hallucination), vector search + LLaMA 3 inference |
| 3 | **Rights Simulator (Gamified)** | 8 real-life scenarios, 5 questions each, score + badge system (Bronze/Silver/Gold)              |
| 4 | **Legal Aid Locator Map**      | Interactive map of Tamil Nadu legal aid centers, DLSA offices, police stations                  |
| 5 | **Dashboard & Progress Tracking** | Questions asked, scenarios completed, rights score, PDF certificate generation                  |
| 6 | **Secure Authentication**      | JWT + bcrypt password hashing, protected routes                                                 |
| 7 | **Voice Input Support**        | Speech-to-text using whisper.cpp (local) for Tamil & English                                    |

---

## 🛠 Tech Stack

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- React Router v6
- Leaflet.js + react-leaflet (maps)
- jsPDF (certificate generation)
- React Hook Form + Zod (forms)
- lucide-react (icons)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- MongoDB Atlas Vector Search (for RAG)
- JWT Authentication
- bcryptjs (password hashing)
- Helmet, CORS, express-rate-limit

### AI & Speech
- **LLaMA 3** (via Ollama – local inference)
- **whisper.cpp** (local speech-to-text – Tamil & English support)
- Custom RAG pipeline (chunking + embedding + retrieval)

### DevOps / Others
- Supabase (auth + storage + vector – optional alternative)
- Git + GitHub
- VS Code + ESLint + Prettier

---

## 📂 Project Structure

```
nyaya-vidya-hub/
├── backend/                    # Node.js + Express server
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── server.ts
│   ├── config/
│   ├── .env
│   └── package.json
├── frontend/                   # React + Vite app (main client)
│   ├── public/
│   ├── src/
│   │   ├── components/         # shadcn/ui + custom components
│   │   ├── contexts/           # AuthContext, etc.
│   │   ├── hooks/
│   │   ├── integrations/       # supabase client, api helpers
│   │   ├── lib/                # supabase-helpers, utils
│   │   ├── pages/              # Chat, Dashboard, Simulator, Map, etc.
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── .env
│   └── package.json
├── ai/                         # Local AI inference (Ollama + whisper.cpp)
│   ├── models/                 # Downloaded LLaMA 3 gguf files
│   └── scripts/                # whisper.cpp setup, inference helpers
├── docs/                       # Architecture diagrams, legal doc sources
├── .gitignore
├── README.md                   # ← this file
└── package.json                # monorepo root (optional)
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Ollama installed + LLaMA 3 model pulled
- whisper.cpp compiled (for voice)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# edit .env (MONGO_URI, JWT_SECRET, etc.)
npm run dev
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# edit .env (VITE_API_URL, etc.)
npm run dev
```

### Start Ollama (AI inference)
```bash
ollama serve
ollama pull llama3:8b
```

### Start whisper.cpp (optional – voice)
Follow whisper.cpp repo instructions to compile and run server.

Open http://localhost:5173 (Vite default)

---

## 🎯 Current Status (as of Feb 2026)

✅ Secure auth & protected routes  
✅ Bilingual legal chatbot (text)  
✅ Voice input (mic) working  
✅ Rights Simulator with 8 scenarios (5 questions each)  
✅ Dashboard + PDF certificate  
✅ Bilingual UI (Tamil-first + English)

🚧 In progress / planned:  
- Full RAG pipeline with legal documents  
- Leaflet map with real legal aid locations  
- Whisper.cpp integration for better Tamil STT  
- Mobile responsiveness improvements  
- Rate limiting & security hardening

---

## ⚖️ Legal Disclaimer

**NyayaVidya is an educational awareness tool only.**  
It is **not** a substitute for professional legal advice.  
Always contact official authorities (15100, 1930, local police, DLSA) or a qualified lawyer for your specific situation.

---

## 🙏 Acknowledgments

- Tamil Nadu youth facing legal challenges every day
- Open-source community (Ollama, whisper.cpp, shadcn/ui, Leaflet)
- Legal aid resources (DLSA, cybercrime.gov.in, UGC Anti-Ragging)

---

## 📬 Contact / Contribute

- **Founder**: Reddy Darshaan D
- **Email**: reddydarshaan@example.com (replace with real)
- **GitHub**: https://github.com/Reddydarshaan/nyaya-vidya-hub

Pull requests, bug reports, legal content suggestions, and Tamil translations are welcome!

Made with ❤️ for Tamil Nadu youth.

```

### What to do next

1. Open your project folder
2. Replace (or create) `README.md` with the content above
3. Stage & commit:

```bash
git add README.md
git commit -m "Update README.md with complete project overview, structure, and setup guide"
git push origin main
```
