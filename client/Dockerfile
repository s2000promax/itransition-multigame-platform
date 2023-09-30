FROM node:16 AS build
WORKDIR /app
COPY ../package.json ../package-lock.json ./
COPY client ./
RUN npm install --legacy-peer-deps
RUN npm run build --prefix client -- --prod

FROM nginx:alpine
COPY --from=build /app/client/dist/client /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
