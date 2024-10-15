import TextTerminal from "text-terminal/src/modules/textTerminal";
import "text-terminal/dist/text-terminal.css";

import game from "./halloween.yaml";

/** **
 _             _                          _   
| |_ _____   _| |_   __ _ _   _  ___  ___| |_ 
| __/ _ \ \/ / __|  / _` | | | |/ _ \/ __| __|
| ||  __/>  <| |_  | (_| | |_| |  __/\__ \ |_ 
 \__\___/_/\_\\__|  \__, |\__,_|\___||___/\__|
                       |_|

                       Unlock your imagination.
** */

const TextQuest = () => {
  let term;
  const indent = "--->";
  const divider = "<p>------------------</p>";
  const logo =
    '<pre class="logo">*=============================================================*<br>' +
    "===============================================================<br>" +
    "===============================================================<br>" +
    "===============================================================<br>" +
    "===  ==================  =================================  ===<br>" +
    "===  ==================  =================================  ===<br>" +
    "==    ===   ===  =  ==    =====    ==  =  ===   ====   ==    ==<br>" +
    "===  ===  =  ==  =  ===  =====  =  ==  =  ==  =  ==  =  ==  ===<br>" +
    "===  ===     ===   ====  =====  =  ==  =  ==     ===  ====  ===<br>" +
    "===  ===  ======   ====  ======    ==  =  ==  =======  ===  ===<br>" +
    "===  ===  =  ==  =  ===  ========  ==  =  ==  =  ==  =  ==  ===<br>" +
    "====  ===   ===  =  ====  =======  ===     ==   ====   ====  ==<br>" +
    "=================================  = ==========================<br>" +
    "==================================  ===========================<br>" +
    "===============================================================<br>" +
    "====================================*                         *<br>" +
    "====================================* Unlock your imagination *<br>" +
    "*===================================*                         *<br></pre>";
  const welcome = `<h1>Welcome to...</h1>
  ${logo}
  ${divider}
  <p>Type commands to complete your quest (type: <strong class="power-unlocked">help</strong> for hints).</p>`;
  const stats = {
    startTime: 0,
    endTime: 0,
    commandsEntered: 0,
  };
  let tracker = false;

  const bagContainsItem = (item) => {
    if (Array.isArray(game.player.bag)) {
      if (game.player.bag.includes(item)) {
        return true;
      }
    }
    return false;
  };

  const setTerm = (instance) => {
    term = instance;
  };

  const track = (category, action, name, value) => {
    if (!tracker) {
      if (window.Piwik) {
        tracker = window.Piwik.getAsyncTracker();
        tracker.trackEvent(category, action, name, value);
      }
    } else {
      tracker.trackEvent(category, action, name, value);
    }
  };

  const bumpCommandsEntered = () => {
    stats.commandsEntered += 1;
  };

  const getBlock = (state, blockId) => game.blocks[blockId].states[state];

  const getBlockState = (blockId) => {
    const block = game.blocks[blockId];
    if (
      Object.prototype.hasOwnProperty.call(game.blocks[blockId], "bag-state")
    ) {
      const bagState = game.blocks[blockId]["bag-state"];
      if (bagContainsItem(bagState)) {
        return bagState;
      }
    }
    return block.state;
  };

  const getBlockIntro = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    return `<h1>${block.name}</h1>
            <p>${block.description}</p>`;
  };

  const getBlockName = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    return block.name;
  };

  const toMinsAndSecs = (mills) => {
    const minutes = Math.floor(mills / 60000);
    const seconds = ((mills % 60000) / 1000).toFixed(0);
    return seconds === 60
      ? `${minutes + 1}m 00s`
      : `${minutes}m ${seconds < 10 ? "0" : ""}${seconds}s`;
  };

  const getStats = () => {
    const endTime = new Date().getTime();
    const timeTaken = toMinsAndSecs(endTime - stats.startTime);

    const playerPowersCount =
      game.player.powers && Array.isArray(game.player.powers)
        ? game.player.powers.length
        : 0;

    term.output(`${divider}
                      <h1>Game Stats</h1>
                      ${indent} Time taken: ${timeTaken}<br>
                      ${indent} Commands entered: ${stats.commandsEntered}<br>
                      ${indent} Powers unlocked: ${playerPowersCount}/${
                        Object.keys(game.powers).length
                      }<br>
                      ${indent} Blocks visited: ${
                        [...new Set(game.player.blockHistory)].length
                      }/${Object.keys(game.blocks).length}`);
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
        bagList += 'Your <strong class="power-unlocked">bag</strong> is empty';
      }
    } else {
      bagList += 'Your <strong class="power-unlocked">bag</strong> is empty';
    }
    return `<p>${bagList}<p>`;
  };

  const getExitState = (exit) => {
    if (exit.state === "open") {
      return `${getBlockName(exit.block)}`;
    }
    return exit.states[exit.state].description;
  };

  const getExitList = (blockId) => {
    const block = getBlock(getBlockState(blockId), blockId);
    let exitList = "";
    Object.keys(block.exits).forEach((exitId) => {
      exitList += `${indent} <b>${exitId}</b>: ${getExitState(
        block.exits[exitId],
      )}<br>`;
    });
    return exitList;
  };

  const getExists = () => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (!Object.prototype.hasOwnProperty.call(block, "exits")) {
      return "";
    }
    return `<p><b>Exits:</b><br>${getExitList(game.player.block)}</p>`;
  };

  const existIsAvailable = (exitId) => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (Object.prototype.hasOwnProperty.call(block.exits, exitId)) {
      if (block.exits[exitId].state === "open") {
        return true;
      }
    }
    return false;
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

  const getBlockAction = (action) => {
    const block = getBlock(getBlockState(game.player.block), game.player.block);
    if (!Object.prototype.hasOwnProperty.call(block, "actions")) {
      return false;
    }
    if (Object.prototype.hasOwnProperty.call(block.actions, action)) {
      return block.actions[action];
    }
    return false;
  };

  /**
    Terminal commands
  */
  const processActions = (actions) => {
    for (let i = 0; i < actions.length; i += 1) {
      const funcName = Object.keys(actions[i])[0];

      const func = eval(funcName);
      func(actions[i][funcName]);
    }
  };

  const newPowerUnlocked = (power) => {
    term.output(`<h1 class="power-unlocked">New power unlocked: ${power}</h1>`);
    term.output(divider);
    track("power", "unlocked", power);
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
        game.player.block,
      );
      game.player.block = currentBlock.exits[direction].block;
      term.output(getBlockIntro(game.player.block));
      term.output(getExists(game.player.block));

      const newBlock = getBlock(
        getBlockState(game.player.block),
        game.player.block,
      );

      game.player.blockHistory.push(game.player.block);

      track("block", "move", game.player.block);
      if (Object.prototype.hasOwnProperty.call(newBlock, "auto-actions")) {
        processActions(newBlock["auto-actions"]);
      }
    } else {
      isPowerKnown(direction);
      term.output(`There is no exit ${direction}.`);
    }
  };

  const powers = () => {
    isPowerKnown("powers");
    const powerList = getPowerList();
    term.output(powerList);
  };

  const take = (item) => {
    isPowerKnown("take");
    const blockAction = getBlockAction(`take ${item}`);
    if (blockAction !== false) {
      processActions(blockAction.actions);
      term.output(`<p>You take the ${item}.</p>`);
      track("take", "success", item);
    } else {
      term.output(`<p>You can't take that.</p>`);
      track("take", "fail", item);
    }
  };

  const use = (item) => {
    isPowerKnown("use");
    const blockAction = getBlockAction(`use ${item}`);

    if (!bagContainsItem(blockAction.bag)) {
      term.output(`<p>You don't have ${item}.</p>`);
      track("use", "dont-have", item);
    } else if (blockAction !== false) {
      processActions(blockAction.actions);
      term.output(`<p>${blockAction.description}`);
      track("use", "have", item);
    } else {
      term.output(`<p>You can't use that.</p>`);
      track("use", "cant-use", item);
    }
  };

  /**
      Dynamic functions called from inside game*.yaml
  */

  const completeQuest = () => {
    getStats();
    term.output(
      `<p>Play more games at: <a href="https://textquest.io">textquest.io</a>.</p>`,
    );
    const commandDom = document.querySelector(".command");
    commandDom.style.display = "none";
    track("quest", "complete");
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
    const itemIndex =
      game.blocks[game.player.block].states[blockState].items.indexOf(item);
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
    const updateValue = exitUpdateArray[1];
    game.blocks[game.player.block].states[blockState].exits[
      exitUpdateArray[0]
    ].state = updateValue;
  };

  const removeBagState = () => {
    // const blockState = getBlockState(game.player.block);
    delete game.blocks[game.player.block]["bag-state"];
  };

  const start = () => {
    stats.startTime = new Date().getTime();
    term.output(welcome);
    term.output(
      `<h1>Quest: ${game.game.name} (v${game.game.version} by ${game.game.author})</h1>`,
    );
    term.output(divider);
    term.output(game.game.intro);
    track("quest", "start");
    game.player.blockHistory = [];
    game.player.blockHistory.push(game.player.block);
  };

  return {
    // static
    logo,
    divider,
    // commands
    bag,
    help,
    look,
    move,
    powers,
    take,
    use,
    // init and utils
    setTerm,
    start,
    track,
    bumpCommandsEntered,
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

  const terminal = new TextTerminal({
    containerId: "terminal",
    prompt: "Hansel",
    separator: ": ",
    welcome: "",
    commands,
  });

  terminal.dom.command.addEventListener(
    "keydown",
    (e) => {
      // up arrow
      if (e.keyCode === 38) {
        tq.track("command", "entered", "up-arrow");
        // down arrow
      } else if (e.keyCode === 40) {
        tq.track("command", "entered", "down-arrow");
        // enter
      } else if (e.keyCode === 13) {
        const inputCommands = terminal.dom.input.value.split(" ");
        const prefix = !Object.prototype.hasOwnProperty.call(
          commands,
          inputCommands[0],
        )
          ? "commandUnknown"
          : "commandKnown";
        tq.track(
          "command",
          "entered",
          "raw",
          `${prefix}--${inputCommands.join("-")}`,
        );
        // bump to commands entered stat
        tq.bumpCommandsEntered();
        // hide the ribbon on mobile
        if (
          !document
            .querySelector(".github-fork-ribbon")
            .classList.contains("mobile-hide")
        ) {
          document
            .querySelector(".github-fork-ribbon")
            .classList.add("mobile-hide");
        }
      }
    },
    true,
  );

  tq.setTerm(terminal);
  tq.start();

  // focus on terminal input for 'whole page' clicking event
  document.body.addEventListener(
    "click",
    () => {
      document.querySelector(".input").focus();
    },
    true,
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
