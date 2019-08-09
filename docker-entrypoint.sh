envsubst < src/environments/environment.${ENV}.ts > src/environments/environment.ts

npm install

echo "Start Webapp";

npm start