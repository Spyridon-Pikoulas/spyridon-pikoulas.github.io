---
layout: guide
title: "Farming & Fishing System"
guide: "Farming & Fishing System"
nav: Overview
order: 1
permalink: /docs/farming-fishing/
description: "The guide to Farming & Fishing System, an Unreal Engine 5.6 to 5.8 plugin for crops, fishing and a calendar of seasons, usable from Blueprint, replicated and saved."
---

# Farming & Fishing System

Farming, fishing and the calendar that drives both, for Unreal Engine 5.6 to 5.8, as one C++ plugin
with all of it usable from Blueprint. Crops grow on any ground you mark as a field, fish bite by
season, hour and weather, and everything works in multiplayer and saves into your own save game.

**Get it on Fab:** [Farming & Fishing System](https://www.fab.com/listings/20a5eea9-9b37-48d9-8a10-efdd5a2dbd58).

**Try it first:** the [playable Windows demo](https://github.com/heyheythere-games/farming-fishing-demo/releases/latest) is free, about 300 MB; unzip it and run the exe.

{% include figure.html src="demo-farm.jpg" size="wide" alt="A small farm from above: a fenced field of crops at different stages, a hen house and a cow in their pens beside it, a wooden bin by a path to a pond with a wooden dock, and trees around." caption="A farm made with the plugin's crops, tools and props." %}

## What it does

- **Fields on any ground.** A **Farm Area** box turns the ground under it into a grid of tiles,
  on a landscape, a static mesh or a slope. Players till, plant, water, fertilize and harvest them
  with seven tools, and a tile's soil darkens when it's watered. Pots and raised beds, set down
  anywhere, are small fields of their own.
- **Crops are data assets.** Seasons, stages with a mesh and a number of watered days each,
  regrowth after harvest (a tomato plant gives again), yield and withering. Thirteen crops ship
  ready to use, from a three-day turnip to an apple tree that fruits every season. Crops grow
  into each stage, pop up to the picker and part as the player walks through them; a card beside
  the targeted crop counts its days.
- **A calendar with four seasons.** Hours, days, seasons and years, and rain that waters every
  field. It runs on its own, or follows your game's day and night cycle.
- **Animals.** Chickens and cows roam a pen, eat from its feeders, sleep at its home at night and,
  fed, lay an egg or give milk. Petting them daily raises their affection, and with it the
  produce's quality.
- **Sprinklers and greenhouses.** A sprinkler waters the tiles round it every morning. Under a
  greenhouse's glass, crops grow in its own season, whatever the calendar's, and water themselves.
- **Fishing.** A **Fishing Water** box marks where fish are. Hold to charge a cast, wait for the
  bite, hook it and play the fish on a tension bar. Which fish bite depends on the season, the hour
  and the weather; bait draws some and others take nothing else. Fish swim as shadows under the
  surface, and a fish book keeps what each player has caught. Ten fish and two fish tables ship.
- **Your inventory, your HUD.** Harvests and catches go to your own inventory through one
  interface, or through events. A ready-made HUD shows the date, the tools and the targeted tile,
  and can be restyled in a Widget Blueprint or replaced.
- **A glint on what can be used.** A small sparkle on each patch of a crop ready to harvest, over
  fishing water, on anything else you give one, and off in one setting.
- **Multiplayer and save.** The server owns the fields, the calendar and the fishing, and every
  player sees them. One node captures the whole farm into your save game; one puts it back.

<div class="gallery">
{% include figure.html src="demo-field.jpg" alt="A tilled field with seedlings, tomatoes, wheat, corn and sunflowers at different heights, the farmer with a basket by a cottage behind the fence, a greenhouse beyond." caption="Crops from seed to ready, each stage its own mesh." %}
{% include figure.html src="demo-pond.jpg" alt="The farmer on a wooden dock at the edge of the pond, her bobber's ring and a glint on the water, lily pads, reeds and cattails." caption="Fishing from the dock." %}
{% include figure.html src="demo-greenhouse.jpg" alt="A glass greenhouse with tomato plants inside, behind a fence and a field of cabbages, wheat and corn, a hen house to the right." caption="A greenhouse grows in its own season." %}
{% include figure.html src="demo-yard.jpg" alt="A hen house with a ramp in a fenced pen, two hens by a feeder, and a cow grazing in the pasture beside it." caption="Hens and a cow, fed and petted." %}
</div>

## What's in the zip

| Folder | What it holds |
|---|---|
| `Source/FarmingFishing` | The plugin: the calendar, fields, crops, tools, fishing, animals, sprinklers, greenhouses, inventory interface, HUD, save, replication and the debugging tools. |
| `Content/Data` | Thirteen sample crops (`Crops`), ten sample fish and two fish tables (`Fish`), a chicken and a cow (`Animals`), a pot and a raised bed (`Planters`). |
| `Content/Meshes` | Each sample crop's stages and withered look, the fish, the tools, rod and bobber, the soil tile and highlight, the cast marker, and ten props: a bed, a dock, a fence, a well, a shipping bin, two trees and three rocks. In `Animals`, the chicken and the cow with their animations, a coop, a trough, an egg and a milk can; in `Farm`, the sprinkler, the greenhouse, the pot and the raised bed. The tool bar's and the crop card's icons in `UI`. |
| `Content/Glint` | The glint's material, `M_FFGlint`. |
| `Content/Materials`, `Content/Textures` | One stylized atlas the meshes share, the soil's, the highlight's, the fishing line's and its ripples' materials. |
| `Content/Demo`, `Source/FarmingFishingDemo` | The demo farm, `L_Farm`, with its meshes, and its code: the player, HUD and day and night. |

It needs the engine's **Enhanced Input** plugin, which every project made from Epic's templates
already uses. It runs on Windows, Mac and Linux, in Blueprint-only and C++ projects.

## Play the demo

The pictures on this page come from the demo farm that ships with the plugin. Open
**Plugins > Farming & Fishing System > Demo > L_Farm** and press **Play**:
[Play the demo](quickstart.md#play-the-demo) says how to find it and lists its keys. The
[quickstart](quickstart.md) then makes a field and a pond in your own map in fifteen minutes.

## Where to go next

- [Install](install.md): from Fab to the plugin enabled in your project.
- [Quickstart](quickstart.md): a field and a pond in your own map, planted, harvested and fished.
- [How-tos](how-to.md): your own crops and fish, fruit trees, planters, bait, animals, sprinklers
  and greenhouses, the calendar and your day and night, your inventory, glints, save, multiplayer, tools, input and HUD of your own.
- [Concepts](concepts.md): how the parts fit together, what a day does, who runs what.
- [Crops and fish](crops-and-fish.md): the samples' seasons, growth times, hours and sizes.
- [Reference](reference.md): every Blueprint node, setting, asset field and console command.
- [Changelog](changelog.md): what each version added.
- [Troubleshooting](troubleshooting.md): when something doesn't happen as it should.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
