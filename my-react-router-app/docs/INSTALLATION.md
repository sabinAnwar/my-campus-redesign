# Installation Guide

## Voraussetzungen

- Node.js (64-bit, empfohlen: aktuelle LTS)
- npm

## Setup

```bash
npm install
npx prisma generate
npm run dev
```

## Hinweis bei Rollup-Fehlern (Windows)

Wenn `npm run dev` mit einem Rollup-Fehler abbricht, fuehre eine saubere Neuinstallation durch:

```bash
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npx prisma generate
npm run dev
```
