# react-frontend/Dockerfile
FROM node:18-alpine as build

WORKDIR /app/liverguard

# 컨텍스트 루트 기준으로 복사하되 절대경로화
COPY ./liverguard/package*.json ./
RUN npm install

COPY ./liverguard/ ./
RUN npm run build

# ----------- nginx stage -------------
FROM nginx:stable-alpine
COPY --from=build /app/liverguard/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]