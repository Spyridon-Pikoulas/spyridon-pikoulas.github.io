---
layout: guide
title: "Concepts · World Map, Minimap & Compass System"
nav: Concepts
order: 5
permalink: /docs/map-minimap-compass/concepts/
description: "How World Map, Minimap & Compass System's parts fit together: regions and their maps, floors, areas, markers and pins, each player's map, the views, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md) and want to plan your own levels.

## Regions: what a map covers

A **Map Region** is a box in the level that has a map. Seen from above its box counts as a
square, the longer side round its middle, and the map is that square's picture. Its **Source**
says where the picture comes from:

| Source | The picture | When to use it |
|---|---|---|
| Captured | shot in the editor by **Capture Map** and saved as a texture beside the level | most levels: it costs nothing at play |
| At Play | shot as play begins, a few seconds, nothing saved | levels made at run time, or while you build |
| Live | a camera above kept running while playing, Photo style only | a small level that changes as it's played |

A Captured map is drawn in its region's **Style**: **Atlas**, the level inked on parchment with
hills shaded, contour lines, outlined shapes and water rings, or **Photo**, the level as it's lit,
from straight above. The Atlas's paper, inks and strengths are the region's **Atlas** settings.
**Capture Map** saves the texture as `<Level>_Map/T_Map_<Id>` beside the level, and remembers the
square it shot: move or resize the region and Data Validation asks you to capture it again.

A level with a Landscape and no region gets one over the Landscape at play, drawn At Play. A
level with neither has no map, and the HUD stays hidden in it, as in a main menu.

## Floors

A region inside another is a **floor** of it: a cave under a valley, a house's upper storey. The
player is in the smallest region holding them, so walking into the cave's box switches the
minimap and the world map to the cave's own map, and walking out switches back. A floor's box sets
its height band: the camera shoots down from its top, so the top goes just under the floor
above, or under the cave's ceiling.

A cave's **Atlas > Underground** setting drops the sun and draws whatever is past its floor as
rock. Walls tagged `MapWall` are shot again from over their tops and drawn solid, where a ceiling
would otherwise hide them. Where the level has a navmesh, the floor a player can reach from a
Player Start is drawn light and inked round its edge, and the rest dark: **Atlas > Walkable** sets
how strongly.

Each map draws the part of the route on its own floor. Where the route leaves the floor, up a
ramp or down a stair, it ends in a ring, and it picks up from a ring on the floor it goes to.
A player on a ramp between two floors stays on the one they came from until they are off it.

## Areas: discovery with a name

A **Map Area** is a box with a name: a village, a lake, a cave's mouth. The first time a player
walks into it they **discover** it: their Player Map's **On Area Discovered** fires, the **Area
Toast** shows its name, the world map writes the name across it, and its whole box is revealed
(**Reveal Whole Area**). Areas are optional; the fog lifts as the player walks either way.

## Markers and pins

A **marker** is a place shown on the maps, the compass and the screen. There are three kinds:

| Kind | What it is | Best for |
|---|---|---|
| **Marker** component | on any actor, moving with it | NPCs, chests, a quest giver, a vehicle |
| **Map Marker** actor | a marker standing alone in the level | waystones, views, places with nothing else there |
| **Pin** | data only, no actor: a location, a label, an icon | game data in bulk (farm plots, quest goals), and the player's own pins |

Each has an **Icon** (a white glyph on transparency, drawn on a badge of its **Color**), a
**Label**, a **Category** that the world map's legend filters by, and a **Priority** that draws it
over others. Each view shows it or not, by its **On World Map**, **On Minimap**, **On Compass**
and **On Screen** and their ranges.

**World pins** are added by game code to the Map subsystem and every player sees them. **Player
pins** are a player's own, placed with a right-click on the world map or by **Add Pin** on their
Player Map; a **Shared** one is seen by their team too. A **ping** points a place out to the team
for a few seconds.

## The player's map

Each player has a **Player Map** component on their controller, added as it spawns, before its
**Begin Play** (add your own to the controller Blueprint to set it up). It holds everything that
is theirs:

- their **discovery**: a grid of cells over each region, a bit each, set within **Reveal Radius**
  (30 m, or the region's own) of where they walk; the region's **Fog** shows the rest dimmed, hidden as blank paper, or
  not at all;
- the **areas** they discovered;
- their **pins**, and their **team**, for shared pins and pings;
- what they **track**: one marker or pin, lit on the compass, held at the minimap's rim, with a
  **route** to it from the navmesh, kept off the walls it turns past, or a straight line where there's none.

## The views

The plugin draws six widgets, each a plain UMG widget you can place in your own Widget Blueprint:

| Widget | Shows |
|---|---|
| **Minimap** | the map round the player, round or square, turning with the camera or north up; markers, pins, the route, the fog |
| **Compass Bar** | the bearings ahead, each marker's bearing and distance, close ones stacked with a count, the tracked one lit |
| **World Map** | the whole region framed: labelled markers, the player, the route, the legend, tooltips, pins and pings |
| **Glints** | a twinkling star over each thing the player can use, within its range and in sight |
| **Screen Markers** | markers over their places in the view, or at the screen's edge pointing the way |
| **Area Toast** | an area's name on a ribbon as it's discovered |

The **Map HUD** lays them out: the compass at the top, the minimap at the top right, the world map
over the dimmed game when it's open. The plugin puts one on each local player's screen; the
settings turn it off or swap in your own ([your own screen](how-to.md#lay-out-your-own-screen)).

## Multiplayer

The server owns what is a player's: it reveals their fog as their pawn moves and keeps their
pins, and each player's machine gets only their own. Calls made on a client (**Add Pin**, **Load
Map**) go to the server. Shared pins and pings go to the players of the same **Team** alone.

| Runs on | What |
|---|---|
| The server | discovery (**Reveal At**, **Reveal Region**, **Discover Area**, **Reset Discovery**), pins kept, areas found |
| The owning player's machine | tracking, the views, **On Region Changed**; the route is found on the server, where the navmesh is, and sent back |
| Both | **On Area Discovered**, the player's pins as replicated |
| Every machine | regions, areas, markers and world pins: each machine has its own, from its level or its game code |

Markers aren't replicated themselves. A Marker component on a replicated actor shows wherever that
actor exists; world pins added on the server alone stay there, so add them on every machine.

## Save

**Save Map** on the Player Map gives a **Map Save**: each region's discovery under its region's
**Id**, the areas found, the player's pins and what they track. Put it in a variable of your own
save game; **Load Map** gives it back, on the server, asked from a client in multiplayer. A
region's discovery is its **Fog Cells** squared in bits: 2 KB at the default 128, 8 KB at most.
Keep a region's **Id** once players have saved: their discovery is found by it.
