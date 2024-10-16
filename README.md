# Maharajamart

Maharajamart is a full stack e-commerce app that sells various indian groceries and delivers them all around poland.

It was made with nextjs, typescript, tailwind, shadcn, next-intl, mongodb, prisma, nginx, docker and more

It is designed to be deployed with docker-compose on a vps and as such, the deployment steps will be for that environment.

## Local development environment

### 1. Set up env variables
   There are two main env files for the dev environment: `.env` and `.env.development.local`

`.env` needs to have the following two variables to make the docker containers (more on that later) work:

```
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
```

The rest of the environment variables are availible in `.env.example` in this repository. They may be put either in `.env` or `.env.development.local`, since nextjs loads both directories. If multiple environments are going to be ran on the same machine, it is recommended to put the env variables shared acrossed the environments in `.env` and ones specific to the environment in `.env.development.local`. For example, here is a setup that I use to run the `development` and `testing` environment on my local machine:

```
# .env
MONGO_INITDB_ROOT_USERNAME=
MONGO_INITDB_ROOT_PASSWORD=
P24_CRC_KEY=
P24_MERCHANT_ID=
P24_API_KEY=
P24_API_DOMAIN=
```

```
# .env.development.local
API_URL=
PUBLIC_URL=
DATABASE_URL=
ADMIN_USER=
ADMIN_PASS=
```

### 2. Run database
   The mongodb is ran with docker-compose with a replica set. Firstly you need to generate a replica key for authentication:

```
openssl rand -base64 756 > replica.key
```

After that, you can run the database with

```
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Run ngrok
   Since przelewy24 sends requests to a status api route on our nextjs server, we need to expose that route to the public. On a local machine we can do that with ngrok:

```
npm run ngrok
```

It runs on a domain under my ngrok account specified in the package.json script. Feel free to change it.

### 4. Run nextjs
   Lastly, when the db and ngrok are running, you can run nextjs with:

```
npm run dev
```

## Testing environment

tbc

## Production environment

tbc
