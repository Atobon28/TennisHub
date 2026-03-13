# TennisHub

TennisHub is a web application developed by **Ana Tobon** and **Juan Pablo Castro**.

The project is designed to connect the tennis community through a platform that supports different user roles and allows users to interact with courts, matches, tournaments, and role-based features in one place.

---

## Authors

- Ana Tobon
- Juan Pablo Castro

---

## Project Overview

TennisHub is a multi-role platform for the tennis community.  
It includes three main user profiles:

- **Player**
- **Coach**
- **Admin**

The purpose of the application is to provide an organized and intuitive experience for users who want to:

- check available courts
- connect with players of similar level
- explore tournaments
- manage role-specific information and views

---

## Main Features

### Player
- View and explore available courts
- Find matches with players of a similar level
- Explore tournaments
- Manage personal profile

### Coach
- Access coach-related views
- Manage training-related information
- Interact with platform services from the coach perspective

### Admin
- Manage courts
- Manage tournaments
- Oversee platform information
- Control administrative views and flows

---

## Technologies and Libraries

### Frontend
- React 18
- TypeScript
- Vite
- React Router DOM
- CSS

### Backend
- Supabase

### Notes
This project follows a component-based structure and uses TypeScript for safer and clearer development.

---

## Project Structure

```bash
src/
  pages/
    player/
    coach/
    admin/
  components/
  types/
  data/
  App.tsx
  main.tsx
```

## Setup Instructions
Clone the repository
git clone https://github.com/Atobon28/TennisHub

2. Enter the project folder
cd TennisHub

3. Install dependencies
npm install

4. Run the development server
npm run dev

5. Open in browser

The project usually runs at:

http://localhost:5173

## Branching Model
This project follows the branching logic defined in the team code of conduct.

## Main Branch
- main
- Contains the stable and approved version of the project

## Development Branch
- dev
- Used to integrate current development before merging into main

## Feature Branches
Used for new functionalities.

Naming convention:
feature/type-short-description

Examples:
feature/ui-login-page
feature/api-player-data
feature/db-create-users-table

## Hotfix Branches
Used to fix urgent production errors.

Naming convention:
hotfix/fix-short-description

Example:
hotfix/fix-login-bug

## Commit Convention
This project follows the commit style defined in the code of conduct.

Format:
type(scope): description

## Types
- feat
- fix
- style

## Example commits
fix(ui): resolve button alignment issue
feat(ui): add dark mode toggle
style(api): improve request formatting

## Suggested scopes
- api
- ui
- db

## Workflow
Step 1
Create a new branch from main or dev depending on the agreed workflow.

Example:
feature/ui-login-page

Step 2
Develop and test the functionality inside that branch.

Step 3
When everything works correctly, merge the branch into the integration branch and later into main after approval.

Step 4
If a production issue appears, create a hotfix branch, solve the issue, and merge it back.