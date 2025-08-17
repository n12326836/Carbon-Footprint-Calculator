## Carbon Footprint Calculator

A small full-stack app to record and manage personal/organizational carbon emissions.  
Frontend: **React**. Backend: **Node.js + Express**. Database: **MongoDB Atlas**. 
Swith to card/table 
Auth uses **JWT**; authenticated users can **Create / Read / Update / Delete** emission records.

## Live Demo

- **Public URL:**: 'http://13.236.187.98', // you need to input http:// before the number
- **Test account** register-login
  ** Jira
  https://connect-team-yq6543h2.atlassian.net/jira/software/projects/SECTION/list?atlOrigin=eyJpIjoiZmJkZTkwODQ1NDdmNDFjZTgwMDViOGJjYmU5NTBjZTgiLCJwIjoiaiJ9

  GitGub
  https://github.com/n12326836/Carbon-Footprint-Calculator




## Project setup instructions
   You can run locally for development, or just use the public URL above for grading
  
  ** Prerequisites
    Node.js 18+ (we deploy with Node 22 via nvm)
    Yarn or npm
    A MongoDB Atlas connection string (free tier is fine)

  ** Clone
    git clone <your-repo-url>  # (This repo)
    cd Carbon-Footprint-Calculator

  **3 Backend .env

    Create backend/.env:

    MONGO_URI=<your MongoDB Atlas connection string>
    JWT_SECRET=<any long random string>
    PORT=5001

  **Install deps
    # Backend
    cd backend
    yarn install    # or: npm install

    # Frontend
    cd ../frontend
    yarn install    # or: npm install



  ** Run locally (two terminals)
    # Terminal A: backend
    cd backend
    yarn start      # or: npm start  -> http://localhost:5001

    # Terminal B: frontend
    cd frontend
    yarn start      # or: npm start  -> http://localhost:3000

  ## How it’s deployed (FYI)

    AWS EC2 instance

    PM2 runs the backend on port 5001

    Nginx serves the React build and reverse-proxies

    MongoDB Atlas (EC2 egress IP is whitelisted)


## Features

- **Auth (JWT):** Register / Login, protect CRUD routes, attach `Authorization: Bearer <token>`.
- **Emission CRUD:** Add, list, edit, delete records (type, amount, unit, factor, note).  
  Carbon value is computed on the server.
- **Profile:** Basic user profile view/update.


## Tech Stack

- **Frontend:** React (Hooks, Context), React Router, Axios  
- **Backend:** Node.js, Express, Mongoose  
- **DB:** MongoDB Atlas (cloud)  
- **Deploy:** AWS EC2, Nginx (static frontend + reverse proxy `/api`), PM2 for backend, GitHub Actions (CI/CD)
