---
layout: guide
title: "Concepts · Farming & Fishing System"
nav: Concepts
order: 5
permalink: /docs/farming-fishing/concepts/
description: "How Farming & Fishing System fits together: the calendar, fields and tiles, crops, tools, fishing, what a day does, what runs on the server and what is saved."
---

# Concepts

How the parts fit together and why, and the words the other pages use.

## The parts

| Part | What it is | Where it lives |
|---|---|---|
| **The farm** | The calendar, and the list of fields and waters in the level. **Get Farm** returns it. | A world subsystem, one per game or Play world; there is none in the editor's world. Its clock runs on the server. |
| **Farm Area** | A field: the ground under its box, cut into square **tiles**. | An actor you place, or spawn. |
| **Crop** | What grows: seasons, stages, yield. | A data asset. |
| **Farmer Component** | The player's tool bar, the targeted tile, the watering can, the seeds. | On the player's pawn. |
| **Fishing Water** | Where fish bite: a box whose top is the water's surface. | An actor you place over your water. |
| **Fish**, **Fish Table** | A fish and when it bites; the fish of one kind of water and how often each bites. | Data assets. |
| **Fishing Component** | The cast, the bite and the reel. | On the player's pawn, beside the Farmer Component, which drives it while the rod is out. |
| **Farm Inventory** | The seam to your inventory. | An interface on your pawn, controller or PlayerState. |
| **Farm HUD** | The date, tools, targeted tile, messages, bite prompt and tension bar. | A widget per local player. |

The plugin draws no ground, water, sky or weather of its own: it lays tiles on your ground,
floats the bobber on your water, and tells your sky and weather what time and weather it is.

## Tiles

A tile is a square of a field, **Tile Size** wide (100 cm by default), named by its **Coord**:
its column and row in the field's grid. Tiles start as plain ground and become something only when
tilled; a tilled tile holds at most one crop. Each tile is laid on the ground found between the top
and the bottom of the field's box, so fields follow landscapes and slopes. The ground under a tile
is found once and kept, and again when the field moves.

Soil and crops are drawn as instanced meshes. The soil scales with **Tile Size**; crops stand
upright at their own size, turned only about the vertical.

## A day

The calendar counts hours, days, seasons of **Days Per Season** days, and years of four seasons.
At midnight, on the server, a new day starts:

1. The weather for the day is rolled: rain at **Rain Chance** outside winter. **On Rain Changed**
   fires if it changed.
2. A crop out of its seasons withers, ready or not, watered or not: a new season can end a crop.
3. Each growing crop that was watered moves on a day in its stage, and to the next stage once it
   has spent that stage's **Days** there. One that was dry counts a dry day instead, and withers
   after **Dry Days To Wither** of them in a row.
4. A ready crop waits for its harvest without water.
5. Every tilled tile starts the day dry, or watered if it rains.
6. **On Day Started** fires, and **On Season Changed** on a season's first day.

So a crop grows only on days it was watered by midnight. The last stage's **Days** is never used:
a crop whose other stages' **Days** add up to 3 is ready on the third morning after planting, if
watered each day. Rain that starts during the day waters every tilled tile at once; rain that
stops dries none.

## Quality

A harvest's quality is 0, 1 or 2: one point for a crop watered on at least nine days in ten of its
growing, one for a fertilized tile. Your inventory gets it with the item; what it means (a better
price, a star) is your game's.

A harvest of a crop that doesn't regrow takes the crop and leaves the soil tilled. A regrowing
crop keeps its fertilizer through its harvests and counts its watering again from zero after each;
the fertilizer goes when the crop is cleared or harvested for good.

## Fishing

A cast flies straight ahead of the pawn, from **Min Cast** (300 cm) for a tap to **Max Cast**
(1400 cm) for a full charge, and only lands on a Fishing Water. Then the line waits:

| State | What's happening | The player |
|---|---|---|
| Idle | No line out. | Holds to charge a cast. |
| Casting | The bobber is flying, for 0.6 s. | Clicks to reel in. |
| Waiting | The bobber floats; a bite comes **Min Wait** to **Max Wait** seconds after it lands. | Waits, or clicks to reel in. |
| Bite | A fish has taken it, for its **Bite Window**. | Clicks to hook it. |
| Reeling | The fish fights on the tension bar. | Holds to reel, lets go for slack. |

The fish that bites is drawn at the cast, from the water's table, among those whose season, hours
and weather match at that moment, by their **Weight**; a fish of Weight 0 never bites. If none
matches, the server refuses the cast: no line goes out, and the HUD says "Nothing bites here now".

While reeling, the tension rises as the player reels and falls with slack, and the fish pulls it up
in gusts by its **Strength**. Between **Safe Min** and **Safe Max** the bar is green and the fish
tires: a second of its **Stamina** each second the player reels, half that with slack. Above, the
bar turns red and the fish tires as fast, but at the top of the bar the line snaps. Below, the bar
turns red too and the fish gets its breath back, half a second each second. The fish is caught
once its Stamina is spent.

A line out is reeled in when the player switches tools, and called off when a reel lasts over 90
seconds.

{% include figure.html src="reel.jpg" alt="The tension bar, labelled Tension, above the tool bar while reeling, filled green part way, the line out to the bobber on the pond." caption="The tension bar while reeling: green while the tension is safe." %}

## Who runs what

The server owns the farm, and players' machines show it.

- **On the server:** the clock and the weather, every tile's changes, the tool uses (the server
  checks the distance to the tile, and that the tool and the seed are the player's), the fish that
  bites and when, whether a catch was played fairly, and every inventory call.
- **On the player's machine:** the targeted tile and its highlight, the input, the HUD, the
  charge of a cast and the reel itself, which the server then judges: a catch landed in less than
  0.8 times the fish's **Stamina** in seconds is refused, and the fish gets away.
- **Replicated to everyone:** the calendar, the tiles, each player's selected tool and seed and its **Seeds**, and
  the fishing state, so every player sees others' fields grow and lines go out. The can's water
  reaches only its own player, and the **Tools** list isn't replicated at all.

A dedicated server draws nothing: no soil, crops, held tools, rods or lines.

Where each event fires:

| Event | Fires on |
|---|---|
| On Day Started, On Season Changed, On Rain Changed | every machine; on a client, Restore Farm's only when the restored day differs |
| On Tile Changed | every machine |
| On Tool Used, On Harvested | the server and the player's machine |
| On Tool Changed | every machine, and once as play begins |
| On State Changed (fishing) | every machine |
| On Bite | the angler's machine |
| On Fish Caught, On Fish Lost | the server and the angler's machine |

The [reference](reference.md#calendar) says in what order a client gets the calendar's events.

## What is saved

**Capture Farm** takes the day, the hour, whether it rains, and every field's tilled tiles with
their crops, stages, watering, fertilizer and withering, keyed by each field's **Area Id**. It
takes nothing of the players: their items are your inventory's, and their tool bar and can start
fresh. Nor does it keep whether the clock was stopped. See
[Save and load the farm](how-to.md#save-and-load-the-farm).
