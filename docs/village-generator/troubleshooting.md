---
layout: guide
title: "Troubleshooting · Procedural Village Generator"
nav: Troubleshooting
order: 8
permalink: /docs/village-generator/troubleshooting/
description: "Fixes for Procedural Village Generator: a village that doesn't appear, floats or sinks, empty plots, missing buildings, no L-shaped houses, a different village in the game, rivers, your own kit, spawned actors, places and packaging."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start with the village's own view
of itself: in Play, open the console (<kbd>&#96;</kbd>) and type `Village.Debug 1` to see its
buildings, places and areas, and `Village.Roles` for what it has.

## The plugin isn't in the Plugins window

Search for `Village`: it's listed as **Procedural Village Generator**. If it isn't there, it isn't
installed to this engine version: it supports 5.6, 5.7 and 5.8 ([Install](install.md)).

## Nothing appears when I place the village

- **Build in Editor is off.** Tick it, or click **Generate** in the village's **Details**.
- **No type or kit.** If you set **Type** or **Kit** to an asset that's since been deleted, the
  village has nothing to build from, and the Output Log says "has no village type or kit to build
  from". Clear the field to use the plugin's.
- **You're inside it.** A village is 200 m across. Press <kbd>F</kbd> with it selected to frame it.

## The village floats, sinks or stands on nothing

The village reads the ground under it as it builds: everything that blocks its **Ground Type**
(World Static).

- **The ground came after the village.** Click **Generate** on the village once your landscape
  or floor is there.
- **No ground under part of it.** Where nothing is under it, it builds at its own height. The
  default village with its woods covers 240 m square; give it ground that size, or lower the
  type's **Extent**.
- **The ground doesn't block World Static.** A landscape or mesh with its collision off, or on
  another object type, isn't seen. Turn its collision on, or set the village's **Ground Type**
  to its type.
- **A roof or bridge of yours above it.** The village reads the highest thing it hits. Move it
  out of the way while building, then [bake](how-to.md#bake-a-village-to-actors) or move it back.

## Some plots are empty, or the village is small on my landscape

A house stands level on a foundation, and the kit's **Foundation Depth** (1.55 m) is as far as a
foundation reaches. Where the ground falls more than that across a plot, the plot stays empty.
On a hillside, place the village on the flatter part, try other seeds, or use a kit with deeper
foundations.

The edge ring builds on under half its plots by design (its **Density**, 0.45), for a village that
thins out into the fields.

## A building I expected isn't there

- **No room for it.** Each role is placed where it belongs (the inn on the square, the smithy by a
  gate). If no free plot there fits it, that seed has none; `Village.Roles` lists what a seed has.
  Try another seed, make the role's **Where** **Anywhere**, or give it fewer **Modules**.
- **Removed.** A building you removed stays removed through every rebuild. **Clear Edits** brings
  it back.

## There are no L- or T-shaped houses

They're built only when every wall style of the kit has a **Corner In** and every roof style a
**Roof L** and **Roof T** for every span. The stylized kit has them; check yours ([Your own
kit](kit.md#roofs)).

## There's no river, stream, lake or bridge

Version 1 builds villages on dry land and has no water of any kind. To have a river near your
village, make it in your level, and keep the village off it: lay the village
[along your own roads](how-to.md#lay-a-village-along-your-own-roads) on the dry side, or
[remove](how-to.md#move-pin-or-remove-a-building) the buildings that stand in it.

## The game shows a different village from the editor

- **The seed changed in play.** `Village.Seed` and **Set Seed** last until play stops. Set the
  seed in the village's **Details** to keep it.
- **The ground differs.** The village reads its ground as it builds, in the editor and again as
  play begins. Something placed or streamed in differently at play, such as a World Partition
  cell not yet loaded, changes what it reads. Make sure the ground under the village is loaded
  when play begins, or [bake](how-to.md#bake-a-village-to-actors) the village.

## My kit's houses come out wrong

- **Walls stand off the outline or face inward.** A wall's pivot must be at the middle of its
  bottom edge, on the building's outline, and its outside must face +X ([walls](kit.md#walls)).
- **Gaps between walls, or roofs that don't meet.** The kit's **Module**, **Storey** and
  **Spans** must match your meshes' sizes.
- **A style is missing.** Data Validation names every missing piece when you save the kit. A
  piece that's missing is left out of the village.

## Spawned actors aren't there, or are under the ground

- **On a client.** Spawn rules run on the server; your actor needs to replicate for clients to see
  it.
- **The area's name.** **Area** takes an area's name or kind as the village has them: `Village`,
  `Meadow`, `Woods`, `Field`, `Field 2`. `Village.Debug 1` draws them.
- **Sunk in.** Actors are lifted by their collision's half height. An actor whose root is not its
  collision (a scene component with a mesh below) needs its pivot at its feet.

## Two NPCs got the same bed, or none

**Get Home** and **Get Work Spot** claim on the machine that calls them. Call them on the server
only, where your NPCs decide. A claim lasts until it's released, or until a rebuild takes its
place away (**On Claim Lost**): **Release All Places** with an NPC that's gone frees its bed.

## The packaged game has no village, or the console says there's none

- **The plugin isn't in the package** of a Blueprint-only project: see the tip in
  [Install](install.md#use-it-from-c).
- **The game opens another map.** Set **Game Default Map** in **Project Settings > Maps & Modes**
  ([how](how-to.md#ship-a-game-with-a-village)).

## It's slow to build

A village of 50 buildings builds in well under a second on a desktop, but that's a hitch in play.
Tick **Async** so the layout runs on a background thread, or build it in the editor and keep it.
A lower type **Grass** and kit **Grass Distance** draws fewer tufts.
