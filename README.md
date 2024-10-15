# Text Quest: Unlock your imagination

Visit the [Text Quest website](https://textquest.io), [Studio23 Games](https://games.studio23.london/) or play one of the games:

* [Halloween (v1.0)](https://halloween.textquest.io)
* [The Sleepy Traveller (v1.2)](https://traveller.textquest.io)

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

## Motivation

The project was started to...

* Inspire creative story writing (without images, CGI or video)
* Create a low/no code solution for building games (using [YAML](https://en.wikipedia.org/wiki/YAML))
* Bootstrap something as quickly as possible to test the above (and not get bogged down with tooling, libraries and frameworks)
* Provide a little escapism during these unusual times

## Game Design

Games are defined using [YAML](https://en.wikipedia.org/wiki/YAML). A sample game can be seen in [./game.yml](./game.yml)).

Here's an overview of the core concepts within a games:

* **Blocks**: A block represents a single location within the game. A block can have:
  * `exits`: Connections to other blocks
  * `states`: Variations for a `block` state (containing `exits`, `actions`, `items`)
  * `items`: Items which are 'visible' from within a `block` state
  * `actions`: Actions which can be performed by the `player` within a block state, and actions which can be triggered automatically based on what a `player` is carrying
* **Game**: The name, version and author for the game
* **Player**: The name, current `block` location, `powers` and `items` they are carrying
* **Powers**: Descriptions for `powers` a `player` can unlock (not listed here, as they are part of the game)
* **Items**: Descriptions for items which the player can carry, or can be found in a `block`

## Technical Details

This project currently uses:

1. [JavaScript](https://en.wikipedia.org/wiki/JavaScript) as the core programming language for the game engine
2. [Node.js v20 LTS](https://nodejs.org/en/about/releases/)
3. [Parcel](https://parceljs.org/getting_started.html) web application bundler
4. [text-terminal](https://github.com/desholmes/text-terminal) for the terminal interface
5. [YAML](https://en.wikipedia.org/wiki/YAML) to store
6. [ascii generator](http://www.network-science.de/ascii/) for the logo
7. [github-fork-ribbon-css](https://simonwhitaker.github.io/github-fork-ribbon-css/)

## Development: Getting Started

1. `npm i`: To install the dependencies
2. `npm start --game=sleepy` and open [localhost:1234](http://localhost:3000) in a browser to view the live reload development server
3. Changes in the `./src` directories will cause a live reload and compiled files to `./dist-$game`
4. Press `CTRL+c` to stop the development server
5. `npm run build --game=sleepy`: Builds to `./dist-$game`
6. `npm run build:serve --game=sleepy`: Server builds from `./dist-$game`

## TODO

1. Introduce `characters` as a concept (and associated `powers`)
2. Cross over with voice activation project
3. Upload/point to yaml URL
   1. Auto conversion yaml > JSON
   1. Game yaml validator
4. Online game editor (visual, or text based)

***

## Credits

* [Studio23 Games](https://games.studio23.london/)
  * [Explore Studio23 Games](https://games.studio23.london/games/)
* [Des Holmes: Technical Leadership & Product Development](https://dholmes.co.uk)
  * [Blog](https://dholmes.co.uk)
  * [Text Quest: A Low/No Code Approach to Game Design](https://dholmes.co.uk/blog/text-quest-javascript-game-engine/)
  * **Skills & knowledge**: [Technical Leadership](/tags/technical-leadership), [Technical Direction](/tags/technical-direction), [Technical Delivery](/tags/technical-delivery), [Product Development](/tags/product-development), [SaaS](/tags/saas), [DevOps](/tags/devops), [Azure Public Cloud](/skills)
  * **Job Titles**: [CTO](/tags/cto), [VP Engineering](/tags/vp-engineering), [Head of DevOps](/tags/devops), [Technical Product Owner](/tags/technical-product-owner)
  * **Example Projects**: [Development standards](/tags/code-quality), [DevOps](/tags/devops), [CI/CD](/tags/ci-cd), [React](/tags/react), [docker](/tags/docker), [Cost Management](/tags/costs)
