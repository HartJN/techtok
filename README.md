# TechTok

TechTok is a social media application that allows users to post and comment on tech-related content. Built using Typescript, Next.js, Sanity.io, React, Zustand, and SCSS.

## Demo Link

A live demo of the project can be found at https://techtok.vercel.app/. Check it out to see the website in action!

## Running the Project

To run the project on your local machine, make sure you have Node.js installed. Then, follow these steps:

1. Clone the repository to your local machine

    ```
    git clone https://github.com/HartJN/techtok.git
    ```

2. Navigate to the project directory in your terminal/command prompt

    ```
    cd TechTok
    ```

3. Install the dependencies by running npm install

    ```
    npm install
    ```

4. Start the development server using npm run dev

    ```
    npm run dev
    ```

This will start a local development server that you can access at http://localhost:3000.

5. To run the Sanity.io backend, cd into `sanitybackend` and run `sanity start`. This will start a local server that serves the backend data, which the frontend application uses.

    ```
    cd sanitybackend
    sanity start
    ```

This will start the Sanity.io backend server that you can access at http://localhost:3333.

## Building and Starting the Project

To build the project for production, run npm run build. This will compile the TypeScript code and generate a set of static files that can be deployed to a server.

```
npm run build
```

To start the built project, run npm run start. This will start a local server that serves the built files, allowing you to see how the project will look when deployed.

```
npm run start
```
