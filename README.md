```markdown
# EgyPyramid Dashboard - Frontend 🇪🇬

A comprehensive Single Page Application (SPA) dashboard for managing content and data for the EgyPyramid platform. Built with Vue 3 to ensure high performance and a seamless user experience.

🔗 **Backend Repository:** [egypyramid-cms-backend](https://github.com/eslam985/egypyramid-cms-backend)

## 🛠 Tech Stack

* **Core Framework:** Vue 3 (Composition API)
* **Build Tool:** Vite
* **State Management:** Pinia
* **Routing:** Vue Router
* **Styling:** Tailwind CSS v4
* **HTTP Client:** Axios
* **Validation:** Zod
* **Icons:** Lucide Vue
* **Linting/Formatting:** ESLint, Oxlint, Prettier

## ✨ Key Features

* **Comprehensive Media Management:** Dedicated panels to manage media entries, seasons, episodes, links, and genres.
* **Monitoring & Analytics Dashboard:** Real-time system counters, analytics, broken links tracking, and missing episodes alerts.
* **Download Tasks Management:** Specialized interface to track, manage, and schedule background download tasks.
* **Authentication & Security:** Secure login system, protected routes, and seamless JWT token management (Access & Refresh Tokens) using Axios Interceptors.
* **Enhanced UX:** 
  * Full Dark Mode support.
  * Interactive toast notifications.
  * Fully responsive design across all devices.
* **Data Integrity:** Strict client-side validation using `Zod` schemas that directly mirror the backend architecture.

## 📂 Project Structure

The project follows a clean, modular, and scalable architecture within the `src` directory:

```text
src/
├── api/          # Axios configuration and interceptors grouped by entity
├── assets/       # Global CSS and Tailwind entry points
├── components/   # UI components organized by domain (Dashboard, Media, Layouts, etc.)
├── composables/  # Reusable Vue composables (e.g., useFormValidation)
├── layouts/      # Application layouts (MainLayout, Sidebar, Header)
├── router/       # Vue Router configuration and route guarding
├── schemas/      # Zod validation schemas
├── stores/       # Pinia state management modules
├── utils/        # Global helper functions and Regex utilities
└── views/        # Main application views/pages

```

## 💡 Getting Started

### Prerequisites

Ensure you have a recent version of Node.js installed (recommended `v22.18.0` or higher) to avoid dependency conflicts.

### Installation

1. Clone the repository and install dependencies:

```bash
npm install

```

2. Environment Setup:
Create a `.env` file in the root directory and add your backend API URL:

```env
VITE_API_URL=http://localhost:3000/api  # For local development

```

3. Run the development server:

```bash
npm run dev

```

### Available Scripts

* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the app for production into the `dist/` folder.
* `npm run preview`: Locally previews the production build.
* `npm run lint`: Runs both Oxlint and ESLint to find and automatically fix code issues.
* `npm run format`: Formats the codebase using Prettier.

```

```