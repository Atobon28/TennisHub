# TennisHub 🎾

TennisHub is a web application built with React, TypeScript, Vite and Firebase.  
The platform helps tennis communities organize matches, tournaments, courts and coach availability in one place.

Instead of managing everything through scattered WhatsApp messages, TennisHub centralizes the experience for three types of users: players, coaches and administrators.

---

## 🚀 Live Demo

Add the final Vercel link here:
https://tennis-hub-1.vercel.app/

---

## 📌 Project Purpose

TennisHub was created to solve a real problem in tennis communities: the difficulty of coordinating games, finding courts, joining tournaments and contacting coaches in a clear and organized way.

The application allows users to interact according to their role:

- **Players** can create matches, join matches, view tournaments, explore courts and find coaches.
- **Coaches** can configure their profile, availability and price per hour.
- **Admins** can create courts, manage tournaments and monitor activity from a dashboard.

---

## 👥 User Roles

### Player

Players can:

- Register and log in as player.
- View the player dashboard.
- Create tennis matches.
- Join available matches.
- Leave matches.
- View match details.
- Explore available courts.
- Filter courts by surface type.
- View and join tournaments according to category eligibility.
- View coaches and contact them through WhatsApp information.
- Edit profile information.

### Coach

Coaches can:

- Register and log in as coach.
- View the coach home page.
- Edit profile information.
- Configure price per hour.
- Configure available days and schedules.
- Show their contact information to players.

### Admin

Admins can:

- Register and log in as admin.
- View an admin dashboard.
- Create courts.
- Edit court information.
- Delete courts using a custom confirmation modal.
- Create tournaments.
- Define tournament type: singles, doubles or both.
- Select allowed categories.
- Define available spots by category.
- Assign courts to tournaments.
- Delete tournaments using a custom confirmation modal.
- View tournament registrations and activity.

---

## ✅ Core Features

### 1. Authentication and Authorization

The app includes authentication using Firebase Authentication.  
Users are redirected based on their role:

- Player route
- Coach route
- Admin route

This allows each user to access the correct dashboard and protected pages.

---

### 2. Match Management

Players can create and join matches.

Main match features:

- Create singles or doubles matches.
- Select court, date and time.
- Join available matches.
- Leave a match.
- Cancel a match if the user is the host.
- View match details.
- See players registered in each match.
- Filter matches by date and match type.
- Use custom confirmation modal instead of `window.confirm`.

---

### 3. Court Management

Admins can create and manage tennis courts.

Court features:

- Create courts with name, contact phone, address, surface type and image.
- Edit court information.
- Delete courts with a custom confirmation modal.
- Display court images with fallback images.
- Players can explore courts.
- Players can filter courts by surface type:
  - Grass
  - Hard
  - Clay

---

### 4. Tournament Management

Admins can create tournaments and players can join them.

Tournament features:

- Create tournaments with name, type, date and hour.
- Select tournament type:
  - Singles
  - Doubles
  - Singles and Doubles
- Select allowed player categories.
- Define capacity by category.
- Assign courts to tournaments.
- View registered players.
- Players can join tournaments only if eligible.
- Players can leave tournaments with a custom confirmation modal.
- Tournament view shows:
  - Type
  - Status
  - Player category
  - Allowed categories
  - Registration summary
  - Singles players
  - Doubles pairs
  - Players looking for partner

---

### 5. Coach Availability

Coaches can configure how players see their profile.

Coach features:

- Configure price per hour.
- Select available days.
- Configure available schedule.
- Display contact information.
- Show coach profile to players.
- Allow players to contact coaches through WhatsApp information.

---

### 6. WhatsApp Contact Integration

TennisHub uses phone numbers to help users contact coaches, players or court administrators through WhatsApp.

This makes the app more practical because it connects the platform with a communication tool that users already use every day.

---

## 🧠 Global State Management

The project uses React Context API to manage shared state across the application.

Main contexts:

- `AuthContext`
- `CourtsContext`
- `MatchesContext`
- `TournamentsContext`
- `PlayersContext`
- `CoachesContext`
- `DashboardContext`

This helps synchronize data between pages and avoid passing props manually through many components.

---

## 🔥 Firebase Integration

Firebase is used as the main backend service.

Firebase handles:

- User authentication
- User data
- Courts
- Matches
- Tournaments
- Tournament registrations
- Coach profile information
- Player profile information

The app uses separated service functions to keep Firebase logic outside the UI components.

---

## 🛠️ Technologies Used

- React
- TypeScript
- Vite
- Firebase Authentication
- Firebase Firestore
- Firebase Storage
- React Router DOM
- Context API
- Iconify
- CSS Modules / CSS files
- Vercel
- GitHub

---

## 📁 Project Structure

```txt
src/
├── assets/
├── components/
│   ├── common/
│   └── player/
├── context/
├── firebase/
├── pages/
│   ├── admin/
│   ├── coach/
│   └── player/
├── styles/
├── App.tsx
└── main.tsx
```

---

## 🧩 Main Components

Some reusable components include:

- `AdBanners`
- `ConfirmModal`
- `LoadingState`
- `EmptyState`
- `ErrorState`
- `PrimaryButton`
- `DangerButton`
- `CourtCard`
- `MatchCard`
- `TournamentCard`
- `PersonCard`

These components help keep the project organized and reduce repeated code.

---

## ♿ Accessibility Improvements

The project includes several accessibility improvements:

- Added `aria-label` to buttons with icons.
- Added descriptive `alt` text to images.
- Added fallback images when an image fails to load.
- Added `type="button"` to buttons that do not submit forms.
- Replaced `window.confirm` with a custom modal.
- Replaced browser `alert()` with UI messages.
- Added `role="alert"` for errors.
- Added `role="status"` for loading and success states.
- Improved color contrast.
- Added visible focus states.
- Avoided relying only on color for status indicators.

---

## ⚡ Performance Improvements

The project includes performance-focused improvements:

- Used `useMemo` for filtered and calculated data.
- Used `useCallback` for reusable functions.
- Memoized Provider values in contexts.
- Reduced unnecessary re-renders.
- Used `Promise.all` for parallel data loading.
- Added image fallbacks.
- Reduced repeated calculations inside JSX.
- Optimized dashboard data filtering.

---

## 🧼 Code Quality Improvements

Final code quality improvements included:

- Removed unused imports.
- Fixed duplicate imports caused by merge conflicts.
- Removed duplicate state declarations.
- Removed unnecessary `any` usage where possible.
- Improved TypeScript typing.
- Improved form validation.
- Improved error handling.
- Separated Firebase logic from UI logic.
- Used reusable components.
- Kept all written content in English.
- Cleaned merge conflict issues before final deployment.

---

## 📱 Responsive Design

The application was reviewed across different screen sizes:

- Mobile
- Tablet
- Desktop

---

## 🌿 Branching and Git Workflow

The project used Git and GitHub for version control.

Main workflow:

- Work was developed in feature or delivery branches.
- Changes were committed with clear messages.
- Final work was merged into `main`.
- Merge conflicts were resolved manually.
- Build and lint were checked before final deployment.

Example commit types:

```txt
feat: add tournament registration flow
fix: improve accessibility and button behavior
perf: reduce unnecessary renders in dashboard and contexts
fix: replace browser alerts and confirm dialogs
```

---

## ▶️ How to Run the Project Locally

### 1. Clone the repository

```bash
git clone https://github.com/Juancastrog10/TennisHub-1.git
```

### 2. Enter the project folder

```bash
cd TennisHub-1
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create the environment file

Create a file named `.env` in the root folder.

Add your Firebase variables:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 5. Run the development server

```bash
npm run dev
```

---

## ✅ Final Verification Commands

Before deployment, run:

```bash
npm run build
npm run lint
```

The app should build successfully and pass linting before pushing to GitHub or deploying to Vercel.

---

## 🚀 Deployment

The app is deployed with Vercel.

Deployment checklist:

- Project connected to GitHub.
- Production branch set to `main`.
- Firebase environment variables added to Vercel.
- Build command:

```bash
npm run build
```

- Output folder:

```txt
dist
```

---


## 👩‍💻 Team

Ana Tobón
Juan Castro

---

## 📌 Final Notes

TennisHub is a functional tennis management platform designed to improve how players, coaches and court administrators organize their tennis activities.

The final version includes authentication, role-based behavior, Firebase data persistence, match management, tournament management, court management, coach availability, accessibility improvements, performance optimizations and public deployment.
