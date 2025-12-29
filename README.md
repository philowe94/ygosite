# YgoSite

A modern, fast, and beautiful Next.js application built with TypeScript and Tailwind CSS.

## Features

- ⚡ **Next.js 14** with App Router
- 🎨 **Tailwind CSS** for styling
- 📱 **Responsive Design** that works on all devices
- 🔧 **TypeScript** for type safety
- 🚀 **Modern UI** with beautiful gradients and animations
- 📦 **Optimized Performance** with Next.js
- 🔍 **SEO-friendly** with proper meta tags
- 🌙 **Dark mode support**
- 👤 **User Accounts** with NextAuth.js authentication
- 🃏 **Deck Management** - Save and manage multiple Yu-Gi-Oh! decks
- 💾 **Database** - SQLite database with Prisma ORM

## Getting Started

### Prerequisites

- Node.js 18.0 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd ygosite
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up the database:
```bash
# Create .env.local file in the project root with:
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"

# Generate a secure secret (optional but recommended):
# openssl rand -base64 32

# Generate Prisma client and run migrations
npm run db:generate
npm run db:migrate

# Or push the schema directly:
DATABASE_URL="file:./prisma/dev.db" npx prisma db push
```

**Important:** Make sure to create the `.env.local` file before running the app, otherwise account creation will fail!

4. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run type-check` - Run TypeScript type checking
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:studio` - Open Prisma Studio (database GUI)

## Project Structure

```
ygosite/
├── app/                    # Next.js 14 App Router
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── Header.tsx         # Navigation header
│   ├── Hero.tsx           # Hero section
│   └── Footer.tsx         # Footer component
├── public/                # Static assets
├── next.config.js         # Next.js configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Dependencies and scripts
```

## Technologies Used

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## Learn More

To learn more about the technologies used in this project:

- [Next.js Documentation](https://nextjs.org/docs) - Learn about Next.js features and API
- [React Documentation](https://react.dev) - Learn React
- [TypeScript Documentation](https://www.typescriptlang.org/docs) - Learn TypeScript
- [Tailwind CSS Documentation](https://tailwindcss.com/docs) - Learn Tailwind CSS

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
