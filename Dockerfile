FROM cypress/base:18.16.0
RUN mkdir /app
WORKDIR /app

COPY . /app

RUN npm install --save-dev cypress

RUN npx cypress verify
RUN npm run cypress:e2e
