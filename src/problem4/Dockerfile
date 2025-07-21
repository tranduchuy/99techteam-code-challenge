# ---- Base Node ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS deps
RUN npm install --production=false

# ---- Build ----
FROM deps AS build
COPY . .
RUN npm run build || echo "No build step defined"

# ---- Production ----
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=build /app .
ENV NODE_ENV=production
CMD ["node", "dist/index.js"]

# ---- Development ----
FROM build AS dev
ENV NODE_ENV=development
CMD ["npm", "run", "dev"] 