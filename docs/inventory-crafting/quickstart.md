---
layout: guide
title: "Quickstart · Inventory, Equipment & Crafting System"
nav: Quickstart
order: 3
permalink: /docs/inventory-crafting/quickstart/
description: "Fifteen minutes from installing Inventory, Equipment & Crafting System to a Third Person character with a bag, a hotbar and equipment, who picks up wheat, crafts a straw hat from it and wears it."
---

# Quickstart: pick up, craft and wear

Fifteen minutes from an installed plugin to a character who picks up wheat, makes a straw hat of
it and wears it. You add four components to the character and one item to the level, then play.
No Blueprint graph is needed.

The steps use the **Third Person** template's level and character, with the plugin enabled
([Install](install.md)). Any character of yours works the same.

## 1. Give the character a bag and a hotbar

1. Open `BP_ThirdPersonCharacter` (in **Content > ThirdPerson > Blueprints**).
2. In its **Components** panel, click **Add** and search `Inv Container`. Add one: this is the
   bag. Its **Container Tag** is already `Inv.Container.Bag`, with 7 columns and 6 rows of slots.
3. Add a second **Inv Container**, for the hotbar, and in its **Details** set:

    | Field | Value |
    |---|---|
    | Container Tag | `Inv.Container.Hotbar` |
    | Columns | `10` |
    | Rows | `1` |

    {% include figure.html src="hotbar.png" alt="The second Inv Container's Details: Container Tag Inv.Container.Hotbar, Display Name empty, Columns 10, Rows 1, Grid unticked, Max Weight 0, Accept Tags and Refuse Tags empty, Owner Only ticked, Openable unticked, Open Range 300 cm, Supplies ticked, Save with World unticked, Starting Items empty." caption="The hotbar: one row of ten slots, picked with <kbd>1</kbd> to <kbd>0</kbd>." %}

The tag is what makes a container the bag or the hotbar to the screen. Every other field can stay
as it comes.

## 2. Let them wear and craft

1. Click **Add** again and add an **Inv Equipment**. It comes with eight slots, from Head to Belt,
   most on a socket of the UE5 mannequin's skeleton, and puts what's worn on the character's mesh.
2. Add an **Inv Crafter**. In its **Details**, click **+** beside **Recipes** and pick
   `RC_StrawHat`: six Wheat make a Straw Hat, anywhere, with no station.

    {% include figure.html src="crafter.png" alt="The Inv Crafter's Details: its variable name InvCrafter and, under Crafting, Recipes with one array element and Max Queue 8." caption="The crafter knows one recipe." %}

3. **Compile** and **Save**. The character now has four new components:

    {% include figure.html src="components.png" size="small" alt="BP_ThirdPersonCharacter's Components panel: the capsule, mesh, camera boom and camera, then InvContainer, InvContainer1, InvCrafter and InvEquipment." caption="The bag, the hotbar, the equipment and the crafter." %}

`RC_StrawHat` is one of the plugin's example recipes, in **Plugins > Inventory, Equipment & Crafting
System > Examples > Recipes**; if the picker doesn't list it, [show plugin content](install.md#enable-it-in-your-project).

## 3. Put wheat in the level

1. Open **Window > Place Actors**, search `Inv Pickup`, and drag an **Inv Pickup** onto the floor
   ahead of the player start.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for Inv Pickup, listing Inv Pickup." caption="**Inv Pickup** in **Place Actors**." %}

2. In its **Details**, open **Stack** and set **Item** to `DA_Wheat` and **Count** to `6`. It lies
   there as a sack, the look of an item with no **World Mesh** of its own.

    {% include figure.html src="pickup.png" alt="The Inv Pickup's Details: Stack with Item DA_Wheat and Count 6, Slot -1, Rotated unticked, Durability -1, Quality 0, Values empty; Auto Pick Up unticked, Verb empty, Mesh Override empty, Lifetime 0." caption="Six wheat, lying on the floor." %}

3. Save the level (<kbd>Ctrl</kbd>+<kbd>S</kbd>).

## 4. Play

Press **Play**.

1. Walk up to the wheat. A glint sparkles over it and the prompt says **Pick up Wheat ×6**. Press
   <kbd>E</kbd>: the wheat goes into the bag, and **+6** shows at the side of the screen.

    {% include figure.html src="picked.jpg" alt="The game: the Third Person character on the floor where the wheat lay, a +6 Wheat toast at the side, and the empty hotbar of ten slots along the bottom." caption="Picked up." %}

2. Press <kbd>I</kbd>. The inventory opens: the bag with the wheat in it, and the equipment panel
   with your character in the middle.
3. Click the **Crafting** tab, pick **Straw Hat** and click **Craft**. The six wheat become a
   straw hat in the bag.

    {% include figure.html src="crafting.jpg" size="wide" alt="The crafting page: the recipe list with Straw Hat chosen, its ingredient Wheat at 0 of 6 now spent, the Craft and Craft all buttons, and the bag beside it holding the Straw Hat." caption="The crafting page, the hat just made." %}

4. Click the **Inventory** tab and right-click the hat. It goes into the **Head** slot, and onto
   your character's head in the preview and in the game.

    {% include figure.html src="worn.jpg" size="wide" alt="The inventory page: the equipment panel with the Straw Hat in the Head slot, the character in the middle wearing it, and Armor 3 in the stats under it; the bag beside it empty." caption="Worn: the hat in the Head slot, its armour counted." %}

5. Press <kbd>I</kbd> again to close it.

    {% include figure.html src="hat.jpg" alt="The game: the Third Person character seen from behind, wearing the straw hat." caption="In the game, for every player to see." %}

On a gamepad, **View** opens the inventory, **X** picks up, and on the screen **A** picks a stack up
and puts it down, **X** uses or wears it, and the shoulders change tab.

`Inventory.Dump` in the console (<kbd>&#96;</kbd>) writes the containers and what's worn to the
Output Log. For the Gameplay Debugger, press <kbd>'</kbd> (apostrophe): its **Inventory**
category shows the same, live.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's Inventory category: the bag 0 of 42 slots, the hotbar 0 of 10, the equipment 1 of 8 holding [0] DA_StrawHat x1, the stats Armor 3.0, and crafting: 1 recipes, the queue empty." caption="The Gameplay Debugger's **Inventory** category." %}

If something doesn't happen as written, [Troubleshooting](troubleshooting.md) has the usual
causes.

## Next

- [Make an item of your own](how-to.md#make-an-item-of-your-own).
- [Craft at a workbench](how-to.md#craft-at-a-workbench).
- [Concepts](concepts.md): items, containers, the player component and the server.
