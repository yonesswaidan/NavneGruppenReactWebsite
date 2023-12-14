FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install


COPY backend/ backend/

EXPOSE 3000


WORKDIR /usr/src/app/backend
CMD ["node", "server.cjs"]
