---
layout: guide
title: "Quickstart · World Map, Minimap & Compass System"
nav: Quickstart
order: 3
permalink: /docs/map-minimap-compass/quickstart/
description: "Fifteen minutes from installing World Map, Minimap & Compass System to a minimap, a compass and a world map of your own Unreal level, with a marker, a named area, fog and a tracked route."
---

# Quickstart: a map of your own level

Fifteen minutes from an installed plugin to a minimap, a compass and a world map of your level.
You place a region over the level and capture its map, then a marker on a lookout and a named
area, and play: the compass points to the lookout, the fog lifts as you walk, and the world map
tracks the lookout and takes your pins. No Blueprint graph is needed.

The steps use the **Third Person** template's level with the plugin enabled ([Install](install.md)).
In your own level, size the boxes to it instead.

## 1. Place a Map Region

A Map Region is the box its map covers.

1. Open **Window > Place Actors**, search for `Map`, and drag **Map Region** into the level.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for Map, listing Map Area, Map Marker and Map Region." caption="The plugin's three actors in **Place Actors**." %}

2. In its **Details**, set:

    | Field | Value |
    |---|---|
    | Location | `0`, `0`, `0` |
    | Box Extent (under **Shape**) | `2000`, `2000`, `500` |
    | Id | `Arena` |
    | Title | `The Arena` |
    | Reveal Radius (under **Discovery**) | `800` |

    The box now holds the template's 40 m square floor and its walls. Its top, 5 m up, is where
    the map is shot from. The fog lifts 8 m round the player here, rather than the 30 m an open
    world wants.

## 2. Capture its map

1. Click **Capture Map** at the top of the region's **Map** settings. It takes a few seconds.

    {% include figure.html src="region.png" alt="The Map Region's Details: Location 0, 0, 0, Box Extent 2000, 2000, 500, then the Map settings with the Capture Map button, Id Arena, Title The Arena, Source Captured, Style Atlas and Resolution 2048." caption="The region's **Details**: its box, and **Capture Map** over its settings." %}

2. Save the level (<kbd>Ctrl</kbd>+<kbd>S</kbd>).

The map is saved as `ThirdPerson/Lvl_ThirdPerson_Map/T_Map_Arena`, and the region's **Image**
(under **Captured**) now holds it. It is drawn in the **Atlas** style: the level inked on
parchment. Change the region's **Style** or its **Atlas** settings and click **Capture Map** again
to see another look.

## 3. Place a marker

1. From **Place Actors**, drag a **Map Marker** onto the block in the north-west corner, and set
   its **Location** to `1650`, `-1500`, `200`: the block's top.
2. In its **Details**, set:

    | Field | Value |
    |---|---|
    | Icon | `T_Icon_Tower` |
    | Label | `Lookout` |
    | Category | `Places` |
    | On Screen | ticked, under **Show** |

    {% include figure.html src="marker.png" alt="The Map Marker's Details: Location 1650, -1500, 200, Icon T_Icon_Tower, Label Lookout, Category Places, and On Screen ticked under Show." caption="The marker, shown on the maps, the compass and the screen." %}

The icon picker lists the plugin's fourteen icons; any white glyph on transparency of yours works
too.

## 4. Place a Map Area

An area is a named place the player discovers.

1. Drag a **Map Area** into the north-east corner, and in its **Details** set:

    | Field | Value |
    |---|---|
    | Location | `1500`, `1500`, `200` |
    | Box Extent (under **Shape**) | `500`, `500`, `300` |
    | Id | `NorthSteps` |
    | Display Name | `North Steps` |

    {% include figure.html src="area.png" alt="The Map Area's Details: Location 1500, 1500, 200, Box Extent 500, 500, 300, Id NorthSteps, Display Name North Steps, and Reveal Whole Area and Name on Map ticked." caption="The area: its whole box is revealed when it is found." %}

2. Save the level.

## 5. Play

Press **Play**.

1. The compass bar is at the top and the minimap at the top right; the minimap turns as you turn
   the camera.
2. Walk to the north-east corner, ahead and to your right, up the steps. As you enter the area its
   name comes up: **North Steps**. Turn left, to the west: the Lookout is ahead over its block, and
   the compass shows it with its distance.

    {% include figure.html src="toast.jpg" size="wide" alt="The game: the compass bar at the top with the Lookout's tower icon and its distance, the North Steps toast under it, the minimap at the top right, and the Lookout's marker over its block." caption="The compass, the minimap, the Lookout on screen, and the area discovered." %}

    {% include figure.html src="compass.jpg" size="wide" alt="The compass bar up close: SW, W and NW along it, the Lookout's tower icon at W with 30 m under it, and the notch at the top marking where the camera faces." caption="The compass bar up close: the Lookout to the west, 30 m away." %}

3. Press <kbd>M</kbd> (**Menu** on a gamepad). The world map opens on you; scroll the mouse wheel
   to see the whole arena. Where you've walked is drawn, the rest is blank paper, and North Steps
   is written across its corner.
4. Click the **Lookout**: it is now tracked. A line leads to it on the map and the minimap, and
   the compass lights it.
5. Right-click an empty spot and pick the **Flag**: a pin of your own.

    {% include figure.html src="map.jpg" alt="The world map of The Arena on parchment: the middle and the north-east corner drawn where the player walked, the rest blank, North Steps written in the corner, the Lookout in the north-west with a dashed line to it from the player's arrow, and a Flag pin." caption="The world map: fog, the area, the tracked Lookout and a pin." %}

6. Press <kbd>M</kbd> or <kbd>Esc</kbd> to close it.

On a gamepad the left stick moves the cursor and the right one pans, the triggers zoom, **A**
clicks, **X** pins and **B** closes.

To watch it as you play, press <kbd>'</kbd> (apostrophe) for the Gameplay Debugger: its **Map**
category shows your region, how much of it you've revealed, the areas you've found, your pins and
what you track. In the console (<kbd>&#96;</kbd>), `Map.Reveal` reveals the whole map and
`Map.Reset` forgets it.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's Map category: region Arena, the Arena 100% revealed after Map.Reveal, North Steps found, one pin of the player's own, and the Lookout tracked with a route of 2 points." caption="The Gameplay Debugger's **Map** category, after `Map.Reveal`." %}

If something doesn't happen as written, [Troubleshooting](troubleshooting.md) has each step's
usual cause.

## Next

- [Point the player at a quest's goal](how-to.md#point-the-player-at-a-quests-goal).
- [Save the map with your game](how-to.md#save-the-map-with-your-game).
- [Concepts](concepts.md): regions, floors, areas, markers and each player's map.
