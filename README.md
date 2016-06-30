# Z-Widget - Tailor Booking

Javascript widget for booking a ztailor.
 
- [Setup](#setup)
- [Running Tests](#running-tests)
- [Training Materials](#training-materials)
- [Contributing](#contributing)

## Setup

1. Install Homebrew if you haven't already:

        ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"  

2. Install Node.js:

        brew install node

3. Clone the repository:

        git clone https://github.com/ztailor/z-widget-tailor-booking.git

4. Install the project dependencies:

        npm install

5. Setup local environment variables:

        cp .env.example .env

6. (optional) Add the following to your `/etc/hosts` file:

        127.0.0.1 local.z-widget-tb.com

7. Start up the local dev server:

        npm run start-local

8. Visit [http://local.z-widget-tb.com:9001](http://local.z-widget-tb.com:9001) or [http://localhost:9001](locahost:9001)


## Running Tests

Make sure you have completed steps 1-5 from the above __Setup__ section before attempting to run the tests.

##### ESLint

[ESLint](http://eslint.org/) breaks on warnings during `npm run build`, but only errors will fail the build during `npm run start-local`. You can run it manually here:

1. Install `eslint` globally:

        npm install -g eslint

2. Run eslint command:

        npm run lint

##### Unit tests

Unit tests can be ran with the command `npm test`.

##### Acceptance tests

1. Install `webdriver-manager` globally:

        npm install -g webdriver-manager

2. Update `webdriver-mananger`:

        webdriver-manager update

3. Ensure that you have a Java SDK installed

    * http://stackoverflow.com/questions/24342886/how-to-install-java-8-on-mac     
    * http://www.oracle.com/technetwork/java/javase/downloads/index.html

4. Start the selenium server with:

        webdriver-manager start

5. Run the app locally:

        npm run start-local

6. Run the acceptance tests:

        node_modules/.bin/nightwatch

After initial setup steps 1-3 can be omitted from this process.

## Contributing

 If you are ready to submit a pull request, before doing so, please run

```
npm run build
```

If this is successful, look inside `public/assets` for all the assets, namely `zwidget.min.js`, `style.css`, and associated fonts.

## Training Materials

### ES2015
[Babel](https://babeljs.io/docs/learn-es2015/)  
[React + ES6](https://babeljs.io/blog/2015/06/07/react-on-es6-plus)

### React

[Docs](http://facebook.github.io/react/docs/getting-started.html)  
[Egghead React Series](https://egghead.io/technologies/react)
