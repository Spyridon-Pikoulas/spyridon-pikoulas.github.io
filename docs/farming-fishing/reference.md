---
layout: guide
title: "Reference · Farming & Fishing System"
nav: Reference
order: 7
permalink: /docs/farming-fishing/reference/
description: "Every Blueprint node, data asset field, setting and console command of Farming & Fishing System: calendar, fields, crops, tools, fishing, inventory, UI and save."
---

# Reference

Every Blueprint node, setting, data asset field and console command of Farming & Fishing System.
The [how-tos](how-to.md) put them to use, and [Concepts](concepts.md) explains the rules behind
them.

## Settings

**Project Settings > Plugins > Farming & Fishing**.

| Setting | Default | What it does |
|---|---|---|
| Add To Players | on | Gives every player's pawn a Farmer Component and a Fishing Component as it is possessed, unless it has them. Turn it off if you add the components to your character yourself. |
| Player Seeds | none | The crops a Farmer Component the plugin adds carries. Greyed out while Add To Players is off; a component you add yourself has its own **Seeds**. |
| Days Per Season | 28 | Four seasons make a year. At least 1. |
| Real Seconds Per Game Hour | 30 | How fast the clock runs. 0 stops it, for a game whose own day and night cycle calls [Advance Time](#calendar). |
| Start Hour | 6 | The hour play begins at, 0 to 23.99. Play always begins on day 1 of spring, year 1. |
| Wake Hour | 6 | The hour **Sleep Until Morning** wakes to, 0 to 23.99. |
| Rain Chance | 0.15 | The chance, 0 to 1, a day outside winter is rainy. Rain waters every tile. |
| Soil Mesh, Soil Material | the plugin's | A tilled tile, 100 cm square. The material reads wetness, 0 or 1, from per-instance custom data 0. |
| Highlight Mesh, Highlight Material | the plugin's | The targeted tile's outline, 100 cm square. |
| Tool Meshes, Tool Transform | the plugin's | What the farmer holds for each tool, gripped at the mesh's pivot, and where it sits on the hand socket (or the pawn's root, without a skeleton). |
| Rod Mesh, Rod Transform | the plugin's | The rod, its tip at a socket named `Tip` (or else the mesh's top), and its place on the hand. |
| Bobber Mesh, Bobber Size | the plugin's, 12 cm | The bobber, scaled to that size across. Its pivot sits on the water's surface. |
| Rod Bend | 60° | How far the rod's tip turns towards the line under a full reel's tension; 0 keeps it straight. A rod bends only when every material on it has **Used with Spline Meshes** ticked. |
| Line Material | the plugin's | The fishing line, drawn on the engine's cylinder. Its **Color** parameter is set to Line Color. |
| Line Width, Line Color | 0.8 cm, gold | How thick the line is drawn at the rod (it thins to two thirds at the bobber), and its colour. |
| Line Shows Tension | on | While reeling, the line takes the tension bar's colour: green in the safe band, red out of it. |
| Ripple Material | the plugin's | The rings spreading from the bobber where it lands, at a bite and while it is reeled in, drawn on the engine's plane; its **Opacity** parameter fades them. None for no rings. |
| Cast Marker Mesh, Cast Marker Size | the plugin's, 90 cm | Where a cast will land, pulsing from the charge until the bobber lands; the plugin's is an amber ring. |
| Hud Class | Farm HUD | Under **UI**: the HUD every local player gets. Set your own [subclass](#ui). |

A packaged game includes every asset these settings name, your own as well as the plugin's.

## Calendar

**Get Farm** returns the farm's subsystem in the current world, in Play or a game (in the editor's
world it returns nothing); every calendar node is on it. The calendar runs on the server and
replicates to every client. A client's clock runs on between updates, but stops at 23:59 until
the server's new day arrives.

| Node | What it does |
|---|---|
| Get Day | Days since the farm began, from 0. |
| Get Hour | The hour, 0 to 24. |
| Get Season | Spring, Summer, Autumn or Winter. |
| Get Day Of Season | 1 to Days Per Season. |
| Get Year | From 1. |
| Is Raining | Whether today is rainy. |
| Advance Time (Hours) | Moves the clock on; every midnight passed starts a day. Negative hours do nothing. Server only. |
| Sleep Until Morning | Moves the clock to the wake hour: today's if it is still earlier, otherwise the next day's, so at the wake hour itself it moves a whole day. Server only. |
| Set Raining | Starts or stops today's rain. Starting it waters every tilled tile; stopping it dries none. Server only. |
| Set Clock Running | Stops or starts the clock's own running. Starting does nothing while Real Seconds Per Game Hour is 0. Server only. |
| Get Farm Areas, Find Area At | The placed farm areas, and the one over a location. |
| Get Waters, Find Water At | The placed Fishing Waters, and the one at a location. |

Events, on every machine:

| Event | When |
|---|---|
| On Day Started (Day) | A day starts. On the server, after the crops have grown. |
| On Season Changed (Season) | The first day of a season starts. |
| On Rain Changed (Raining) | Rain starts or stops. At midnight it fires before the crops grow. |

On the server, every day passed fires its own On Day Started. A client gets the calendar by
replication, a couple of times a second, and the tiles separately, so its tiles may change before
or after the event. When several days pass at once (`Farm.Day 3`, `Farm.Season`), a
client gets one On Day Started, for the last of them. **Restore Farm** fires On Day Started too,
with no day passing, and On Season Changed when it changes the season; a client gets them only
when the restored day differs from its own. On Rain Changed fires only on a change: read the rain as play begins with **Is
Raining**.

**Your own day and night cycle.** Set **Real Seconds Per Game Hour** to 0 and call **Advance
Time** with the hours that passed, from wherever your cycle ticks. The plugin draws no rain; bind
**On Rain Changed** to your own weather.

**Date Text** gives "Spring 3, Year 1, 06:30"; **Season Name**, **Tool Name** and **Tool Result
Text** give the words the HUD uses.

## Farm Area

A box placed in the map, 10 m square and 4 m tall as placed: every **Tile Size** square inside it
(100 cm by default) is a tile on the ground below it. The ground is found by a trace for World
Static objects, so landscapes, static meshes and slopes all work. Tilled soil and crops are drawn
as instanced meshes.

| Field | What it is |
|---|---|
| Tile Size | The tile's side in cm, at least 25. |
| Area Id | The name its tiles are saved under. The actor's name when empty; set it if the area is spawned at run time. |

| Node | What it does |
|---|---|
| Grid Size | Tiles along X and Y. |
| World To Tile | The tile under a location, if inside the box, its height included. |
| Tile To World | The tile's centre on the ground. |
| Get Tile | A tile's state, if tilled: its crop, stage, watered, fertilized, withered and the days counted. False for an untilled tile. |
| Get Tiles | Every tilled tile. |
| Till, Water, Plant, Fertilize, Harvest, Clear | Change a tile as the tools do and return how it went ([the results](#tool-results)). **Clear** removes a crop, or untills an empty tile. Server only. |
| Can Plant | How planting would go, changing nothing. |
| On Tile Changed (Area, Coord) | Fires on every machine when a tile changes, and for every tilled tile at each new day. |

**Till** outside the grid gives No Target. **Harvest** on a withered crop gives Not Ready, where
the hand tool clears it. "Server only" holds in Blueprint: called from C++ on a client, these
nodes change only that client's own copy.

## Crops

A crop is a data asset (**Miscellaneous > Data Asset > Crop**). Ten samples, Turnip to
Sunflower, are in the plugin's `Data/Crops`.

| Field | What it is |
|---|---|
| Display Name | Shown in the HUD. |
| Seasons | The seasons it grows in. Out of them it withers, including when a season ends under it. |
| Stages | From the planted seed to the ready crop, two or more. Each has a **Mesh** and **Days** (1 by default, 1 to 255), the watered days it spends there before the next. The last stage's Days is unused. |
| Regrow Stage | The stage a harvested crop goes back to, such as a tomato plant's, before the last stage. -1, the default, takes the crop and leaves the soil tilled. |
| Yield Min, Yield Max | How many a harvest gives, 1 to 1 by default. |
| Item Id | What a harvest hands to your inventory. |
| Seed Item Id | What planting takes from your inventory. Empty makes planting free. |
| Dry Days To Wither | Dry days in a row before it withers, 3 by default, 1 to 255. |
| Withered Mesh | Shown once withered; the stage's own mesh when empty. |

How a crop grows each day, and its quality, are in [Concepts](concepts.md#a-day). Saving a crop
checks it. These are errors: fewer than two stages or more than 255, a stage's Days or Dry Days To
Wither above 255, no season, Yield Max below Yield Min, no Item Id, and a Regrow Stage that isn't
before the last stage. A stage without a mesh, and an empty Seed Item Id, are warnings. The ten samples' seasons and times are in [Crops and fish](crops-and-fish.md).

## Farmer Component

The player's tools, on the pawn. **Add To Players** adds it, on the server, to each pawn a player
controller possesses; add it yourself if that is off.

| Field | Default | What it is |
|---|---|---|
| Target Mode | In Front | How the tile is picked: **In Front** of the pawn (third and first person), what the **Camera** looks at (first person), or under the **Cursor** (top-down). |
| Reach | 120 cm | How far ahead In Front targets. |
| Max Reach | 350 cm | The farthest the aimed point can be from the pawn, at least 50 cm. The server checks the tile's centre against Max Reach plus one tile. |
| Tools | all six | The tool bar, in order: Hand, Hoe, Watering Can, Seeds, Fertilizer, Rod. Not replicated: change it on the server and the owning client both. |
| Seeds | none | The crops the seeds tool cycles through. The components the plugin adds start with **Player Seeds**. Set on the server, it reaches the owning client. |
| Hand Socket | `hand_r` | The socket a held tool goes on. |
| Fertilizer Item Id | `Fertilizer` | What fertilizing takes from your inventory. Empty makes fertilizing free. |
| Can Capacity | 20 | Waterings a full can holds, at least 1. |
| Default Input | on | Makes its own input actions and keys (mapping context `IMC_FarmingDefault`, priority 1) for a locally controlled pawn with an Enhanced Input component. Set it in the Details panel; Blueprint can't change it. Turn it off and call the nodes below from your own input. |
| Show Hud, Show Highlight | on | The HUD and the targeted tile's outline. |

The can starts full. It refills only when aimed at a Fishing Water with **Refills Cans**, within
Max Reach plus 1 m, and a refill comes before watering; a new day doesn't refill it. Watering a
tile that is already wet still uses a watering.

| Node | What it does |
|---|---|
| Use Pressed, Use Released | The active tool's use. For the rod, pressed charges a cast, hooks a bite or reels; released casts or gives slack. |
| Select Tool (Index), Cycle Tool (Step) | Picks a tool. Index 0 is the first; the keys 1 to 6 pick 0 to 5, and the mouse wheel up picks the previous tool. |
| Cycle Seed (Step) | Picks the next seed, on the player's machine and then the server. |
| Get Active Tool, Get Tool Index, Get Selected Seed, Get Water | The tool bar's state. Get Water reads 0 on other players' machines. |
| Get Target | The tile the player would work on now, its area and the point aimed at. |
| Get Fishing | The Fishing Component beside it. |

| Event | When |
|---|---|
| On Tool Used (Tool, Result, Coord) | Every use but the rod's, with [how it went](#tool-results), and each cast refused. On the server and the owning client; a cast that misses the water only on the angler's machine. |
| On Harvested (Crop, Item Id, Count, Quality) | A harvest. On the server and the owning client. |
| On Tool Changed (Tool) | The tool changed, on every machine, and once as play begins. |

The tile is highlighted for the local player. Hand harvests a ready crop or clears a withered one;
the hoe tills, or clears a withered crop. Clearing a withered crop hands out nothing, fires no On
Harvested and takes the fertilizer away.

### Tool results

Each use, and each Farm Area node, returns one of these; the HUD shows its words when it isn't
Done. A refused cast reports Coord 0, 0.

| Result | The HUD says | When |
|---|---|---|
| Done | | It worked, including clearing a withered crop. |
| No Target | Nothing to work on here | No tile is targeted. |
| Out Of Reach | Too far away | The server found the tile's centre beyond Max Reach plus one tile, or a cast's landing beyond the rod's reach. |
| Not Tilled | Till the soil first | Watering, planting or fertilizing plain ground, or **Clear** on it. |
| Already Tilled | Already tilled | The hoe on tilled, empty soil. |
| Occupied | Already done here | Planting on a crop, the hoe on a crop that isn't withered, or fertilizing twice. |
| No Crop | Nothing growing here | The hand on a tile with no crop. |
| Out Of Season | It won't grow this season | Planting a crop out of its seasons. |
| Not Ready | Not ready yet | The hand on a growing crop. |
| No Seeds | No seeds | No seed selected, a crop with no stages, a seed not in the server's **Seeds**, or your inventory refused the seeds. |
| No Item | None left | Your inventory refused the fertilizer. |
| Can Empty | The can is empty | Watering with an empty can. |
| Refilled | Can refilled | The can aimed at a Fishing Water that refills it. |
| No Tool | You don't have that tool | The server's Farmer Component lacks the tool a client used. |
| No Water | Cast onto water | A cast that lands on no Fishing Water. |
| No Fish Table | This water has no fish table | A cast onto a Fishing Water with no Fish Table. |
| Nothing Bites | Nothing bites here now | A cast onto water where no fish of its table can bite now. |

## Fishing

**Fishing Water** is a box placed where water is, 10 m square and 2 m deep as placed. The top of
the box is the surface the bobber floats on; a cast lands anywhere inside the box seen from above.
The plugin draws no water, so it goes with your own. Its **Fish Table** says what bites there, and
**Refills Cans**, on by default, lets the watering can fill. Saving the level checks each Fishing
Water: one with no table is an error, or a warning when it refills cans, as a well does.

A **Fish** (**Miscellaneous > Data Asset > Fish**):

| Field | What it is |
|---|---|
| Display Name, Item Id, Mesh | Its name, what a catch hands out, and its look. |
| Size Min, Size Max | Its size in cm, rolled per catch; 20 to 40 by default. |
| Strength | How hard it pulls, 0 to 1; 0.4 by default. |
| Stamina | Seconds of reeling with the bar green that tire it out; 5 by default, at least 0.5. Slack in the green tires it half as fast ([how](concepts.md#fishing)). |
| Bite Window | Seconds a bite lasts for the hook; 1.2 by default, at least 0.2. The server allows 0.3 s more for the click to reach it. |
| Seasons | When it bites; none is every season. |
| Hour From, Hour To | The hours it bites between, 0 to 24 by default. Hour To itself is out. From above To runs over midnight (18 to 6); From equal to To never bites. |
| Weather | Any (the default), Clear or Rain. |

**Why No Bite** (Season, Hour, Raining) says why the fish wouldn't bite in that season, hour and
weather: "Not in Winter", "Only from 20 to 5", "Only in the rain" or "Only in clear weather". It
is empty when it would. **Can Bite** gives the same answer as true or false.

A **Fish Table** (**Miscellaneous > Data Asset > Fish Table**) lists **Entries**, each a fish and
its **Weight** (1 by default) among the fish that can bite at the cast, and **Min Wait** and **Max
Wait** (3 and 10 by default), the seconds from the bobber landing to a bite. A fish of Weight 0
never bites. If no fish can bite at the cast, the server refuses it: no line goes out, and the HUD
says "Nothing bites here now". `Fish.Table` says why.

Saving a fish checks it: no Item Id, or Size Max below Size Min, is an error. Saving a table
checks it too: an entry without a fish, or Max Wait below Min Wait, is an error, and no entries at
all is a warning. A Fishing Water without a table gives no bite; saving the map makes that an error,
or a warning for one that refills cans.

The plugin's `Data/Fish` holds ten sample fish and two tables, `DA_FishTable_Pond` and
`DA_FishTable_River`, listed in [Crops and fish](crops-and-fish.md#fish).

The **Fishing Component** goes on the pawn beside the Farmer Component, which drives it while the
rod is out.

| Field | Default | What it is |
|---|---|---|
| Min Cast, Max Cast | 300, 1400 cm | How far a cast flies, from a tap to a full charge. |
| Charge Time | 1 s | The hold to a full charge, at least 0.1 s. |
| Hand Socket | `hand_r` | The socket the rod goes on. |
| Safe Min, Safe Max | 0.25, 0.8 | The safe tension, where the bar is green and the fish tires. |
| Reel Rate, Slack Rate | 0.7, 0.55 | How fast reeling raises the tension and slack lowers it, per second. |

How the reel plays is in [Concepts](concepts.md#fishing).

| Node | What it does |
|---|---|
| Use Pressed, Use Released | As the farmer's, for a game that drives fishing alone. Such a game calls **Set Rod Out** itself. Its catches reach your inventory, and its refused casts (No Water, No Fish Table, Nothing Bites, Out Of Reach) reach **On Tool Used**, only through a Farmer Component on the same actor. |
| Cancel | Reels the line in. Clicking while the line is casting or waiting does the same. |
| Set Rod Out | Shows or hides the rod. Hiding it reels the line in. |
| Get State | Idle, Casting, Waiting, Bite or Reeling. |
| Is Charging, Get Charge | A cast's charge, 0 to 1. |
| Get Tension, Get Reel Progress | The reel's tension and how tired the fish is, 0 to 1, on the angler's machine only. |
| Get Cast Target | Where a cast would land now, and whether that is fishable water. |
| Get Water | The water the line is in. |

| Event | When |
|---|---|
| On State Changed (State) | Every change, on every machine. |
| On Bite (Fish) | A bite, on the angler's machine. |
| On Fish Caught (Fish, Size Cm) | A catch, on the server and the angler's machine. The size is to 0.1 cm. |
| On Fish Lost (Why) | Missed, Snapped, Cancelled or Escaped (a landing the server found too quick), on the server and the angler's machine. The HUD says nothing for Cancelled. |

A line is cancelled when the player switches tools, and when a reel lasts over 90 seconds.

## Inventory

The **Farm Inventory** interface connects your inventory. Implement it on the pawn, its
controller or its player state; the plugin looks in that order, on the server.

| Function | What it does |
|---|---|
| Add Farm Item (Item Id, Count, Quality) | A harvest or catch arrives. Quality is 0 to 2 for crops and the size rounded to whole cm for fish, whose Count is 1. It can't refuse: the crop is picked and the fish landed either way. |
| Consume Farm Item (Item Id, Count) | Seeds or fertilizer used, one at a time. Return false to refuse the use. |

Without an implementation, seeds and fertilizer are unlimited and items leave through the
events alone. An empty **Seed Item Id** or **Fertilizer Item Id** makes that use free even with
one, and the server's Output Log warns of it once a player for each crop, and once for fertilizer. A catch reaches the inventory through the Farmer Component on the angler's actor.

## UI

The HUD is **Farm HUD**, a C++ widget: the date, the tool bar, the targeted tile, messages, the
bite prompt and the tension bar. To restyle it, make a Widget Blueprint whose parent is Farm HUD
and lay it out in the designer; name a part `DateText`, `ToolText`, `TargetText`, `MessageText`,
`BiteText`, `BarText` (text blocks) or `TensionBar` (a progress bar) and the HUD fills it in; the tension bar also shows a cast's
charge, in amber, and `BarText` over it says which: Charge or Tension. Any part can be left out. Override **Make Tool Text** and **Make Target Text** to change only the words. Set the
Widget Blueprint as **Hud Class**, or turn off **Show Hud** and build your own from the nodes
above. A message stays **Message Seconds** (2) on screen, and the date gets "(rain)" while it
rains.

## Save

| Node | What it does |
|---|---|
| Capture Farm | The calendar and every area's tiles, as one Farm Save (the **FFFarm Save** type) to keep in your own save game. Works on a client too, from what has replicated to it. |
| Restore Farm | Puts a Farm Save back and returns whether it did. Areas match by Area Id; an area the save doesn't name keeps its tiles, and a crop that fails to load leaves its tile tilled and empty. Server only: on a client it returns false. |
| Save Farm To Slot, Load Farm From Slot (Slot, User Index) | The same through a save slot of the plugin's own, for a game without a save game yet. User Index is 0 by default. Each returns whether it worked; loading restores, so it is server only too. |

Crops are saved by reference, so a renamed crop asset needs a redirector to load. Blueprint can
read a Farm Save's Day, Hour and Raining. Not saved: whether the clock was stopped, and the
players' cans and selected tools. Restore Farm fires On Tile Changed for every tile the field held
before or holds after, on the server at once and on clients as the tiles arrive.

## Console commands

Typed in the console (<kbd>&#96;</kbd>) in Play. The `Farm.*` commands run on the server or in a
single player's game; typed on a client, they only log "Farm commands run on the server, in a game
or PIE world." `Fish.Table` runs on any machine. They write to the Output Log under `LogFarming`,
and none of them exist in a Shipping build.

| Command | What it does |
|---|---|
| `Farm.Day [Count]` | Moves the clock on whole days of 24 hours, 1 by default, to the same hour. |
| `Farm.Season` | Moves on to the next season's first morning, at the Wake Hour. Each day on the way passes as usual, so dry crops can wither. |
| `Farm.Hour Hour` | Moves the clock on to that hour (0 to 23.99), the next day's if it has passed, which starts a day. Without an hour it does nothing. |
| `Farm.GrowAll` | Every crop to its ready stage, withered ones brought back too. |
| `Farm.Rain [0/1]` | Stops (0) or starts (1, the default) the rain. Starting it waters every tilled tile. |
| `Fish.Table` | Logs every water's fish, and why each won't bite now. |

The **Gameplay Debugger** (the **'** key in Play) has a **Farming** category: the date and
weather; each area's tilled, planted, ready, withered and watered tiles; the player's tool, can and
seed; and, while fishing, the water's fish and why the others won't bite.
