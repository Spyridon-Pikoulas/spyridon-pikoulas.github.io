---
layout: guide
title: "How-tos · Farming & Fishing System"
nav: How-tos
order: 4
permalink: /docs/farming-fishing/how-to/
description: "Answers to the common tasks in Farming & Fishing System: your inventory, your own crops and fish, seasons and your day and night, glints, saving, multiplayer, tools, targeting, input and HUD of your own, your own animations."
---

# How-tos

The tasks buyers come back for, each answered in steps, Blueprint first and C++ after where both
apply. They build on the [quickstart](quickstart.md)'s field and pond and the words in
[Concepts](concepts.md).

## Hand the harvest to your inventory

The plugin keeps no inventory of its own. It asks yours, through the **Farm Inventory**
interface, to take in what is harvested, caught and collected from animals, and to give up seeds,
fertilizer and feed as they are used. Implement it on the player's pawn, controller or PlayerState, whichever holds your
inventory; the plugin looks in that order, on the server.

1. Open that Blueprint, click **Class Settings** in the toolbar, and under **Interfaces** click
   **Add** beside **Implemented Interfaces**. Pick **Farm Inventory** and compile.
2. In the **My Blueprint** panel, under **Interfaces**, double-click **Add Farm Item**. Its event
   comes with **Item Id**, **Count** and **Quality**. Add that many of the item to your inventory.
   **Quality** is 0 to 2 for a crop, an egg or milk, and the size in whole cm for a fish. The
   event can't refuse: the crop is picked, and the fish landed, whether your inventory has room or not.
3. Double-click **Consume Farm Item**, which is a function with a **Return Value**. If your
   inventory holds **Count** of **Item Id**, take them out and return true; otherwise return
   false. False refuses the planting, fertilizing or filling of a feeder, and the HUD says
   **No seeds** or **None left**.
4. Give the player something to plant: add a few `TurnipSeeds` to your inventory when play starts.

The item ids are the assets' own: a crop hands out its **Item Id** (`Turnip`) and takes its
**Seed Item Id** (`TurnipSeeds`), a fish hands out its **Item Id** (`Bluegill`), and fertilizer is
the Farmer Component's **Fertilizer Item Id** (`Fertilizer`). A feeder takes its **Feed Item Id**
(`Hay`), and the sample animals give `Egg` and `Milk`.

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

### With the Inventory, Equipment & Crafting System

Our [Inventory, Equipment & Crafting System](/docs/inventory-crafting/) keeps items as **Inv Item
Definition** data assets, so a map from the plugin's item ids to them is all the seam needs.

1. On your character, add **Farm Inventory** under **Class Settings > Implemented Interfaces**, and
   a variable `FarmItems`, a **Map** from **Name** to **Inv Item Definition**: `Turnip` to your
   `DA_Turnip`, `TurnipSeeds` to `DA_TurnipSeeds`, `Worm` to `DA_Worm`, and so on for each id
   your farm uses.
