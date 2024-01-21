# PYCount Project
available at [https://duratm.com](https://duratm.com)
## how to build the frontend locally
1. clone the repo: `git clone https://github.com/duratm/woa-frontend.git`
2. run `npm install`
3. create a `.env.development` file in the root directory of the project and add the following variables:
    ```
    VITE_API_ENDPOINT=http://localhost:3333
    ```
4. run `npm run dev`
5. open `localhost:80` in your browser
## how to build the backend locally
1. clone the repo: `git clone https://github.com/duratm/woa-backend.git`
2. run `npm install`
3. run `npm run dev`
4. create a `.env` file in the root directory of the project and add the following variables:
    ```
    PORT=3333
    HOST=0.0.0.0
    NODE_ENV=development
    APP_KEY=app-key
    DRIVE_DISK=s3
    DB_CONNECTION=pg
    PG_HOST=0.0.0.0
    PG_PORT=5432
    PG_USER=potgres-user
    PG_PASSWORD=postgress-password
    PG_DB_NAME=postgress-db-name
    API_TOKEN_COOKIE_NAME=token
    S3_ENDPOINT=adress.to.minio
    S3_KEY=minio-key
    S3_SECRET=minio-secret
    S3_REGION=us-east-1
    S3_BUCKET=minio-bucket
    ```
5. make sure you have a postgresql database and a minio instance running and available from the information you provided in the `.env` file
## TAD (Technical Architecture Document)
### CI/CD
The CI/CD pipeline is implemented using Github Actions. The pipeline is triggered on every push to the `develop` branch depending on the content of the commit message. The pipeline consists of the following steps:
1. calculate the version number based on the commit message with gitVersion
2. build the frontend image with the calculated version number and push it to the docker registry (dockerhub)
3. update the manifest file of the frontend deployment with the new image tag
4. commit the updated manifest file and push it to the `master` branch watched by ArgoCD which will then deploy the new version of the frontend

The pipeline is similar in the backend repository.

### Frontend
The frontend is built using React and TailwindCSS and is served by a nginx server.
## Technologies Used

This project is built with an array of powerful coding languages and frameworks:

- **React (Version 18.2.0):** The main framework of our frontend. React is used for building user interfaces, particularly for single-page applications.

- **React-DOM (Version 18.2.0):** This serves as the entry point to the DOM and server renderers for React. It's instrumental for rendering components.

- **TypeScript (Version 5.2.2):** TypeScript is used to develop JavaScript applications for both client-side and server-side execution and provides strong typing which helps in production level quality code.

- **PostCSS (Version 8.4.31) & Autoprefixer (Version 10.4.16):** We use PostCSS, a tool for transforming styles with plugins, like autoprefixer which is used to parse CSS and add vendor prefixes to CSS rules.

- **ESLint (Version 8.53.0) & @typescript-eslint/eslint-plugin (Version 6.10.0):** As our primary linter tool, ESLint helps us maintain a consistent code style and avoid error-prone code.

- **Axios (Version 1.6.2):** Promise-based HTTP client for the browser and Node.js. It makes asynchronous HTTP requests to REST endpoints and performs CRUD operations.

- **ZXCVBN (Version 4.4.2):** ZXCVBN is a password strength estimator based on an arbitrary string.

- **Vite (Version 5.0.5) & @vitejs/plugin-react-swc (Version 3.5.0):** Vite (French word for "fast", pronounced /vit/) is a new breed of frontend build tool that significantly improves the frontend development experience.

- **Tailwind CSS (Version 3.3.5):** This is a utility-first CSS framework.

- **React Router (Version 6.0.2):** React Router is a collection of navigational components that compose declaratively with your application.

- **React Hook Form (Version 7.20.0):** React Hook Form is a performant, flexible and extensible forms with easy-to-use validation.

### Backend
The backend is built using Node.js and the Adonis.js framework. The database is a PostgreSQL database and the file storage is handled by a Minio instance.
## Technologies Used

- **Node.js & npm:** Runtime environment and package manager used to manage dependencies and run the project.
- **TypeScript:** Superset of JavaScript, providing static types and modern language features. Helps in writing more maintainable and robust codebase.
- **eslint & prettier:** Used for linting and formatting code. These help in maintaining code quality and consistency across the project.
- **AdonisJS:** Modern and fully featured web framework for Node.js. We employ various parts of the AdonisJS ecosystem like `@adonisjs/core` for main framework functionalities, `@adonisjs/auth` for authentication, `@adonisjs/drive-s3` for interacting with S3 compatible storage service, and `@adonisjs/lucid` for the Object Relational Mapper (ORM).
- **Luxon:** A powerful, modern and friendly wrapper for JavaScript dates and times.
- **@smithy/util-waiter & @smithy/core:** These AWS smithy packages are essential for waiting and core functionalities.
- **source-map-support:** This package improves stack trace by enabling source maps.
- **pg:** PostgreSQL is used as the database. The `pg` package is a non-blocking Node.js client for PostgreSQL.

## Authentication
Our project utilizes JWT (JSON Web Token) for authentication, which is facilitated by the `@adonisjs/auth` library. JWTs allow us to provide secure user sessions, where each token contains encoded user data and are typically used in conjunction with Bearer authentication scheme.

## Resource Storage
We use MinIO S3 for efficient and secure object storage. It is an open source, Amazon S3-compatible service, which allows us to store and retrieve any amount of data. The `@adonisjs/drive-s3` package helps us to streamline our interactions with the service.

This package provides a clean and simple API to interact with MinIO S3, enabling us to perform essential tasks like uploading files, managing file metadata, and handling access permissions with ease.

# What's next?
- [ ] Add tickets images on expenses
- [ ] Implement notifications

# Credits
For all the people who helped me and inspired me in this project:
- [Tristan Mihai](https://github.com/Courtcircuits)
- [Nathael Bonnal](https://github.com/NathaelB)
- [Dorian Grasset](https://github.com/dorian-grst)
