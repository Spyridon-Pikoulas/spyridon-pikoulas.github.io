---
layout: guide
title: "Quickstart · Farming & Fishing System"
nav: Quickstart
order: 3
permalink: /docs/farming-fishing/quickstart/
description: "Fifteen minutes from installing Farming & Fishing System to a field and a pond in your own Unreal map: tilled, planted, watered, harvested and fished, with no Blueprint graph or C++."
---

# Quickstart: a field and a pond in your own map

Fifteen minutes from an installed plugin to a turnip you planted, watered and harvested, and a
fish you caught. No Blueprint graph or C++ is needed.

The steps use a project made from the **Third Person** template with the plugin enabled
([Install](install.md)). Any project whose player is a pawn on Enhanced Input works the same.

To see it all working first, [play the demo](#play-the-demo) that comes with the plugin.

## 1. Give the player seeds

The plugin ships ten crops to start from. A turnip is the quickest: it grows in spring, the
season play begins in, and is ready after three watered days.

1. Open **Edit > Project Settings** and pick **Farming & Fishing** under **Plugins** on the left.
2. Click **+** beside **Player Seeds** and pick from the new entry's list, adding
   `DA_Crop_Turnip` to **Player Seeds**.

    {% include figure.html src="settings.png" alt="Project Settings, Plugins, Farming and Fishing: Add To Players ticked, and Player Seeds opened to its one entry, Index 0, DA_Crop_Turnip; the calendar below." caption="**Player Seeds** with its one entry, the turnip: every player now carries turnip seeds." %}

Every player's Farmer Component now carries turnip seeds. The other crops are beside it in
**Plugins > Farming & Fishing System > Data > Crops**; [Crops and fish](crops-and-fish.md) lists
their seasons and growing times.

## 2. Place a field

1. Open the **Place Actors** panel (**Window > Place Actors**) and search for `Farm Area`.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for Farm Area, with Farm Area as the one result." caption="**Farm Area** in **Place Actors**." %}

2. Drag **Farm Area** onto the ground a few metres in front of the **Player Start**. A green box
   appears, 10 m square.
3. With it selected, find **Box Extent** in the **Details** panel and set it to `300`, `300`,
   `100`. The field is now 6 by 6 tiles of 1 m.

    {% include figure.html src="extent.png" alt="The selected Farm Area's Details: its Bounds component picked at the top, and under Shape, Box Extent 300, 300, 100." caption="**Box Extent** is on the area's **Bounds** box: pick it at the top of the **Details** if you don't see it." %}

The box's middle should sit about on the ground: the tiles are laid on whatever ground lies
between its top and bottom, so a slope or a landscape works too.

## 3. Farm

1. Press **Play** and walk up to the field. The tile in front of you is outlined, and the text
   above the tool bar says what it holds.

    {% include figure.html src="tile.jpg" alt="The player beside the field in the Third Person map, a white outline on the tile ahead of her, and Untilled over the tool bar at the bottom." caption="The targeted tile, and over the tools what it holds." %}

2. Press <kbd>2</kbd> for the hoe and click: the tile is tilled.
3. Press <kbd>4</kbd> for the seeds and click: a turnip seed is planted.

    {% include figure.html src="plant.jpg" alt="A turnip seed on a square of tilled soil inside the outline; over the tool bar, Turnip, stage 1/4, dry, and under it, Seed: Turnip." caption="Planted. The line under the tools names the seed; <kbd>E</kbd> picks the next." %}

4. Press <kbd>3</kbd> for the watering can and click: the soil darkens, watered.

    {% include figure.html src="watered.jpg" alt="The same seed on darker soil, the can in her hand; over the tool bar, Turnip, stage 1/4, watered, and under it, Water 19/20." caption="Watered soil is darker. The can holds 20 waterings and refills at a Fishing Water; rain waters every field." %}

5. Open the console with <kbd>&#96;</kbd> and type `Farm.Day`. The clock moves on 24 hours, past
   midnight, and the watered turnip grows a stage. Every tile starts a new day dry: water the
   turnip again before each `Farm.Day`, and type it twice more.

6. After the third `Farm.Day` the date reads Spring 4 and the turnip is ready. Press <kbd>1</kbd>
   for the hand and click to harvest it.

    {% include figure.html src="ready.jpg" alt="The grown turnip, its leaves up, on its tile; over the tool bar, Turnip, ready, dry." caption="Ready to harvest." %}

Left to run, the calendar moves on 30 real seconds a game hour, so a game day takes 12 minutes. A
crop left dry for three days withers: clear it with the hand or the hoe.

> [!TIP]
> `Farm.GrowAll` brings every crop to its ready stage at once, and `Farm.Season` jumps to the next
> season. The [reference](reference.md#console-commands) lists all the commands.

## 4. Make a pond

1. If your map has no water yet, place a **Cube** from **Place Actors**, flatten it to a pond
   (scale it to `12`, `8`, `0.2`) and give it a blue material. Put it on the ground to one side
   of the field.
2. Search **Place Actors** for `Fishing Water` and drag it onto the pond. Set its **Box Extent**
   to cover the water, and move it so the top of the Fishing Water's box is level with the water's
   surface: that is where the bobber floats.
3. Set its **Fish Table** to `DA_FishTable_Pond`, whose bluegill bite in every season, at any
   hour.

    {% include figure.html src="pond.png" alt="The Fishing section of the selected Fishing Water's Details: Fish Table DA_FishTable_Pond and Refills Cans ticked." caption="The pond's settings. **Refills Cans** lets the watering can fill here." %}

## 5. Fish

1. Press **Play** and stand at the water's edge, facing it.
2. Press <kbd>6</kbd> for the rod, then hold the left mouse button. The bar above the tool bar,
   labelled Charge, fills amber, and a marker shows where the bobber will land: 3 m ahead for a tap, up to
   14 m for a full second's hold.

    {% include figure.html src="cast.jpg" alt="The player holding the rod at the pond's edge, an amber ring on the water ahead where the bobber will land, and the Charge bar part full above the tool bar." caption="Charging a cast. The marker shows only over a Fishing Water." %}

3. Release to cast, and wait. When **Bite!** shows, click at once to hook the fish.

    {% include figure.html src="bite.jpg" alt="The player at the pond's edge, her line out on the water, and Bite! in yellow in the middle of the screen." caption="A bite lasts about a second: click before it passes." %}

4. Hold the button to reel and let go to give slack, keeping the tension bar green until the fish
   tires; in the green it tires twice as fast while you reel as with slack. The bar turns red when
   the tension is too low (the fish rests) or too high; at the top the line snaps.

    {% include figure.html src="reel.jpg" alt="The tension bar, labelled Tension, above the tool bar, filled green part way, and the line out to the bobber on the water." caption="Reeling: hold to raise the tension, let go to lower it." %}

5. The fish is caught: the HUD names it and its size.

    {% include figure.html src="caught.jpg" alt="The player at the pond with the rod, the message naming the fish caught and its size in cm under her." caption="Caught." %}

`Fish.Table` in the console says which fish can bite at each water now, and why the others can't.

## Play the demo

The plugin comes with a small farm to play: a field already growing, a pond with a dock, and a
cottage with a bed to sleep in.

1. In the Content Browser, open **Settings** and turn on **Show Plugin Content**, and **Show
   Engine Content** too if the plugin is installed to the engine.
2. Open **Plugins > Farming & Fishing System > Demo > L_Farm** and press **Play**.

The panel on the left lists the keys: <kbd>1</kbd> to <kbd>6</kbd> or the mouse wheel pick a
tool, the left mouse button uses it, <kbd>E</kbd> picks the next of the ten crops' seeds,
<kbd>Z</kbd> sleeps by the bed and <kbd>F3</kbd> moves on a season. <kbd>F5</kbd> saves the farm and <kbd>F9</kbd> loads it.
The basket on the right counts what you harvest and catch.

For two players, set **Number of Players** to 2 and **Net Mode** to **Play As Listen Server**
under the **Play** button's menu, then Play. The map uses its own game mode, so your project's
stays as it is. Its farmer wears the Third Person template's mannequin where your project has it.

## Where to go next

The harvest and the catch have gone nowhere yet: the plugin hands them to your game's inventory,
which [the first how-to](how-to.md#hand-the-harvest-to-your-inventory) connects. Then:

- [your own crop](how-to.md#grow-a-crop-of-your-own) and [your own fish](how-to.md#add-fish-of-your-own);
- [your day and night cycle](how-to.md#follow-your-own-day-and-night) driving the calendar;
- [saving the farm](how-to.md#save-and-load-the-farm) and [multiplayer](how-to.md#play-it-in-multiplayer).
