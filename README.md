# NyayaVidya – AI-Powered Vernacular Legal Rights Awareness Platform

NyayaVidya is an AI-powered, Tamil-first Legal Decision Support Platform designed to empower youth in Tamil Nadu with structured, actionable legal guidance.

The system combines Retrieval-Augmented Generation (RAG), LLaMA-based local AI inference, and voice-enabled interaction to provide grounded, step-by-step legal action plans instead of generic chatbot responses.

---

## 📌 Problem Statement

Many students and youth:

- Lack awareness of their legal rights  
- Fall victim to scams, wage theft, harassment, and fraud  
- Do not know where or how to seek legal help  

Legal information is often complex and not easily accessible in vernacular languages.

---

## 💡 Our Solution

NyayaVidya provides:

- Tamil-first AI legal assistant  
- Step-by-step actionable guidance  
- Retrieval-Augmented responses grounded in legal documents  
- Voice-based complaint support  
- Legal authority routing and helpline guidance  
- Gamified rights awareness simulator  
- Legal aid locator map  

---

## 🚀 Core Features

### 1. Secure Authentication
- JWT-based authentication
- Password hashing using bcrypt
- Protected routes

### 2. AI Legal Chatbot
- Text and voice input
- Speech-to-text using whisper.cpp
- Structured action plan responses
- Risk-level tagging
- Legal disclaimer included in every response

### 3. Retrieval-Augmented Generation (RAG)
- Legal documents chunked and embedded
- Vector similarity search
- Context-aware AI responses using LLaMA 3

### 4. Rights Simulator
- Real-life legal scenarios
- Score-based evaluation
- Bronze / Silver / Gold badges
- Progress stored in database

### 5. Legal Aid Locator
- Interactive Leaflet map
- Tamil Nadu legal aid centers
- Geolocation support

### 6. Dashboard & Analytics
- Questions asked tracking
- Rights score tracking
- Scenario completion tracking
- PDF certificate generation

---

## 🛠 Tech Stack

### Frontend
- React 18
- Vite
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Router v6
- React Hook Form
- Leaflet.js
- jsPDF

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- Helmet
- CORS
- express-rate-limit

### AI & ML
- LLaMA 3 via Ollama (local inference)
- whisper.cpp for speech-to-text
- MongoDB Atlas Vector Search / FAISS for RAG

---

## 📂 Project Structure
