# BugDo - Todo App QA Demo

A Vue 3 + TypeScript todo application with authentication and role-based access control.

## Features

- **Authentication**: Choose between User or Admin roles
- **Role-based Access**: 
  - Users can only see and manage their own todos
  - Admins can see and manage all todos
- **Client-side Routing**: Clean URLs with Vue Router
- **Real-time Updates**: Full CRUD operations for todos
- **Responsive Design**: Built with Tailwind CSS

## Routes

- `/` - Login page (redirects to `/todos` if already authenticated)
- `/todos` - Todo list page (requires authentication)

## Getting Started

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm run dev
   ```

This will start both the Express backend server and the Vue frontend development server.

## Tech Stack

- **Frontend**: Vue 3, TypeScript, Vue Router, Tailwind CSS
- **Backend**: Express.js, JWT authentication
- **Build Tool**: Vite
- **Package Manager**: pnpm
