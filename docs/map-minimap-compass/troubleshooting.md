---
layout: guide
title: "Troubleshooting · World Map, Minimap & Compass System"
nav: Troubleshooting
order: 8
permalink: /docs/map-minimap-compass/troubleshooting/
description: "Fixes for the usual problems with World Map, Minimap & Compass System: no minimap, M does nothing, a blank or misplaced map, fog, routes, caves, the mouse after closing the map, saves, multiplayer and World Partition."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start a check with the Gameplay
Debugger (<kbd>'</kbd> in Play): its **Map** category shows the player's region, how much is
revealed, the areas found, the pins and what is tracked. In the console (<kbd>&#96;</kbd>),
`Map.Markers` lists every region, area and marker in the Output Log.

## The plugin isn't in the Plugins window

Search for `Minimap` or `Compass`: the plugin is listed as **World Map, Minimap & Compass
System**. If it still isn't there, it isn't installed to this engine version
([Install](install.md)).

## There's no minimap or compass

- **The level has no map.** The HUD shows only where there is one: a **Map Region**, or a
  Landscape, which gets a region at play. Place a region ([Quickstart](quickstart.md#1-place-a-map-region)).
- **Show HUD is off**, under **Project Settings > Plugins > Map, Minimap & Compass**. Then the
  plugin's screen is yours to place ([your own screen](how-to.md#lay-out-your-own-screen)).
- **Your own HUD covers it.** Raise **HUD Z Order** in the settings, or lower your widget's.

## M does nothing

- **Your own input takes M first.** A mapping context of yours with a priority above the plugin's
  (1) and <kbd>M</kbd> mapped consumes the key. Change one of the two keys, or set **Map Keys** in
  the settings.
- **The player isn't on Enhanced Input.** Every project made from Epic's templates is; an older
  project needs **Default Player Input Class** set to **EnhancedPlayerInput** under **Project
  Settings > Engine > Input**.
- **Map Keys is empty** in the settings. Then only your own call to **Toggle World Map** opens it.
- **Your game is in a UI-only input mode**, such as a menu's. Keys reach the game in **Game Only**
  or **Game and UI**.

## The map is blank, grey or old

- **Capture Map wasn't clicked**, or the level wasn't saved after it. A region whose **Source** is
  **Captured** has no picture until then; **Data Validation** and **Map Check** say so.
- **Something covers the level from above**: a roof, a ceiling, a sky mesh inside the box. The map
  is shot from the box's top down, so lower the top under it, or leave the mesh out of the box.
- **The level changed since.** Click **Capture Map** again; a Captured map is a texture and
  doesn't follow the level by itself.
- **Source is At Play** and play has just begun: it takes a few seconds to draw.

## The map is in the wrong place

The region was moved or resized after its capture, so the picture no longer fits its box. Saving
the level, **Data Validation** names the region: click **Capture Map** again.

## The map is blank paper where I haven't been

The region's **Fog** is **Hidden** by default: only what the player has walked within **Reveal
Radius** of is drawn. Set **Fog** to **Dimmed** to show the rest darkened, or **Off** for no fog.
The region's own **Reveal Radius**, when set, is how far round the player it lifts.
Discovery happens on the server as the pawn moves, so a pawn moved by setting its location every
frame on a client isn't seen. `Map.Reveal` reveals everything, to check the map itself.

## The route is a straight line

Routes follow the navmesh, and the level has none: place a **Nav Mesh Bounds Volume** over the
walkable ground and press <kbd>P</kbd> in the viewport to see it. Without one the route is a
straight line to the target. In multiplayer the route is found on the server, so its navmesh is
the one that counts.

## A cave's map shows the ground above

- **The cave's region reaches above its ceiling.** Lower its box's top just under the ceiling, and
  click **Capture Map** again.
- **The walls don't show.** Tag them `MapWall` (**Details > Actor > Tags**): they are drawn solid
  even under a ceiling.
- **It's drawn sunlit.** Tick **Atlas > Underground** on the cave's region.

## A cave's floor and its rock look alike

The floor is told from what's blocked by the navmesh. Without one in the cave the map guesses
from the shapes: build it, check its floor is reachable from a Player Start (press <kbd>P</kbd>),
and click **Capture Map** again. **Atlas > Walkable** sets how strongly they stand apart.

## The map doesn't switch in a cave

The player is in the smallest region holding them, by its box. Check that the cave's region holds
where the player stands, its height included: the Gameplay Debugger names the region they are in.

## The mouse stays after closing the map

The Map HUD sets **Game Only** input when the map closes, as a game without a cursor wants. If your
game keeps a cursor or a UI input mode of its own, turn **Manage Input Mode** off in the settings
and set the input mode yourself on **On World Map Shown**.

## Discovery is lost after loading

- **The region's or area's Id changed** since the save ([Save](concepts.md#save)).
- **Load Map ran before the player's map existed.** Call it once the player is in the level, from
  the controller's **Begin Play** or later.

## Multiplayer

- **A player's pin doesn't reach the others.** Only a pin with **Shared** ticked does, and only to
  the players of the same **Team**: set **Team** on each Player Map, on the server.
- **World pins show only on the server.** Each machine has its own
  ([Multiplayer](concepts.md#multiplayer)).
- **A client's fog doesn't lift.** The server reveals it from the pawn it sees, so the pawn must be
  possessed and replicate its movement, as Epic's characters do.

## Questions

- **Can I paint my own map?** Yes: set a region's **Source** to **Captured** and give **Image** your
  texture, square, covering the region's square with north up.
- **Does it work in a top-down or 2.5D game?** Yes: the maps read the level from above, whatever the
  camera. A minimap with **Turn With Camera** off keeps north up.
- **Does it work with World Partition?** Yes. **Capture Map** loads the level's cells a tile at a
  time as it draws, so the map holds the whole level. Map Regions, Map Areas and Map Marker actors
  are never unloaded, so the map, its fog and those markers hold from anywhere. A **Marker**
  component comes and goes with its actor's cell: for a place the map should always show, place a
  Map Marker or turn the actor's **Is Spatially Loaded** off. **At Play** and **Live** maps see only
  the cells loaded at the time, so give a World Partition level's regions **Captured**.
- **How many markers can I have?** Each view draws all its markers itself, without a widget each:
  thousands of pins cost little. Hide the far ones with each marker's ranges.
