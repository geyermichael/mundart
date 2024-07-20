# mundart

A simple framework agnostic translation tool for developers base on Nuxt.

## Installation

```bash
  npm install --save-dev mundart
```

## Usage

Add mundart to your `package.json` as a script you can run.

```javascript
scripts: {
    "mundart": "node ./node_modules/mundart/server/index.mjs"
}
```

The default port the application is running is `3000`.

The default location for `locales` is `src/locales`.

If you need to change these default values see how you can set enviroment variables.

## Environment Variables

To run `mundart` in your application, you probably will need to add the following environment variables to your script.

`NUXT_LOCALE_DIR_PATH`

Set this to the correct path to your locale files.

```javascript
scripts: {
    "mundart": "NUXT_LOCALE_DIR_PATH=foo/bar node ./node_modules/mundart/server/index.mjs"
}
```

If you app running on port `3000` you should change it for `mundart` using any free port on your machine.

```javascript
scripts: {
    "mundart": "PORT=8123 node ./node_modules/mundart/server/index.mjs"
}
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
