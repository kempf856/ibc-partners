#!/bin/bash

set -e

echo "🔧 Backend build..."
./gradlew :backend:bootJar

echo "🐳 Backend Docker build..."
cd backend
docker build -t ghcr.io/kempf856/ibcpartners-backend:latest .

echo "⬆️ Backend push..."
docker push ghcr.io/kempf856/ibcpartners-backend:latest

cd ..

echo "🎨 Frontend build..."
cd frontend

echo "🐳 Frontend Docker build..."
docker build -t ghcr.io/kempf856/ibcpartners-frontend:latest .

echo "⬆️ Frontend push..."
docker push ghcr.io/kempf856/ibcpartners-frontend:latest

cd ..

echo "🚀 Done!"
