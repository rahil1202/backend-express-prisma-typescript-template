
# 🚀 Backend Express + Prisma + TypeScript Template

A **production-ready** and **developer-friendly** startup template for building scalable Express.js backend applications using **TypeScript**, **Prisma ORM**, **Zod validation**, and **security tools** like **Helmet**, **Rate Limiter**, and **HPP**.

---

## 🛠️ Features

- ⚙️ Express.js with TypeScript
- 🧠 Zod for schema validation
- 🛡️ Secure headers (Helmet, HPP, CORS)
- 🧱 Prisma ORM with PostgreSQL
- 🔐 JWT-based Auth (sample-ready)
- 🚦 Rate Limiting support
- 📬 Nodemailer configured
- 📊 Ready to use Email Templates for email service
- 📦 Environment variable management with `dotenv`
- 📊 Swagger API documentation
- 🧪 Pre-configured testing setup (Jest)
- 🧹 Pre-configured ESLint + Prettier + Husky + Lint-Staged
- 🔄 Hot Reload (via `nodemon`, `tsx`, or `ts-node-dev`)

---

## 📦 Installation Guide

```bash
# 1️⃣ Clone the repository
git clone https://github.com/rahil1202/backend-express-prisma-typescript-template.git

# 2️⃣ Install dependencies
cd backend-express-prisma-typescript-template
npm install

# 3️⃣ Setup environment variables
cp .env.example .env
# Add your DB_URL and other variables in .env

# 4️⃣ Run Prisma commands
npx prisma generate
npx prisma migrate dev --name init

# 5️⃣ Start the server
npm run dev      # Dev mode with nodemon
npm run dev:tsx  # Fast dev mode using TSX
```

---

## 💡 Why Use This Template?

- ✅ Save time setting up repetitive backend configs.
- ✅ Start building your business logic immediately.
- ✅ Maintain **code quality** with pre-configured linters.
- ✅ Easily scalable for production deployment.

---

## 📂 Folder Structure

```
📁 src
├── 📄 index.ts          # App entry point
├── 📁 config            # Env, DB, and other global configs
├── 📁 middlewares       # Custom middlewares (e.g., validation, error handler)
├── 📁 routes            # All Express routes
├── 📁 controllers       # Business logic for routes
├── 📁 utils             # Helper functions
├── 📁 services          # External services (e.g., mail, token)
├── 📁 schemas           # Zod validation schemas
├── 📁 models            # (Optional) ORM helpers if needed
├── 📁 prisma            # Prisma schema & seed file
│   ├── schema.prisma
│   └── seed.ts
```

---

## 🔧 Useful Commands

| Command                  | Description                                |
| ------------------------ | ------------------------------------------ |
| `npm run dev`            | Start server with hot reload using nodemon |
| `npm run dev:ts-node`    | Start server with ts-node-dev              |
| `npm run dev:tsx`        | Fast dev start with tsx                    |
| `npm run build`          | Compile TypeScript to JavaScript           |
| `npm run lint:fix`       | Auto-fix ESLint issues                     |
| `npm run format`         | Format code using Prettier                 |
| `npm run prisma:migrate` | Create and apply DB migrations             |
| `npm run prisma:studio`  | Open Prisma Studio for DB                  |

---

## 🧪 Lint & Formatting

- ✅ ESLint with Prettier
- ✅ Husky pre-commit hook
- ✅ `lint-staged` for formatting staged files

```bash
npm run lint       # Check lint issues
npm run lint:fix   # Auto-fix issues
```

---

## 📝 License

Licensed under [AGPL-3.0-only](LICENSE).

---

> Created with ❤️ for fast backend development.
