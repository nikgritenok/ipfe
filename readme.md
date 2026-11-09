# IPFE: education portal

A study portal I built to learn a two-part app end to end: Vue on the front, Express on the back, a MongoDB document store in between.

## Stack

**Frontend:** Vue 3, TypeScript, Vite, Vue Router, Pinia, PrimeVue, PrimeFlex, PrimeIcons.

**Backend:** Node.js, Express, TypeScript, MongoDB with Mongoose, JWT for auth, Multer for uploads, Sharp for image processing.

## Layout

```
ipfe/
├── frontend/    Vue app
├── backend/     Express API
└── package.json workspaces root
```

## Run

Needs Node.js 16 or newer, Yarn and a running MongoDB.

```bash
yarn install          # installs frontend and backend

cd frontend && yarn dev
cd backend  && yarn dev
```

Build for production with `yarn build` in each part. Tests and lint run from `backend` (`yarn test`, `yarn lint`) and `frontend` (`yarn lint`).

Editors: VSCode with Volar, ESLint and Prettier.
