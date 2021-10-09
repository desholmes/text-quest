# Text Quest: Unlock your imagination

Visit the [textquest.io website](https://textquest.io) or play one of the games:

- [Halloween (v1.0)](https://halloween.textquest.io)
- [The Sleepy Traveller (v1.2)](https://traveller.textquest.io)

```javascript
 _             _                          _
| |_ _____   _| |_   __ _ _   _  ___  ___| |_
| __/ _ \ \/ / __|  / _` | | | |/ _ \/ __| __|
| ||  __/>  <| |_  | (_| | |_| |  __/\__ \ |_
 \__\___/_/\_\\__|  \__, |\__,_|\___||___/\__|
                       |_|

                       Unlock your imagination.
```

## Overview

Text Quest is a game engine for running text-based adventure games, using a low/no code approach to game design.

A hosted version of the demo game `The Sleepy Traveller (v1.1)` can be found at: [textquest.io](https://textquest.io/).

## Motivation

The project was started to...

- Inspire creative story writing (without images, CGI or video)
- Create a low/no code solution for building games (using [YAML](https://en.wikipedia.org/wiki/YAML))
- Bootstrap something as quickly as possible to test the above (and not get bogged down with tooling, libraries and frameworks)
- Provide a little escapism during these unusual times

## Game Design

Games are defined using [YAML](https://en.wikipedia.org/wiki/YAML). A sample game can be seen in [./game.yml](./game.yml)).

Here's an overview of the core concepts within a games:

- **Blocks**: A block represents a single location within the game. A block can have:
  - `exits`: Connections to other blocks
  - `states`: Variations for a `block` state (containing `exits`, `actions`, `items`)
  - `items`: Items which are 'visible' from within a `block` state
  - `actions`: Actions which can be performed by the `player` within a block state, and actions which can be triggered automatically based on what a `player` is carrying
- **Game**: The name, version and author for the game
- **Player**: The name, current `block` location, `powers` and `items` they are carrying
- **Powers**: Descriptions for `powers` a `player` can unlock (not listed here, as they are part of the game)
- **Items**: Descriptions for items which the player can carry, or can be found in a `block`

## Technical Details

This project currently uses:

1. [JavaScript](https://en.wikipedia.org/wiki/JavaScript) as the core programming language for the game engine
1. [Parcel](https://parceljs.org/getting_started.html) web application bundler
1. [text-terminal](https://github.com/desholmes/text-terminal) for the terminal interface
1. [YAML](https://en.wikipedia.org/wiki/YAML) to store the game configuration
1. [js-yaml](https://nodeca.github.io/js-yaml/) for YAML > JSON conversion
1. [ascii generator](http://www.network-science.de/ascii/) for the logo
1. [github-fork-ribbon-css](https://simonwhitaker.github.io/github-fork-ribbon-css/)

## Development: Getting Started

1. Run `npm i`: To install the dependencies
1. Run `npm start` and open [localhost:1234](http://localhost:3000) in a browser to view the live reload development server
1. Changes in the `./src` directories will cause a live reload and compiled files to `./dist`
1. Press `CTRL+c` to stop the development server

## TODO

1. Introduce `characters` as a concept (and associated `powers`)
1. Cross over with voice activation project
1. Upload/point to yaml URL
   1. Auto conversion yaml > JSON
   1. Game yaml validator
1. Create a supporting website with docs and links to games
1. Online game editor (visual, or text based)
