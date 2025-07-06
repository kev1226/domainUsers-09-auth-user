# Etapa 1: Build
FROM node:20-alpine AS builder

WORKDIR /app
COPY . .

RUN npm install -g pnpm && pnpm install && pnpm build

# Etapa 2: Imagen final
FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml ./

RUN npm install -g pnpm && pnpm install --prod

EXPOSE 3009

CMD ["node", "dist/main"]
