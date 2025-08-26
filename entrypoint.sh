#!/bin/sh
set -e

npm run prismaProd 

if [ "$POPULATE_DB" = "true" ]; then
echo "POPULATE_DB=true → Running database population..."
echo "test"
npm run populateDb -- --noconfirm
fi

echo "Running build (NODE_ENV=${NODE_ENV:-unset})..."
npm run build

cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

echo "Build finished. Starting server..."

if [ -f ./.next/standalone/server.js ]; then
  node ./.next/standalone/server.js
else
  npm run start
fi
