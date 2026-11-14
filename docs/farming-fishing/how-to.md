---
layout: guide
title: "How-tos · Farming & Fishing System"
nav: How-tos
order: 4
permalink: /docs/farming-fishing/how-to/
description: "Answers to the common tasks in Farming & Fishing System: your inventory, your own crops and fish, seasons and your day and night, saving, multiplayer, tools, targeting, input and HUD of your own."
---

# How-tos

The tasks buyers come back for, each answered in steps, Blueprint first and C++ after where both
apply. They build on the [quickstart](quickstart.md)'s field and pond and the words in
[Concepts](concepts.md).

## Hand the harvest to your inventory

The plugin keeps no inventory of its own. It asks yours, through the **Farm Inventory**
interface, to take in what is harvested and caught and to give up seeds and fertilizer as they are
used. Implement it on the player's pawn, controller or PlayerState, whichever holds your
inventory; the plugin looks in that order, on the server.

1. Open that Blueprint, click **Class Settings** in the toolbar, and under **Interfaces** click
   **Add** beside **Implemented Interfaces**. Pick **Farm Inventory** and compile.
2. In the **My Blueprint** panel, under **Interfaces**, double-click **Add Farm Item**. Its event
   comes with **Item Id**, **Count** and **Quality**. Add that many of the item to your inventory.
   **Quality** is 0 to 2 for a crop, and the size in whole cm for a fish. The event can't refuse:
   the crop is picked, and the fish landed, whether your inventory has room or not.
3. Double-click **Consume Farm Item**, which is a function with a **Return Value**. If your
   inventory holds **Count** of **Item Id**, take them out and return true; otherwise return
   false. False refuses the planting or fertilizing, and the HUD says **No seeds** or
   **None left**.
4. Give the player something to plant: add a few `TurnipSeeds` to your inventory when play starts.

The item ids are the assets' own: a crop hands out its **Item Id** (`Turnip`) and takes its
**Seed Item Id** (`TurnipSeeds`), a fish hands out its **Item Id** (`Bluegill`), and fertilizer is
the Farmer Component's **Fertilizer Item Id** (`Fertilizer`).

```cpp
#include "FFInventory.h"

UCLASS()
class AMyCharacter : public ACharacter, public IFFInventory
{
    GENERATED_BODY()

    virtual void AddFarmItem_Implementation(FName ItemId, int32 Count, int32 Quality) override
    {
        Items.FindOrAdd(ItemId) += Count;
    }

    virtual bool ConsumeFarmItem_Implementation(FName ItemId, int32 Count) override
    {
        int32* Held = Items.Find(ItemId);
        if (!Held || *Held < Count) { return false; }
        *Held -= Count;
        return true;
    }

    TMap<FName, int32> Items;
};
```

> [!NOTE]
> Without an implementation, seeds and fertilizer are unlimited and nothing is handed out. The
> Farmer Component's **On Harvested** and the Fishing Component's **On Fish Caught** still fire,
> for a game that would rather listen to events. An empty **Seed Item Id** or
> **Fertilizer Item Id** makes that use free even with an implementation, and the server's Output Log
> warns of it once a player for each crop, and once for fertilizer.

## Grow a crop of your own

A crop is a data asset naming its stages' meshes, its seasons and what it yields. This makes a
beet that grows in spring and autumn and is ready after four watered days.

1. Make a static mesh for each stage, seedling to ready, with its pivot at the bottom centre and
   sized to stand on a tile (100 cm by default). A withered mesh is optional.
2. In each mesh's material, open **Details > Usage**, tick **Used with Instanced Static Meshes**
   and save the material. The fields draw crops as instances; without the tick, a packaged game
   shows them in the default grey.
3. In the Content Browser, right-click and pick **Miscellaneous > Data Asset**, choose **Crop**,
   and name it `DA_Crop_Beet`. Open it.

    {% include figure.html src="crop.png" alt="The DA_Crop_Turnip data asset open: Display Name Turnip, Seasons Spring, four Stages with the first opened to show its Mesh and Days 1, Regrow Stage -1, Yield 1 to 1, Item Id Turnip, Seed Item Id TurnipSeeds, Dry Days To Wither 3 and a Withered Mesh." caption="The sample turnip, laid out as your own crop will be." %}

