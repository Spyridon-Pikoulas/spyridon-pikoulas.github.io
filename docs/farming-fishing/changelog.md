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

## 1.4 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [Sound and feel](how-to.md#change-the-sounds-and-effects): each moment, from tilling to a catch
  or a lost fish, has a sound, an effect, a camera kick and a rumble, set per moment in
  **Feedback**. The plugin's own sounds and Niagara effects (dust, a pop, a splash, the
  sprinkler's spray) follow the effects quality setting. The tilled soil squashes in, and a caught
  fish leaps to the hand.
- Input as assets: `IMC_FF_Farming` and its `IA_FF_` actions, set in the plugin's settings under
  **Input**, each player-mappable for a rebinding menu. <kbd>Q</kbd> and the gamepad's top face
  button pick the previous seed, bait or planter. Prompts name the keys of the device in use.
- The HUD reacts to events instead of updating every frame, and moves: the bite pops, messages
  slide in, the card and bars fade, the picked slot pops. The tension bar marks its safe band and
  says **Too slack**, **Good** or **Too tight**, in colours that hold for colour-blind players.
  **HUD Scale** sizes it, and **Set Hud Scale** changes it in play. Text sits on backing panels.
- A fish has an **Icon**, and the samples have pictures; **Fish Book** pages say how common a fish
  is (**Share**).
- Animals keep apart at a trough, roaming and going home.
- The look: a roughness and metal lookup beside the colour atlas, so fruit, metal and wood differ;
  crops and trees lit through their leaves; LODs on crops, trees, props and the yard's buildings;
  rounder fish fins.
- The sprinkler, greenhouse and trough meshes are settings, so a packaged game cooks them even
  when they are spawned at run time.
- The tile's outline glides from tile to tile (**Highlight Glide**), and In Front holds a tile till
  the aim is a quarter of a tile into the next. **Reach** is 220 cm, a tile further, and the farmer
  walks up to a tile beyond **Work Reach** (120 cm) before working it (**Walk Up**), so the tool
  lands on the marked tile. A move of the player's own calls the walk off.
- A fish bites sooner: **Min Wait** and **Max Wait** are 1 and 3 seconds by default, and in the
  sample tables.

On updating:

- A Farmer Component at the default **Reach** now targets a tile further and walks up to it; set
  Reach to 120 cm and turn **Walk Up** off for the old way. The hand's reach for animals, feeders
  and eggs no longer follows it.
- A Fish Table at the default waits now waits 1 to 3 seconds; set 3 and 10 for the old.
- **Default Input** now adds the **Input** settings' mapping context. A game that set its own keys
  through the plugin's old context, `IMC_FarmingDefault`, sets them on `IMC_FF_Farming`, or on
  copies named in the settings.
- A Farm HUD Widget Blueprint of yours lays out no `TensionBand` and goes on without it.

A 1.3 save loads.

## 1.3 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [Planters](how-to.md#set-down-planters): a pot and a raised bed the player sets down with a
  seventh tool, the **Planter**, each a small field of its own, tilled already, watered by
  sprinklers and grown under glass, saved with the farm. Placed in the level too.
- [Fruit trees and a bush](how-to.md#grow-fruit-trees-and-bushes): an apple and an orange tree
  and a blueberry bush that fruit again each season and never wither. **Perennial**, **Spacing**
  and **Trunk Radius** on a crop.
- The HUD's [crop card](reference.md#ui) beside the targeted crop: its stage, the days to the next
  stage and to harvest, the dry days before it withers and its quality, a line each with an icon.
  The tool bar is a row of icon slots, the can's water a bar.
- [Bait and a fish book](how-to.md#fish-with-bait-and-keep-a-fish-book): a fish table's entry can
  favour or need a bait taken from the inventory at the cast; **Fish Book** gives a page per fish,
  caught or not, with the biggest and where and when it bites.
- Fish seen in the water: a Fishing Water's fish swim as shadows under its surface, and one turns
  to the bobber before a bite.
- Living crops: a crop grows into its next stage instead of popping, a harvest flies up to the
  picker, crops part round the player as she walks through them, and the can pours.
- Recipes for the [Inventory, Equipment & Crafting System](how-to.md#with-the-inventory-equipment--crafting-system)
  and for [a day and night sky](how-to.md#with-a-sky-that-keeps-its-own-time).
- The tile follows the view: In Front targets where the player looks, turning as the view turns
  with the farmer still, and she turns to it as she works; the way she faces until the view first
  turns. A tile is held till the aim is well into the next, so it doesn't flicker on an edge.
- Walking away from the bobber ends the fishing: past **Walk Away** (300 cm) farther than the
  cast, the line is reeled in.
- The demo farm has an orchard, a pot and a raised bed, and a denser yard: flowers, tufts, bales,
  crates and barrels.

On updating:

- **Tools** gains the Planter, at the end, and the keys go 1 to 7. A Farmer Component whose
  **Tools** you set yourself keeps its own list.
- **Tool Result** has new entries (Placed, No Room, Picked Up, Not Empty): a **Switch** on it
  shows them, and Placed and Picked Up are successes.
- A Farm HUD Widget Blueprint of yours lays out none of the new parts and goes on without them;
  name them as in [UI](reference.md#ui) to have them.

A 1.2 save loads, with no planters set down and an empty fish book.

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
