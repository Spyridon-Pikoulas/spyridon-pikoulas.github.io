---
layout: guide
title: "Reference · Procedural Village Generator"
nav: Reference
order: 7
permalink: /docs/village-generator/reference/
description: "Every setting, Blueprint node, event, data asset field, PCG node and Village console command of Procedural Village Generator."
---

# Reference

Every setting, node and command of Procedural Village Generator. The [quickstart](quickstart.md)
walks through a first village, [Concepts](concepts.md) explains the words, and the
[how-tos](how-to.md) answer the common tasks. Distances are in centimetres.

## VG Village

An actor: **Place Actors > VG Village**. It builds a village round its location from its type,
kit and seed. In C++, `AVGVillage` in `VGVillage.h`.

| Field | Default | What it is |
|---|---|---|
| Type | none | The [village type](#village-type). None uses the plugin's `DA_VG_Village`. Replicated when it is an asset. |
| Kit | none | The [kit](kit.md). None uses the plugin's `DA_VG_StylizedKit`. |
| Seed | 7 | Which of the type's villages. Replicated and saved. |
| Roads | none | Road splines to lay the village along: each entry's **Actor** (every Spline component on it), **Width** (450) and **Main**. None grows its own roads. |
| Async | off | In play, lay out on a background thread; **On Generated** says when it's built. |
| Build in Editor | on | Build in the editor as it's placed and changed. |
| Collision | on | Collision on the buildings and the larger props. |
| Ground Type | World Static | The object type the ground is read off. |
| Ground Step | 200 | How far apart the ground is read. |
| Pinned | none | The buildings kept as they are ([edits](#edits)). Replicated and saved. |
| Cleared | none | The ground kept clear of buildings, trees, props and grass. Replicated and saved. |
| Spawn Rules | none | Actors spawned as play begins: each entry's **Class**, **Area** (a name or kind, `Village` by default) and **Count**. |
| Glint Places | none | Places of these kinds get a [VG Glint](#vg-glint) in play (`Read`, for the notice board). |
| Glint Offset | 95, 0, 200 | Where a place's glint sits, in the place's frame: X ahead of whoever stands there. |
| Debug | off | Draws the buildings, places and areas over the village, in the editor and in play, a Shipping game's too; their labels in a development build only. |
| Baked | off | Read only: baked to actors, not drawn. |

**Seed**, **Type**, **Kit** and **Async** are pins on **Spawn Actor from Class**, so a village
spawned in play builds once, from them.

The buttons in its **Details**:

| Button | What it does |
|---|---|
| Generate | Builds the village again. |
| Clear | Removes what it drew. |
| Clear Edits | Forgets every pin, move and removal, and builds again. |
| Bake To Actors | Turns the village into plain actors, an actor a building and one a 64 m cell for the rest, in the Outliner folder `<village>_Baked`. The village stays for its places and areas, not drawn. |
| Unbake | Deletes the baked actors and draws the village again. |

What it holds once built, read only:

| Field | What it is |
|---|---|
| Buildings | Every [building](#vg-building), in the village's space. |
| Places | Every [place](#vg-place), in the world's space. |
| Areas | Every [area](#vg-area), in the world's space. |
| Laid Roads | Every road as laid out: its **Points** on the ground, **Width** and **Main**, in the world's space. |

### Building and its events

| Node | What it does |
|---|---|
| Generate | Builds the village now. |
| Generate Async | Builds it with the layout on a background thread; **On Generated** fires when it's done. |
| Set Seed (New Seed) | Sets the seed and builds again, async if **Async** is on. |
| Set Type (New Type, New Seed) | Sets the type, and the seed with it (-1, the default, keeps the seed), and builds again: a hamlet for a market town. |
| Clear | Removes what it drew. |
| Is Generated, Is Generating | Whether it's built, and whether an async build is under way. |
| Get Instance Count | Meshes drawn, every instance. |
| Set Debug (On) | Turns the debug drawing on or off. |
| On Generated (Village) | Fires each time the village is built. |
| On Claim Lost (Village, Claimer, Place) | Fires for each claim a rebuild or **Clear** drops, with the place as it was, before **On Generated**: the new places are there to claim. |

### Buildings

| Node | What it does |
|---|---|
| Get Buildings Of Role (Role Name) | Every building of a role. |
| Find Building (Id, Building) | A building by Id. False if there's none. |
| Find Building At (Location, Building) | The building standing at a world location. |
| Get Building Transform (Id) | Its floor's world transform at the body's middle, its front (+X) to the road. |

### Places

| Node | What it does |
|---|---|
| Find Places (Kind, Role Name, Free Only) | Places of a kind; of a role's buildings when given one (`Square` for the square's); only free ones when ticked. |
| Find Nearest Place (Kind, Location, Free Only, Place) | The nearest place of a kind to a location. |
| Claim Place (Index, Claimer) | Holds the place for the claimer, if it's free or already theirs. |
| Release Place (Index) | Frees it. |
| Release All Places (Claimer) | Frees every place the claimer holds. |
| Get Claimer (Index) | Who holds it, or none. |
| Get Claimed Places (Claimer) | The places the claimer holds, at their **Index** now. |
| Get Home (Resident, Place) | The **Sleep** place the resident holds, or the nearest free one, now claimed for it. |
| Get Work Spot (Worker, Role Name, Place) | The same for a **Work** place, at a role's building when given one. |

Claims live on the machine that makes them, and aren't saved: make them on the server. A rebuild
keeps those whose place still stands ([Places](concepts.md#places)).

### Areas

| Node | What it does |
|---|---|
| Find Area (Name, Area) | An area by name. |
| Is In Area (Name Or Kind, Location) | Whether a location is in an area of that name or kind. |
| Get Areas At (Location) | The names of every area at a location. |
| Random Point In Area (Name Or Kind, Point, Random Seed) | A point on the ground in such an area, off the buildings and roads. A **Random Seed** of -1 gives a new point each time. False if none was found. |
| Distance To Road (Location) | How far a location is from the nearest road's edge; negative on a road. |

### Edits

Each edit builds the village again round it.

| Node | What it does |
|---|---|
| Pin Building (Id) | Keeps the building as and where it is. |
| Unpin Building (Id) | Lets it go back to the layout. |
| Move Building (Id, Transform) | Moves it to a world transform, level on the ground there, and pins it. |
| Remove Building (Id) | Removes it and keeps its ground clear. |
| Clear Edits | Forgets every edit. |
| Make Save Data | The seed and edits, as [VG Save Data](#vg-save-data). |
| Apply Save Data (Data) | Sets the seed and edits and builds again. |

## Library

| Node | What it does |
|---|---|
| Find Village (Location, At Location) | The world's first village, or with **At Location** ticked the one whose ground holds the location. |
| Get Place Kinds | The kinds the layout makes: Sleep, Work, Sit, Read, Trade, Gather, Door. |

## VG Glint

A component: the small sparkle on what the player can use, shown while the player's view is within
**Range**. Add it to any actor (**Add > VG Glint**).

| Field | Default | What it is |
|---|---|---|
| Glint On | on | **Set Glint On** turns this one off and on. |
| Range | 1200 | How near the player's view comes before it shows. |
| Size | 24 | |
| Color | warm white | |

**Is Glint Shown** says whether it shows now. The game's **VG Glints** subsystem has **Set Glints
Shown** and **Are Glints Shown**, for every glint at once. **Project Settings > Plugins > Village
Generator** has **Glints** (shown as play starts, on by default) and **Glint Material**.

## Structures

### VG Building

| Field | What it is |
|---|---|
| Id | Unique in its village, and kept by a pinned building. |
| Role | `Home`, `Inn`, `Church`... |
| Transform | Its ground floor at the body's middle, its front (+X) to the road, in the village's space. |
| Shape | **Rect**, **L**, **T** or **Landmark** (a nave with a tower). |
| Span | Its width, between its eave walls' middles. |
| Modules | Its length along the ridge. |
| Wing Modules, Wing At, Wing Side | An L's or T's wing: its length, which end or where, and front or back. |
| Storeys | 1 or more. |
| Wall Styles | The kit's wall styles, the ground storey's first; the last goes on up. |
| Roof | The kit's roof style. |
| Seed | Picks its windows, door, chimney and canopy. |
| Pinned | Kept through rebuilds. |
| Prefab | Its role's prefab mesh or actor in place of modules. |
| Extent, Offset | Half its footprint's box, and the box's middle off **Transform**. |
| Places | Its places' indexes in the village's **Places**. |

### VG Place

| Field | What it is |
|---|---|
| Index | Its index in the village's **Places**, for **Claim Place** and the like. |
| Kind | Sleep, Work, Sit, Read, Trade, Gather, Door, or a kind of your own. |
| Transform | Where it is in the world, facing the way one stands there. |
| Building | Its building's Id, or -1 for the square's. |
| Role | Its building's role, or `Square`. |

### VG Area

| Field | What it is |
|---|---|
| Name | `Village`, `Core`, `Square`, `Meadow`, `Field 1`, `Woods 1`... |
| Kind | Village, Core, Square, Field, Meadow or Woods. |
| Shape | **Circle**, **Ring** or **Box**. |
| Center | In the world, on the ground. |
| Yaw | A box's turn. |
| Extent | A circle's or ring's radius in X; a box's half sides. |
| Inner | A ring's inner radius. |

### VG Save Data

**Seed**, **Pinned** and **Cleared**: what makes a village again, for a variable in your save game.

## Village type

A **VG Village Type** data asset. The plugin's is `DA_VG_Village`; its values are the defaults
below.

| Field | Default | What it is |
|---|---|---|
| Radius | 9500 | Houses stand within this of the square, the most; each seed's outline reaches less far some ways. At least 2000. |
| Extent | 12000 | Fields, meadow and woods reach out to this: half a side of the square the village fills. Not less than Radius. |
| Square Radius | 1250 | The market square's; 0 has none. |
| Main Roads | 2 | With no road splines: the fewest roads out of the square. A seed has this to twice as many, the two most nearly opposite running through as the main road. 1 to 4. |
| Lanes | 3 | Lanes between neighbouring roads, one more or less by seed. 0 to 8. |
| Main Road Width | 480 | |
| Lane Width | 300 | |
| Bend | 0.12 | How far grown roads bend off straight, a share of the radius. 0 to 0.5. |
| Rings | Core, Middle, Edge | The houses, from the square out ([rings](#rings)). |
| Default Role | `Home` | The role of a building no rule takes. |
| Default Places | Sleep 2 inside, Sit 1 front, Work 1 yard | A home's places. |
| Roles | Inn, Church, Smithy, Bakery, Farm 2 | The buildings placed before the homes, in this order ([roles](#roles)). |
| Stalls | 8 | Market stalls round the square, at most. |
| Lamp Spacing | 1700 | A lamp every so far along the main roads; 0 has none. |
| Fields | 6 | Fields, two more or less by seed, together on a side or a few. |
| Field Patch | 800 | A field patch's side. |
| Crops | Wheat, Wheat, Corn, Cabbage, Pumpkin | The kit's crops for fields and beds; a name twice is twice as likely. |
| Trees | 220 | Trees per 100 m square in the groves. |
| Woods | 2400 | The pine woods' depth at the rim; 0 has none. |
| Grass | 2.4 | Grass tufts per square metre of open ground, at their thickest. 0 to 20. |
| Flowers | 0.08 | The share of tufts in flower. |

### Rings

| Field | Core / Middle / Edge | What it is |
|---|---|---|
| Reach | 0.44 / 0.82 / 1.0 | Out to this share of the radius. |
| Density | 1.0 / 0.8 / 0.45 | How likely a free plot gets a house. |
| Gap | 30-120 / 180-450 / 180-450 | The gap between neighbours along a road, least and most. |
| Modules | 3-5 / 2-4 / 2-3 | Modules along the ridge, least and most. |
| Spans | 600, 600, 800 / 400, 600, 600 / 400, 600 | The kit's spans, picked from. |
| Two Storeys | 0.8 / 0.35 / 0 | How likely a house has two storeys. |
| L Shaped, T Shaped | 0.2, 0.1 / 0.2, 0.1 / 0.25, 0.05 | How likely a house is an L or a T, where the kit has the pieces. |
| Ground Walls | Stone, Brick, Plaster, Stone / Plaster, Ochre, Stone, Brick, Plank / Plank, Stone, Plaster, Plank | The ground storey's wall styles, picked from. |
| Upper Walls | Plaster, Ochre, Plaster, Ochre / Plaster, Ochre / none | The upper storey's; none uses the ground's. |
| Roofs | Tile, Tile, Slate / Tile, Slate, Thatch / Thatch, Thatch, Slate | Roof styles, picked from. |
| Yards | 0.7 each | How likely a house outside the core gets a fenced yard behind it. |

### Roles

| Field | Default | What it is |
|---|---|---|
| Role | `Inn` | Its name, read back by **Get Buildings Of Role**, **Find Places** and the rest. |
| Count | 1 | How many. |
| Where | Anywhere | **Anywhere**, **Square**, **Core**, **Middle**, **Edge** or **Gate** (by a main road where it leaves the village). |
| Shape | Rect | **Rect**, **L**, **T** or **Landmark**. |
| Modules, Span, Storeys | 0 | 0 takes its ring's. |
| Wall Styles | none | From the ground up, the last going on up; none takes its ring's. |
| Roof | none | None takes its ring's. |
| Prefab Mesh | none | A whole building's mesh in place of modules, its pivot on the ground at its middle and its front +X. |
| Prefab Class | none | A whole building's actor in place of modules, spawned in play. |
| Prefab Size | 800 × 800 | A prefab's footprint, kept clear. |
| Places | none | Its places: each a **Kind**, a **Count** and a **Spot**. |

The default roles:

| Role | Where | Building | Places |
|---|---|---|---|
| Inn | Square | 5 modules, 800 span, 3 storeys, stone and plaster, slate | Sleep 4, Sit 6, Trade 1 and Work 1 inside; Sit 2 at the front |
| Church | Core | Landmark, 5 modules, 800 span, 2 storeys, stone, slate | Sit 8, Read 1 and Work 1 inside; Gather 3 at the front |
| Smithy | Gate | 3 modules, 1 storey, stone | Work 2 at the front, Trade 1 at the door, Sleep 1 inside |
| Bakery | Core | its ring's | Work 2 inside, Trade 1 at the door, Sleep 2 inside |
| Farm | Edge, 2 | its ring's | Sleep 2 inside, Work 3 in the nearest field, Work 1 in the yard |

A place's **Spot**:

| Spot | Where |
|---|---|
| Inside | On the ground floor, within the walls. |
| Door | Before the door, side by side. |
| Front | Along the front, either side of the door. |
| Yard | In its yard, or behind it without one. |
| Field | On the nearest field's patches. |
| Square | On the square. |

Besides its rule's places, every building has a **Door** place before its door. The square has
its own: **Gather** round the well, **Read** at the notice board, **Sit** on the benches and
**Trade** at each stall.

## Kit

A **VG Kit** data asset: every field is on [Your own kit](kit.md).

## PCG nodes

### Village Points

The village's buildings, places and roads as points, each with **Kind**, **Role** and **Id**
attributes. A building's point has its footprint's box; a place's faces the way one stands there.

| Setting | Default | What it is |
|---|---|---|
| Village Tag | none | The village with this actor tag; none takes the nearest. |
| Buildings | on | A point per building. |
| Places | on | A point per place. |
| Roads | off | A point every **Road Step** along each road, its box the road's width. |
| Road Step | 400 | |
| Walls | off | A point on each ground-floor wall module of the buildings' outsides, Kind `Wall`, facing out, with an **Opening** attribute: `Plain`, `Window`, `WindowBox`, `Windows`, `Door` or `Arched`. |
| Openings | none | Only walls with these openings; none takes them all. |
| Wall Out | 0 | Moves the wall points this far out and down onto the ground, for what grows at a wall's foot; 0 keeps them on the wall, for what climbs it. |
| Role | none | Only buildings and places of this role. |
| Place Kind | none | Only places of this kind. |

### Village Clearance

Drops the input points that are on a village's roads, buildings, square or fields.

| Setting | Default | What it is |
|---|---|---|
| Village Tag | none | As above. |
| Padding | 100 | How far points stay from what they're kept off. |
| Roads, Buildings, Square, Fields | on | What they're kept off. |

## Console commands

Each works on every village in the world, in the editor's Play and in a packaged development
build.

| Command | What it does |
|---|---|
| `Village.Seed <number>` | Builds the villages again from that seed. |
| `Village.Rebuild` | Builds them again, edits kept, and prints each one's buildings and places. |
| `Village.Roles` | Prints each village's buildings by role and places by kind, with how many are held. |
| `Village.Glints [0/1]` | Hides or shows every [VG Glint](#vg-glint), in play. With no number, it toggles. |
| `Village.Debug [0/1]` | Draws the buildings (cyan, pinned orange, with role and Id), places (green free, red held, with kind) and areas over the villages. With no number, it toggles. |

The commands print on screen and in the Output Log, under **LogVillageGenerator**, as do the plugin's warnings.