4. Fill it in:

    | Field | Value |
    |---|---|
    | Display Name | `Beet` |
    | Seasons | **Spring** and **Autumn** (click **+** for each) |
    | Stages | three: the seedling's mesh with **Days** `2`, the half-grown mesh with **Days** `2`, the ready mesh |
    | Regrow Stage | `-1`, so a harvest clears the tile |
    | Yield Min, Yield Max | `1`, `2` |
    | Item Id, Seed Item Id | `Beet`, `BeetSeeds` |

5. Save it. Saving checks it: a missing season or **Item Id**, fewer than two stages, **Yield Max** below
   **Yield Min**, or a **Regrow Stage** not before the last stage is an error in the Message Log, and a
   stage without a mesh, or an empty **Seed Item Id**, a warning.
6. Give it to the player: add it to **Player Seeds** in the plugin's settings, for the components
   the plugin adds, or at run time, on the server, to the Farmer Component's **Seeds** array (when
   the player buys seeds, say).

A crop moves on to the next stage once it has had that stage's **Days** of watered days, and is
ready on the last stage, whose **Days** is unused. For a plant that gives again, such as a tomato,
set **Regrow Stage** to the stage a harvest leaves it at.

## Add fish of your own

A fish is a data asset; a **Fish Table** lists the fish of one kind of water and how often each
bites. A Fishing Water uses one table.

1. Right-click in the Content Browser, pick **Miscellaneous > Data Asset**, choose **Fish**, and
   name it `DA_Fish_Eel`. Open it.

    {% include figure.html src="fish.png" alt="The DA_Fish_Koi data asset open: Display Name Koi, Item Id Koi, its Mesh, Size 30 to 60, Strength 0.5, Stamina 7, Bite Window 1.1, Seasons Spring and Summer, Hour From 0 and Hour To 24, Weather Rain." caption="The sample koi: it bites only in rain, in spring and summer." %}

2. Set its **Display Name**, **Item Id** and **Mesh**, its size range in cm, and how it fights:
   **Strength** 0 to 1 is how hard it pulls, **Stamina** the seconds of reeling with the bar green
   it takes to tire, **Bite Window** the seconds you have to hook it.
3. Set when it bites: its **Seasons** (none means all), the hours from **Hour From** up to
   **Hour To** (`20` to `5` runs over midnight; two equal hours never bite), and **Weather**:
   **Any**, **Clear** or **Rain**.
4. Make the table: **Miscellaneous > Data Asset > Fish Table**, named `DA_FishTable_Marsh`. Click
   **+** beside **Entries** for each fish, and give each a **Weight**: among the fish that can bite
   at the cast, one of weight 2 bites twice as often as one of weight 1, and one of weight 0
   never. **Min Wait** and **Max Wait** are the seconds from the bobber landing to a bite.

    {% include figure.html src="fishtable.png" alt="The DA_FishTable_Pond data asset open: six Entries, the first opened to show Fish DA_Fish_Bluegill and Weight 4, then Min Wait 3 and Max Wait 10." caption="The sample pond's table." %}

5. Select your Fishing Water and set its **Fish Table** to the new table.

Check it in Play with `Fish.Table` in the console: it lists each water's fish and why any can't
bite now ("Not in Winter", "Only from 20 to 5", "Only in the rain", "Only in clear weather").
Saving a fish or a table checks it too: a fish without an **Item Id** is an error in the Message
Log, and a table with no fish a warning. Saving the map checks each Fishing Water: one without a
table is an error, or a warning if it refills cans.

> [!TIP]
> Give every table a fish that bites at any hour in every season, as the sample pond's bluegill
> does. The fish is chosen at the cast: if none can bite then, the cast is refused with "Nothing bites
> here now", which reads as a bug to a player.

## Change the seasons and the speed of time

All in **Project Settings > Plugins > Farming & Fishing**, under **Calendar**:

