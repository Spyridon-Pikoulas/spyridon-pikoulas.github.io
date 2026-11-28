---
layout: guide
title: "Troubleshooting · Inventory, Equipment & Crafting System"
nav: Troubleshooting
order: 7
permalink: /docs/inventory-crafting/troubleshooting/
description: "Fixes for the usual problems with Inventory, Equipment & Crafting System: I or E doing nothing, items not picked up or no room, gear not showing, recipes that can't be made, client changes lost, saves, packaging, and questions on Blueprint, GAS, Common UI and Lyra."
---

# Troubleshooting

Each problem as you'd notice it, why it happens and the fix. `Inventory.Dump` in the console and
the Gameplay Debugger's **Inventory** category (<kbd>'</kbd>) show what the player carries, which
answers most of them.

## The plugin isn't in the Plugins window

It isn't installed to that engine version. In the Epic Games Launcher's **Fab Library**, click
**Install to Engine** for the version your project uses, then restart the editor.

## I or E does nothing

- **No Inv Player.** **Add Player Component** is off in **Project Settings > Plugins >
  Inventory**, so add an **Inv Player** to your player controller yourself.
- **Your input takes the keys first.** Your own mapping context has <kbd>I</kbd>, <kbd>Tab</kbd> or
  <kbd>E</kbd> at a higher priority. Raise the settings' **Input Priority**, or change the
  plugin's keys.
- **Your game binds input itself.** With **Bind Default Input** off, call **Toggle Inventory** and
  **Interact** on the Inv Player from your own actions.
- **The game's input mode is UI only.** The inventory's keys are game input while it's closed:
  keep the input mode **Game Only** or **Game and UI**.

## I opens an empty screen

The player's character has no **Inv Container**, or its **Container Tag** isn't
`Inv.Container.Bag`. The screen shows the bag and hotbar by their tags.

## Walking up to an item shows no prompt

- It's beyond **Interact Range** (250 cm in the settings), measured from the pawn.
- The pickup's **Stack** has no **Item**: there's nothing to pick up.

## <kbd>E</kbd> at an item answers "No room"

Neither the bag nor the hotbar takes it: they're full, it's over the bag's **Max Weight**, or the
bag's **Accept Tags** or **Refuse Tags** turn it away.

## The item goes into the hotbar, not the bag

An item first tops up the stacks of it the supplies hold, the hotbar's included; what's left
takes free slots, the bag's first, then the hotbar's when the bag is full or refuses the item.
A container with **Supplies** unticked is never filled this way.

## Worn gear doesn't show on the character

- The item's **Equippable** has no **Mesh** or **Skinned Piece**.
- The socket isn't on your skeleton. The slots' sockets are the UE5 mannequin's bones; set your
  own in the **Inv Equipment**'s **Slots** or the item's **Socket**.
- A **Skinned Piece** is on another skeleton than the body's.
- The equipment puts gear on the wrong mesh: a character with several skeletal meshes. Tag the
  body's component and set **Body Component Tag**.
- **Show Worn** is off.

## The equipment panel shows no character

**Character Preview** is off in the settings, or the player has no pawn. The preview draws the
pawn and the actors attached to it, and nothing else in the level.

## A recipe can't be made

Its **Craft** button is greyed out, and **Can Craft** says why (in the words of **Get Result
Text**):

- **Missing ingredients**: the inputs must be in containers that **Supply** (the bag and hotbar).
  The page shows each against what's carried.
- **Needs a station nearby**: no **Inv Station** of the recipe's **Station Tag** is within its
  **Range**. The page says "Made at a Workbench."
- **Not learnt yet**: the recipe has an **Unlock Tag** the crafter hasn't unlocked. The list
  shows it as **Locked**, and the page says "You haven't learnt this yet."
- **No room**: the crafter has **Max Queue** orders already.

A recipe doesn't appear at all when it isn't in the crafter's **Recipes**.

## Give Item or Add Item does nothing on a client

A client changed a container with an **Authority** node (**Add Item**, **Give Item**, **Remove
Item**). These run on the server only. From a client, use the **Inv Player**'s requests (**Move
Item**, **Use Item**, **Craft**), or your own Run on Server event that calls the Authority node.

## Multiplayer: another player's bag is empty on my screen

That's by design: a container with **Owner Only** replicates to its owner alone. Untick it for a
container others should see, or make it **Openable**, as a chest is.

## Items are gone after loading

- **Load Inventory** needs the same actor kind as was saved: a container saved from the pawn is
  found on the pawn again, by its component's name. Renaming the component loses it.
- **Save Inventory** and **Load Inventory** run on the server: called on a client, they do
  nothing.
- Chests come back with **Load World** only when their container has **Save With World** ticked.

## Dropped items come back after loading

**Load World** puts the pickups back as they were saved. Save after the drop, or don't call
**Load World** if your game doesn't keep the level's side.

## The packaged game is missing items or recipes

Items and recipes nothing cooked references, ones your game finds by path or name, weren't cooked.
In **Project Settings > Asset Manager > Primary Asset Types to Scan**, add `InvItem` with **Asset
Base Class** **Inv Item Definition** and `InvRecipe` with **Inv Recipe**, each with your folders in
**Directories** and **Cook Rule** **Always Cook**.

What the plugin's settings name (the style, the screen and HUD classes, the currencies, the
materials) the plugin adds to the cook itself.

## "Unable to load plugin" in a packaged Blueprint project

The plugin is in the project's `Plugins` folder without `"EnabledByDefault": false,`. See the tip
in [Install](install.md#use-it-from-c).

## Questions

**Blueprint or C++?** Either. Every node on these pages is Blueprint; the C++ is the same calls.
C++ projects add the module to their `Build.cs` ([Install](install.md#use-it-from-c)).

**Do I need the Gameplay Ability System?** No. Its traits are in their own module and only used
if you add them to an item.

**Does it work with Common UI or Lyra?** The components work on any actor, so Lyra's character,
controller and player state can carry them. The default screen is a plain UMG widget: in a Common
UI game, untick **Show Hud**, set **Bind Default Input** off, and push a screen of your own that
reads the **Inv Player**, as [Use your own UI](how-to.md#use-your-own-ui) shows.

**How many items can a container hold?** Up to 64 by 64 slots. A change replicates only the stacks
it touched.

**Can I ship the example items?** Yes: the items, icons, gear and style are yours to use in your
game, changed or not.

Anything else, ask in the listing's comments on Fab or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com), with your engine version, what you did and
what happened.
