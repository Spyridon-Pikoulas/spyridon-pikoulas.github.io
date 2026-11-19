---
layout: guide
title: "How-tos · Inventory, Equipment & Crafting System"
nav: How-tos
order: 4
permalink: /docs/inventory-crafting/how-to/
description: "Answers to the common tasks in Inventory, Equipment & Crafting System: your own items, traits and recipes, giving and taking items, stations, chests, vendors, a wallet, grids, gear on your own character, saving, your own UI and input, multiplayer, GAS, and heyheythere's other plugins."
---

# How-tos

The tasks buyers come back for, each answered in steps, Blueprint first and C++ after. They build
on the [quickstart](quickstart.md)'s character and the words in [Concepts](concepts.md).

## Make an item of your own

1. In the Content Browser, click **Add > Miscellaneous > Data Asset**, pick **Inv Item
   Definition**, and name it `DA_Torch`.
2. Open it and fill in what it is:

    | Field | Value |
    |---|---|
    | Display Name | `Torch` |
    | Icon | your texture, square, 256 px or more |
    | World Mesh | its mesh when it lies on the ground |
    | Max Stack | `5` |
    | Weight | `0.5` |
    | Tags | `Inv.Category.Tool` (the bag's **Tools** tab shows it) |
    | Rarity | `Inv.Rarity.Common` |
    | Value | `4`, what a vendor charges for it |

3. Under **Traits**, click **+** and pick what it does. For a torch carried in the off hand,
   **Equippable** with **Slot Tag** `Inv.Slot.Hand.Off` and **Mesh** your torch mesh.

    {% include figure.html src="item.png" alt="The Straw Hat item open: Display Name Straw Hat, its description, Icon T_Inv_straw_hat, World Mesh empty, Max Stack 1, Weight 0.3, Size 2 by 1, Tags Inv.Category.Gear, Rarity Inv.Rarity.Poor, Value 6; Traits with one Equippable: Slot Tag Inv.Slot.Head, Stats with one element, Mesh SM_InvGear_StrawHat, Skinned Piece empty, Socket head." caption="The example `DA_StrawHat`: an item worn on the head." %}

Give it to the player with `Inventory.Give Torch` in the console to try it. The plugin's 25
examples in **Examples > Items** are a start: copy one to your own folder and change it.

## Give and take items from your game

For a quest's reward, a chest your code fills or a harvest, use the **Inventory Library**'s nodes
on the server, with any of the player's actors (pawn, controller or player state):

- **Give Item** (Item, Count, Drop Rest): onto the stacks of it in the player's bag and hotbar,
  then into free slots, the bag's first; what doesn't fit is dropped at their feet when **Drop
  Rest** is ticked. Returns how many went in.
- **Take Item** (Item, Count): out of them, the smallest stacks first. Returns how many.
- **Count Item** (Item): how many they carry.

**Give Stack** gives a stack with its own quality, wear and values: **Make Stack** from the item,
then set them. For a container that isn't a player's, a chest say, call **Add Item** and **Remove
Item** on the container itself.

```cpp
#include "InvLibrary.h"

// on the server
const int32 Given = UInvLibrary::GiveItem(PlayerPawn, Torch, 3);
if (UInvLibrary::CountItem(PlayerPawn, Torch) >= 3)
{
    UInvLibrary::TakeItem(PlayerPawn, Torch, 3);
}
```

To react to items coming and going, bind the container's **On Item Count Changed**, on the server:
it gives the item and the change, above 0 for in.

## Make an item do something when used

Give the item a **Usable** trait (its **Verb**, `Eat` or `Drink`, is the tooltip's word). Using
it, by right-click, the gamepad's **X** or the hotbar's use key, then fires the player's **On Item
Used**, on the server, before one is spent.

1. In your game mode Blueprint, override **Handle Starting New Player**: call the parent first,
   then **Find Player** with **New Player**, and bind its **On Item Used**. The plugin adds the
   player's **Inv Player** as they log in, which is after **Event OnPostLogin** and before this,
   for every player, late joiners too.
2. In the bound event, check the stack's **Item**, and do what it does: heal the user, add to their
   hunger.

With the Gameplay Ability System, add the **Apply Effect On Use** trait beside **Usable** instead,
and pick the Gameplay Effect: it is applied to the user's ability system.

## Make a trait of your own

A trait is an object in the item, and a Blueprint can be one.

1. Make a Blueprint class whose parent is **Inv Item Trait**, `BPT_Glow`.
2. Override what it should do:
    - **On Equipped** and **On Unequipped**, on the server, with the equipment, the stack and the
      slot;
    - **On Use**, on the server, with the user, the container and the stack; return true when it
      took effect. On an item without **Usable**, that makes it usable. **Usable** always takes
      effect itself, so with it one is spent on every use, whatever you return;
    - **Get Tooltip Lines**, to add lines to the tooltip, on the machine that draws it.
3. Add it to an item's **Traits**: it's listed with the plugin's own.

## Craft at a workbench

1. Make a recipe: **Add > Miscellaneous > Data Asset**, **Inv Recipe**, `RC_Torch`, and set:

    | Field | Value |
    |---|---|
    | Inputs | `DA_Logs` × 1 |
    | Outputs | `DA_Torch` × 2 |
    | Station Tag | `Inv.Station.Workbench` |
    | Time | `3` (seconds a batch takes) |
    | Category | `Inv.Category.Tool`, the crafting page's tab |

    {% include figure.html src="recipe.png" alt="The Lantern recipe open: Display Name Lantern, Inputs DA_Logs 2 and DA_IronIngot 1, Outputs DA_Lantern 1, Station Tag Inv.Station.Workbench, Time 2, Unlock Tag empty, Category empty." caption="The example `RC_Lantern`, made at a workbench." %}

2. Add it to the **Recipes** of the player's **Inv Crafter**.
3. Open your workbench's Blueprint (any actor with a mesh) and add an **Inv Station**: **Station
   Tag** `Inv.Station.Workbench`, **Display Name** `Workbench`, **Range** `300`.
4. Place the workbench in your level.

In play, <kbd>E</kbd> at the workbench opens the crafting page with its recipes first. Away from
it, the recipe is listed with **Made at a Workbench** and can't be made. Your own stations are
tags of your own under `Inv.Station`, added in **Project Settings > Gameplay Tags**.

## Unlock a recipe

1. Add a tag for it in **Project Settings > Gameplay Tags**: `Recipe.Torch`.
2. Set it as the recipe's **Unlock Tag**. The crafting page lists the recipe as **Locked**.
3. When the player learns it, on the server, call **Unlock** on their crafter (**Find Crafter**
   with any of the player's actors) with `Recipe.Torch`.

Unlocked tags are saved with **Save Inventory**. **Set Unlocked** sets them all at once.

## Place a chest with loot

1. Make an actor Blueprint for the chest, with its mesh, and add an **Inv Container**:

    | Field | Value |
    |---|---|
    | Container Tag | `Inv.Container.Chest` |
    | Display Name | `Chest` |
    | Columns, Rows | `6`, `3` |
    | Owner Only | unticked |
    | Openable | ticked |
    | Save With World | ticked, so what's taken stays taken after a load |
    | Loot Table | `LT_Chest`, or your own |
    | Loot Seed | `0` for new loot each play, or a number for the same loot every time |

2. Place it. In play, <kbd>E</kbd> opens it beside the bag, and **Take all** empties it.

For loot of your own, make an **Inv Loot Table** data asset: **Guaranteed** entries come every
time, then **Min Rolls** to **Max Rolls** draws from **Entries** by **Weight**. An entry's
**Table** rolls another table in its place. **Starting Items** on the container give fixed
contents instead.

For an enemy's drop, roll the table yourself on the server with **Roll** and a seed, and give each
stack to **Spawn Pickup** at the body, or put a container on the corpse.

## Set up a vendor

1. Make an actor Blueprint for the stall and add an **Inv Vendor**:

    | Field | Value |
    |---|---|
    | Display Name | `Greengrocer` |
    | Currency | `DA_Coins` |
    | Goods | an entry per item: **Item**, **Price** (0: the item's **Value**), **Stock** (-1: no end) |
    | Buys Tags | `Inv.Category.Food`, or empty to buy anything with a value |
    | Sell Ratio | `0.5`, the share of an item's value it pays |

2. Place it. In play, <kbd>E</kbd> at it opens its goods beside the bag. Click a good to buy one;
   Shift-click an item in the bag, or press **Y** on it, to sell it.

**Restock** puts every good's stock back.

## Keep money in a wallet

Coins in the bag take a slot and can be dropped; in a wallet they are a number, as in an MMO.

1. Add an **Inv Wallet** to the player's character (or controller, or player state).
2. Tag the currency item under `Inv.Currency`: the example `DA_Coins` has `Inv.Currency.Coins`.
   Each tag is a currency of its own: add `Inv.Currency.Tokens` and an item for it for a second.
3. Add the item to **Currencies** in **Project Settings > Plugins > Inventory**. The bag shows
   each one under it, the vendor's page the one it takes, and both count up or down as it changes.

From then on a currency item given to the player, picked up, looted, found in a chest they open or
paid by a vendor goes into the wallet, and buying spends from it. **Count Item**, **Give Item** and
**Take Item** count it with the bag, so a recipe or an errand that asks for coins works either way.
The wallet replicates to its player alone and is saved with **Save Inventory**.

## Make the bag a grid

Tick **Grid** on the bag's **Inv Container**. Each item then covers its **Size** in cells (the
example axe is 2 × 3), and the player turns the one in focus on its side with <kbd>R</kbd> or the
right trigger, where it fits. The screen's line of keys names **Rotate** only then, in a grid on an
item that isn't square. In a slot container an item takes one slot, whatever its size.

**Columns** and **Rows** set the grid. A **Max Weight** limits it by weight too, shown as **Carry
weight** in the equipment panel; the items' **Weight** is per unit.

## Show gear on your own character

The equipment puts a worn item's look on the character's mesh, the component tagged with its
**Body Component Tag**, or the character's mesh, or the first skeletal mesh.

- A **Mesh** (a hat, a sword) goes on a socket: the item's **Socket**, or the slot's. The slots'
  sockets are the UE5 mannequin's bones (`head`, `hand_r`, `hand_l`, `spine_05`, `pelvis`). On
  another skeleton, set each slot's **Socket** in the **Inv Equipment**'s **Slots** to a bone or
  socket of yours, and the item's **Offset** to sit it right.
- A **Skinned Piece** (a jerkin, boots) is a skeletal mesh on the same skeleton as the body. It
  follows the body's animation.

Your own slots are entries in **Slots**: a tag under `Inv.Slot` (`Inv.Slot.Ring.Left`), a label, a
socket and a side of the panel.

To react in your anim Blueprint, bind the equipment's **On Equipment Changed**: it gives the slot,
the stack and whether it went on. **Get Worn** says what's in a slot.

## Save and load

1. Make a **Save Game** Blueprint, `BP_Save`, with two variables: `Inventory` of type **Inv Save
   Data** and `World` of type **Inv World Save**.
2. To save, on the server: **Create Save Game Object** of `BP_Save`, set `Inventory` to **Save
   Inventory** with the player's pawn, set `World` to **Save World**, and **Save Game to Slot**.
3. To load: **Load Game from Slot**, cast to `BP_Save`, then **Load Inventory** with the player's
   pawn and `Inventory`, and **Load World** with `World`.

For several players, keep an **Inv Save Data** each, by your own id for them. **Load Inventory**
replaces what the player carries; **Load World** replaces the pickups lying around with the saved
ones.

```cpp
#include "InvLibrary.h"

// on the server
Save->Inventory = UInvLibrary::SaveInventory(PlayerPawn);
Save->World = UInvLibrary::SaveWorld(this);
// ...
UInvLibrary::LoadInventory(PlayerPawn, Save->Inventory);
UInvLibrary::LoadWorld(this, Save->World);
```

## Use your own UI

There are three ways, from the least work:

1. **Restyle it.** Copy `DA_InvStyle` (in **UI**) to your folder, change its fonts, colours,
   frames, rarities, stat names and filter tabs, and set it as **Style** in **Project Settings >
   Plugins > Inventory**. Every default widget takes it.
2. **Replace a widget.** Make a Widget Blueprint whose parent is **Inv Screen Widget** (or **Inv
   HUD Widget**). Left empty, it draws the plugin's look, and its **Refresh** event fires after
   each redraw for what you add. Given a designer tree of its own, it keeps yours and you fill it
   in **Refresh**. Set it as **Screen Class** (or **Hud Class**) in the settings.
3. **Build your own.** Make any widgets and read the player's **Inv Player** (**Find Player**):
   **Get Bag**, **Get Hotbar**, **Get Equipment**, **Is Inventory Open**, **Get Focus**, and each
   container's **Get Stacks**. Redraw on its **On View Changed**. Your buttons call its requests:
   **Move Item**, **Use Item**, **Craft**, **Buy**. Untick **Show Hud** and **Bind Default
   Input**, and open yours from your own input: **Screen Class** only takes an **Inv Screen
   Widget**, and none is the plugin's own.

The pieces, **Inv Slot Widget**, **Inv Container Widget**, **Inv Tooltip Widget**, **Inv
Equipment Widget**, **Inv Crafting Widget** and **Inv Vendor Widget**, can each be placed in a
widget of yours; set their player with **Set Player**, or they find the owning player's.

## Use your own input

The plugin binds its own Enhanced Input actions on the keys in **Project Settings > Plugins >
Inventory**: change the keys there. To bind them in your own input instead, untick **Bind Default
Input** and call the **Inv Player**'s **Toggle Inventory**, **Interact**, **Select Hotbar Slot**,
**Cycle Hotbar** and **Use Selected** from your actions. The screen's own keys (move, use, rotate,
change tab) work while it's open either way, before your game's: the key that opened it, or
<kbd>Esc</kbd> or **B**, closes it.

## Play it in multiplayer

Nothing to set up: the containers replicate and a player's requests go to the server
([The server and clients](concepts.md#the-server-and-clients)). Call the **Authority** nodes
(**Give Item**, **Add Item**, **Unlock**) on the server, and put the containers on the **Player
State** for them to outlive a respawn; on the pawn they're lost with it.

To try it, set **Play > Number of Players** to 2 and **Net Mode** to **Play As Listen Server**.

## Grant abilities while an item is worn

With the Gameplay Ability System, add the **Grant Abilities While Worn** trait to the item and
fill its **Abilities**, **Effects** and **Tags**: the wearer's Ability System Component has them
while it's worn ([the trait's fields](reference.md#grant-abilities-while-worn)).

## Use it with heyheythere's other plugins

Each takes a node or two; no plugin needs another.

### Farming & Fishing System

[Farming & Fishing](/docs/farming-fishing/) asks your inventory, through its **Farm Inventory**
interface, to take harvests and catches and give up seeds.

1. On `BP_ThirdPersonCharacter`, add **Farm Inventory** in **Class Settings > Implemented
   Interfaces**, and a variable `FarmItems`, a **Map** from **Name** to **Inv Item
   Definition**: `Turnip` to your `DA_Turnip`, `TurnipSeeds` to `DA_TurnipSeeds`, and so on.
2. In **Add Farm Item**: **Find** the **Item Id** in `FarmItems`, **Make Stack** with **Count**,
   and **Give Stack** with self. A crop's **Quality** (0 to 2) goes into the stack's **Quality**;
   a fish's is its size in cm, so keep that in the stack's **Values** under a tag of yours.
3. In **Consume Farm Item**: **Find** the item, and if **Count Item** is at least **Count**,
   **Take Item** and return true; otherwise false.

### Quest & Dialogue System

[Quest & Dialogue](/docs/quest-dialogue/) counts what your game reports.

- **Bring five carrots.** A carrot moved from the hotbar to the bag counts as coming in to the
  bag, so count what's carried instead. Keep an integer `CarrotsReported`, and bind the bag's and
  the hotbar's **On Item Count Changed** (server). When **Item** is `DA_Carrot` and **Count Item**
  is above `CarrotsReported`, **Report Quest Event** on **Get Quest Component** with
  `Collect.Carrot` and the difference as the count, then set `CarrotsReported` to it. An
  objective on `Collect.Carrot` with a count of 5 completes. To take them as delivered, **Take
  Item** 5 when the quest completes.
- **A reward.** In **On Quest State Changed**, when **New State** is **Completed**, **Give
  Item** to the player.

### RPG Skill Tree & XP System

[Progression](/docs/progression-skill-tree/) gives rewards your game reads.

- **A recipe from a skill.** Give the node an **Event** reward named `Recipe.Torch`. In **On
  Reward Event**, when **Event** is `Recipe.Torch` and **Rank** is above 0, **Find Crafter** and
  **Unlock** the tag `Recipe.Torch`: the event is a name, not a tag, so pick the tag on **Unlock**
  itself.
- **XP for crafting.** Bind the crafter's **On Crafted** (server), and on **Get Progression
  Component** with the crafter's owner, **Add XP** to a track of yours (`TK_Crafting`) with the
  **Batches** as the amount.

### GAS Ability & Status Effect System

[Ability & Status](/docs/ability-status/)'s **AS Ability System** is an Ability System Component,
so the GAS traits find it on the character.

- **A sword that grants a skill.** Its abilities are **AS Ability** data assets, granted by its
  own nodes, not by **Grant Abilities While Worn**. Bind the equipment's **On Equipment Changed**
  (server): when the sword goes on, **Grant Ability** with the ability and a slot; as it comes
  off, **Remove Ability**.
- **A potion.** **Usable** and **Apply Effect On Use** with `GE_Regeneration`, which heals 5 a
  second for 8 seconds.

### World Map, Minimap & Compass System

[Maps](/docs/map-minimap-compass/) puts your stalls and chests on the map.

- **A stall.** On the stall's Blueprint, beside its **Inv Vendor**, add a **Marker** with an icon
  from the Maps plugin's **Icons** (`T_Icon_Town`) and **Category** `Shop`. In the **Construction
  Script**, set the marker's **Label** to the vendor's **Display Name**: each stall is named on the
  map as it is over its goods.
- **A chest.** A **Marker** with `T_Icon_Chest` beside its **Inv Container**.

### NPC Behavior & Daily Life System

[NPCs](/docs/npc-daily-life/) work at spots. Put an **NL Spot** of kind `NPC.Spot.Work` behind your
stall's counter, kept for a role of yours (**Only For**): the stallkeeper stands there through
their working hours, and the player trades with the stall's **Inv Vendor** beside them.

### Procedural Village Generator

[The Village](/docs/village-generator/) makes **Trade** places at each market stall. In the
village's **On Generated** (server), **Find Places** of kind `Trade` and role `Square`, and spawn
your stall actor with its **Inv Vendor** at each place's **Transform**.
