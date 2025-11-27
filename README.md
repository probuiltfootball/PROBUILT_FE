# PROBUILT Frontend Starter

This repository is an opinionated Next.js App Router starter template, pre-configured with the specific tooling requested for the PROBUILT frontend. It provides a solid foundation for building modern, high-performance web applications.

## 🚀 Tech Stack

This project leverages a modern stack focused on performance, developer experience, and scalability:

-   **[Next.js 16](https://nextjs.org/)**: App Router, Server Components, and the latest React features.
-   **[TypeScript](https://www.typescriptlang.org/)**: Static typing for better code quality and developer tooling.
-   **[Tailwind CSS 4](https://tailwindcss.com/)**: Utility-first CSS framework with the new `@tailwindcss/postcss` pipeline.
-   **[Redux Toolkit](https://redux-toolkit.js.org/)**: Efficient global state management.
-   **[React Redux](https://react-redux.js.org/)**: Official React bindings for Redux.
-   **[next-themes](https://github.com/pacocoursey/next-themes)**: Perfect dark mode implementation.
-   **[Framer Motion](https://www.framer.com/motion/)**: Production-ready animation library for React.
-   **[React Icons](https://react-icons.github.io/react-icons/)**: Popular icons as React components.
-   **[ESLint](https://eslint.org/)**: Pluggable JavaScript linter (Flat Config).
-   **[Prettier](https://prettier.io/)**: Opinionated code formatter.

## ✨ Features

-   **App Router Ready**: Built from the ground up using the Next.js App Router.
-   **Dark Mode**: Integrated theme switching with `next-themes`, preventing flash of incorrect theme.
-   **State Management**: Redux Toolkit store setup with example slices.
-   **Animations**: Hero section and interactions powered by Framer Motion.
-   **Code Quality**: Pre-configured ESLint and Prettier for consistent code style.
-   **Responsive Design**: Mobile-first approach using Tailwind CSS.

## 🛠️ Getting Started

Follow these steps to get the project running locally:

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Start the development server:**

    ```bash
    npm run dev
    ```

3.  **Open your browser:**

    Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📂 Project Structure

-   `src/app`: Next.js App Router entry points (layouts, pages, global styles).
-   `src/components`: Reusable UI components (Hero, Counter, ThemeToggle, etc.).
-   `src/lib`: Redux Toolkit store configuration and slices.
-   `public`: Static assets.

## 📜 Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Creates an optimized production build.
-   `npm run start`: Runs the built application in production mode.
-   `npm run lint`: Runs ESLint to check for code quality issues.
-   `npm run format`: Formats code using Prettier.
