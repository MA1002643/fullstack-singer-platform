<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<h1 align="center">FULLSTACK-SINGER-PLATFORM</h1>
<p align="center"><em>Empowering Creators to Shine Brightly Online</em></p>

<!-- BADGES -->
<a href="https://github.com/MA1002643/fullstack-singer-platform/blob/main/LICENSE" alt="license">
   <img src="https://img.shields.io/badge/license-MIT-green?style=flat&logo=opensourceinitiative&logoColor=white" alt="MIT License" />
</a>
<img src="https://img.shields.io/github/last-commit/MA1002643/fullstack-singer-platform?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<a href="https://github.com/MA1002643/fullstack-singer-platform/discussions" alt="Discussions">
   <img src="https://img.shields.io/github/discussions/MA1002643/fullstack-singer-platform" alt="Discussions" />
</a>
<a href="https://github.com/MA1002643/fullstack-singer-platform/stargazers">
   <img src="https://custom-icon-badges.demolab.com/github/stars/MA1002643/fullstack-singer-platform?logo=star&style=flat" alt="stars" />
</a>
<a href="https://github.com/MA1002643/fullstack-singer-platform/issues">
   <img src="https://custom-icon-badges.demolab.com/github/issues-raw/MA1002643/fullstack-singer-platform?logo=issue" alt="issues" />
</a>
<br>
<br>
<em>Built with the tools and technologies:</em>
<br>
<br>

<!-- TECH-STACK:START -->

<div align="center" style="display:flex;flex-wrap:wrap;gap:6px;align-items:center;justify-content:center;margin:0 auto;">
<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=html5&logoColor=white" alt="HTML5">
<img src="https://img.shields.io/badge/CSS3-1572B6.svg?style=flat&logo=css3&logoColor=white" alt="CSS3">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=javascript&logoColor=white" alt="JavaScript">
</div>

<!-- TECH-STACK:END -->

</div>
<br>

---

## 📄 Table of Contents

