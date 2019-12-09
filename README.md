# Swash App UI

This project is a [React project](https://reactjs.org/) containing the user-interface for the dashboard of [SwashApp project](https://github.com/swashapp/swash). Swash app is a browser extension for selling surfing data and earning money. for more information visit: https://swashapp.io

## Getting Started

In this directory, you can run following scripts to build and migrate the UI to the main Swash project:

### Install

First clone the code

```
git clone https://github.com/swashapp/swash-ui
cd swash-ui
```

Then install dependencies if needed:

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
npm run migrate -- --dst=../swash/dashboard2
``` 

## Authors

* **Ebrahim Khalilzadeh**  - [ebkhalilzadeh](https://github.com/ebkhalilzadeh)
* **Mehrdad Abdi**  - [mabdi](https://github.com/mabdi)
* **Masoud Sarabadani**  - [sarab2009](https://github.com/sarab2009)

## License

This project is licensed under the Attribution-NonCommercial-ShareAlike 4.0 International License - see the [LICENSE.md](LICENSE.md) file for details
