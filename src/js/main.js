/****
 _             _                          _   
| |_ _____   _| |_   __ _ _   _  ___  ___| |_ 
| __/ _ \ \/ / __|  / _` | | | |/ _ \/ __| __|
| ||  __/>  <| |_  | (_| | |_| |  __/\__ \ |_ 
 \__\___/_/\_\\__|  \__, |\__,_|\___||___/\__|
                       |_|

                       Unlock your imagination.
***/

const TextQuest = () => {
  let term;
  const indent = "--->";
  const divider = "<p>------------------</p>";
  const logo =
    '<pre class="logo">  *================================================================*<br>\
  ==================================================================<br>\
  ==================================================================<br>\
  ==================================================================<br>\
  ===  ==================  ====================================  ===<br>\
  ===  ==================  ====================================  ===<br>\
  ==    ===   ===  =  ==    ========    ==  =  ===   ====   ==    ==<br>\
  ===  ===  =  ==  =  ===  ========  =  ==  =  ==  =  ==  =  ==  ===<br>\
  ===  ===     ===   ====  ========  =  ==  =  ==     ===  ====  ===<br>\
  ===  ===  ======   ====  =========    ==  =  ==  =======  ===  ===<br>\
  ===  ===  =  ==  =  ===  ===========  ==  =  ==  =  ==  =  ==  ===<br>\
  ===   ===   ===  =  ===   ==========  ===    ===   ====   ====  ==<br>\
  ====================================  = ==========================<br>\
  =====================================  ===========================<br>\
  ==================================================================<br>\
  ========================================*"""""""""""""""""""""""*=<br>\
  =======================================* Unlock your imagination *<br>\
  *======================================*-------------------------*<br></pre>';
  const welcome = `<h1>Welcome to</h1>
  ${logo}
  ${divider}
  <p>(Type commands to complete your quest)</p>`;

  const start = () => {
    term.output(welcome);
    term.output(
      `<h1>Quest: ${game.game.name} (v${game.game.version} by ${game.game.author})</h1>`
    );
    term.output(divider);
    term.output(game.game.intro);
    track("search", "questWelcome");
  };

  /**
      Getters
  */
  const getBlockState = (blockId) => {
    const block = game.blocks[blockId];
    if (game.blocks[blockId].hasOwnProperty("bag-state")) {
      const bagState = game.blocks[blockId]["bag-state"];
      if (bagContainsItem(bagState)) {
        return bagState;
      }
    }
    return block.state;
  };

  const getBlock = (state, blockId) => {
    return game.blocks[blockId].states[state];
  };

  const getBlockIntro = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    return `<h1>${block.name}</h1>
            <p>${block.description}</p>`;
  };

  const getPowerList = () => {
    const playerPowers = game.player.powers;
    let powerList = "Powers:<br>";

    if (playerPowers) {
      playerPowers.forEach((power) => {
        powerList += `${indent} ${game.powers[power].description}<br>`;
      });
    } else {
      powerList += "You have no powers :( Try typing a command";
    }
    return `<p>${powerList}<p>`;
  };

  const getBlockName = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    return block.name;
  };

  const getBlockAction = (action) => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (!block.hasOwnProperty("actions")) {
      return false;
    }
    if (block.actions.hasOwnProperty(action)) {
      return block.actions[action];
    } else {
      return false;
    }
  };

  /**
      Helpers
   */

  const bagContainsItem = (item) => {
    if (Array.isArray(game.player.bag)) {
      if (game.player.bag.includes(item)) {
        return true;
      }
    }
    return false;
  };

  const getBagList = () => {
    let bagList = "Bag contents: ";
    if (Array.isArray(game.player.bag)) {
      if (game.player.bag.length > 0) {
        bagList += "<br>";
        game.player.bag.forEach((item) => {
          bagList += `${indent} ${item}: ${game.items[item].description}<br>`;
        });
      } else {
        bagList += "Your bag is empty";
      }
    } else {
      bagList += "Your bag is empty";
    }
    return `<p>${bagList}<p>`;
  };

  const getExitState = (exit) => {
    if (exit.state === "open") {
      return `${getBlockName(exit.block)}`;
    } else {
      return exit.states[exit.state].description;
    }
  };

  const getExists = () => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (!block.hasOwnProperty("exits")) {
      return "";
    }
    return `<p><b>Exits:</b><br>${getExitList(game.player.block)}</p>`;
  };

  const getExitList = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    let exitList = "";
    for (const exitId in block.exits) {
      exitList += `${indent} <b>${exitId}</b>: ${getExitState(
        block.exits[exitId]
      )}<br>`;
    }
    return exitList;
  };

  const existIsAvailable = (exitId) => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (block.exits.hasOwnProperty(exitId)) {
      if (block.exits[exitId].state === "open") {
        return true;
      }
    }
    return false;
  };

  /**
    Terminal commands
  */

  const bag = () => {
    isPowerKnown("bag");
    const bagContents = getBagList();
    term.output(bagContents);
  };

  const help = () => {
    isPowerKnown("help");
    const powers = getPowerList();
    term.output(powers);
    const bagContents = getBagList();
    term.output(bagContents);
  };

  const look = () => {
    term.clear();
    isPowerKnown("look");
    term.output(getBlockIntro(game.player.block));
    term.output(getExists(game.player.block));
  };

  const move = (direction) => {
    if (existIsAvailable(direction)) {
      term.clear();
      isPowerKnown(direction);

      const currentBlock = getBlock(
        getBlockState(game.player.block),
        game.player.block
      );
      game.player.block = currentBlock.exits[direction].block;
      term.output(getBlockIntro(game.player.block));
      term.output(getExists(game.player.block));

      const newBlock = getBlock(
        getBlockState(game.player.block),
        game.player.block
      );

      track("search", game.player.block);

      if (newBlock.hasOwnProperty("auto-actions")) {
        processActions(newBlock["auto-actions"]);
      }
    } else {
      isPowerKnown(direction);
      term.output(`There is no exit ${direction}.`);
    }
  };

  const powers = () => {
    isPowerKnown("powers");
    const powers = getPowerList();
    term.output(powers);
  };

  const take = (item) => {
    isPowerKnown("take");
    const blockAction = getBlockAction(`take ${item}`);
    if (blockAction !== false) {
      processActions(blockAction.actions);
      term.output(`<p>You take the ${item}.</p>`);
      track("search", `took-${item}`);
    } else {
      term.output(`<p>You can't take that.</p>`);
      track("search", `cantTake-${item}`);
    }
  };

  const use = (item) => {
    isPowerKnown("use");
    const blockAction = getBlockAction(`use ${item}`);

    if (!bagContainsItem(blockAction.bag)) {
      term.output(`<p>You don't have ${item}.</p>`);
      track("search", `useDontHave-${item}`);
    } else {
      if (blockAction !== false) {
        processActions(blockAction.actions);
        term.output(`<p>${blockAction.description}`);
        track("search", `use-${item}`);
      } else {
        term.output(`<p>You can't use that.</p>`);
        track("search", `cantUse-${item}`);
      }
    }
  };

  const processActions = (actions) => {
    for (let i = 0; i < actions.length; i++) {
      const funcName = Object.keys(actions[i])[0];
      const func = eval(funcName);
      func(actions[i][funcName]);
    }
  };

  /**
      Dynamic functions called from inside game.js
  */

  const completeQuest = () => {
    const commandDom = document.querySelector(".command");
    commandDom.style.display = "none";
    track("search", "questComplete");
  };

  const addItemToBag = (itemArray) => {
    if (!Array.isArray(game.player.bag)) {
      game.player.bag = [];
    }
    game.player.bag.push(itemArray[0]);
  };

  const removeItemFromBag = (item) => {
    const itemIndex = game.player.bag.indexOf(item);
    game.player.bag.splice(itemIndex);
  };

  const removeItemFromBlock = (item) => {
    const blockState = getBlockState(game.player.block);
    const itemIndex = game.blocks[game.player.block].states[
      blockState
    ].items.indexOf(item);
    game.blocks[game.player.block].states[blockState].items.splice(itemIndex);
  };

  const removeActionFromBlock = (action) => {
    const blockState = getBlockState(game.player.block);
    delete game.blocks[game.player.block].states[blockState].actions[action];
  };

  const updateBlockState = (state) => {
    game.blocks[game.player.block].state = state;
  };

  const updateExitState = (exitUpdateArray) => {
    const blockState = getBlockState(game.player.block);
    game.blocks[game.player.block].states[blockState].exits[
      exitUpdateArray[0]
    ].state = exitUpdateArray[1];
  };

  const removeBagState = () => {
    const blockState = getBlockState(game.player.block);
    delete game.blocks[game.player.block]["bag-state"];
  };

  const newPowerUnlocked = (power) => {
    term.output(`<h1 class="power-unlocked">New power unlocked: ${power}</h1>`);
    term.output(divider);
    track("search", `newPowerUnlocked--${power}`);
  };

  const isPowerKnown = (power) => {
    if (Array.isArray(game.player.powers)) {
      if (!game.player.powers.includes(power)) {
        newPowerUnlocked(power);
        game.player.powers.push(power);
      }
    } else {
      game.player.powers = [];
      newPowerUnlocked(power);
      game.player.powers.push(power);
    }
  };

  const setTerm = (instance) => {
    term = instance;
  };

  const track = (type, value) => {
    if (window.gtag) {
      if (type === "search") {
        window.gtag("event", "search", {
          search_term: value,
        });
      }
    }
  };

  return {
    // static
    logo: logo,
    divider: divider,
    // commands
    bag: bag,
    help: help,
    look: look,
    move: move,
    powers: powers,
    take: take,
    use: use,
    // getters and setters
    setTerm: setTerm,
    // init and utils
    start: start,
    track: track,
  };
};

