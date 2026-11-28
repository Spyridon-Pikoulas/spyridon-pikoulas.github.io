---
layout: guide
title: "Concepts · Inventory, Equipment & Crafting System"
nav: Concepts
order: 5
permalink: /docs/inventory-crafting/concepts/
description: "How Inventory, Equipment & Crafting System's parts fit together: items, stacks and traits, containers, the Inv Player, equipment, crafting, vendors, pickups and loot, the server and clients, saving and the screen."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md) and want to build your own.

## Items and stacks

An **item** is a data asset of the class **Inv Item Definition**: what every one of it shares, its
name, icon, stack size, weight, size in a grid, tags, rarity and value. Items are primary assets of
the type `InvItem`, so the Asset Manager can list every item in your game.

A **stack** is some of one item in one place: a slot of a bag, a chest, a pickup lying on the
ground. Besides its item and count, a stack carries its own **Quality** (0, 1 or 2: normal, silver,
gold), its **Durability** and any **Values** you give it by tag, such as a charge or who made it.
Two stacks merge only when all of these match, up to the item's **Max Stack**.

An item's **traits** say what it does beyond being carried:

| Trait | What it does |
|---|---|
| Equippable | Worn in a slot of a tag; adds its stats while worn; its mesh goes on the body. |
| Usable | Used from a container, one spent each time: eaten, drunk, read. |
| Durability | Worn down by **Damage Durability**; at 0 one of the stack breaks, or it stays until mended. |
| Quality | Names the three grades and multiplies the value by them. |
| Grant Abilities While Worn | Gameplay Ability System: abilities, effects and tags while worn. |
| Apply Effect On Use | Gameplay Ability System: a Gameplay Effect on the user when used. |