| Setting | Default | For |
|---|---|---|
| Days Per Season | 28 | A shorter year: at 7, a season is a week. |
| Real Seconds Per Game Hour | 30 | A slower or faster day: at 30, a day lasts 12 minutes. |
| Start Hour | 6 | The hour a new game begins at. |
| Wake Hour | 6 | The hour **Sleep Until Morning** wakes to. |
| Rain Chance | 0.15 | How often a day outside winter is rainy. |

The calendar always begins on day 1 of spring, year 1. To start elsewhere, call **Advance Time**
on the server when play begins, or load a saved farm.

## Follow your own day and night

The calendar runs its own clock by default. A game with its own day and night cycle drives it
instead, so the two never disagree.

1. Set **Real Seconds Per Game Hour** to `0`. The clock stands still, and **Set Clock Running**
   can't start it.
2. Where your cycle moves time on, on the server, call **Get Farm**, then **Advance Time** with
   the game hours that passed; it never goes back. Each midnight passed starts a day: the weather
   is rolled, crops grow, the soil dries.

The other way round, to light your level from the farm's clock:

1. In your sky or lighting Blueprint, on **Event Tick**, call **Get Farm** and **Get Hour**.
2. Set your directional light's pitch to `(Hour - 6) * -15`: on the horizon at 06:00, straight
   down at noon, set at 18:00.

The plugin draws no weather. Bind **On Rain Changed** on **Get Farm** to start and stop your rain
effect, and **On Season Changed** to swap foliage, music or anything else by the season. The
events fire only on a change: read **Is Raining** and **Get Season** as play begins too.

## Sleep in a bed

1. Give your bed an interaction of your own (an overlap, a key, a prompt).
2. On the server, call **Get Farm**, then **Sleep Until Morning**. The clock moves to the
   **Wake Hour**: today's if it is still earlier, otherwise the next day's, so sleeping at the wake
   hour itself moves a whole day. Every midnight on the way starts a day.

From a client, call it through an event of your own set to **Run on Server**, on something the
client owns, such as its pawn or player controller. The plugin ships a bed mesh,
`SM_Prop_Bed`, among its props.

## Save and load the farm

The farm's state is the calendar and every field's tiles. **Capture Farm** returns it as one
structure to keep in your save game; **Restore Farm** puts it back. Restore Farm runs on the
server only: on a client it changes nothing and returns false. Capture Farm works on a client too,
from what has replicated to it.

1. In your **SaveGame** Blueprint, add a variable of type **FFFarm Save** (search `Farm Save`
   in the type list).
2. When you save: call **Capture Farm**, set the variable from it, and save your save game as you
   already do.
3. When you load: load your save game, then call **Restore Farm** with the variable. Call it once
   the level has begun play, for example after a **Delay Until Next Tick** in your game mode's
   **BeginPlay**: fields not yet in the level are skipped. A field the save doesn't name keeps the
   tiles it has.

A game without a save game of its own can call **Save Farm To Slot** and **Load Farm From Slot**
with a slot name instead. Each returns whether it worked. Saving works anywhere; loading restores,
so it runs on the server.

```cpp
#include "FFLibrary.h"

// In your save game: UPROPERTY(SaveGame) FFFFarmSave Farm;
Save->Farm = UFFLibrary::CaptureFarm(this);
// ...and after loading it, on the server:
UFFLibrary::RestoreFarm(this, Save->Farm);
```

The player's items and seeds are your inventory's to save; the farm keeps neither the players'
cans and tools nor whether the clock was stopped. Fields match their saved tiles by
**Area Id**, which is the actor's name unless set: give a Farm Area spawned at run time an **Area
Id** of its own. Crops are saved by reference, so a crop asset you rename keeps loading only
through its redirector.

## Play it in multiplayer

Nothing needs setting up: the server owns the calendar, the fields and the fishing, every player
gets their own tools, and all of it replicates. The plugin adds the components on the server, to
each pawn a player controller possesses.

1. To try it, open the arrow beside **Play**, set **Number of Players** to `2` and **Net Mode** to
   **Play As Listen Server**, and press **Play**. Both players see the same field; each has their
   own tool bar and can.
