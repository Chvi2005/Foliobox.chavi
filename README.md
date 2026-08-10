# Filio.chavi — Personal Software Engineer Portfolio

![Filio.chavi Portfolio](https://img.shields.io/badge/Portfolio-Filio.chavi-ff4d15?style=for-the-badge)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

A high-performance personal portfolio built for **Chavindu Nirmal**, featuring a cinematic 144-frame background scroll sequence, smooth lerp physics, glassmorphism UI overlay, 8 modular views, and interactive project detail modals.

---

## ✨ Features

- **Cinematic 144-Frame Canvas Engine**: Interactive frame-by-frame background scroll sequence driven by HTML5 Canvas with smooth linear interpolation (`lerp`).
- **Responsive 8-View Architecture**:
  1. **Scrollable Homepage**: Hero typewriter header, quick metrics, About section, Featured Projects, Achievements Gallery, 3-Column Skills Grid, and Marquee Feedback section.
  2. **CV / Resume View Modal**: Interactive full-page resume preview with simulated PDF print export.
  3. **All Projects Modal**: Filterable project gallery supporting category filters (`Web Apps`, `UI/UX & Figma`, `Backend & Java`).
  4. **Single Project Detail Modal**: Interactive detail view showcasing screenshots, descriptions, tech stacks, live demos, and GitHub repositories.
  5. **Achievements & Full Gallery Modal**: Masonry photo gallery showcasing awards, hackathon certificates, and milestones with fullscreen lightbox preview.
  6. **Add Feedback Form Modal**: Modal form enabling users and clients to submit direct portfolio feedback.
  7. **Animated Success Popup**: Responsive green-tick confirmation popup for form submissions.
  8. **Fullscreen Lightbox**: Image inspection overlay with captions.
- **Skills & Mastery 3-Column Grid**: Dynamic progress bars that fill automatically on scroll reveal.
- **Continuous Feedback Marquee Carousel**: Smooth infinite scrolling testimonial cards with dark mode orange accents.
- **Mobile Responsive Navigation**: Touch-optimized glassmorphism drawer menu with compact icon-only action buttons.

---

## 🛠️ Tech Stack

- **Frontend Core**: Standard Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Canvas Rendering**: HTML5 `<canvas>` 2D Context, DPR Scaling, Contain Aspect-Ratio Math
- **Design System**: Glassmorphism (`backdrop-filter`), CSS Custom Properties (Variables), Responsive Flexbox & Grid
- **Build Tool**: Vite

---

## 📂 Project Structure

```
Potafolio/
├── index.html            # Main HTML document and 8-View Modal Architecture
├── style.css             # Design system, glassmorphism tokens, and responsive media queries
├── app.js                # Canvas Lerp Engine, Modal Manager, Typewriter, and UI Handlers
├── images/               # Project screenshots, logos, and UI assets
│   ├── project1.png      # Cartora E-Commerce Application screenshot
│   ├── project2.png      # CampusHub Campus Portal screenshot
│   ├── card_product.png  # Aura Design System screenshot
│   └── favicon.svg       # Favicon emblem logo
├── frames/               # 144 pre-rendered sequence frames (ezgif-frame-001.jpg to 144.jpg)
├── package.json          # Node dependencies & Vite scripts
└── README.md             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Chvi2005/Foliobox.chavi.git
   cd Foliobox.chavi
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser at `http://127.0.0.1:3000`.

4. **Build Production Bundle**:
   ```bash
   npm run build
   ```

---

## 👤 Author

**Chavindu Nirmal**
- Portfolio: [Filio.chavi](http://127.0.0.1:3000)
- GitHub: [@Chvi2005](https://github.com/Chvi2005)

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
