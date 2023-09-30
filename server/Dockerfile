FROM node:16
WORKDIR /app
COPY ../package.json ../package-lock.json ./
COPY server ./
RUN npm install --legacy-peer-deps
EXPOSE 3000
CMD ["npm", "run", "start", "--prefix", "server"]
