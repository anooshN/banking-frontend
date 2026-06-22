# Banking Frontend

Production-grade Banking Application — React 18 + TypeScript + Tailwind CSS

## Tech Stack
- **Framework**: React 18 + TypeScript
- **Build**: Vite
- **State**: Redux Toolkit + RTK Query
- **UI**: Tailwind CSS + shadcn/ui
- **Routing**: React Router v6
- **Auth**: OAuth2 PKCE + JWT (HttpOnly cookies)
- **HTTP**: Axios with interceptors
- **Forms**: React Hook Form + Zod
- **Charts**: Recharts
- **Real-time**: WebSocket / SSE
- **Testing**: Jest, React Testing Library, Cypress

## Pages
| Route | Page | Auth Required |
|---|---|---|
| /login | Login / MFA / SSO | No |
| /dashboard | Dashboard | Yes |
| /accounts | Accounts | Yes |
| /transactions | Transactions | Yes |
| /transfers | Transfers | Yes |
| /payments | Bill Payments | Yes |
| /cards | Cards | Yes |
| /loans | Loans | Yes |
| /notifications | Notifications | Yes |
| /profile | User Profile & KYC | Yes |
| /reports | Reports & Statements | Yes |
| /admin | Admin Panel | ADMIN only |

## Getting Started
```bash
git clone https://github.com/anooshN/banking-frontend.git
cd banking-frontend
npm install
npm run dev
```

Frontend runs on http://localhost:5173
Backend gateway expected at http://localhost:8080
