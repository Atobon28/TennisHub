Claro. Te lo dejo actualizado para D3, manteniendo el estilo simple:

````markdown
# TennisHub

TennisHub is a web application developed by **Ana Tobon** and **Juan Pablo Castro**.

It is a platform created for the tennis community, where different types of users can access different sections depending on their role.

---

## Authors

- Ana Tobon
- Juan Pablo Castro

---

## Project Overview

TennisHub is a multi-role platform designed for:

- Players
- Coaches
- Admins

The project currently includes role-based authentication, protected routes, real data persistence with Firebase, and functional flows for matches, courts, tournaments, and coach profiles.

---

## Technologies Used

- React
- TypeScript
- Vite
- React Router DOM
- Firebase Authentication
- Firebase Firestore
- CSS
- Iconify
- Vercel

---

## Installation

Clone the repository and install dependencies:

```bash
git clone <your-repository-url>
cd tennishub
npm install
````

Run the project locally:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Preview the production version:

```bash
npm run preview
```

---

## Main Scripts

* `npm run dev` → starts the project locally
* `npm run build` → builds the project for production
* `npm run preview` → previews the production version

---

## Environment Variables

To run the project correctly, create a `.env` file in the root folder with the Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

---

## Project Structure

```text
src/
├─ assets/
├─ components/
├─ context/
├─ firebase/
├─ layouts/
├─ pages/
├─ styles/
├─ App.tsx
├─ main.tsx
```

---

## Simple Folder Explanation

* `assets`: images and static files
* `components`: reusable interface parts
* `context`: global user session and authentication state
* `firebase`: Firebase configuration and database services
* `layouts`: shared page structures by role
* `pages`: main screens of the app
* `styles`: CSS files
* `App.tsx`: main routes and protected routes
* `main.tsx`: app entry point

---

## Current Status

Right now, the project includes:

* role-based login
* protected routes for Player, Coach, and Admin
* Firebase Authentication
* Firestore data persistence
* global user state with Context API
* functional match system
* singles and doubles matches
* court creation and management
* court surface types: Grass, Hard, and Clay
* tournament creation and management
* tournament categories and capacity configuration
* real tournament enrollment
* player profile with matches and tournaments
* coach profile with price and availability schedule
* admin management for courts and tournaments
* real password update with Firebase Auth
* public deployment with Vercel

---

## Main Features

### Player

Players can:

* view available courts
* filter courts by surface type
* create and join matches
* leave matches
* view match details
* view tournaments
* join eligible tournaments
* leave tournaments
* manage their profile category

### Coach

Coaches can:

* register and log in
* configure price per hour
* select available days
* define start and end hours for each available day
* update their profile information

### Admin

Admins can:

* create courts
* delete courts
* create tournaments
* delete tournaments
* select allowed tournament categories
* select one or more courts for a tournament
* define tournament type: Singles, Doubles, or Singles and Doubles
* define capacity by category

---

## Deployment

The project is deployed publicly using Vercel.

---

## Notes

This project is still under development. The main MVP flows are already functional, but some improvements are still pending, such as:

* final responsive testing
* accessibility review
* Firebase Storage for avatars
* tournament capacity enforcement
* showing registered players and pairs in tournaments
* better success and error messages
* performance optimization