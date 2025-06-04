FROM node:18.0-alpine
WORKDIR /app

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "prod"]