A trait is an object of its own inside the item, and you can write one in Blueprint ([how](how-to.md#make-a-trait-of-your-own)).

## Containers

Anything that holds stacks is an **Inv Container** component: the player's bag and hotbar, a chest,
a crate, a corpse, a stall. A container is **slots**, one stack each whatever the item's size, or a
**grid**, where an item covers its **Size** in cells and can lie on its side.

Its **Container Tag** says what it is: `Inv.Container.Bag` and `Inv.Container.Hotbar` are the
player's bag and hotbar to the screen and the saves, `Inv.Container.Chest` a chest. **Max Weight**,
**Accept Tags** and **Refuse Tags** limit what goes in.

Three switches decide who sees it and uses it:

- **Owner Only**: its contents replicate to its owner's player alone, as a bag's do. Off, everyone
  near sees them.
- **Openable**: any player can open it with Interact, and take from it and put in while within
  its **Open Range**. An openable container is everyone's.
- **Supplies**: crafting takes ingredients from it and a vendor its currency, and what's made or
  bought goes into it. The bag and hotbar supply; a quiver of your own might not.

A player's containers can sit on their pawn, their controller or their player state, in any mix:
the plugin looks at all three. Put them on the pawn and they go when it dies; on the player state
and they outlive it.

## The Inv Player

Every player controller gets an **Inv Player** component as it logs in (Project Settings can turn
that off). It is the player's hands on the inventory:

- **Requests.** Every move a player makes, from a drag to a craft, is a call on the Inv Player,
  sent to the server, which checks it there: whose the containers are, how near, whether it
  fits. The answer comes back as **On Result** (`Done`, `No Room`, `Too Far`...).
- **The view.** It holds what the screen shows: open or closed, the page, the chest or vendor
  open, the slot in focus, the stack in hand, the filter, the recipe chosen. The widgets hold
  nothing of their own and redraw on **On View Changed**, so a widget of yours reads the same state.
- **Interact.** It finds the nearest pickup, openable container, vendor or station in reach, for
  the prompt and the Interact key.

The containers have nodes of their own for your game's server code, such as **Add Item** for a
quest's reward. These are **Authority** nodes: they change the contents directly and check
nothing, so call them only on the server.

## Equipment

The **Inv Equipment** component is a container of slots by tag: Head, Body, Back, Main Hand, Off
Hand, Feet, Belt and Trinket as it comes, most with a socket (Body, Feet and Trinket have none). An item whose Equippable **Slot Tag**
is the slot's tag, or a parent of it, goes in it.

As an item goes on, the equipment:

- adds its stats to its sums (**Get Stat** `Inv.Stat.Armor`), and fires **On Stats Changed**;
- puts its **Mesh** on the body at the socket, or its **Skinned Piece** on the body's skeleton,
  for every player to see. The equipment isn't Owner Only, so everyone near knows what's worn;
- calls its traits' **On Equipped**, where the GAS trait grants its abilities;
- fires **On Equipment Changed**, for your anim Blueprint.

The stats are numbers under tags, and the plugin applies none of them itself: **Inv.Stat.MoveSpeed**
doesn't change your walk speed until your game reads it. Read them in **On Stats Changed**, or let
a GAS trait apply them as an effect.

## Crafting

A **recipe** (**Inv Recipe**) is inputs, outputs, a **Station Tag**, a **Time** and an optional
**Unlock Tag**. The player's **Inv Crafter** holds the recipes they could know; one with an Unlock
Tag is locked until the crafter has that tag unlocked.

A recipe with a station tag is made only within range of an **Inv Station** of that tag, a
component on your workbench actor. Interact at a station opens the crafting page with its recipes
first.

Crafting takes the inputs from the player's supplies at once and queues the batches. The crafter
works through its queue on the server, a batch every **Time** seconds, and puts what's made into
the supplies, or at the player's feet when there's no room. Cancelling an order gives back the
inputs of its batches left, the one under way included.

## Vendors, pickups and loot

An **Inv Vendor** is a shop: its **Goods** at a price in its **Currency** item, with or without a
stock, and the items it buys back at **Sell Ratio** of their value. Interact opens its page beside
the bag.

Money can be kept apart from the bag, as an MMO keeps gold. An **Inv Wallet** on the player holds an
amount per currency tag (`Inv.Currency.Coins`, your own). An item tagged with a currency that
reaches a player with a wallet, given, looted, found in a chest they open or paid by a vendor, goes
into the wallet instead, and vendors take their price from it. Without a wallet the currency is an
item in the bag like any other.

An **Inv Pickup** is a stack lying in the world: placed in the level, dropped by a player, or
spawned by your code. Interact picks it up, or walking into it does with **Auto Pick Up**.

A **loot table** (**Inv Loot Table**) gives its **Guaranteed** entries every time, then draws
**Min Rolls** to **Max Rolls** times from **Entries** by weight. An entry can roll another table.
The same seed gives the same loot. A container fills itself from its **Loot Table** as play
begins, when it's empty.

## The server and clients

The server holds every container, crafter and vendor. Each container's stacks replicate as a fast
array, so a change sends only the stacks it touched. A player's own containers go to that player
alone (Owner Only); chests, stalls and worn equipment to everyone near.

A client never changes a container itself. Its requests go through its Inv Player to the server,
which checks and does them, and the change replicates back. The screen redraws when it lands, and
a refusal comes back as **On Result**. The same calls work on a listen server's host, in a
single-player game and on a client, with nothing to tell apart.

Events say where they fire: **On Changed** and **On Equipment Changed** on every machine that sees
the container, **On Item Count Changed** and **On Crafted** on the server only.

## Saving

The plugin saves into your own **Save Game** object, in two parts:

- **Save Inventory** gives a player's (or any actor's) containers, hotbar selection and unlocked
  recipes as an **Inv Save Data**. **Load Inventory** puts it back.
- **Save World** gives the level's side as an **Inv World Save**: the pickups lying around, the
  containers ticked **Save With World** (chests, crates), and each vendor's stock. **Load World**
  puts it back, replacing the pickups on the ground with the saved ones.

Both run on the server. [Save and load](how-to.md#save-and-load) has the nodes.

## The screen

The default UI is two widgets, both made by the Inv Player for its local player:

- the **HUD**: the hotbar, the toasts of what came in, and the prompt of what Interact would do;
- the **screen**: tabs for the bag and crafting, the equipment with the character preview, or a
  chest or a vendor beside the bag, and the tooltip of the slot in focus.

Their look is built in C++ from a **style** asset, `DA_InvStyle`: fonts, colours, frames, rarities,
stat names and the bag's filter tabs. Copy it and name the copy in Project Settings to restyle
every widget. Or make a widget of your own from **Inv Screen Widget**, or from nothing, and name it
there ([your own UI](how-to.md#use-your-own-ui)).

The **character preview** in the equipment panel is a scene capture of the player's own pawn,
live, wearing what's equipped. It captures only while the screen shows it, and Project Settings
turns it off.
