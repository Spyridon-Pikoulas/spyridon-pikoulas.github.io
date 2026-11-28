---
layout: guide
title: "Changelog · World Map, Minimap & Compass System"
nav: Changelog
order: 9
permalink: /docs/map-minimap-compass/changelog/
description: "Each version of World Map, Minimap & Compass System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.3

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- **Big worlds**: a region's **Detail Levels** (2 or 3) captures the map again in tiles at twice
  and four times its resolution, which the minimap and the world map load as they zoom in and let
  go after. [Map a big world](how-to.md#map-a-big-world) has the sizes.
- **Capture Map** in a World Partition level loads each part of the level as it shoots it.
- **Capture Map As** captures a second style beside the region's own, with its tiles, and **Set Map
  Image** takes the tiles with the picture.
- **Check Map Setup** names a region whose tiles no longer match its box or its settings.
- Areas' names on the world map are written light on a dark edge, so they read over any ground, and
  a Map Area's **Name Scale** sets its name's size. A marker named as the area it is in shows its
  icon alone, the place named once (the world map's **One Name Per Place**, on).
- The **trail** on the ground is light arrows pointing the way, drawn from just ahead of the player
  and faded out at its end. **Trail Look**, in the settings and on the Player Map, lays them on a
  band of the HUD Style's **Trail** colour instead. A Trail Material gets **Here**, where along it the
  player stands, and **Band**, 1 for the band.
- Tested with the engine's dedicated server mode: two clients, each with its own fog, team pins
  shared.

## 1.2 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- **A trail on the ground** to what the player tracks, off until you turn it on: a soft ribbon along
  the route, its corners rounded, over hills, fading at its ends, in the HUD's colour. **Show Trail**
  in the settings turns it on for every player, the Player Map's for one.
- **Route Filter** on the Player Map: the navigation filter the route is found with, to keep it to
  your roads.
- **Teammates** on each other's minimap, world map and compass, in their team's colour
  (**Team Colors** in the settings).
- **Secret places**: a marker's **Discovery** is **Unknown** (a ? till found) or **Hidden** (not
  shown till found). What a player found is saved with their map.
- **Markers that move**: a marker's or a pin's **Animation** (Pulse, Flash, Spin, Bounce), and
  **Flash Marker** for a while when a quest updates there.
- **HUD Styles**: the views' colours, frames, badges, icons and font in one asset. **Parchment**
  is the default, **Clean** a second, and you can make your own.
- **Your own map art**: a region's **Source** can be **Own Image**, which **Capture Map** never
  overwrites, and **Set Map Image** swaps the picture at play.
- **Check Map Setup** (**Tools** menu): what the level lacks for its maps, and how to fix each.
- The map's line of keys shows the gamepad's buttons once a gamepad is used, and names your own close keys through the Map HUD's **Get Close Keys**.
- Fixed: a tracked marker above the view showed twice at the top, on the compass and held at the
  screen's edge under it. The compass alone shows it now.
- The demo: <kbd>L</kbd> or the D-pad's left switches between the two looks, <kbd>T</kbd> or the
  left bumper lays a trail to the tracked notice board along the roads, the old stones are a ? till found, the controls
  card holds the general keys and the map its own, and the guide on <kbd>G</kbd> has pages on secret places, the trail
  and the looks.

Nothing to change on updating. The trail is off until you tick **Show Trail**; teammates are on
by default: untick **Show Teammates** on the Player Map if you don't want them.

## 1.1 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The demo only; the plugin's code is as
in 1.0.

- The demo's controls card on <kbd>I</kbd>, and a guide on <kbd>G</kbd> or the D-pad's right: eight
  pages on the map, the minimap and compass, fog, tracking, pins, waystones, floors and saving.
- <kbd>Space</kbd> no longer jumps behind the open world map.
- The village's houses: chimneys through their roofs, glass in the windows, and the stone house's
  stones apart, where they flickered.

Nothing to change on updating.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- Map Regions with maps captured in the editor in the Atlas or Photo style, drawn at play, or live;
- floors: a region inside another, with an Underground style for caves that sets the walkable
  floor apart from the rock, and the route drawn on each floor alone;
- the minimap, the compass bar, the world map, markers on screen and the area toast, laid out by
  the Map HUD or placed in your own Widget Blueprint;
- each player's fog of war, named areas to discover, and reveal and reset nodes;
- glints over what the player can use, on or off per thing or for the whole game;
- Marker components, Map Marker actors and pins, the player's own pins, team pins and pings;
- tracking with a route on the navmesh, and fast-travel markers;
- replication, and save into your save game;
- the Gameplay Debugger's **Map** category and the `Map.*` console commands;
- the demo valley.