const init = () => {
  // create instance of TextQuest
  const tq = TextQuest();

  const commands = {
    bag: () => {
      tq.bag();
    },
    clear: (terminal) => {
      terminal.clear();
    },
    help: () => {
      tq.help();
    },
    look: () => {
      tq.look();
    },
    powers: () => {
      tq.powers();
    },
    take: (inst, item) => {
      tq.take(item);
    },
    use: (inst, item) => {
      tq.use(item);
    },
    // Movement directions
    north: () => {
      tq.move("north");
    },
    east: () => {
      tq.move("east");
    },
    south: () => {
      tq.move("south");
    },
    west: () => {
      tq.move("west");
    },
  };

  const terminal = new VanillaTerminal({
    container: "terminal",
    welcome: null,
    prompt: "Traveller",
    separator: ": ",
  });
  terminal.commands = commands;

  terminal.DOM.command.addEventListener(
    "keydown",
    (e) => {
      // up arrow
      if (e.keyCode === 38) {
        tq.track("search", "up-arrow");
        // down arrow
      } else if (e.keyCode === 40) {
        tq.track("search", "down-arrow");
        // enter
      } else if (e.keyCode === 13) {
        let inputCommands;
        let firstCommand;
        let commandsString;
        if (terminal.DOM.input.value.includes(" ")) {
          inputCommands = terminal.DOM.input.value.split(" ");
          firstCommand = commands[0];
          commandsString = commands.join("-");
        } else {
          inputCommands = terminal.DOM.input.value;
          firstCommand = commandsString = inputCommands;
        }
        const prefix = !commands.hasOwnProperty(firstCommand)
          ? "commandUnknown"
          : "commandKnown";
        tq.track("search", `${prefix}--${commandsString}`);
        // hide the ribbon if people are using the app on mobile
        document.querySelector(".github-fork-ribbon").classList.add("mobile-hide");
      }
    },
    true
  );

  tq.setTerm(terminal);
  tq.start();

  // focus on terminal input for 'whole page' clicking event
  document.body.addEventListener(
    "click",
    () => {
      document.querySelector(".input").focus();
    },
    true
  );

  // show the 'fork me' banner if we're not on local host
  if (window.location.hostname !== "localhost") {
    document.querySelector(".github-fork-ribbon").classList.remove("hide");
  }
};

if (
  document.readyState === "complete" ||
  (document.readyState !== "loading" && !document.documentElement.doScroll)
) {
  init();
} else {
  document.addEventListener("DOMContentLoaded", init);
}
