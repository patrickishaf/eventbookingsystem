#! /bin/bash
echo "Installing dependencies..."

cd booking
npm i
cd ../event
npm i
cd ../gateway
npm i
cd ../waitinglist
npm i
cd ..

echo "Installed dependencies successfully"