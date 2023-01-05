[Live version](https://projeto-final-mas.web.app/)

# Install dependencies

Before being able to use the project it's dependencies must be installed,
this can be done by running:

```bash
npm install
```

# Starting the app for development

To start the app in development mode run:

```bash
npm start
```

This will start the app at [http://localhost:3000](http://localhost:3000)
and automatically open it in your browser.

The page will reload when you make changes. You may also see any lint errors in
the console.

# Starting the app in test mode

To start the app in test mode run:

```bash
npm test
```

This will start the app at [http://localhost:3000](http://localhost:3000)
with a temporary services and some test data so that tests can be reproduced
between runs.

# Build the application for deployment

To build the application for deployment, run:

```bash
npm run build
```

This will build the app for production in the `build` folder.

# Firebase emulators

In order to not exhaust the quota provided by firebase the development build by
**default** uses the firebase emulators, in order to run these `firebase-tools`
needs to be installed:

```sh
npm install -g firebase-tools
```

Then to start the emulators run in the project root

```sh
firebase emulators:start --import=./.emulator-data --export-on-exit
```

This will start all the necessary emulators and store the data in
`.emulator-data` directory, this way data is kept between runs.
