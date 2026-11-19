---
layout: guide
title: "Quickstart · Procedural Village Generator"
nav: Quickstart
order: 3
permalink: /docs/village-generator/quickstart/
description: "Ten minutes from installing Procedural Village Generator to a village in a new Unreal level: ground for it, the village placed and given a seed, then played, its places and areas drawn and another seed tried."
---

# Quickstart: a village in your level

Ten minutes from an installed plugin to a village you walk through. You make a level, give it
ground, drop a village on it and pick a seed. No Blueprint graph is needed.

The steps use a new **Basic** level in any project with the plugin enabled ([Install](install.md)):
the **Third Person** template's, for its character to walk round with. In a level of your own,
put the village on your landscape instead.

## 1. Make a level with room for a village

1. Pick **File > New Level**, choose **Basic** and click **Create**. Save it (<kbd>Ctrl</kbd>+<kbd>S</kbd>)
   as `L_Village` in a `Maps` folder.
2. A village with its fields and woods fills about 240 m square, and the Basic level's floor is
   80 m. Select **Floor** in the Outliner and, in its **Details**, set **Scale** X and Y to `30`,
   leaving Z as it is. The floor is now 300 m across.

    {% include figure.html src="floor.png" alt="The Floor's Details: Location 0, 0, -0.5; Rotation 0, 0, 0; Scale 30, 30, 8; Mobility Movable." caption="The Basic level's floor, scaled out to 300 m." %}

## 2. Place a village

1. Open **Window > Place Actors** and search for `Village`. Drag **VG Village** into the level.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for Village, listing VG Village." caption="**VG Village** in **Place Actors**." %}

2. In its **Details**, set **Location** to `0`, `0`, `0`. The village builds round it in a second
   or so: roads, houses, the square, fields and woods, on the floor below.
3. Set **Seed** to `42`. The village builds again, a different one: 36 buildings round a square,
   the church beside it.

    {% include figure.html src="details.png" alt="The VG Village's Details: its Village section with the Bake To Actors, Clear, Clear Edits, Generate and Unbake buttons, Type and Kit empty, Seed 42, no Roads, Async off, Build in Editor and Collision ticked." caption="The village's own settings. **Type** and **Kit** empty use the plugin's." %}

4. Save the level.

Any whole number is a seed, and each builds its own village. Try a few, and keep the one you like.

## 3. Play

Press **Play**. You stand on the village square, where the player start is. Turn round to find the
church.

{% include figure.html src="square.jpg" size="wide" alt="The game: the third person character by the well on a cobbled square, a bench, a cart and market stalls to its left, half-timbered houses round it and the church's spire above them." caption="The square, seed 42, turned toward the church." %}

1. Open the console (<kbd>&#96;</kbd>) and type `Village.Debug 1`. Over the village, each
   building's box and its role, each place where someone can sleep, work, sit or trade, and
   the areas' outlines are drawn. A place is green while free and red once claimed.

    {% include figure.html src="debug.jpg" size="wide" alt="The village from above with Village.Debug on: cyan boxes round the buildings labelled with their role and number (Home, Inn, Church, Bakery, Smithy, Farm), small green spheres labelled Sleep, Work, Sit, Door, Read and Gather, and a circle round the square." caption="`Village.Debug 1`: what your game can read of the village." %}

2. Type `Village.Debug 0`, then `Village.Roles`. On screen and in the Output Log, it lists the
   village's buildings by role (for seed 42: Inn 1, Church 1, Smithy 1, Bakery 1, Farm 2, Home 30)
   and its places by kind, each with how many are held.

3. Type `Village.Seed 7`. Another village is built where you stand.

    {% include figure.html src="seed-7.jpg" size="wide" alt="Another village from above, seed 7: its roads cross differently, more houses round the square, and fields on another side." caption="`Village.Seed 7`: the same rules, another village." %}

The seed you type in Play lasts until you stop. To keep it, set it in the village's **Details**.

If something doesn't come out as written, [Troubleshooting](troubleshooting.md) has the usual
causes.

## Next

- [Lay the village along your own road](how-to.md#lay-a-village-along-your-own-roads).
- [Give your NPCs homes and work](how-to.md#give-npcs-a-home-and-a-workplace).
- [Make a village type of your own](how-to.md#make-a-village-type-of-your-own).
- [Concepts](concepts.md): seeds, types, rings, roles, places and areas.
