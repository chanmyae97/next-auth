# Next-Auth Project

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app), implementing a robust authentication system using Next-Auth.

## 🚀 Project Details

This project provides a comprehensive authentication solution with the following features:

### ✨ Features

- **Authentication Providers:**
  - Google
  - GitHub
  - Credentials (Email and Password)
- **Database:** Neon (Serverless PostgreSQL) with Prisma ORM
- **User Management:**
  - User registration and login
  - Social login with Google and GitHub
  - Password reset functionality
  - Two-factor authentication
- **Authorization:**
  - Role-based access control (Admin and User roles)
  - Protected routes for authenticated users
- **API:**
  - API authentication routes
- **Email Notifications:**
  - Email verification
  - Password reset
  - Two-factor authentication codes

### 💻 Technologies Used

- [Next.js](https://nextjs.org/) - React framework for building server-side rendered and static web applications.
- [Next-Auth](https://next-auth.js.org/) - Authentication for Next.js.
- [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js and TypeScript.
- [Neon](https://neon.tech/) - Serverless PostgreSQL.
- [React](https://reactjs.org/) - JavaScript library for building user interfaces.
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript.
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
- [Resend](https://resend.com/) - Email API for developers.

## 🏁 Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📖 Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🚀 Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
