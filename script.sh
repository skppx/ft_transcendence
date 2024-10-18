#!/usr/bin/env bash

cd ./backend/

npx prisma generate
npx prisma migrate dev

npm run build

exec npm run start