2. In **Add Farm Item**: **Find** the **Item Id** in `FarmItems`. If found, call **Make Stack**
   on it with **Count**, set the stack's **Quality** to the **Quality** for a crop, an egg or milk
   (0 to 2, which the item's **Quality** trait names), and **Give Stack** with self. A fish's quality
   is its size in cm: keep it in the stack's **Values** under a tag of yours instead.
3. In **Consume Farm Item**: **Find** the item. If found and **Count Item** with self is at least
   **Count**, **Take Item** that many and return true; otherwise return false.

```cpp
virtual void AddFarmItem_Implementation(FName ItemId, int32 Count, int32 Quality) override
{
    if (UInvItemDefinition* Item = FarmItems.FindRef(ItemId))
    {
        FInvItemStack Stack = Item->MakeStack(Count);
        Stack.Quality = Item->FindTrait<UInvTrait_Quality>() ? FMath::Clamp(Quality, 0, 2) : 0;
        UInvLibrary::GiveStack(this, Stack);
    }
}

virtual bool ConsumeFarmItem_Implementation(FName ItemId, int32 Count) override
{
    const UInvItemDefinition* Item = FarmItems.FindRef(ItemId);
    return Item && UInvLibrary::CountItem(this, Item) >= Count && UInvLibrary::TakeItem(this, Item, Count) == Count;
}

UPROPERTY(EditAnywhere) TMap<FName, TObjectPtr<UInvItemDefinition>> FarmItems;
```

An id missing from the map hands nothing out and refuses the use, so a seed you forgot to map
reads "No seeds" in the HUD.

> [!NOTE]
> Without an implementation, seeds, fertilizer and feed are unlimited and nothing is handed out. The
> Farmer Component's **On Harvested** and the Fishing Component's **On Fish Caught** still fire,
> for a game that would rather listen to events. An empty item id makes that use free even with an
> implementation ([Inventory](reference.md#inventory)).

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

    {% include figure.html src="crop.png" alt="The DA_Crop_Turnip data asset open: Display Name Turnip, Seasons Spring, four Stages with the first opened to show its Mesh and Days 1, Regrow Stage -1, Yield 1 to 1, Item Id Turnip, Seed Item Id TurnipSeeds, Dry Days To Wither 3, Perennial unticked, Spacing 0, Trunk Radius 0 cm, then a Produce Mesh and a Withered Mesh." caption="The sample turnip, laid out as your own crop will be." %}

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

## Grow fruit trees and bushes

A tree or a bush is a crop that fruits again instead of going: tick **Perennial**. It never
withers, and out of its seasons it rests, its fruit dropping back to its **Regrow Stage**, until
its season comes round again. The samples `DA_Crop_Apple`, `DA_Crop_Orange` and
`DA_Crop_Blueberry` are made this way.

1. Make a crop as [above](#grow-a-crop-of-your-own), with its last stage the fruiting tree and its
   **Regrow Stage** the stage before it, bare.
2. Tick **Perennial**.
3. Set **Spacing** to the tiles its crown keeps clear: `1` leaves the eight round it empty, so no
   crop is planted under it and it is planted no nearer another tree.
4. Set **Trunk Radius** to its trunk's, such as `14` cm: from its second stage, players walk round
   it instead of through.
5. Set **Produce Mesh** to the fruit, which flies up to the picker at each harvest (every crop can
   have one).

A dry day only holds a perennial's growth: the crop card says "Dry: rests until watered". Plant
it in a Farm Area like any crop; the [demo](quickstart.md#play-the-demo)'s orchard is one, with
grass left between its rows.

## Add fish of your own

A fish is a data asset; a **Fish Table** lists the fish of one kind of water and how often each
bites. A Fishing Water uses one table.

1. Right-click in the Content Browser, pick **Miscellaneous > Data Asset**, choose **Fish**, and
   name it `DA_Fish_Eel`. Open it.

    {% include figure.html src="fish.png" alt="The DA_Fish_Koi data asset open: Display Name Koi, Item Id Koi, its Mesh and Icon, Size 30 to 60, Strength 0.5, Stamina 7, Bite Window 1.1, Seasons Spring and Summer, Hour From 0 and Hour To 24, Weather Rain." caption="The sample koi: it bites only in rain, in spring and summer." %}

2. Set its **Display Name**, **Item Id** and **Mesh**, its size range in cm, and how it fights:
   **Strength** 0 to 1 is how hard it pulls, **Stamina** the seconds of reeling in the bar's good
   band it takes to tire, **Bite Window** the seconds you have to hook it. An **Icon** is its
   picture for a fish book.
3. Set when it bites: its **Seasons** (none means all), the hours from **Hour From** up to
   **Hour To** (`20` to `5` runs over midnight; two equal hours never bite), and **Weather**:
   **Any**, **Clear** or **Rain**.
4. Make the table: **Miscellaneous > Data Asset > Fish Table**, named `DA_FishTable_Marsh`. Click
   **+** beside **Entries** for each fish, and give each a **Weight**: among the fish that can bite
   at the cast, one of weight 2 bites twice as often as one of weight 1, and one of weight 0
   never. **Min Wait** and **Max Wait** are the seconds from the bobber landing to a bite.

    {% include figure.html src="fishtable.png" alt="The DA_FishTable_Pond data asset open: six Entries, the first opened to show Fish DA_Fish_Bluegill and Weight 4, then Min Wait 1 and Max Wait 3." caption="The sample pond's table." %}

5. Select your Fishing Water and set its **Fish Table** to the new table.

Check it in Play with `Fish.Table` in the console: it lists each water's fish and why any can't
bite now ("Not in Winter", "Only from 20 to 5", "Only in the rain", "Only in clear weather").
Saving a fish or a table checks it too: a fish without an **Item Id** is an error in the Message
Log, and a table with no fish a warning. Saving the map checks each Fishing Water: one without a
table is an error, or a warning if it refills cans.

## Fish with bait and keep a fish book

A fish table's entry can name a **Bait**: with it on the hook, the fish bites **Bait Favour** times
as often (3 by default), or, with **Needs Bait** ticked, it bites on nothing else.

1. In your fish table, open an entry and set **Bait** to an item id of yours, such as `Worm`.
   Tick **Needs Bait** for a fish that takes nothing else.
2. On the player's Fishing Component, add the bait ids to **Baits**, in the order <kbd>E</kbd>
   picks them with the rod out, after "no bait".
3. In Play, take the rod, press <kbd>E</kbd> until the tool bar reads **Rod · Worm**, and cast.

Each cast with a bait takes one from your [inventory](#hand-the-harvest-to-your-inventory) (free
without one); with none left, the cast is refused with "None left". The sample tables favour
`Worm` and `Fly`, and their koi and sturgeon need them ([Crops and fish](crops-and-fish.md#fish-tables)).

Each Fishing Component keeps a book of what its angler has caught: **Get Book** gives a record per
fish, its count and its biggest. **Fish Book** (Farming|Fishing) turns that into a page for every
fish the level's Fishing Waters hold, in their tables' order, caught or not: its count, its biggest,
the **Display Name** of each water that holds it, when it bites in words ("Spring, Summer ·
5:00 to 21:00 · in rain") and the bait its entry favours or needs. Lay the pages out in a widget
of yours; the demo's <kbd>Tab</kbd> shows one. **Capture Farm** keeps the host's book; a game
that saves each player's keeps theirs from **Get Book** and puts it back with **Set Book**.

> [!TIP]
> Give every table a fish that bites at any hour in every season, as the sample pond's bluegill
> does. The fish is chosen at the cast: if none can bite then, the cast is refused with "Nothing bites
> here now", which reads as a bug to a player.

## Keep animals

1. Drag an **Animal Pen** into the level and set its box's **Box Extent** to the ground it fences.
   The pen's location is the box's middle: raise it until its **Location** Z is the **Box Extent**
   Z above the ground, so the box's bottom lies on it. Move its **Home** to where they sleep and
   lay, such as a coop's door.
2. Drag a **Feeder** inside the pen. Set **Start Portions** for feed from the first day.
3. Drag a **Farm Animal** inside it and set **Animal** to `DA_Animal_Chicken` or `DA_Animal_Cow`,
   and **Name** to its own name. It roams the pen whose box it starts in, height included.
4. Press **Play**. With the hand, face the feeder and press use to fill it; face an animal to pet
   it. The morning after its **Produce Days** of being fed (one for the samples), a hen has laid an
   egg by the home, with a glint over it, and a cow carries a glint until it is milked. Pick the
   egg up, or milk the cow, with the hand.

Each animal eats one portion a day. Filling the feeder takes one **Hay** from your
[inventory](#hand-the-harvest-to-your-inventory) for each portion it lacks, and the produce
arrives there as **Egg** or **Milk**, with a quality from the animal's affection. Without an
inventory the feed is free and the produce comes through **On Harvested** alone. Call **Feed** on
an animal to feed it without a feeder.

Your own kind of animal is an **Animal** data asset (**Add > Miscellaneous > Data Asset >
Animal**): a skeletal mesh facing +X, an animation for each of Idle, Walk, Graze, Eat, Happy and
Sleep, its walk speed and body extent, and what it gives ([its fields](reference.md#animals)).

{% include figure.html src="animal.png" alt="The DA_Animal_Chicken data asset open: Display Name Chicken, Mesh SK_Chicken, five Animations for Idle, Walk, Graze, Eat and Happy, Walk Speed 0.6 m/s, an Extent, Blocks Players unticked, then Produce Item Id Egg, Produce Name Egg, Produce Days 1 and Laid Mesh SM_Egg." caption="The sample chicken." %}

## Water with sprinklers, grow under glass

1. Drag a **Sprinkler** onto a field's tile. It waters the 3 x 3 tiles round it each morning, wider
   with a larger **Range**.
2. Drag a **Greenhouse** over a Farm Area and scale it over the tiles it covers (its **Bounds**
   alone resized leaves the frame and glass as they are). They grow in
   its **Season**, summer by default, whatever the calendar's; rain doesn't reach them, and they
   are watered every morning, unless you untick **Waters**.

The HUD says "under glass" on a greenhouse's tiles. The greenhouse draws its frame and glass
from the plugin's `SM_Greenhouse` and `SM_Greenhouse_Glass`; swap them for your own in a Blueprint
of it.

## Set down planters

A **Planter** is a small Farm Area that stands on the ground: a pot or a raised bed, tilled
already, watered by sprinklers, grown under a greenhouse, and saved with the farm. Players set
them down with the seventh tool; you can place them in the level as well.

1. In **Project Settings > Plugins > Farming & Fishing**, add `DA_Pot` and `DA_RaisedBed` to
   **Player Planters**. (A Farmer Component you add yourself has its own **Planters**.)
2. Press **Play**, then <kbd>7</kbd> for the planter. A tinted outline of it stands ahead of you,
   green where it fits and red where it doesn't: on level ground, off fields and water, clear of
   anything solid. <kbd>E</kbd> switches pot and bed.
3. Click to set it down, then plant and water it as a field. With the planter out, click an empty
   one you set down to take it back up; one with a crop in it stays.

Setting one down takes its kind's **Item Id** from your inventory, and taking it up gives it back.
To place one in the level, drag a **Planter** in and set its **Planter** to the kind; it isn't
taken up by the tool. Your own kind is a **Planter** data asset: its mesh with the pivot at the
middle of its foot, its **Tiles** across and deep, their **Tile Size**, and how high its **Soil
Height** lies; a round pot takes a round **Soil Mesh**.

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

### With a sky that keeps its own time

A sky that moves its own sun, such as the engine's **Sun and Sky** actor (the **Sun Position
Calculator** plugin) or a day and night system from Fab, keeps the time of day itself. Let it lead,
and move the farm's clock on by what it moved:

1. Set **Real Seconds Per Game Hour** to `0`.
2. In your game mode or level Blueprint, add a float variable `LastHour`, set as play begins to
   the sky's hour (**Solar Time** on Sun and Sky, 0 to 24).
3. On **Event Tick**, on the server: read the sky's hour, and set `Passed` to the hour less
   `LastHour`; if that is below 0, the sky passed midnight, so add 24. Call **Get Farm**, then
   **Advance Time** with `Passed`, and set `LastHour` to the hour.

The farm's day then starts as the sky passes midnight, and its crops grow overnight with it. A
sky that also counts days can go on driving the farm: a jump of whole days is **Advance Time** with
24 for each.

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

## Change the sounds and effects

Each moment of play (Till, Water, Plant, Fertilize, Harvest, Place, Cast, Land, Bite, Hook, Catch,
Lost) plays a set from **Feedback** in **Project Settings > Plugins > Farming & Fishing**, under
**Feel**, where it happens: the tile, the planter or the bobber.

1. Open **Feedback** and the moment's entry.
2. Set its **Sound** and Niagara **Effect** to your own, or clear them. **Kick** turns the
   player's camera that many degrees and eases back; **Rumble** and **Rumble Time** shake a
   gamepad.
3. Remove an entry for a moment that should pass unmarked.

The plugin's effects belong to one effect type that lowers their counts with the effects quality
setting.

## Show what the player can use

A **Glint** is a small sparkle on what the player can use. The plugin puts one on each patch of
one crop ready to harvest, such as a row, one on each Fishing Water, one on each egg laid and one
on an animal whose produce is ready; the demo's bed carries one too.

1. In the Blueprint of your bed, chest or other prop, click **Add** and search `Glint`.
2. Move it to where it should shine. Set **Range** to the distance it should show from.
3. When the thing can't be used, call **Set Glint On** with it unticked; tick it again when it can.

A Fishing Water's glint is its **Glint** component, over the box's centre until you move it. Untick **Glint On** on one water whose glint you don't want, and **Ready Glints** on a Farm
Area for none over its crops. **Glints** in **Project Settings > Plugins > Farming & Fishing** turns
them all off; in play, **Set Glints Shown** on **Glints** (the local player subsystem, from the
player controller) does the same for one player, for an options menu.

## Save and load the farm

**Capture Farm** returns the farm ([what it holds](concepts.md#what-is-saved)) as one structure to
keep in your save game; **Restore Farm**, on the server, puts it back.

1. In your **SaveGame** Blueprint, add a variable of type **FFFarm Save** (search `Farm Save`
   in the type list).
2. When you save: call **Capture Farm**, set the variable from it, and save your save game as you
   already do.
3. When you load: load your save game, then call **Restore Farm** with the variable. Call it once
   the level has begun play, for example after a **Delay Until Next Tick** in your game mode's
   **BeginPlay**: fields not yet in the level are skipped.

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

Fields, animals and feeders match what's saved by **Area Id**, **Animal Id** and **Feeder Id**,
each the actor's name unless set: give one spawned at run time an Id of its own. Crops are saved by
reference, so a crop asset you rename keeps loading only through its redirector.

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

The tool bar's seven tools are fixed, but a tool of your own is an input of yours calling a field's
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
| In Front | third and first person | the tile **Reach** (220 cm) from the pawn the way the player looks, following the view as it turns; the way the pawn faces until the view first turns |
| Camera | first person | the tile the camera looks at |
| Cursor | top-down | the tile under the mouse cursor |

Every mode stops at **Max Reach** (350 cm) from the pawn. The server checks the distance again, to
the tile's centre, allowing one tile more: 450 cm by default. In Front finds the ground by its
World Static collision; Camera and Cursor trace the Visibility channel. To change Max Reach for
every player, add the components to your character yourself (next how-to) and set it there.

A tile further than **Work Reach** (120 cm) is walked up to first, with the pawn's own movement, and
worked once in reach, so the hoe and the can land on the marked tile: with In Front, that is a
step before a use. The tile stays marked and worked, whatever the tool, till the pawn moves or
looks away, so one is tilled, sown and watered from where it stopped. A move of the player's own
calls the walk off, and a pawn held up gives up without working. Turn **Walk Up** off for a tile
worked from where the pawn stands.

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
3. For other keys, change them in `IMC_FF_Farming`, or name copies of it and its actions under
   **Input** in the plugin's settings; each action is player-mappable, so a rebinding menu built on
   Enhanced Input's User Settings lists them. For input of your own, untick the Farmer Component's
   **Default Input** in its Details (Blueprint can't change it at run time) and call **Use
   Pressed**, **Use Released**, **Select Tool**, **Cycle Tool** and **Cycle Seed** from your input
   events.
4. For your own HUD, untick **Show Hud**, or restyle the plugin's: make a Widget Blueprint whose
   parent is **Farm HUD**, lay it out, and name its parts `DateText`, `ToolText`, `TargetText`,
   `MessageText`, `BiteText`, `BarText` and `TensionBar`; the HUD fills them in. Set it as **Hud Class** in
   the plugin's settings, under **UI**.

The [reference](reference.md#ui) lists what each HUD part shows and the nodes to build your own.

## Play your own animations

Each use is an **action**: Till, Plant, Water, Fertilize and Harvest on the field, which the hand
also plays to pet (Plant), fill a feeder (Fertilize) and collect (Harvest); Charge, Cast, Strike,
Reel, Strain and Snap with the rod. On a skeleton with the UE5 mannequin's bone names the
plugin poses each one itself, over whatever your Anim Blueprint plays and with the feet kept where
it puts them. To play your own instead:

1. Make an Anim Montage for the action on your character's skeleton, in a slot your Anim Blueprint's
   AnimGraph plays (a **Slot 'DefaultSlot'** node before the output pose, for instance).
2. In the **Farmer Component**'s Details, under **Farming > Animation**, add the action to
   **Action Montages** and pick the montage. The plugin's own pose stops for that action, and with
   any montage there it no longer carries the tool in hand either (the arm out, the rod up): your
   Anim Blueprint holds it.
3. Time it to **Use Delay** (0.35 s): a farm use changes the ground that long after it is pressed,
   so the hoe or the can should land then. Cast plays as the cast flies, Strike as a bite is struck,
   Snap as the line breaks. Charge, Reel and Strain last while they happen: make their montages
   loop. The plugin stops each when the next begins, and starts one once a montage played before it
   (the strike before the reel) has ended.

For an Anim Blueprint that animates on its own, untick **Action Poses** and bind **On Action**: it
fires with each action as it begins, on every machine that shows the pawn, and with **None** when a
held one ends. **Play Action** plays one yourself; **Show** (something lifted to the chest) and
**Stow** (the left hand put away) are for your own code, as the demo farmer holds up her harvest and
catch.
