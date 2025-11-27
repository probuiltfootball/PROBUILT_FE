# PROBUILT Frontend

A modern, production-ready Next.js application for the PROBUILT football coaching platform. Built with a focus on performance, developer experience, and scalability.

## 🚀 Tech Stack

-   **[Next.js 16](https://nextjs.org/)**: App Router, Server Components, and the latest React 19 features.
-   **[React 19](https://react.dev/)**: Latest React with improved performance and features.
-   **[TypeScript 5](https://www.typescriptlang.org/)**: Strict static typing for code quality and developer tooling.
-   **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework with the new `@tailwindcss/postcss` pipeline.
-   **[Redux Toolkit](https://redux-toolkit.js.org/)**: Efficient global state management with minimal boilerplate.
-   **[React Redux](https://react-redux.js.org/)**: Official React bindings for Redux.
-   **[next-themes](https://github.com/pacocoursey/next-themes)**: Seamless dark/light mode with no flash on load.
-   **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animations and interactions.
-   **[React Icons](https://react-icons.github.io/react-icons/)**: Comprehensive icon library as React components.
-   **[ESLint 9](https://eslint.org/)**: Pluggable linter with Flat Config.
-   **[Prettier](https://prettier.io/)**: Opinionated code formatter for consistency.

## ✨ Features

-   ✅ **Next.js App Router**: Modern routing with Server and Client Components.
-   ✅ **Dark Mode**: Theme switching with `next-themes`, preventing flash of unstyled content.
-   ✅ **Global State Management**: Redux Toolkit store ready for feature slices.
-   ✅ **Smooth Animations**: Framer Motion integration for hero sections and interactions.
-   ✅ **Responsive Design**: Mobile-first Tailwind CSS approach.
-   ✅ **Code Quality**: ESLint and Prettier pre-configured for consistent code style.
-   ✅ **TypeScript Strict Mode**: Full type safety across the application.
-   ✅ **Custom Design System**: Dark theme with accent colors (#00FFC2).
-   ✅ **Global Background Provider**: Fixed position rotating background images across all pages.
-   ✅ **Professional Footer**: Multi-column footer with links, social media, and branding.
-   ✅ **Image Carousel**: Smooth transitions between rotating background images.

## 📂 Project Structure

```
src/
├── app/
│   ├── (home)/
│   │   └── page.tsx              # Home page with all sections
│   ├── theme/
│   │   └── page.tsx              # Theme showcase page
│   ├── layout.tsx                # Root layout with providers
│   └── globals.css               # Global styles and CSS variables
├── components/
│   ├── hero-section.tsx          # Hero section with image carousel
│   ├── edge-section.tsx          # Edge training section
│   ├── hub-section.tsx           # Hub academy section
│   ├── team-section.tsx          # Team showcase section
│   ├── testimonials-section.tsx  # User testimonials
│   ├── cta-section.tsx           # Call-to-action section
│   ├── navbar.tsx                # Navigation bar with links
│   ├── footer.tsx                # Professional footer with links
│   └── theme-toggle.tsx          # Dark/light mode toggle button
├── lib/
│   ├── store.ts                  # Redux store configuration
│   ├── features/                 # Redux slices (ready for expansion)
│   └── providers/
│       ├── store-provider.tsx    # Redux Provider wrapper
│       ├── theme-provider.tsx    # Theme Provider wrapper
│       └── background-provider.tsx # Global background image carousel
└── assets/
    ├── svg/
    │   └── site-logo.svg         # PROBUILT logo
    └── football/
        ├── horz0.jpg             # Horizontal background images
        ├── horz1.jpg
        ├── horz2.avif
        ├── horz3.avif
        ├── vert1.avif            # Vertical background images
        ├── vert2.avif
        ├── vert3.avif
        └── bg.avif               # Static background image
```

## 🛠️ Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 📜 Available Scripts

-   `npm run dev`: Start development server with Turbopack
-   `npm run build`: Create optimized production build
-   `npm run start`: Run production build
-   `npm run lint`: Check code quality with ESLint
-   `npm run format`: Format code with Prettier

## 🎨 Design System

- **Primary Colors**: Dark theme (#000000, #2E2E2E), Accent (#00FFC2)
- **Typography**: Manrope font family
- **Spacing**: Tailwind CSS defaults
- **Animations**: Framer Motion for interactive elements
- **CSS Variables**: Custom theme variables in `globals.css`
- **Responsive Breakpoints**: Mobile-first design with md, lg breakpoints

## 🏗️ Key Components

### Hero Section
- Rotating image carousel with smooth fade transitions
- 5-second interval between images
- Dark overlay for text readability
- Responsive height (1020px on desktop)

### Navigation Bar
- Fixed top navigation with logo
- Quick links (Hub, Edge, Community, PB Points)
- Register and Login buttons
- Responsive mobile menu

### Footer
- 4-column layout (Brand, Quick Links, Company, Connect)
- Social media links (Facebook, Instagram, LinkedIn, X, WhatsApp)
- Copyright and legal links
- Fully responsive design

### Background Provider
- Global fixed background image carousel
- Rotates through 7 football images
- Positioned from bottom to top
- No repeat, covers entire viewport
- Stays behind all content with z-index management

## 🚀 Ready for Development

The project is fully configured and ready for adding new features:
- Redux store is set up and ready for feature slices
- Component architecture is clean and modular
- Providers are configured for theme, state management, and global backgrounds
- TypeScript strict mode ensures type safety
- All major landing page sections are implemented
