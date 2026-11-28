---
layout: guide
title: "Concepts · Procedural Village Generator"
nav: Concepts
order: 5
permalink: /docs/village-generator/concepts/
description: "How Procedural Village Generator's parts fit together: the village actor, its type, kit and seed, how a village is laid out, rings and roles, places and areas, the ground, edits, baking, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md) and want villages of your own.

## A village, its type, its kit and its seed

A **village** is one actor in your level, **VG Village**. It builds itself from three things:

- its **type** (a **VG Village Type** data asset): the rules. How big the village is, how many
  roads, how the houses change from the middle out, which buildings it has and where they go,
  how many fields, how deep the woods;
- its **kit** (a **VG Kit** data asset): the meshes. Wall and roof styles, foundations, props,
  trees, grass, crops and the decals for roads, the square and soil;
- its **seed**, a whole number that picks among everything the rules allow.

The same type, kit and seed build the same village every time, on every machine. A village with
no type or kit uses the plugin's: `DA_VG_Village` and the stylized kit `DA_VG_StylizedKit`.

The village rebuilds whenever it would look different: when you place it, move it or change a
setting in the editor, when a level opens, as play begins, and when a seed or an edit changes
during play. It is drawn with instanced meshes, a component per mesh, so a village of 50
buildings and their grass is a few hundred draw calls, not thousands of actors.

## How a village is laid out

The layout runs in stages, each with its own random stream from the seed, so changing one of the
type's settings changes that stage and leaves the others' choices alone.

1. **The outline.** The seed draws the village's shape, lopsided and narrower one way than
   another, so the square isn't in the middle of the houses and no two villages have the same
   footprint. The houses reach the type's **Radius** at most, less on some sides.
