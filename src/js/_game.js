const game = {
  game: {
    name: "The Sleepy Traveller",
    version: 1.2,
    description: "Use commands to help the sleepy traveller escape",
    author: '<a href="https://github.com/desholmes">Des Holmes</a>',
    intro:
      '<p>And so it begins...</p><p>Blink, blink, yawn: You slowly wake up.</p><p>"Where am I?!?, maybe I should <b>look</b> around."</p>',
  },
  player: {
    name: "Sleepy traveller",
    block: "entrance",
    bag: null,
    powers: null,
  },
  powers: {
    help: { description: "help: Lists your powers and any hints." },
    look: {
      description: "look: Use `look` for a description of your surroundings.",
    },
    bag: { description: "bag: view the contents of your `bag`." },
    use: { description: "use: `use` an item from your `bag`." },
    powers: { description: "powers: List the powers you have unlocked." },
    take: {
      description: "take: `take` an item from a room and put it in your `bag`",
    },
    north: { description: "north: travel `north` from your current location." },
    east: { description: "east: travel `north` from your current location." },
    south: { description: "south: travel `south` from your current location." },
    west: { description: "west: travel `west` from your current location." },
  },
  items: {
    key: {
      description:
        "A small brass key with a decorative, red ribbon tied through it.",
    },
    torch: {
      description: "A bright metal torch with a strong glowing yellow flame.",
    },
  },
  blocks: {
    entrance: {
      state: "default",
      states: {
        default: {
          name: "Cave entrance",
          description:
            "You find yourself in a damp entrance to a cave. You can't remember how you got here, but you know you must get out. The exit to the south is blocked by thick brambles.",
          items: ["key"],
          actions: {
            "use key": {
              description:
                "You put the key into the lock and turn the handle. The large oak door slowly opens inwards...",
              bag: "key",
              actions: [
                { updateExitState: ["north", "open"] },
                { removeItemFromBag: ["key"] },
              ],
            },
          },
          exits: {
            north: {
              block: "grand-hall",
              state: "closed",
              states: {
                closed: {
                  description:
                    "A large, locked, oak door stands before you. There is a keyhole, but it's too small to peep through.",
                },
              },
            },
            west: { block: "well-lit-tunnel", state: "open" },
            east: { block: "dark-tunnel", state: "open" },
          },
        },
      },
    },
    "dark-tunnel": {
      state: "default",
      "bag-state": "torch",
      states: {
        default: {
          name: "Dark tunnel",
          description:
            "You're standing in the pitch black. The space doesn't feel very big and there's a funny smell.",
          exits: { west: { block: "entrance", state: "open" } },
        },
        "torch-no-key": {
          name: "Dim tunnel",
          description:
            "You're standing in a torch lit room. It's small and smelly with mouldy green walls.",
          exits: { west: { block: "entrance", state: "open" } },
        },
        torch: {
          name: "Dim tunnel",
          description:
            "You're standing in a torch lit room. It's small and smelly with mouldy green walls. You can see a small key on the floor.",
          items: ["key"],
          actions: {
            "take key": {
              actions: [
                { removeItemFromBlock: ["key"] },
                { addItemToBag: ["key"] },
                { removeActionFromBlock: ["take key"] },
                { removeBagState: null },
                { updateBlockState: ["torch-no-key"] },
              ],
            },
          },
          exits: { west: { block: "entrance", state: "open" } },
        },
      },
    },
    "well-lit-tunnel": {
      state: "default",
      states: {
        default: {
          name: "Well lit tunnel",
          description:
            "You're standing in a well lit room, there are two torches on the wall. One looks to have been lit recently.",
          items: ["torch"],
          actions: {
            "take torch": {
              actions: [
                { removeItemFromBlock: ["torch"] },
                { addItemToBag: ["torch"] },
                { removeActionFromBlock: ["take torch"] },
                { updateBlockState: ["dim"] },
              ],
            },
          },
          exits: { east: { block: "entrance", state: "open" } },
        },
        dim: {
          name: "Dimly lit tunnel",
          description:
            "You're standing in dimly lit room, there's a single torch fixed firmly to the wall, and sooty marks on the wall opposite where a torch once was.",
          exits: { east: { block: "entrance", state: "open" } },
        },
      },
    },
    "grand-hall": {
      state: "default",
      states: {
        default: {
          name: "Grand Hall",
          description:
            '<p>You\'re standing in a vast hall. The long, well dressed table is full of delicious-looking food. A voice from the back of the room booms:</p><h1>"There you are my boy! Sit down, sit down. The food is getting cold."</h1><p>Your quest is complete!</p>',
          "auto-actions": [{ completeQuest: null }],
        },
      },
    },
  },
};
