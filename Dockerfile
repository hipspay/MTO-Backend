from node:17

# workdir

WORKDIR /usr/src/app

COPY package*.json ./
   
RUN yarn

COPY . .

EXPOSE 8080

CMD ["npm", "run","start"]