2. Console commands such as `Farm.Day` run on the server: type them in the server's window.
3. The nodes marked server only (**Advance Time**, **Sleep Until Morning**, **Restore Farm**, a
   Farm Area's **Till**, **Plant** and the rest) do nothing on a client; Restore Farm returns
   false there. Call them from an event set to **Run on Server**. **Capture Farm** and
   **Save Farm To Slot** work on a client too.
4. **Add Farm Item** and **Consume Farm Item** are called on the server: your inventory must
   replicate its own contents to the player.
5. A Farmer Component's **Seeds** set on the server reach its player, but its **Tools** list
   doesn't replicate: change it on the server and on the owning client.

A dedicated server draws nothing: no soil, crops, tools or lines. The
[concepts](concepts.md#who-runs-what) say which event fires on which machine.

## Make a tool of your own

The tool bar's six tools are fixed, but a tool of your own is an input of yours calling a field's
nodes. This sprinkler waters the nine tiles around the one ahead:

1. Make an input action `IA_Sprinkle`, map it to a key in your mapping context, and handle it in
   your character Blueprint.
2. On it, get the **Farmer Component** (**Get Component by Class**) and call **Get Target**. It
   returns the **Area**, the tile's **Coord** and the point aimed at, and false when no tile is
   targeted.
3. Pass **Area** and **Coord** to a custom event set to **Run on Server**.
4. In it, loop **X** and **Y** from `-1` to `1`, make a point of **Coord**'s X plus X and Y plus Y
   (**Make IntPoint**), and call **Water** on **Area** with it.

**Till**, **Plant**, **Fertilize**, **Harvest** and **Clear** work the same, and each returns how
it went, such as **Done** or **Not Tilled**.

To change only what the player holds, set a tool's mesh in **Tool Meshes** in the plugin's
settings. To leave a tool out, such as the rod in a game without fishing, edit the Farmer
Component's **Tools** list. Its order is the keys': **Select Tool** with index 0, or the key
<kbd>1</kbd>, picks the first.

## Target from above or through the eyes

The Farmer Component's **Target Mode** picks how the tile is chosen:

| Target Mode | For | Picks |
|---|---|---|
| In Front | third and first person | the tile **Reach** (120 cm) ahead of the pawn |
| Camera | first person | the tile the camera looks at |
| Cursor | top-down | the tile under the mouse cursor |

Every mode stops at **Max Reach** (350 cm) from the pawn. The server checks the distance again, to
the tile's centre, allowing one tile more: 450 cm by default. In Front finds the ground by its
World Static collision; Camera and Cursor trace the Visibility channel. To change Max Reach for
every player, add the components to your character yourself (next how-to) and set it there.

## Use your own character, input and HUD

With **Add To Players** on, the plugin adds both components to every player's pawn that has none.
To set them up yourself:

1. In your character Blueprint, click **+ Add** in **Components** and add a **Farmer Component**
   and a **Fishing Component**. The plugin then uses yours, with their events ready to bind in the
   Details panel. Fill the Farmer Component's **Seeds**: **Player Seeds** goes only to the
   components the plugin adds.
2. Set **Hand Socket** on both to your skeleton's hand socket (`hand_r` on Epic's mannequins), and
   adjust **Tool Transform** and **Rod Transform** in the plugin's settings until the tools sit in
   the hand.
3. For your own input, untick the Farmer Component's **Default Input** in its Details (Blueprint
   can't change it at run time) and call **Use Pressed**, **Use Released**, **Select Tool**,
   **Cycle Tool** and **Cycle Seed** from your input events.
4. For your own HUD, untick **Show Hud**, or restyle the plugin's: make a Widget Blueprint whose
   parent is **Farm HUD**, lay it out, and name its parts `DateText`, `ToolText`, `TargetText`,
   `MessageText`, `BiteText`, `BarText` and `TensionBar`; the HUD fills them in. Set it as **Hud Class** in
   the plugin's settings, under **UI**.

The [reference](reference.md#ui) lists what each HUD part shows and the nodes to build your own.
