FROM node:20-slim
WORKDIR /app
COPY artifacts/api-server/dist/ ./
ENV NODE_ENV=production
CMD ["node", "--enable-source-maps", "index.mjs"]
