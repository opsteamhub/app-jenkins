FROM node:lts-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY server.js /home/node/app

USER node


#RUN npm install elastic-apm-node --save

RUN npm install @opentelemetry/sdk-node \
  @opentelemetry/auto-instrumentations-node \
  @opentelemetry/api \
  @opentelemetry/resources \
  @opentelemetry/semantic-conventions \
  @opentelemetry/sdk-trace-node \
  @opentelemetry/instrumentation  

RUN npm install express  
RUN npm i dotenv

COPY --chown=node:node . .


EXPOSE 3000
CMD ["node", "server.js"]