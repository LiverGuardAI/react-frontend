# react-frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app
COPY liverguard/package*.json ./
RUN npm install
COPY liverguard/ ./
RUN npm run build

FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html