- [Overview](#overview)
- [UI Preview](#ui-preview)
- [Features](#key-features)
- [Project Structure](#project-structure)
  - [Project Index](#project-index)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
  - [Testing](#testing)
- [Learning Outcomes](#learning-outcomes)
- [Roadmap](#roadmap)
- [Contributors](#contributors)
- [Acknowledgments](#acknowledgment)
- [License](#license)

---

<a id="overview"></a>

## ✨ Overview

It is a **static, multi-page** project using **HTML, CSS, and JavaScript**, with dedicated pages (**About**, **Songs**, **Sign-Up**), shared styles, and a lightweight script for basic interactions and responsiveness.

### Why fullstack-singer-platform?

This project is a interactive singer websites with core features including:

- 🧩 **Responsive Navigation:** Mobile-friendly layout and menus for smooth navigation across devices.
- 🎥 **Multimedia Integration:** Easy embedding of **YouTube** videos and images to showcase songs and artist visuals.
- 📝 **User Sign-Up (Front-End Only):** A sign-up page/form suitable for newsletters or waitlists.  
  _Note: The repository does not include backend/authentication code._
- ⚙️ **Lightweight UI Interactions:** Basic DOM manipulation via a single `app.js` script.  
  _Note: There is no server or database layer in this repository._
- 🌟 **Multi-Page Structure:** Clear IA with **About**, **Songs**, and **Sign-Up** pages.
- 🎨 **Consistent Styling:** Centralized CSS (`Singer Website/Public/style.css`) and image assets under `Singer Website/Public/images/`.

---

<a id="ui-preview"></a>

## 🎨 UI Preview

|             Frontend View             |               Admin / Dashboard View               |
| :-----------------------------------: | :------------------------------------------------: |
| ![Homepage](screenshots/homepage.png) | ![ VideoRecording](screenshots/VideoRecording.png) |

---

<a id="key-features"></a>

## 📌 Features

|     | Component          | Details                                                                                                                                                                                          |
| :-- | :----------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ⚙️  | **Architecture**   | <ul><li>Static multi-page site (**HTML/CSS/JavaScript**)</li><li>Pages: **index.html**, **About**, **Songs**, **Sign-Up**</li><li>No server or database code present in the repository</li></ul> |
| 🔩  | **Code Quality**   | <ul><li>Single JS entry (**Singer Website/JavaScript/app.js**)</li><li>Clear separation of **HTML / CSS / JS** assets</li><li>Human-readable file and folder naming</li></ul>                    |
| 📄  | **Documentation**  | <ul><li>Project **README** with overview and structure</li><li>**CONTRIBUTING.md**, **CODE_OF_CONDUCT.md**, **SECURITY.md** included</li><li>MIT **LICENSE** file</li></ul>                      |
| 🔌  | **Integrations**   | <ul><li>Embeds **YouTube** videos and images for media content</li><li>HTML forms for user sign-up (client-side only)</li></ul>                                                                  |
| 🧩  | **Modularity**     | <ul><li>Per-page HTML with shared styles (**Singer Website/Public/style.css**)</li><li>Reusable DOM helpers in a single **app.js**</li></ul>                                                     |
| 🧪  | **Testing**        | <ul><li>No automated tests in the repository</li><li>Manual route/UI validation</li></ul>                                                                                                        |
| ⚡️ | **Performance**    | <ul><li>Lightweight static assets</li><li>Client-side DOM updates for responsiveness</li></ul>                                                                                                   |
| 🛡️  | **Security**       | <ul><li>Client-side input checks</li><li>No authentication or authorization logic present</li><li>**SECURITY.md** outlines reporting policy</li></ul>                                            |
| 📦  | **Dependencies**   | <ul><li>**Vanilla** HTML/CSS/JS (no package manager, no build step)</li><li>Image assets under **/Public/images**</li></ul>                                                                      |
| ⚙️  | **CI / Templates** | <ul><li>GitHub Actions: **ci.yml**, contributor and index updaters</li><li>Issue & PR templates; **CODEOWNERS**</li></ul>                                                                        |

---

<a id="project-structure"></a>

## 📁 Project Structure

```sh
└── fullstack-singer-platform/
├── docs/
│   ├── adr/
│   │   └── ADR-001-tech-stack.md
│   ├── audit/
│   │   ├── CODEBASE_AUDIT.md
│   │   └── MIGRATION_PATH.md
│   └── decisions/
│       ├── DEC-001-licensing-catalogue.md
│       └── DEC-002-infrastructure-cost.md
├── Singer Website/
│   ├── HTML/
│   │   ├── about.html
│   │   ├── sign-up.html
│   │   └── songs.html
│   ├── JavaScript/
│   │   └── app.js
│   └── Public/
│       ├── images/
│       │   ├── Background_image.jpg
│       │   ├── image1.jpg
│       │   ├── image2.jpg
│       │   ├── image3.jpg
│       │   ├── image4.jpg
│       │   ├── image5.jpg
│       │   ├── image6.jpg
│       │   ├── image7.jpg
│       │   └── test_image.jpeg
│       └── style.css
├── CODE_OF_CONDUCT.md
├── CONTRIBUTING.md
├── index.html
├── LICENSE
├── README.md
└── SECURITY.md
```

---

<a id="project-index"></a>

### 📑 Project Index

<details open>
   <summary><b>FULLSTACK-SINGER-PLATFORM/</b></summary>
   <details>
      <summary><b>__root__</b></summary>
      <ul>
         <li><b><a href="./CODE_OF_CONDUCT.md">CODE_OF_CONDUCT.md</a></b> — File.</li>
         <li><b><a href="./CONTRIBUTING.md">CONTRIBUTING.md</a></b> — File.</li>
         <li><b><a href="./index.html">index.html</a></b> — HTML page.</li>
         <li><b><a href="./LICENSE">LICENSE</a></b> — File.</li>
         <li><b><a href="./README.md">README.md</a></b> — Project documentation, overview and setup instructions.</li>
         <li><b><a href="./SECURITY.md">SECURITY.md</a></b> — File.</li>
      </ul>
   </details>
   <details>
      <summary><b>.github</b></summary>
      <ul>
         <li><b><a href=".github/CODEOWNERS">CODEOWNERS</a></b> — File.</li>
      </ul>
      <details>
         <summary><b>ISSUE_TEMPLATE</b></summary>
      <ul>
         <li><b><a href=".github/ISSUE_TEMPLATE/bug_report.yml">bug_report.yml</a></b> — File.</li>
         <li><b><a href=".github/ISSUE_TEMPLATE/config.yml">config.yml</a></b> — File.</li>
         <li><b><a href=".github/ISSUE_TEMPLATE/feature_request.yml">feature_request.yml</a></b> — File.</li>
      </ul>
      </details>
      <details>
         <summary><b>PULL_REQUEST_TEMPLATE</b></summary>
      <ul>
         <li><b><a href=".github/PULL_REQUEST_TEMPLATE/pull_request_template.yml">pull_request_template.yml</a></b> — File.</li>
      </ul>
      </details>
      <details>
         <summary><b>scripts</b></summary>
      <ul>
         <li><b><a href=".github/scripts/update-contributors.js">update-contributors.js</a></b> — JavaScript file.</li>
      </ul>
      </details>
      <details>
         <summary><b>workflows</b></summary>
      <ul>
         <li><b><a href=".github/workflows/ci.yml">ci.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-contributors.yml">update-contributors.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-project-index.yml">update-project-index.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-project-structure.yml">update-project-structure.yml</a></b> — File.</li>
         <li><b><a href=".github/workflows/update-tech-badges-single-repo.yml">update-tech-badges-single-repo.yml</a></b> — File.</li>
      </ul>
      </details>
   </details>

   <details>
      <summary><b>Singer Website</b></summary>
      <details>
         <summary><b>HTML</b></summary>
      <ul>
         <li><b><a href="Singer Website/HTML/about.html">about.html</a></b> — HTML page.</li>
         <li><b><a href="Singer Website/HTML/sign-up.html">sign-up.html</a></b> — HTML page.</li>
         <li><b><a href="Singer Website/HTML/songs.html">songs.html</a></b> — HTML page.</li>
      </ul>
      </details>
      <details>
         <summary><b>JavaScript</b></summary>
      <ul>
         <li><b><a href="Singer Website/JavaScript/app.js">app.js</a></b> — JavaScript file.</li>
      </ul>
      </details>
      <details>
         <summary><b>Public</b></summary>
      <ul>
         <li><b><a href="Singer Website/Public/style.css">style.css</a></b> — Stylesheet.</li>
      </ul>
      <details>
         <summary><b>images</b></summary>
      <ul>
         <li><b><a href="Singer Website/Public/images/Background_image.jpg">Background_image.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image1.jpg">image1.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image2.jpg">image2.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image3.jpg">image3.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image4.jpg">image4.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image5.jpg">image5.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image6.jpg">image6.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/image7.jpg">image7.jpg</a></b> — File.</li>
         <li><b><a href="Singer Website/Public/images/test_image.jpeg">test_image.jpeg</a></b> — File.</li>
      </ul>
      </details>
      </details>
   </details>


</details>

---

<a id="getting-started"></a>

## 🚀 Getting Started

<a id="prerequisites"></a>

### 📋 Prerequisites

This project requires the following dependencies:

- **Programming Language:** HTML, CSS and JavaScript

<a id="installation"></a>

### ⚙️ Installation

Build fullstack-singer-platform from the source and install dependencies:

1. **Clone the repository:**

   ```sh
   ❯ git clone https://github.com/MA1002643/fullstack-singer-platform
   ```

2. **Navigate to the project directory:**

   ```sh
   ❯ cd fullstack-singer-platform
   ```

<a id="usage"></a>

### 💻 Usage

Run the project with:

echo 'INSERT-RUN-COMMAND-HERE'

<a id="testing"></a>

### 🧪 Testing

Fullstack-singer-platform uses the {**test_framework**} test framework. Run the test suite with:

echo 'INSERT-TEST-COMMAND-HERE'

---

<a id="learning-outcomes"></a>

## 🎓 Learning Outcomes

- Designed and developed a **full-stack artist portfolio platform** using **Node.js**, **Express**, **MySQL**, and **EJS**, following the **MVC architectural pattern**.
- Strengthened understanding of **RESTful API design** and **server–client interaction** through dynamic content rendering and modular routing.
- Implemented **CRUD functionality** for artist profiles, media content, and user interactions, reinforcing database integration and query optimization skills.
- Gained hands-on experience in **authentication**, **session management**, and **secure form handling** to protect user data and application logic.
- Enhanced proficiency with **frontend templating (EJS)** and **backend development (Express.js)** for real-world, production-ready web applications.
- Practiced **responsive UI design** using **Bootstrap** and **Font Awesome**, ensuring accessibility and consistency across devices.
- Applied **modular software engineering principles** to achieve clean code separation between controllers, models, and routes.
- Strengthened understanding of **database schema design**, **foreign key relationships**, and **SQL joins** for structured data management.
- Explored **deployment workflows** and configuration for hosting a Node.js application connected to a cloud-based MySQL database.
- Improved **collaborative development and version control** practices using **Git**, **branching workflows**, and **comprehensive documentation** to maintain project quality.

---

<a id="roadmap"></a>

## 📈 Roadmap

- [ ] **`Task 1`**: Implement feature one.
- [ ] **`Task 2`**: Implement feature two.
- [ ] **`Task 3`**: Implement feature three.

---

<a id="contributors"></a>

## 🤝 Contributors

<!-- CONTRIBUTORS:START -->
<p align="left">
<a href="https://github.com/MA1002643" title="MA1002643"><img src="https://images.weserv.nl/?url=avatars.githubusercontent.com%2Fu%2F87866666%3Fv%3D4%26s%3D96&w=48&h=48&fit=cover&mask=circle&border=white&borderwidth=2" alt="MA1002643" width="48" height="48" style="border-radius: 50%;"/></a>
</p>
<!-- CONTRIBUTORS:END -->

---

<a id="acknowledgment"></a>

## ✨ Acknowledgments

- Built as part of a **full-stack engineering showcase**, combining **Node.js**, **Express**, **MySQL**, and **EJS** to deliver a professional artist platform.
- Inspired by **modern music portfolio sites** that emphasize visual identity, performance, and content scalability.
- Thanks to the **open-source ecosystem** and **mentors** whose guidance strengthened the project’s architecture, UI flow, and deployment strategy.

---

<a id="license"></a>

## 📜 License

This project is licensed under the **[MIT License](https://github.com/MA1002643/fullstack-singer-platform/blob/main/LICENSE)**. See the **[LICENSE](https://choosealicense.com/licenses/)** file for full details.

#

<p align="center">
  <strong>© 2025 Muhammad Abdullah</strong><br>
  Developed with 💙 using HTML, CSS and JavaScript<br>
  <a href="#top"><img alt="Back to Top" src="https://img.shields.io/badge/Back_to_Top-0A0A0A?style=for-the-badge">
</a>
</p>
