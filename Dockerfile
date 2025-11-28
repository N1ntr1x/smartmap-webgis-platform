FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate

COPY . .

EXPOSE 3000 5555

# Mantieni il container vivo per eseguire comandi manualmente
CMD ["tail", "-f", "/dev/null"]
