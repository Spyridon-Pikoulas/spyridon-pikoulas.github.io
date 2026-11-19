---
layout: guide
title: "Changelog · Farming & Fishing System"
nav: Changelog
order: 9
permalink: /docs/farming-fishing/changelog/
description: "Each version of Farming & Fishing System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.2 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [Animals](how-to.md#keep-animals): a chicken and a cow, with their meshes and animations, that
  roam an **Animal Pen**, eat from its **Feeders**, sleep at its home and, fed, lay eggs or give
  milk; petting raises their affection and their produce's quality. A coop, a trough, an egg and a
  milk can among the props.
- [Sprinklers and greenhouses](how-to.md#water-with-sprinklers-grow-under-glass): a **Sprinkler**
  waters the tiles round it each morning; a **Greenhouse** grows its tiles in its own season,
  watered.
- The hand uses anything with the **Farm Usable** interface; **Get Usable**, **Give Item** and
  **Consume Item** on the Farmer Component; **Get Season At** on the farm.
- Animals, feeders and laid produce are saved with the farm; `Farm.FeedAnimals`, `Farm.Sprinkle`
  and the debugger's animal lines.
- The demo farm has a hen pen and coop, a cow's pasture, sprinklers on the field and a greenhouse.

On updating:

- The hand uses a Farm Usable just ahead before the tile: an animal standing on the field comes
  first.
- **Tool Result** has new entries (Petted, Already Petted, Collected, Filled, Already Full): a
  **Switch** on it shows them, and they are successes.
- Rain, **Set Raining** included, no longer waters tiles under a greenhouse.
- Your inventory is asked for `Hay` and handed `Egg` and `Milk` once animals are fed.
- A save made with 1.1 loads, with no animals' care and no laid produce in it: eggs on the ground
  are cleared.

## 1.1 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- The [glint](how-to.md#show-what-the-player-can-use), a small sparkle on each patch of a crop ready
  to harvest, over fishing water and on anything else you give a **Glint**: the **Glints** settings,
  **Ready Glints** on the Farm Area, **Set Glints Shown** on **Glints** and `Farm.Glints`. In the
  demo the bed carries one too.
- The farmer's [actions](how-to.md#play-your-own-animations): the hoe swung, a seed planted, the
  can tipped, a crop pulled, a cast charged and flicked, a bite struck, the line reeled and strained
  against and its snap, each posed by the plugin on the mannequin's skeleton, or played from a
  montage of yours in **Action Montages**; **On Action**, **Play Action** and **Use Delay**: a farm
  use now changes the ground 0.35 s after it is pressed, as the tool lands.

Nothing to change on updating. The glints show at once; untick **Glints** in the settings for none.
Untick **Action Poses** on the Farmer Component if your Anim Blueprint animates the uses already,
and set **Use Delay** to 0 for the ground to change at once as before.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- fields of tiles on any ground, tilled, planted, watered, fertilized and harvested with six tools;
- crops as data assets, with seasons, stages, regrowth, yields, withering and quality;
- a calendar of days, seasons and years, with rain, sleep and your own day and night cycle;
- fishing: casting, bites by season, hour and weather from fish tables, and a tension reel;
- ten sample crops, ten fish and two fish tables, with their meshes, tools and props;
- a HUD replaceable by your own Widget Blueprint, and targeting for third person, first person and
  top-down;
- an inventory interface, replication with server checks, and save into your save game or a
  slot;
- the Gameplay Debugger's **Farming** category and the `Farm.*` and `Fish.*` console commands.
