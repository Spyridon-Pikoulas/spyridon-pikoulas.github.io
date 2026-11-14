---
layout: guide
title: "Troubleshooting · Farming & Fishing System"
nav: Troubleshooting
order: 8
permalink: /docs/farming-fishing/troubleshooting/
description: "Fixes for the usual problems with Farming & Fishing System: clicks that do nothing, crops that don't grow or wither, no seeds, casts that don't land, no bite, grey crops in a packaged game, keys, loading and multiplayer."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start a check with the Gameplay
Debugger (<kbd>'</kbd> in Play): its **Farming** category shows the date and weather, each field's
tiles, the player's tool, can and seed, and while fishing, which fish can bite.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's Farming category over the dimmed game: Spring 4, Year 1, 07:07, day 3, clear; the farm area, 6 by 6, with 1 tilled tile, none planted, ready, withered or watered; the farmer holding the rod, water 17 of 20, seed DA_Crop_Turnip; fishing idle." caption="The **Farming** category of the Gameplay Debugger." %}

> [!TIP]
> On a keyboard that isn't US English, the console and the debugger may sit on other keys. Set
> them under **Project Settings > Engine > Input > Console Keys**, and
> **Project Settings > Engine > Gameplay Debugger > Activation Key**.

## Clicking does nothing, or no tile is outlined

The text above the tool bar says why a use failed: read it first.

- **"Nothing to work on here"** or no outline: no tile is targeted. With **In Front** targeting the
  tile is **Reach** (120 cm) ahead of the pawn; with **Camera** or **Cursor**, the point aimed at
  must be within **Max Reach** (350 cm). Step closer, or raise them on the Farmer Component.
- **"Too far away"**: the server measured the tile's centre beyond **Max Reach** plus one tile
  (450 cm by default) from the pawn, which a lagging connection can bring about. Step closer.
- **The tile is outside the field.** Only the squares inside the Farm Area's box are tiles. Select
  the field and check its green box covers the ground you're on.
- **The box doesn't straddle the ground.** Tiles are laid on the ground found between the top and
  the bottom of the box, and only points inside the box's height can be aimed at. A box floating
  above the ground, or sunk under it, can't be targeted, and its soil sits at the box's bottom:
  move it so its middle is about at ground level, and give it height (**Box Extent** Z of 100 or
  more) on a slope.
- **The ground isn't World Static.** The ground trace, and **In Front** targeting, find only
  objects whose collision is World Static: landscapes and placed static meshes are. A mesh inside
  a Blueprint is World Dynamic unless its collision preset says otherwise, and a ground with no
  collision isn't found. **Camera** and **Cursor** targeting trace the Visibility channel instead.
- **"Till the soil first"**: the tile is plain ground. Use the hoe on it first.
- **The wrong tool.** The hand harvests and clears; the hoe tills; the can waters; the seeds
  plant. The tool bar shows which is held.

## The soil floats above the ground, or sinks into it

The soil is laid on what the trace hits first from the top of the box down. A rock, a fence or a
roof inside the box, above the ground, takes the soil. Keep other World Static meshes out of the
field's box, or lower the box's top below them.

The ground under a tile is found once and kept, and found again when the field moves or its
box or **Tile Size** changes. A field on a moving actor finds it again every frame, which costs time:
keep fields still.

## A crop doesn't grow

- **It wasn't watered by midnight.** A crop grows only on days its soil was wet at midnight, and
  every tile starts the day dry. Water it every day, or let the rain.
- **The clock isn't running.** **Real Seconds Per Game Hour** is 0, or **Set Clock Running** turned
  it off. Then only **Advance Time**, **Sleep Until Morning** and the commands `Farm.Day`,
  `Farm.Season` and `Farm.Hour` start a day.
- **`Farm.Day` was typed on a client.** The commands work on the server. In a two-player Play,
  type them in the server's window.
- **It's at its stage's Days and not there yet.** A stage with **Days** of 2 takes two watered
  days. [Crops and fish](crops-and-fish.md) gives each sample's total.

## A crop withered

- **It was dry too long.** **Dry Days To Wither** (3) dry days in a row wither it.
- **Its season ended.** At the first midnight out of its seasons a crop withers, ready or not,
  watered or not. A turnip planted on spring's last days won't make it.
- **`Farm.Season` skipped the days.** It passes every day to the next season, and a crop left dry
  counts each as a dry day.

Clear a withered crop with the hand or the hoe.

## Planting takes no seeds from the inventory

The crop's **Seed Item Id** is empty, so planting it is free even with an inventory. The server's
Output Log says so as a warning the first time each player plants the crop; the same goes for the Farmer
Component's **Fertilizer Item Id**. Set it to your inventory's id for the item.

## "No seeds" or "None left"

- **The player has no seeds.** **Player Seeds** in the settings is empty, or a Farmer Component
  you added yourself has an empty **Seeds**. The tool bar's seeds show no crop.
- **Your inventory refused.** **Consume Farm Item** returned false: the player has no
  `TurnipSeeds` (the crop's **Seed Item Id**) or no `Fertilizer` in your inventory. Give them some,
  or check the ids match.
- **The crop has no stages.** A crop asset with an empty **Stages** can't be planted. The Message
  Log names it, as an error, when the asset is saved.

## "It won't grow this season"

The selected seed's **Seasons** don't include today's. <kbd>E</kbd> picks another seed, and
`Farm.Season` moves on a season to try.

## "Cast onto water"

The cast lands straight ahead, 3 m for a tap and up to 14 m for a full second's hold, and only on a
Fishing Water. No cast marker while charging means no water there, and letting go says so.

- **The cast flies past the water.** On a small pond a long hold lands on the far bank. Tap, or
  hold for less.
- **The Fishing Water doesn't cover the water.** Only the box's outline seen from above decides
  where a cast can land; its top sets only the height the bobber floats at. Select it and fit its
  box to the water.
- **The player faces along the bank.** Face the water.

## Nothing bites

The fish is chosen as the line goes out, and a cast no fish can take is refused with a message.

- **"This water has no fish table".** Set the Fishing Water's **Fish Table** in its Details. The
  Output Log names the water too, and saving the level names it in the Message Log.
- **"Nothing bites here now".** No fish of the table can bite at this season, hour and weather, or
  the table has no entries, or only entries of **Weight** 0. Type `Fish.Table` in the console: it
  lists every water's fish in the Output Log, and why each can't bite now ("Not in Winter", "Only
  from 20 to 5", "Only in the rain", "Only in clear weather", "weight 0, never bites"). Add a fish
  that bites at any hour and season, like the bluegill, to every table. The Message Log names an
  empty table, as a warning, when it is saved.
- **The line is out and no bite.** A bite comes **Min Wait** to **Max Wait** seconds after the
  bobber lands: 3 to 10 in the sample tables, 12 to 20 at the demo farm's pond.

## The fish gets away

- **"It got away."** The bite wasn't hooked within the fish's **Bite Window**, about a second.
  Click as soon as **Bite!** shows. The server also lets a fish go that was landed in less than
  0.8 times its **Stamina** in seconds, which a bad connection or a modified client can bring about.
- **"The line snapped."** The tension reached the top of the bar. Let go as soon as the bar turns
  red; strong fish pull it up fast.
- **No message at all.** A click while the line is flying or waiting reels it in, and so does
  switching tools.

## The crops are grey in a packaged or standalone game

A crop mesh of your own whose material isn't marked for instanced meshes draws with the default
material outside the editor. Open the material, tick **Used with Instanced Static Meshes** under
**Usage** in its Details, and save. The plugin's own materials already have it.

## The plugin's crops and fish aren't in the Content Browser

Installed to the engine, the plugin's content counts as both engine and plugin content, and the
Content Browser hides both by default. Open its **Settings** and turn on **Show Engine Content**
and **Show Plugin Content**: **Plugins > Farming & Fishing System** appears. The pickers in a
Details panel, such as **Player Seeds**, list the plugin's assets either way.

## The keys do nothing

- **The player isn't on Enhanced Input.** See the note in [Install](install.md#enable-it-in-your-project).
- **Your own input takes the keys first.** A mapping context of yours with a priority above the
  plugin's (1) and the same keys consumes them. Lower it, or turn off **Default Input** on the
  Farmer Component and call **Use Pressed**, **Use Released**, **Select Tool** and **Cycle Seed** from your own
  input ([how](how-to.md#use-your-own-character-input-and-hud)).
- **Another plugin uses E.** Quest & Dialogue System talks on <kbd>E</kbd> too. With both, map one
  of them to another key in your own context.
- **The pawn isn't the player's.** The components are added to a pawn as a player possesses it.

## The tools sit wrongly in the hand

The tools are gripped at **Hand Socket** (`hand_r`, as on Epic's mannequins), placed by **Tool
Transform** and **Rod Transform** in the settings. A skeleton with another hand socket name needs
it set on both components; a hand whose bone is turned differently needs the transforms adjusted.
Without the socket, the tool sits at the pawn's root.

## Loading doesn't bring the farm back

- **Restore Farm ran on a client.** It works on the server only, and returns false on a client.
- **It ran too early.** Fields register as they begin play; a field not yet registered is
  skipped. Call it after **Delay Until Next Tick** on Begin Play, or later.
- **The field's Area Id changed.** Tiles are saved under each field's **Area Id**, or its actor
  name when that is empty. Renaming the actor, or spawning the field at run time without an Area
  Id, loses its tiles. Set **Area Id** on every field you save.
- **A crop asset was renamed or moved** since the save, and the redirector deleted. Keep
  redirectors in crop folders once players have saves.

## Multiplayer

- **A client's use shows a moment late.** Tool uses go to the server and come back with
  replication. Read the outcome in **On Tool Used**, not right after the call.
- **Calendar, Farm Area and Restore Farm nodes do nothing on a client.** Those marked
  **Server only** in the [reference](reference.md) change nothing there. Call them on the server,
  or through a Run on Server event. **Capture Farm** and **Save Farm To Slot** work on a client.
- **"You don't have that tool" or "No seeds" on a client.** The server rejects a tool or a seed
  its own Farmer Component lacks. The **Tools** list doesn't replicate: change it on the server and
  on the owning client.
- **Another player's can reads 0.** The can's water replicates only to its own player.
- **A client's clock stops at 23:59** for a moment, until the server's new day arrives.
