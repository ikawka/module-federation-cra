# module-federation-cra

## Credits

A clone of [craco-module-federation](https://github.com/hasanayan/craco-module-federation).

## Note

Add module-federation support for your CRA project without ejecting and losing update support of react-scripts. Requires latest version of CRA with Webpack 5

## Install

```
npm install https://github.com/ikawka/module-federation-cra.git --save-dev
```

## Usage

1. Add the plugin into your craco.config.js;

```
const cracoModuleFederation = require('module-federation-cra');

module.exports = {
    plugins: [{
        plugin: cracoModuleFederation,
        options: { useNamedChunkIds:true } //THIS LINE IS OPTIONAL
      },
    ]
}
```

2. create a file named `modulefederation.config.js` in the project root. You should export ModuleFederationPlugin constructor options as json from this module. For example;

```
const deps = require("./package.json").dependencies;

module.exports = {
  name: "app1",
  exposes: {
    "./Button": "./src/Button",
  },
  remotes: {
    app2: "app2@http://localhost:3002/remoteEntry.js",
  },
  filename: "remoteEntry.js",
  shared: {
    ...deps,
    react: {
      singleton: true,
      requiredVersion: deps["react"],
    },
    "react-dom": {
      singleton: true,
      requiredVersion: deps["react-dom"],
    },
  },
};

```

3. Update the scripts section of your package.json as follows:

```diff
  ...
  "scripts": {
-    "start": "react-scripts start",
-    "build": "react-scripts build",
+    "start": "craco start",
+    "build": "craco build",
    ...
```

## Testing the plugin locally

There are two sample apps in this repository inside sample folder (app1 and app2). Install their dependencies on them using yarn (`yarn install`) and hit `yarn start` on both of them. When you navigate to app1 it should render the exported button from app2 that says `hello from app2`

## License

Licensed under the MIT License. See [LICENSE.md](LICENSE) for more information.