2. **The roads.** Two to four roads leave the square. The two most nearly opposite run through it
   as the main road; the others end at the square or branch off the main road. Lanes loop between
   neighbouring roads. With [road splines of your own](how-to.md#lay-a-village-along-your-own-roads),
   the village follows yours instead.
3. **The houses.** Plots line both sides of every road, each house with its door to the road.
   Each plot falls in a **ring** by its distance out (see below), which sets how likely it is to be
   built on, how big the house is and what it is built of.
4. **The roles.** Before the homes, each role the type names takes the plots where it belongs: the
   inn on the square, the church in the core, the smithy by a gate, farms at the edge. The plots no
   role takes become the type's **Default Role**, `Home`.
5. **The square.** A well, a notice board, benches, a cart, a tree and market stalls with their
   wares, turned to keep the roads clear, and lamps round its edge.
6. **Yards, fields and nature.** Fenced yards with a bed of crops, a shed or a cart behind the
   houses outside the core; fields together on one side or a few; a meadow; pine woods at the rim,
   with a hedge of trees between the groves; trees, bushes, rocks, grass and flowers on the open
   ground.
7. **What a game reads.** Every building's **places**, the **areas**, and the decals for the
   roads, the square and the soil.

## Rings

A type's **Rings** run from the square out, each to its **Reach**, a share of the radius. The
default has three:

| Ring | Reach | Its houses |
|---|---|---|
| Core | 0.44 | Close together, mostly two storeys, stone, brick and plaster below and plaster or ochre above, tile and slate roofs. |
| Middle | 0.82 | Further apart, 8 in 10 plots built on, a third of them two storeys, plaster, ochre, stone, brick and plank, some thatch. |
| Edge | 1.0 | Under half the plots built on, small and single storey, plank, stone and plaster under thatch, more of them L-shaped. |

A ring's lists of walls and roofs are picked from by seed; a name twice in a list is twice as
likely.

## Roles

A **role** is what a building is for: `Inn`, `Church`, `Smithy`, `Bakery`, `Farm`, or any name of
yours. Each role rule says how many, **Where** they go and what **places** they have, and may fix
their size, storeys, walls and roof, or swap the modules for a whole mesh or actor of yours
(a **prefab**).

| Where | Which plots |
|---|---|
| Anywhere | Any. |
| Square | Facing the square. |
| Core | In the core ring. |
| Middle | In the middle ring. |
| Edge | In the outer ring. |
| Gate | By a main road where it leaves the village. |

The church is the **Landmark** shape: a nave with a tower at its end, arched windows down its
sides, and a belfry under a spire when the kit has them.

## Places

A **place** is a spot your game sends someone to, with the way to face there. Each has a **Kind**:

| Kind | What it is | Where the default type puts them |
|---|---|---|
| Sleep | A bed | Two in each home, inside; the inn, bakery, smithy and farms have their own. |
| Work | A workplace | A home's yard, the inn, the church, the smithy's front, the bakery, a farm's field and yard. |
| Sit | A seat | Before each home's door, the inn's tables, the church's pews, the square's benches. |
| Trade | A counter | The inn, the bakery's and smithy's doors, each market stall. |
| Read | A board or a book | The square's notice board, the church's lectern. |
| Gather | Somewhere to stand together | Round the well, before the church. |
| Door | A building's door, outside it | One per building. |

A place belongs to a building (its **Building** is that building's Id, its **Role** the
building's role) or to the square (Building `-1`, Role `Square`). Kinds are names, so a role rule
of yours can give places any kind you like, such as `Pray` or `Guard`.

A place is **claimed** by an actor with **Claim Place**, **Get Home** or **Get Work Spot**, and
stays theirs until released, so two NPCs don't get the same bed. Claims are not saved and not
replicated: make them on the server, where your NPCs think.

A claim outlasts a rebuild (an edit, a new seed, **Apply Save Data**) while its place still stands:
the same place of the same building, wherever the building now is, or for a place of the square
one of its kind within a metre of where it was. Its **Index** may change, so ask again with **Get
Home**, **Get Work Spot** or **Get Claimed Places**. Otherwise the claim is dropped and **On Claim
Lost** fires for it: a new seed loses the claims on every building but the pinned ones, as does a
building removed or laid out anew, and **Clear** loses them all.

Places marked **Inside** are on the building's ground floor, within its walls. The houses are
closed shells in version 1, so how someone gets inside (a fade at the **Door** place, say) is up
to your game.

## Areas

An **area** is a named part of the village and its surroundings, a circle, a ring or a box:

| Name | Kind | Shape |
|---|---|---|
| `Village` | Village | A circle round the houses. |
| `Core` | Core | A circle round the core ring. |
| `Square` | Square | The square's circle. |
| `Field 1`, `Field 2`... | Field | Each field's box. |
| `Meadow` | Meadow | A ring from the middle ring's edge out to the woods. |
| `Woods 1`, `Woods 2`... | Woods | Circles along each grove of the woods. |

Every node that takes an area takes its name or its kind: `Field` means any field, `Field 2` only
that one. Areas overlap: the square is in the core, which is in the village.

## The ground

As it builds, the village reads the ground under it: everything that blocks **World Static**
(its **Ground Type**), every 2 m (its **Ground Step**), out to its type's **Extent**. A landscape,
static meshes and slopes all work. Villages and what they bake are left out, so two villages
don't build on each other.

Each house stands level on a foundation that reaches down to the ground. Where the ground falls
across a plot by more than the kit's **Foundation Depth** allows (1.55 m for the stylized kit),
the plot stays empty. Roads, the square's decals, props and grass follow the ground.

Where nothing is under it, the village builds at its own height. Give it a floor or a landscape
before you place it.

## Spaces

A village's **Places**, **Areas** and **Laid Roads** are in the world's space, ready to use. Its
**Buildings** are in the village's own space, as edits keep them; **Get Building Transform** gives a
building's world transform.

## Edits

A building can be **pinned** (kept where and as it is through every rebuild), **moved** (and so
pinned) or **removed** (its ground kept clear). Each edit rebuilds the rest of the village round
it: roads and pinned buildings stay, and the plots near them are laid out again.

The edits are kept on the village, in its **Pinned** and **Cleared** lists, with the seed. **Make
Save Data** and **Apply Save Data** carry the three into your save game and back
([how](how-to.md#save-a-village-and-its-edits)). **Clear Edits** forgets them.

## Baking

**Bake To Actors** turns a village into plain actors in the level: an actor per building and one
per 64 m cell for everything else, each holding instanced meshes, in an Outliner folder named
after the village. World Partition streams them like any actor, and you can move, delete or add
to them by hand. The village stays, not drawn, so its places and areas still answer your game.
**Unbake** deletes the baked actors and draws the village again.

## Multiplayer

The type, the seed and the edits replicate. Each machine builds the village itself from them, so a client
gets the same village as the server without any of its meshes being sent. Spawn rules run on
the server only, and their actors replicate as your actors do.

## In the editor and in play

In the editor, a village builds as you change it (untick **Build in Editor** to stop that, and
click **Generate** when you want it). In play, it builds again as play begins. With **Async**
ticked, a village built in play lays out on a background thread and calls **On Generated** when
it's ready; reading the ground stays on the game thread.
