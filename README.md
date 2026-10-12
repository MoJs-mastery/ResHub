# 🍽️ Restaurant Website — Full-Stack Next.js Project

A modern, responsive, full-stack Restaurant Management Website built with [Next.js](https://nextjs.org), TypeScript, MongoDB, NextAuth.js, and Tailwind CSS.

This project is developed for learning full-stack web development, including authentication, database integration, RESTful APIs, CRUD operations, and deployment.

**Lead Developer:** Eng Ina Liibaan  
**Project:** Restaurant Management Website  
**Level:** Beginner to Intermediate  
**Framework:** Next.js App Router

---

## 🚀 Technologies Used

- **Next.js** — Full-stack React framework
- **TypeScript** — Type-safe JavaScript
- **React.js** — Frontend user interface
- **Tailwind CSS** — Responsive UI styling
- **MongoDB** — NoSQL database
- **Mongoose** — MongoDB object modeling
- **NextAuth.js** — Authentication and session management
- **bcryptjs** — Secure password hashing

## ✨ Features

### Public Website
- Responsive homepage
- Restaurant information
- View food menu and categories
- View food prices and availability
- User registration
- User login and logout

### Dashboard
- Protected dashboard
- View user information
- Create menu items
- Read menu items
- Update menu items
- Delete menu items
- Manage restaurant content

### Authentication
- Register new users
- Secure password hashing
- Login using email and password
- JWT-based sessions
- Logout functionality
- Protected dashboard routes

## 📁 Project Structure

```text
restaurant-app/
│
├── app/
│   ├── api/
│   │   ├── auth/
│   │   ├── menu/
│   │   └── restaurant/
│   │
│   ├── dashboard/
│   ├── login/
│   ├── register/
│   ├── menu/
│   ├── about/
│   │
│   ├── page.tsx
│   ├── layout.tsx
│   ├── globals.css
│   └── providers.tsx
│
├── components/
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── MenuCard.tsx
│   └── MenuForm.tsx
│
├── lib/
│   ├── mongodb.ts
│   └── auth.ts
│
├── models/
│   ├── User.ts
│   ├── MenuItem.ts
│   └── Restaurant.ts
│
├── types/
│
├── public/
├── .env.local
├── package.json
├── tsconfig.json
└── README.md
```

## ⚙️ Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
```

Navigate to the project:

```bash
cd restaurant-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory.

```env
MONGODB_URI=your_mongodb_connection_string

NEXTAUTH_SECRET=your_secure_random_secret

NEXTAUTH_URL=http://localhost:3000
```

**Important:** Never upload `.env.local` to GitHub.

### 4. Run the Development Server

```bash
npm run dev
```

Or use another supported package manager:

```bash
yarn dev
```

```bash
pnpm dev
```

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The application will automatically reload when you modify your source code.

## 🔐 Authentication

This project uses NextAuth.js for authentication.

Users can register, log in, access protected pages, and log out securely.

Passwords are hashed using bcryptjs before being stored in MongoDB.

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register user |
| GET/POST | `/api/auth/[...nextauth]` | Authentication handlers |
| GET | `/api/menu` | Get all menu items |
| POST | `/api/menu` | Create menu item |
| GET | `/api/menu/:id` | Get single item |
| PUT | `/api/menu/:id` | Update menu item |
| DELETE | `/api/menu/:id` | Delete menu item |

Menu creation, updating, and deletion require authentication.

## 🗄️ Database

The application uses MongoDB with Mongoose.

Main database models:

- **User** — Stores account information
- **MenuItem** — Stores food menu details
- **Restaurant** — Stores restaurant information

## 🧪 Build for Production

To create a production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

## 🌐 Deploy on Vercel

The easiest way to deploy this Next.js application is using [Vercel](https://vercel.com/new).

Deployment steps:

1. Push your project to GitHub.
2. Sign in to Vercel.
3. Import your GitHub repository.
4. Configure the required environment variables.
5. Deploy your application.

Make sure MongoDB Atlas is configured to allow connections from your deployment environment.

Read the [Next.js Deployment Documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more information.

## 📚 Learn More

Useful learning resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [MongoDB Documentation](https://www.mongodb.com/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## 👨‍💻 Lead Developer

**Eng Ina Liibaan**

Full-Stack Web Development | Software Engineering | Technical Education

This project is prepared for educational purposes to help developers understand modern full-stack web application development.

---

© 2026 Restaurant Website Project. All Rights Reserved.

**Developed & Led by Eng Ina Liibaan** 🚀
