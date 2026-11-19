---
layout: guide
title: "Changelog · Inventory, Equipment & Crafting System"
nav: Changelog
order: 8
permalink: /docs/inventory-crafting/changelog/
description: "The versions of Inventory, Equipment & Crafting System and what each one changed."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- items as primary data assets, with traits for equipping, using, durability and quality, and
  Blueprint traits of your own;
- containers as slots or grids, with weight, tag and slot limits, for bags, hotbars, chests,
  crates and stalls;
- equipment by slot tag, its stats summed and its gear on the body for every player, as meshes on
  sockets or skinned pieces;
- crafting with recipes, stations, a queue and unlocks;
- vendors with stock and prices, a wallet of currencies by tag (or coins as items), and seeded,
  weighted loot tables;
- pickups and Interact, with a glint on what's in reach;
- server-checked requests and fast-array replication, tested with two players on a listen server;
- save and load of players' containers and the level's pickups, chests and stock;
- the default screen and HUD for mouse, keyboard and gamepad (the keyboard and gamepad focus on
  the page open, as the screen opens or turns a page), the character preview, and the style asset;
- Gameplay Ability System traits: abilities and effects while worn, an effect on use;
- the `Inventory.*` console commands, the Gameplay Debugger's **Inventory** category and Data
  Validation;
- 25 example items with their icons, 8 recipes, a loot table, the gear, and the market-day demo.
