FROM node:16

WORKDIR /home/node

RUN mkdir -p frontend/node_modules backend/node_modules

COPY ./backend/package*.json ./backend
RUN cd ./backend && npm install
 
COPY ./frontend/package*.json ./frontend
RUN cd ./frontend && npm install
 
COPY ./backend/ ./backend
COPY ./frontend/ ./frontend

RUN cd ./backend/ && npx prisma generate
RUN cd ./backend && npm run build

COPY ./script.sh .

RUN chmod +x script.sh

ENTRYPOINT ["./script.sh"]
