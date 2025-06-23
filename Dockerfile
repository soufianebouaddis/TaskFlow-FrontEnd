# Stage 1: Build the React app
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with nginx, as non-root user
FROM nginx:alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

# Create non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Fix permissions for nginx directories
RUN mkdir -p /var/cache/nginx /var/log/nginx /run && \
    chown -R appuser:appgroup /var/cache/nginx /var/log/nginx /run

USER appuser

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 