# Stage1: UI Build
FROM node:14-slim AS ui-build
WORKDIR /usr/src
COPY mern-frontend/ ./mern-frontend/
RUN cd mern-frontend && npm install && npm run build

# Stage2: API Build
FROM node:14-slim AS api-build
WORKDIR /usr/src
COPY mern-backend/ ./mern-backend/
RUN cd mern-backend && npm install &&  npm start
RUN ls

# Stage3: Packagign the app
FROM node:14-slim
WORKDIR /root/
COPY --from=ui-build /usr/src/mern-frontend/build ./mern-frontend/build
COPY --from=api-build /usr/src/api/dist .
RUN ls

EXPOSE 5001

CMD ["node", "api.bundle.js"]
