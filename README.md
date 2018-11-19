<p align="center">
  <img src="/src/static/logo.png" alt="Bonsai" height="150px"/>
  <br>
  <h1 align="center">Bonsai Book</h1>
</p>


## Introduction

I started Bonsai with the idea of providing an alternative to storybook focused on react and providing less functionnality but with a quicker way to start using it. If your looking for highly customisable book for sharing your component, i strongly advise you to look at storybook.

If you want a quick way to start a book of your react components, bonsai might be for you.

To provide that powerfull tool with the least amount of configuration needed as possible, bonsai is based on NextJs. It uses the power of Next to provide HMR/auto-reloading/... of your react components and a routing based on folder structure of your `stories`.

## Getting Started

First you need to add bonsai to your project:

`$ yarn add bonsai-book`

or

`$ npm install bonsai-book`

Once it's done, you can create a folder called `stories` at the root of your project. you can start adding your stories like this :

```javascript
// index.js
import React from 'react'

export default () => <span style={{ color: 'red' }}>Hello world of bonsai.</span>
```

To launch your bonsai book add this command to your script in `package.json` :

```json
// package.json
"scripts": {
  "bonsai": "bonsai-book"
}
```

By default, bonsai will look for `stories` at the root of your project, you can change that using configuration.

Once launched, go to [http://localhost:3000](http://localhost:3000) and start using bonsai !

# Configuration

By default you don't need to provide any configuration, but if you need to modify some behavior, like the directory for stories or adding some configuration to next or webpack, you can add a file `bonsai.config.js` that return an object, this is the default config used by bonsai :

```js
const config = {
  stories_dir: './stories',
  output_dir: './output',
  next: {},
  include: [process.cwd()],
  webpack: (webpackConfig, opts) => {},
}
```

To know more about next options and webpack options, you can go to the nextJs config : [NextJs Website](https://nextjs.org/docs/#custom-configuration)


Right now the output dir is not used, i hope to add the possibility to export statically the book to upload it later for example.

# Issues right now

I'm working on this project for now and the major issue if with reloading the stories after an error in one of your stories.
Webpack doesn't reaload after an error in your stories and you need to restart your server.

I'm still working on this and currently have an issue on the plugins, you can follow here if you want to help or just know where thing are heading : [#copy-webpack-plugin/#307](https://github.com/webpack-contrib/copy-webpack-plugin/issues/307)

# Plan

Obvisouly there is still a lot to be done on this project and i will keep working on it as long as i'm interested, obviously if people start using it, i will keep updating and fixing bugs.
