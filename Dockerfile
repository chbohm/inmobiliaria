FROM node:18-alpine


# dependencies for various npm packages (which ones? - annotate here)
RUN apk add python3 make gcc libc-dev g++


# create working area
RUN mkdir /app
WORKDIR /app
RUN mkdir ./tmp
RUN mkdir ./var




# deps
ADD .npmrc ./.npmrc
COPY package*.json ./
RUN npm install --verbose

# primary lib ...
COPY ./src ./src

ADD tsconfig.json ./tsconfig.json
ADD git-commit.json ./git-commit.json

# Build TypeScript files first
RUN npm run build



#RUN npm run build
# ... and entry point
CMD ["npx", "ts-node", "./src/app/main.ts"]


