# 🎉 Dynamic Birthday Celebration Platform

> **A personalized, interactive web application with real database integration, serverless CRUD API, local client-side file handling, audio synthesis, and multi-level navigation.**

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![Netlify](https://img.shields.io/badge/Netlify-Serverless-00C7B7?logo=netlify&logoColor=white)](https://www.netlify.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media_CDN-3448C5?logo=cloudinary&logoColor=white)](https://cloudinary.com/)

---

## 📌 Executive Summary

**Dynamic Birthday Celebration Platform** is a web-based celebration management application that allows users to create, customize, and share personalized birthday experiences. It moves beyond static greeting cards by combining **serverless PostgreSQL database persistence**, **drag-and-drop animated galleries**, **curated music streaming**, **Web Audio API sound synthesis**, **multi-theme styling**, and **client-side file management**.

The project is architected to fulfill rigorous academic software engineering criteria:
- **Backend & Database**: Supabase PostgreSQL managed through secure Netlify Serverless Functions.
- **RESTful Architecture**: Complete CRUD (`POST`, `GET`, `PUT`, `DELETE`) with request validation and UUID verification.
- **File Systems**: Local JavaScript file handling (`FileReader`, `Blob`, `URL.createObjectURL`) alongside cloud CDN media uploads.
- **Rich Controls**: Over 25 meaningful interactive UI controls (sliders, color pickers, date pickers with past-date validation, toggles, and modals).
- **External Services**: 4 external APIs integrated for storage, cloud media, quotes, and translation.

---

## 🎓 Academic Requirement Compliance Matrix

| Requirement | Implementation Details | File Location |
| :--- | :--- | :--- |
| **1. Real Database Integration** | Managed **Supabase PostgreSQL** cloud database storing records with UUID primary keys and structured JSON payloads. | `netlify/functions/birthday.mjs` |
| **2. Complete CRUD Operations** | • **Create**: Insert wish & playlist (`POST`)<br>• **Read/Search**: Query by ID or search by recipient/relation (`GET`)<br>• **Update**: Modify existing record in database (`PUT`)<br>• **Delete**: Remove record by UUID (`DELETE`) | `netlify/functions/birthday.mjs` |
| **3. Menu-Based Navigation** | Sticky header navigation (`countdown`, `memories`, `letter`, `playlist`, `wishes`) with smooth scroll and active scrollspy indicator. | `index.html` (`#mainNav`), `CSS/index.css` |
| **4. Local & Cloud File Handling** | • **Local JS**: Client-side JSON backup export (`Blob`), printable `.txt` greeting card export, JSON restore (`FileReader.readAsText`), and local file metadata inspector (`FileReader.readAsDataURL`).<br>• **Cloud**: Cloudinary direct upload presets for photos and audio. | `JS/index.js` (Section 4, 5, 6), `index.html` (`#file_hub_overlay`) |
| **5. 20+ Meaningful UI Controls** | 25+ functional controls including font size range slider, volume range slider, theme accent color picker, date picker with validation, audio player controls, particle switches, and drag-and-drop reorder cards. | `index.html`, `JS/index.js` |
| **6. Minimum 3 Levels of Navigation** | **Level 1**: Main sticky nav menu & floating action button.<br>**Level 2**: Dedicated functional modal windows (Controls Modal, File Hub, Wish Form, Playlist Editor).<br>**Level 3**: In-modal controls (tab buttons, range sliders, export actions, drag handles). | `index.html`, `CSS/index.css` |
| **7. Integration of 2–3+ External APIs** | 1. **Supabase REST API** (Database operations)<br>2. **Cloudinary REST API** (Image & Audio cloud hosting)<br>3. **Quotes Inspiration API** (`dummyjson.com/quotes/random`)<br>4. **Google Translate API** (Multilingual greeting name animation)<br>5. **Browser Web APIs** (Battery Status & Online/Offline Network APIs) | `netlify/functions/birthday.mjs`, `JS/index.js` |
| **8. Error & Exception Handling** | Global unhandled rejection handlers, form validation, past-date calendar check, HTTP status error handlers, and visual animated toast notifications. | `JS/index.js` (`showToast`, `window.onerror`) |

---

## 🌟 Key Application Features

### 1. 🎂 Personalized Celebration Experience
- **Relationship-Specific Letters**: Pre-crafted heartfelt letters tailored to relationships (Friend, Best Friend, Teacher/Sir, Mom, Dad, Brother, Sister, Wife, Husband, Boss, GF, BF) or fully custom letters.
- **Multilingual Name Animation**: Recipient name translates dynamically into 15+ world languages (Hindi, Gujarati, Japanese, Arabic, Russian, etc.) with a typewriter effect.
- **Interactive Celebration Garden**: Clickable wish badges that chime using Web Audio API synthesis and display floating celebration toasts.

### 2. ⏳ Smart Birthday Countdown & Validation
- **Past-Date Validation Pop-Up**: Selecting a past date (e.g., yesterday) immediately triggers a validation alert, highlights the date picker in red, and prevents generating an impossible countdown.
- **Same-Day Celebration Banner**: Selecting today’s date automatically displays the festive banner (*"Today Is The Special Day! Happy Birthday! 🎉"*).
- **Future Countdown Clock**: Displays live ticking Days, Hours, Minutes, and Seconds until the celebration date.

### 3. 🖼️ Dual Gallery System
- **Simple Gallery**: 3 curated photos with individual replace, preview, and delete controls.
- **Animated Gallery**: Supports 10–15 images with drag-and-drop reordering, interactive thumbnail viewer, keyboard navigation (`←`/`→`), and swipe support on touch screens.

### 4. 🎛️ Live Celebration Controls (`⚙` Menu)
- **Letter Font Size Range Slider**: Adjusts letter typography dynamically between `14px` and `24px`.
- **Music Volume Range Slider**: Controls playback volume across all soundtrack tracks simultaneously.
- **Theme Accent Color Picker**: Updates the primary highlight color across recipient names, countdown boxes, navbar badges, and CSS `--rose` variables.
- **Web Audio FX Synthesizer**: Generates harmonic celebration chimes using browser `AudioContext` without requiring external sound assets.
- **Festive Particles Toggle**: Enables or disables ambient falling flower petals, royal sparkles, and shooting stars.

### 5. 💾 Client-Side File Handling Hub
- **JSON Backup Export**: Exports full wish metadata, images, and playlist into a structured `.json` file using `Blob` and `URL.createObjectURL`.
- **Printable ASCII Card Download**: Generates and downloads a formatted `.txt` card.
- **JSON Restore / Import**: Uses `FileReader.readAsText()` to load and restore cards directly from the computer.
- **Local File Metadata Inspector**: Reads file size, MIME type, byte length, and read latency locally using `FileReader.readAsDataURL()`.

---

## 📐 System Architecture

```text
┌────────────────────────────────────────────────────────┐
│                   Client Browser (UI)                  │
│  HTML5 + CSS3 + Vanilla JavaScript (ES6) + jQuery      │
└──────────────┬───────────────────────────┬─────────────┘
               │                           │
      Local File Operations        External REST APIs
      (FileReader & Blob)          - Cloudinary CDN (Images/Audio)
      - JSON Export / Import       - Quotes API (dummyjson.com)
      - TXT Greeting Card          - Google Translate API
      - File Metadata Inspector    - Web Audio API (Chimes)
               │
               ▼
┌────────────────────────────────────────────────────────┐
│             Netlify Serverless Function                │
│            (netlify/functions/birthday.mjs)            │
│  - Method Routing: GET / POST / PUT / DELETE           │
│  - UUID & Schema Payload Validation                    │
│  - CORS & Cache-Control Headers                        │
└──────────────────────────┬─────────────────────────────┘
                           │
                           ▼
┌────────────────────────────────────────────────────────┐
│               Supabase Cloud Database                  │
│                  PostgreSQL Engine                     │
│  Table: birthdays (UUID, name, relationship, message,  │
│         theme, gallery_type, images[], playlist[])     │
└────────────────────────────────────────────────────────┘
```

---

## 📁 Project Directory Structure

```text
Dynamic-Birthday-Website/
│
├── CSS/
│   └── index.css                 # Master styles, themes, responsive queries, and animations
│
├── JS/
│   └── index.js                  # Frontend logic, countdown, controls, Web Audio, file handling
│
├── netlify/
│   └── functions/
│       └── birthday.mjs          # Serverless CRUD API handler (Supabase PostgreSQL integration)
│
├── Utili/                        # Project static assets
│   ├── Favicon.png               # Website favicon
│   ├── SVG.svg / Cursor.svg      # Decorative graphics
│   ├── Golden Hour.mp3           # Soundtrack: Golden Hour (JVKE)
│   ├── Ilahi.mp3                 # Soundtrack: Ilahi (Arijit Singh)
│   ├── Iktara.mp3                # Soundtrack: Iktara (Kavita Seth)
│   ├── Safarnama.mp3             # Soundtrack: Safarnama (Lucky Ali)
│   ├── Aashayein.mp3             # Soundtrack: Aashayein (KK)
│   ├── Love You Zindagi.mp3      # Soundtrack: Love You Zindagi (Jasleen Royal)
│   └── Phir Se Ud Chala.mp3      # Soundtrack: Phir Se Ud Chala (Mohit Chauhan)
│
├── .env                          # Backend credentials (SUPABASE_URL, SUPABASE_SECRET_KEY)
├── .gitignore                    # Git ignore rules for node_modules and .env
├── index.html                    # Main HTML document and modal overlays
├── package.json                  # Dependencies (@supabase/supabase-js)
└── README.md                     # Comprehensive project documentation
```

---

## 🗄️ Database Schema (Supabase PostgreSQL)

```sql
CREATE TABLE birthdays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_name VARCHAR(100) NOT NULL,
    relationship VARCHAR(50) NOT NULL,
    message TEXT DEFAULT '',
    message_type VARCHAR(20) DEFAULT 'default',
    theme VARCHAR(30) DEFAULT 'classic',
    gallery_type VARCHAR(20) DEFAULT 'simple',
    images JSONB DEFAULT '[]'::jsonb,
    playlist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Serverless CRUD Endpoints (`/.netlify/functions/birthday`)

| Method | Endpoint / Query | Description | Status Code |
| :---: | :--- | :--- | :---: |
| **GET** | `?id=<uuid>` | Retrieve a single birthday record by ID | `200 OK` / `404` |
| **GET** | `?search=<name>&relation=<rel>` | Search records by recipient name and relationship | `200 OK` |
| **POST** | `/` (JSON body) | Insert a new birthday record into Supabase | `201 Created` |
| **PUT** | `/` (JSON body with `id`) | Update an existing birthday record | `200 OK` |
| **DELETE**| `?id=<uuid>` | Delete a record by UUID | `200 OK` |

---

## 💻 20+ Meaningful UI Controls Inventory

1. **Name Text Input (`#nameInput`)**: Recipient identification.
2. **Relationship Select Dropdown (`#typeInput`)**: Triggers relationship-based themes and presets.
3. **Birthday Date Picker (`#birthdayDateInput`)**: Captures celebration date with past-date validation.
4. **Gallery Mode Radios (`name="galleryType"`)**: Switches between Simple and Animated gallery layouts.
5. **Theme Selection Radios (`name="themeType"`)**: Switches between Classic, Royal Gold, Galaxy, Floral, and Romantic styles.
6. **Theme Preview Trigger Buttons (`.previewBtn`)**: Displays modal previews for themes.
7. **Message Type Radios (`name="messageType"`)**: Toggles default relationship letter vs. custom text area.
8. **AI / Quote Suggest Button (`#fetchQuoteBtn`)**: Fetches external inspiration quotes via API.
9. **Custom Letter Textarea (`#customMessage`)**: Multiline custom greeting editor.
10. **Image File Upload Triggers (`.upload_box`)**: Cloudinary image upload handlers.
11. **Image Replace Buttons (`.replaceImageBtn`)**: In-place photo replacement.
12. **Image Delete Buttons (`.deleteImageBtn`)**: Removes uploaded photos.
13. **Image Preview Modal Buttons (`.imagePreviewBtn`)**: Opens full-screen lightbox viewer.
14. **Image Navigation Previous / Next (`#prevImage`, `#nextImage`)**: Lightbox slider buttons.
15. **Animated Gallery Drag Handles (`.galleryCard`)**: Reorders gallery sequence using Drag & Drop.
16. **Audio Track Selection (`.music`)**: Plays/pauses tracks on click.
17. **Playlist Editor Modal Trigger (`.playlist_edit_button`)**: Opens song management modal.
18. **Custom Audio File Input (`#songFile`)**: Uploads MP3 to Cloudinary CDN.
19. **Audio Drag & Drop Reorder Cards (`.editor_song`)**: Customizes playlist playback order.
20. **Song Delete Buttons (`.editor_delete`)**: Removes tracks from playlist.
21. **Letter Font Size Range Slider (`#fontSizeSlider`)**: Live typography scaling (`14px`–`24px`).
22. **Music Volume Range Slider (`#volumeSlider`)**: Global audio volume control (`0%`–`100%`).
23. **Accent Color Input (`#accentColorPicker`)**: Real-time CSS variable color modification.
24. **Sound FX & Chimes Switch (`#soundEffectsToggle`)**: Enables Web Audio API chimes.
25. **Festive Confetti Switch (`#confettiToggle`)**: Toggles canvas/DOM ambient particle effects.
26. **Dark / Light Mode Toggle Button (`#themeToggleBtn`)**: Switches theme lighting mode.
27. **Scroll To Top Floating Button (`#scrollTopBtn`)**: Animated smooth scroll to top.

---

## ⌨️ Keyboard Navigation & Shortcuts

| Shortcut | Action |
| :---: | :--- |
| `Space` | Play / Pause active soundtrack |
| `N` / `n` | Skip to Next song |
| `P` / `p` | Return to Previous song |
| `M` / `m` | Toggle Playlist modal window |
| `Escape` | Close any active modal (Wish Form, File Hub, Controls, Image Lightbox) |
| `←` / `→` | Navigate photos in lightbox viewer |

---

## 🚀 Installation & Local Development

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Netlify CLI](https://docs.netlify.com/cli/get-started/) (optional, for local serverless functions)

### 1. Clone the Repository
```bash
git clone https://github.com/hetuk2005/Dynamic-Birthday-Website.git
cd Dynamic-Birthday-Website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the project root:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SECRET_KEY=your-supabase-service-role-secret-key
```

### 4. Run Locally
- **Option A (Frontend only with Live Server)**:
  Open `index.html` with VS Code Live Server or double-click to view in any browser.
- **Option B (Full Full-Stack with Netlify Dev)**:
  ```bash
  npx netlify dev
  ```
  The app will be accessible at `http://localhost:8888`.

---

## 🛡️ Error Handling & Exception Management

1. **Past Date Check**: Validates user-selected celebration dates against the client's midnight timestamp, notifying users via pop-ups if an expired date is submitted.
2. **File Size & Format Validation**: Client-side checks restrict uploaded images to `< 5MB` and verify `image/*` MIME types.
3. **Database Connection Fallback**: When backend serverless functions are unreachable, the UI gracefully defaults to local URL parameter generation and displays warning toasts.
4. **Global Event Listeners**:
   - `window.addEventListener("error", ...)` intercepts runtime errors.
   - `window.addEventListener("unhandledrejection", ...)` logs and suppresses unhandled promise rejections.
5. **Toast Feedback**: A non-blocking toast notification system informs users of network updates, file reads, and clipboard copies.

---

## 👨‍💻 Project Information

- **Student Name**: Hetuk Patel
- **Repository**: [https://github.com/hetuk2005/Dynamic-Birthday-Website](https://github.com/hetuk2005/Dynamic-Birthday-Website)
- **Live Deployment**: [https://dynamicbirthdaywebsite.netlify.app/](https://dynamicbirthdaywebsite.netlify.app/)
