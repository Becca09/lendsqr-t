This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Approach

- **Routing & App Directory**: 
Uses Next.js App Router with pages under `src/app` (`/login`, `/users`, `/users/[id]`).

- **Authentication (lightweight)**: 
Client-side check via `localStorage.auth === "1"`. The Login page sets this on successful login and redirects to `/users`.

- **Data**:
 Mock user data is deterministically generated and stored in `localStorage` using helpers in `src/lib/users.ts` (`seedUsers`, `getUsers`, `getUserById`). This keeps the app self-contained without a backend.

- **State & UI**: 
React client components with local state manage filters, pagination, and simple menus. Styles are authored in modular SCSS under `src/styles`.

- **Testing**: 
Jest + React Testing Library. `@testing-library/jest-dom` is configured in `jest.setup.ts`. Core flows are covered: Sidebar render, Login, Users list, and User Details.

## User Login

- **Credentials**:
  - Email: `user@lendsqr.com`
  - Password: `password`
- **Flow**:
  1. Open `/login`.
  2. Enter the credentials above and click "LOG IN".
  3. On success, `localStorage.auth` is set to `"1"` and you are redirected to `/users`.
  4. Protected pages (`/users`, `/users/[id]`) check this flag and redirect to `/login` if missing.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
