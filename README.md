# Swash App UI

This project is a [React project](https://reactjs.org/) containing the user-interface for the dashboard of [SwashApp project](https://gitlab.com/surf-streamr/firefox). Swash app is a browser extension for selling surfing data and earning money. for more information visit: https://swashapp.io

## Getting Started

In this directory, you can run following scripts to build and migrate the UI to the main Swash project:

### Install

First install dependencies if needed:

```
npm install
```

In some cases, you need to run the following command as well:

```
npm audit fix
```

### Start

You can start the app in development mode before migrate:


```
npm run start
```

Open http://localhost:3000 in the browser.

### Build and Migrate

Builds the app for production to the `build` folder.

```
npm run build
```

Then you can migrate code to the swash app project using this command:

```
npm run migrate
```

The default migration location is `../swash/dashboard`. You can change migration location by:

```
npm run migrate -- --dst=../firefox/dashboard2
``` 

## Authors

* **Ebrahim Khalilzadeh**  - [ebkhalilzadeh](https://github.com/ebkhalilzadeh)
* **Mehrdad Abdi**  - [mabdi](https://github.com/mabdi)
* **Masoud Sarabadani**  - [mabdi](https://github.com/mabdi)

## License

This project is licensed under the Attribution-NonCommercial-ShareAlike 3.0 Unported License - see the [LICENSE.md](https://github.com/swashapp/swashapp/master/LICENSE.md) file for details
