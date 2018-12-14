# notes on phaser

# Gotchyas

-   By default, if a Scene at the top of the scene list receives and handles a valid input request, then all of the Scenes below that one will just skip their input processing in order to save time. You can change this behavior by calling this.input.setGlobalTopOnly(false) from any Scene. Every Scene will then process input, regardless of its position in the scene list.
-   if the above comment includes event emitters, then it makes sense that all other emitters stop

#notes on tweens

-   must have correct context (scene)
-   helpful to pass scene with events emitters
-   check if tween already exist and use if they do
-   stop all tweens and timed events when game objects are destroyed

# to be removed

-   preloader
-   game scales

# Phaser 3 template (ES5)

Very basic template project for game development with Phaser 3.

## Feature

-   dev server with live-reload
-   build
-   webpack
-   `SHOW_ALL` and `RESIZE` scale mode
-   simple preloader scene

## How to run

### Using yarn

-   Prepare: `yarn install`
-   Development: `yarn start`
-   Build: `yarn build`

### Using NPM

-   Prepare: `npm install`
-   Development: `npm run start`
-   Build: `npm run build`

## Folders

-   assets: raw assets, you can put images and texture packer files here, export atlas to `media` folder
    -   tex: textures should be placed here, which will be included
        in the `tex.tps` atlas
-   media: image, atlas, sound and whatever you need to ship with the final game
-   src: source code locates here, `main.js` is the entry
