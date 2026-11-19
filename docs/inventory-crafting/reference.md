---
layout: guide
title: "Reference · Inventory, Equipment & Crafting System"
nav: Reference
order: 6
permalink: /docs/inventory-crafting/reference/
description: "Every Blueprint node, event, asset field, setting and console command of Inventory, Equipment & Crafting System: items and traits, containers, equipment, crafting, stations, vendors, pickups, loot, the Inv Player, the library, save, the style and widgets."
---

# Reference

Every node, event, field, setting and command, by the class it's on. Nodes marked **Server** are
Authority-only: they change things directly, check nothing, and do nothing on a client.

## Settings

**Project Settings > Plugins > Inventory**.

| Setting | Default | What it does |
|---|---|---|
| Add Player Component | on | Every player controller gets an **Inv Player** as it logs in. Off: add it to your controller yourself. |
| Style | `DA_InvStyle` | The look of every default widget ([Inv Style](#inv-style)). |
| Screen Class | none | The inventory screen; none is **Inv Screen Widget**. |
| Hud Class | none | The hotbar, toasts and prompt; none is **Inv HUD Widget**. |
| Show Hud | on | Off: no HUD. |
| Currencies | none | The game's money, each shown under the bag. One tagged under `Inv.Currency` is kept in the player's [Inv Wallet](#inv-wallet) when they have one; any other is counted in the bag. |
| Character Preview | on | The player's own character, live, in the equipment panel. Off: the slots alone. |
| Preview Material | `M_InvPreview` | Draws the capture: a texture parameter `Capture`, its alpha the inverse of coverage. |
| Preview Resolution | 768 | The capture's height in pixels; its width is two thirds of it. |
| Pickup Mesh | `SM_InvSack` | What an item with no **World Mesh** looks like on the ground. |
| Glint Material | `M_InvGlint` | The sparkle; a material with `Color`, `Phase` and `Strength` parameters. |
| Pickup Class | none | What dropped items spawn as; none is **Inv Pickup**. |
| Interact Range | 250 cm | How far Interact reaches. |
| Bind Default Input | on | The plugin's own Enhanced Input actions on the keys below. Off: call the Inv Player's nodes from your input. |
| Toggle Keys | <kbd>I</kbd>, <kbd>Tab</kbd>, View | Open and close the inventory. |
| Interact Keys | <kbd>E</kbd>, X | Pick up, open, trade or craft at what's in reach. |
| Hotbar Keys | <kbd>1</kbd> to <kbd>0</kbd> | The hotbar's slots, first to last. |
| Hotbar Next Keys, Hotbar Previous Keys | D-pad right, D-pad left | The hotbar's selection one along. |
| Use Selected Keys | D-pad up | Uses what the hotbar's selection holds. |
| Input Priority | 1 | The mapping context's priority against your game's. |

## Inv Item Definition

A data asset: **Add > Miscellaneous > Data Asset > Inv Item Definition**. A primary asset of type
`InvItem`.

| Field | Default | What it is |
|---|---|---|
| Display Name | none | Its name; the asset's name when empty. |
| Description | none | The tooltip's text. |
| Icon | none | Its slot's picture. Data Validation flags an item without one. |
| World Mesh | none | Its look on the ground; the settings' **Pickup Mesh** when none. |
| Max Stack | 1 | How many one stack holds. |
| Weight | 0 | A unit's weight, against a container's **Max Weight**. |
| Size | 1 × 1 | The cells it covers in a grid, up to 8 × 8. |
| Tags | none | What it is, for filters, containers and vendors: `Inv.Category.Tool` and your own. |
| Rarity | none | `Inv.Rarity.*`; the style colours its slot and name by it. None is Common. |
| Value | 0 | A unit's worth in the vendors' currency. |
| Traits | none | What it does ([traits](#traits)). |

| Node | What it does |
|---|---|
| Find Trait (Class) | Its trait of a class, or none. |
| Make Stack (Count) | A new stack of it, its durability full. |
| Get Unit Value (Stack) | Its value with the stack's quality, a unit. |
| Get Label | Display Name, or the asset's name. |

## Traits

Added to an item's **Traits**. Make your own as a Blueprint child of **Inv Item Trait**.

### Inv Item Trait

| Event | When |
|---|---|
| On Equipped (Equipment, Stack, Slot Tag) | On the server, a stack of the item goes into an equipment slot. |
| On Unequipped (Equipment, Stack, Slot Tag) | On the server, it leaves the slot. |
| On Use (User, Container, Stack) | On the server, the item is used from a container. Return true when the use took effect. |
| Get Tooltip Lines (Stack, Lines) | Its tooltip is drawn, on that player's machine: add lines, shown under the stats. |

### Equippable

| Field | What it is |
|---|---|
| Slot Tag | The slot it goes in (`Inv.Slot.Head`). A slot under this tag takes it too, so `Inv.Slot` fits any. |
| Stats | What it adds while worn: a tag and a value each (`Inv.Stat.Armor` `12`). |
| Mesh | A static mesh put on the body at the socket: a hat, a sword, a lantern. |
| Skinned Piece | A skeletal mesh on the body's skeleton that follows it: a tunic, boots. |
| Socket | Where Mesh goes; the slot's socket when none. |
| Offset | Mesh's transform from the socket. |

### Usable

| Field | Default | What it is |
|---|---|---|
| Consumed | on | One is spent by each use that takes effect. |
| Verb | none | The tooltip's word for using it: Eat, Drink, Read. |

Usable alone does nothing but take effect: the use is the Inv Player's **On Item Used**, another
trait's **On Use**, or **Apply Effect On Use**.

### Durability

| Field | Default | What it is |
|---|---|---|
| Max | 100 | Full durability. A new stack has it. |
| Breaks | off | At 0 one of the stack is used up and the rest are whole again. Off: it stays at 0. |

### Quality

| Field | Default | What it is |
|---|---|---|
| Names | Normal, Silver, Gold | The grades' names, 0 to 2. |
| Value Multipliers | 1, 1.25, 1.5 | What each grade multiplies the value by. |

### Grant Abilities While Worn

In the **InventoryCraftingGAS** module.

| Field | What it is |
|---|---|
| Abilities | Gameplay Abilities granted while worn. |
| Effects | Gameplay Effects applied while worn; the item's stats go to them as Set By Caller magnitudes, by tag. |
| Tags | Loose tags on the wearer while worn. |
| Level | The abilities' and effects' level. |
| Level By Quality | Adds the stack's quality to the level. |

The Ability System Component is found on the player's pawn, then their controller, then their
player state.

### Apply Effect On Use

In the **InventoryCraftingGAS** module.

| Field | What it is |
|---|---|
| Effect | The Gameplay Effect applied to the user. |
| Level | Its level. |
| Set By Caller | Magnitudes it reads by tag; the item's Equippable stats are added. |

## Inv Item Stack

What a slot holds. **Make Stack** on an item gives one.

| Field | What it is |
|---|---|
| Item | The item. |
| Count | How many. |
| Slot | The slot it's in; in a grid, the cell of its top left corner. |
| Rotated | In a grid, on its side. |
| Durability | What wear has left; -1 for an item without durability. |
| Quality | 0, 1 or 2. |
| Values | Anything else it carries, by tag. |

Two stacks merge when their item, quality, durability and values are the same.

## Inv Container

A component: **Add > Inv Container** on any actor.

| Field | Default | What it is |
|---|---|---|
| Container Tag | `Inv.Container.Bag` | What it is to the screen and the saves: `Inv.Container.Bag`, `Inv.Container.Hotbar`, `Inv.Container.Chest`, your own. |
| Display Name | none | The name over it on the screen. |
| Columns, Rows | 7, 6 | Its slots or cells. |
| Grid | off | Items cover their **Size** and may be rotated. Off: one stack a slot. |
| Max Weight | 0 | The most it carries; 0 for no limit. |
| Accept Tags | none | When set, only items with one of these go in. |
| Refuse Tags | none | Items with one of these never go in. |
| Owner Only | on | Its contents replicate to its owner's player alone. |
| Openable | off | Any player can open it with Interact, and take and put. Everyone's. |
| Open Range | 300 cm | How far it stays open, and how near a player must be to move items in or out if it isn't theirs. Interact opens it from **Interact Range** (250 cm) or this, whichever is nearer. |
| Supplies | on | Crafting and vendors take from it, and what's made or bought goes into it, when it's the player's. |
| Save With World | off | Kept by **Save World** (a chest). A player's containers are saved with **Save Inventory**. |
| Loot Table | none | Rolled into it on the server as play begins, when it's empty. |
| Loot Seed | 0 | The loot's seed; 0 for a new one each play. |
| Starting Items | none | What it starts with, before any loot. |

| Event | When |
|---|---|
| On Changed (Container) | Its contents changed, on every machine that sees them. |
| On Selected Changed (Container) | A hotbar's chosen slot changed, on every machine. |
| On Item Count Changed (Container, Item, Delta) | On the server: so many of an item came in (above 0) or went out. |

| Node | What it does |
|---|---|
| Get Slot Count | Columns × Rows. |
| Get Stacks | Every stack in it. |
| Get Stack At (Slot) | The stack covering a slot; false for an empty one. |
| Get Selected Slot, Get Selected Stack | A hotbar's chosen slot, and what it holds. |
| Count Item (Item), Count Tagged (Tag) | How many of an item, or of items with a tag. |
| Get Weight | What it holds, in weight. |
| Is Slot Free (Slot) | No stack covers it. |
| Get Stack Size (Stack) | The cells a stack covers. |
| Accepts (Item, Slot) | Whether the item may go in at all, or at that slot. |
| Get Room For (Stack) | How many of the stack would fit. |
| Add Item (Item, Count) | **Server.** Adds up to Count, merging first; returns how many went in. |
| Add Stack (Stack) | **Server.** The same for a stack with its own data. |
| Put Stack (Stack) | **Server.** Puts it at its **Slot** as it is, if it fits there. |
| Remove Item (Item, Count) | **Server.** Takes up to Count from anywhere, smallest stacks first; returns how many. |
| Remove From Slot (Slot, Count) | **Server.** Takes up to Count (0: all) from a slot; returns what was taken. |
| Set Stack At (Slot, Stack) | **Server.** Changes a stack in place: its count, wear or values. |
| Damage Durability (Slot, Amount) | **Server.** Wears the stack; at 0 one breaks if its trait says so. |
| Clear | **Server.** Empties it. |
| Set Selected Slot (Slot) | **Server.** A hotbar's selection. |
| Sort Items | **Server.** Merges what it can, then lays out by size (a grid's largest first), the item's first tag, name, and quality (best first). |
| Fill From Loot (Table, Seed) | **Server.** Rolls a loot table into it. |

## Inv Equipment

A component: **Add > Inv Equipment**. An [Inv Container](#inv-container) of slots by tag,
`Inv.Container.Equipment`, seen by everyone near.

| Field | Default | What it is |
|---|---|---|
| Slots | eight, below | Each a **Tag**, a **Label**, a **Socket**, and **Right Side** for the panel's side. |
| Body Component Tag | none | The mesh worn things go on: the component with this tag; none is the character's mesh, or the first skeletal mesh. |
| Show Worn | on | Puts what's worn on the body. |

| Slot | Tag | Socket |
|---|---|---|
| Head | `Inv.Slot.Head` | `head` |
| Body | `Inv.Slot.Body` | none: skinned pieces |
| Main Hand | `Inv.Slot.Hand.Main` | `hand_r` |
| Feet | `Inv.Slot.Feet` | none: skinned pieces |
| Back | `Inv.Slot.Back` | `spine_05` |
| Trinket | `Inv.Slot.Trinket` | none |
| Off Hand | `Inv.Slot.Hand.Off` | `hand_l` |
| Belt | `Inv.Slot.Belt` | `pelvis` |

| Event | When |
|---|---|
| On Equipment Changed (Slot Tag, Stack, Equipped) | On every machine, as an item goes on or comes off. |
| On Stats Changed | The sums changed. |

| Node | What it does |
|---|---|
| Get Stat (Stat) | A stat summed over what's worn; 0 when nothing gives it. |
| Get Stats | Every stat and its sum. |
| Find Slot (Slot Tag) | The slot index of a tag. |
| Get Slot For (Item) | The slot an item would go in: an empty one that takes it, else the first. |
| Get Worn (Slot Tag) | What's in a slot. |
| Compare (Item) | The item's stats against what's in the slot it would take: each **Stat**, **Value** and **Worn**. |
| Get Worn Mesh (Slot Tag) | The component drawing a slot's look, while something is worn there. |
| Get Body | The mesh worn things go on. |

## Inv Recipe

A data asset: **Add > Miscellaneous > Data Asset > Inv Recipe**. A primary asset of type
`InvRecipe`.

| Field | What it is |
|---|---|
| Display Name | Its name; the first output's when empty. |
| Inputs | Items and counts it takes. |
| Outputs | Items and counts it makes. Data Validation flags a recipe that makes nothing. |
| Station Tag | Made only near a station of this tag (`Inv.Station.Workbench`); none: anywhere. |
| Time | Seconds a batch takes; 0 makes it at once. |
| Unlock Tag | Known only once the crafter has this tag unlocked; none: known from the start. |
| Category | The crafting page's tab it's listed under (`Inv.Category.Tool`). |

| Node | What it does |
|---|---|
| Get Label | Display Name, or the first output's. |
| Get Main Output | The first output's item. |

## Inv Crafter

A component on the player's character, controller or player state: **Add > Inv Crafter**.

| Field | Default | What it is |
|---|---|---|
| Recipes | none | Every recipe it could know. The crafting page lists them, the locked ones as such. |
| Max Queue | 8 | Orders held at once. |

| Event | When |
|---|---|
| On Queue Changed | The queue or the unlocked tags changed, on every machine that sees it. |
| On Crafted (Recipe, Batches) | On the server, as a batch is made. |

| Node | What it does |
|---|---|
| Is Known (Recipe) | In its recipes, and unlocked. |
| Get Unlocked | Its unlocked tags. |
| Get Queue | Its orders: each **Recipe**, **Count** of batches left and **Ends**. |
| Get Progress | The batch under way, 0 to 1. |
| Get Craftable Count (Recipe) | How many batches the supplies make; 0 when it isn't known or no station is near. |
| Can Craft (Recipe, Count) | Whether it may be ordered now, and why not. |
| Is Near Station (Station Tag) | A station of the tag is in range; true for none. |
| Craft (Recipe, Count) | **Server.** Takes the inputs and queues the batches. A player orders through the Inv Player's **Craft**. |
| Cancel (Index) | **Server.** Drops an order; the inputs of its batches left, the one under way included, come back. |
| Unlock (Tag) | **Server.** |
| Set Unlocked (Tags) | **Server.** |

## Inv Station

A component on a workbench, a stove, an anvil: **Add > Inv Station**.

| Field | Default | What it is |
|---|---|---|
| Station Tag | none | `Inv.Station.Workbench`, `Inv.Station.Cooking`, `Inv.Station.Anvil`, your own. |
| Display Name | none | Its name, in the prompt ("Use Workbench") and over the crafting page. |
| Range | 300 cm | How near the crafter must be to craft at it, and how far its page stays open. Interact opens it from **Interact Range** (250 cm) or this, whichever is nearer. |

## Inv Vendor

A component on a stall or a shopkeeper: **Add > Inv Vendor**.

| Field | Default | What it is |
|---|---|---|
| Display Name | none | Its name over its goods. |
| Currency | none | The item it's paid in. |
| Goods | none | Each an **Item**, a **Price** (0: the item's **Value**), a **Stock** (-1: no end) and a **Quality**. |
| Buys Tags | none | It buys items with one of these tags; none: anything with a value. |
| Sell Ratio | 0.5 | What it pays: this share of the item's value. |
| Range | 300 cm | How near a player must be to trade, and how far the trade stays open. Interact opens it from **Interact Range** (250 cm) or this, whichever is nearer. |

| Event | When |
|---|---|
| On Changed | Its stock changed, on every machine that sees it. |

| Node | What it does |
|---|---|
| Get Stock (Good), Get Price (Good) | A good's stock left (-1: no end) and price. |
| Get Offer (Stack) | What it pays for a unit; 0 when it doesn't buy it. |
| Can Buy (Buyer, Good, Count) | Whether the buyer can buy, and why not. |
| Buy (Buyer, Good, Count), Sell (Seller, From, Slot, Count) | **Server.** A player trades through the Inv Player's **Buy** and **Sell**, which check the range first. |
| Restock | **Server.** Every good's stock back to what it was set to. |

A vendor's currency tagged under `Inv.Currency` is taken from and paid into the player's wallet
when they have one.

## Inv Wallet

Money apart from the bag, by currency tag: **Add > Inv Wallet** on the player's pawn, controller or
player state. An item tagged with a currency that reaches its player (given, picked up, looted,
found in a container they open, paid by a vendor) is paid into it. It replicates to its player
alone.

| Event | When |
|---|---|
| On Changed (Currency, Delta) | An amount changed: on the server, and on the player's machine as it arrives. |

| Node | What it does |
|---|---|
| Get Amount (Currency), Get Amounts | One currency's amount, or every one held. |
| Add (Currency, Amount) | **Server.** Adds to it. |
| Spend (Currency, Amount) | **Server.** Takes all of it, or nothing and false when there isn't that much. |
| Set Amounts (Amounts) | **Server.** Everything at once. |

## Inv Pickup

An actor: **Place Actors > Inv Pickup**, or **Spawn Pickup**.

| Field | Default | What it is |
|---|---|---|
| Stack | none | What lies there: set **Item** and **Count**. |
| Auto Pick Up | off | A pawn that walks into it takes it, if it has room. |
| Verb | none | The prompt's word: **Pick up** when empty; Pull, Harvest or Gather suit a crop. |
| Mesh Override | none | Drawn as this instead of the item's World Mesh: a carrot still in the ground. |
| Lifetime | 0 | Gone after this many seconds; 0 for never. |

It has a **Glint** component ([Inv Glint](#inv-glint)).

| Node | What it does |
|---|---|
| Give To (Taker) | **Server.** Gives what fits to the taker's containers; gone once empty. Returns how many. |
| Spawn Pickup (What, Transform) | **Server.** A pickup of a stack, in the world. |

## Inv Loot Table

A data asset: **Add > Miscellaneous > Data Asset > Inv Loot Table**.

| Field | Default | What it is |
|---|---|---|
| Guaranteed | none | Entries given every time. |
| Entries | none | Entries drawn from by weight. |
| Min Rolls, Max Rolls | 1, 3 | How many draws. |
| Nothing Weight | 0 | A draw's weight of landing on nothing. |

An entry has an **Item**, or a **Table** to roll in its place, a **Weight**, **Min Count** to **Max
Count**, and **Min Quality** to **Max Quality**.

| Node | What it does |
|---|---|
| Roll (Seed) | The stacks it gives for a seed; the same seed gives the same loot. |

## Inv Player

A component on each player controller, added by the settings. Find it with **Find Player**.

| Event | When |
|---|---|
| On View Changed | What the screen shows changed. The widgets redraw on it. |
| On Result (Result) | The server's answer to a request, on the requesting machine. |
| On Item Used (Stack, User) | On the server, an item this player used took effect, before one is spent. |

The player's own:

| Node | What it does |
|---|---|
| Get Bag, Get Hotbar, Get Equipment, Get Crafter | Their containers and crafter. |
| Can Reach (Container) | Theirs, or an openable one near enough. |
| Get Interactable | What Interact would do now: its **Kind**, **Target** and **Prompt**. |
| Get Last Result (Time) | The last refusal and when. |
| Get Toasts, Clear Toasts | What came in lately, for the HUD. |

The screen, on the player's own machine:

| Node | What it does |
|---|---|
| Toggle Inventory, Open Inventory (Page), Close Inventory, Is Inventory Open | The screen. **Page** is Inventory or Crafting. |
| Set Page, Get Page | The tab. |
| Open Container, Open Vendor, Open Station | The screen with a chest, a vendor or a station's recipes. Interact calls them. |
| Get Open Container, Get Open Vendor, Get Open Station | What's open. |
| Set Focus, Get Focus | The slot the pointer or the gamepad is on: what the tooltip shows. |
| Hold, Unhold, Place Held, Get Held, Get Held Count | A stack picked up to put down elsewhere, as the gamepad's **A** does. |
| Set Filter, Get Filter, Passes Filter | The bag's filter tab. |
| Select Recipe, Get Selected Recipe, Get Recipes | The crafting page's recipe. |
| Get Preview, Keep Preview, Add Preview Yaw | The character preview's material, kept capturing while shown, and turned. |
| Clock | What toasts and messages age by: real time, which pause doesn't stop. |

Requests, sent to the server, which checks and does them:

| Node | What it does |
|---|---|
| Move Item (From, From Slot, To, To Slot, Count, Rotate) | Moves, merges or swaps. To Slot -1: wherever it fits. Count 0: all. |
| Quick Move (Container, Slot) | To where it most likely goes: worn gear off, the player's into an open chest or sold to an open vendor, gear in the bag or hotbar worn, then between hotbar and bag. |
| Split Stack (Container, Slot) | Half into a free slot of the same container. |
| Rotate Item (Container, Slot) | In a grid, onto its other side. |
| Use Item (Container, Slot) | Equips what's wearable, uses what's usable. |
| Use Selected | Uses the hotbar's selection. |
| Drop Item (Container, Slot, Count) | At the player's feet. Count 0: all. |
| Sort Container (Container) | Sorts it. |
| Take All (From) | Everything in it into the player's supplies; from the bag, into the open container. |
| Craft (Recipe, Count), Cancel Craft (Index) | Orders and cancels. |
| Buy (Vendor, Good, Count), Sell (Vendor, Container, Slot, Count) | Trades. |
| Select Hotbar Slot (Slot), Cycle Hotbar (Step) | The hotbar's selection. |
| Interact | Picks up, opens, trades with or crafts at the nearest thing in reach. |
| Pick Up (Pickup) | Picks up that pickup. |

### Results

**On Result** and **Can Craft**'s answers; **Get Result Text** gives the words.

| Result | Means |
|---|---|
| Done | It was done. |
| Nothing There | No stack at that slot. |
| No Room | It doesn't fit. |
| Too Heavy | Over the container's **Max Weight**. |
| Not Allowed | Not the player's, or the container refuses the item. |
| Too Far | Out of range. |
| Missing Items | Not enough of a recipe's inputs. |
| Not Unlocked | The recipe is locked. |
| No Station | No station of its tag near. |
| Cannot Afford | Not enough currency. |
| Out Of Stock | The vendor has none left. |
| Not Equippable | No slot takes it. |
| Not Usable | Nothing to do with it. |
| Invalid | A request that makes no sense. |

## Inventory Library

Nodes anywhere, each taking any of the player's actors (pawn, controller or player state).

| Node | What it does |
|---|---|
| Get Player Actors (Anyone) | The player's pawn, controller and player state. |
| Get Containers (Anyone) | Every container on them, the bag first. |
| Get Supplies (Anyone) | Those that supply: bag, hotbar, then the rest. |
| Find Container (Anyone, Container Tag) | The player's container of a tag. |
| Find Equipment, Find Crafter, Find Player (Anyone) | The player's equipment, crafter and Inv Player. |
| Find Wallet (Anyone) | The player's Inv Wallet, or none. |
| Get Currency (Item), Find Currency Item (Currency) | An item's tag under `Inv.Currency` (none: an item like any other), and the settings' item for a currency. |
| Count Item (Anyone, Item) | How many their supplies hold, with their wallet's for a currency. |
| Give Item (Anyone, Item, Count, Drop Rest) | **Server.** Into their supplies, or their wallet for a currency; the rest dropped at their feet if Drop Rest. Returns how many went in. |
| Give Stack (Anyone, Stack, Drop Rest) | **Server.** The same for a stack with its own data. |
| Take Item (Anyone, Item, Count) | **Server.** Out of their wallet, then their supplies; returns how many. |
| Get Result Text (Result) | The words for a result: "No room", "Too far away". |

## Save

| Node | What it does |
|---|---|
| Save Inventory (Anyone) | **Server.** The player's (or an actor's) containers, wallet, hotbar selection and unlocked recipes, as an **Inv Save Data**. |
| Load Inventory (Anyone, Data) | **Server.** Puts it back over what's there. |
| Save World | **Server.** The level's side as an **Inv World Save**: the pickups lying around, the containers ticked **Save With World**, and the vendors' stock. |
| Load World (Data) | **Server.** Puts it back; the pickups lying around are replaced by the saved ones. |

Containers are found again by their actor and component name. Items are saved by path, so a
renamed one loads through its redirector.

## Inv Glint

A component: a small sparkle on something the player can take or use. A pickup has one; add it to
anything else.

| Field | Default | What it is |
|---|---|---|
| Glint On | on | Off: never shown. **Set Glint On** in play. |
| Range | 300 cm | How near the player's pawn comes before it shows. |
| View Angle | 40° | How far off the middle of the view it still shows. |
| Fade Seconds | 0.35 | Its fade in and out. |
| Size | 18 cm | Its width. |
| Color | warm gold | Its tint. |

**Is Glint Shown** and **Is In Reach** read it. `Inventory.Glints 0` hides every glint.

## Inv Style

A data asset, `DA_InvStyle` in the plugin's **UI** folder. Copy it and name the copy in the
settings' **Style**.

| Group | Fields |
|---|---|
| Fonts | Title Font, Italic Font, Body Font, Small Font |
| Colours | Text, Muted, Dim, Accent (titles, prices, the focus), Good, Bad, Backdrop, Backdrop Blur |
| Frames | Panel, Slot Frame, Slot Focus, Rarity Glow, Tooltip, Hotbar, Pill (tabs, buttons, toasts), Keycap, Rule |
| Layout | Slot Size (76), Slot Gap (6) |
| Items | Rarities (a tag, name, colours and Glow each; by default WoW's: Poor grey, Common white, Uncommon green, Rare blue, Epic purple, Legendary red), Stats (a tag, label and Higher Is Better each), Filters (the bag's tabs, a label and category each) |

**Get Inventory Style** gives the style in use: the settings' **Style**, or the built-in look. On
it, **Get Rarity** (Item) gives an item's rarity look, Common's when it has none, and **Get Stat**
(Stat) a stat's label and Higher Is Better, its tag's last part when the style doesn't list it.

## Widgets

The default widgets, each a class you can make a Widget Blueprint from. Each shows its **Player**'s
inventory (the owning player's when not set with **Set Player**), redraws on its view's changes and
fires **Refresh** after. **Update** redraws it now.

| Widget | What it is |
|---|---|
| Inv Screen Widget | The inventory screen: the tabs, bag, hotbar, equipment or what's open, and the tooltip. **Focus First** puts the focus on the bag's first slot. |
| Inv HUD Widget | The hotbar, toasts and prompt on the game's screen. |
| Inv Container Widget | A container's slots under its name, with the bag's tabs and buttons. |
| Inv Slot Widget | One slot: icon, count, wear and rarity; drag, right-click and Shift-click. **Set Slot** points it. |
| Inv Tooltip Widget | The focused item: name, stats against what's worn, wear, worth. |
| Inv Equipment Widget | What's worn either side of the character, and the stats. |
| Inv Character Preview | The player's character, live, turned with a drag or the right stick. |
| Inv Crafting Widget | The recipes, the chosen one's ingredients, and the queue. |
| Inv Vendor Widget | A vendor's goods, and the player's money in its currency. |
| Inv Money Widget | A currency's icon and amount, counting to a new amount with the change rising over it. |
| Inv Row Widget | A line of a list: a recipe, a good, an order. |

On the screen, with a mouse: drag to move (Ctrl-drag for half), right-click to use or equip, and
Shift-click to move to where it most likely goes. On the slot in focus, with a gamepad or the
keyboard: **A** or <kbd>Enter</kbd> picks up and puts down, **LT** picks up half, **X** uses, **Y**
moves, **RT** or <kbd>R</kbd> rotates, and the left stick's press or <kbd>X</kbd> drops. The
shoulders or <kbd>Q</kbd> and <kbd>E</kbd> change tab, and **B**, <kbd>Esc</kbd> or the toggle key
closes. A line under the screen names the keys that act on the slot in focus: Move, Split for more
than one, Rotate in a grid on an item that isn't square, Drop, and Close.

## Gameplay tags

| Tags | What for |
|---|---|
| `Inv.Container.Bag`, `.Hotbar`, `.Equipment`, `.Chest` | What a container is. |
| `Inv.Slot.Head`, `.Body`, `.Back`, `.Hand.Main`, `.Hand.Off`, `.Feet`, `.Trinket`, `.Belt` | The equipment's slots. |
| `Inv.Rarity.Poor`, `.Common`, `.Uncommon`, `.Rare`, `.Epic`, `.Legendary` | An item's rarity. |
| `Inv.Currency.Coins` | A currency, kept in the wallet. |
| `Inv.Category.Tool`, `.Food`, `.Gear`, `.Material`, `.Currency` | What an item is; the bag's tabs. |
| `Inv.Stat.Armor`, `.Damage`, `.Warmth`, `.MoveSpeed`, `.Luck`, `.Weight` | Worn stats. |
| `Inv.Station.Workbench`, `.Cooking`, `.Anvil` | Stations. |

Add your own under the same roots in **Project Settings > Gameplay Tags**.

## Console commands

Open the console with <kbd>&#96;</kbd>. They act on the first local player, and all but
`Inventory.Glints` and `Inventory.Prompts` are left out of Shipping builds.

```console
Inventory.Give <item> [count] [quality]   onto the stacks carried, then the bag, the hotbar, the rest dropped; by asset or display name (1, quality 0 by default); host only
Inventory.Clear [container tag]           the player's containers emptied, or the one tagged; host only
Inventory.Interact                        as the Interact key
Inventory.Craft <recipe> [count]          queues one of the crafter's recipes (RC_ optional)
Inventory.Use <item>                      uses or wears the first stack carried
Inventory.Sell <item> [count]             sells from the bag or hotbar to the vendor open
Inventory.Dump                            writes containers, stats and queue to the log
Inventory.Glints 0|1                      hides or shows the glints
Inventory.Prompts 0|1|2                   key hints: the device last used, keyboard, gamepad
```

Give and Craft answer a wrong name with the ones there are.

## Gameplay Debugger

Press <kbd>'</kbd> (apostrophe) in play. The **Inventory** category shows the viewed player's
containers, what's worn, the stats and the crafting queue, live.

## Data validation

**Validate** on an asset, or on save, flags:

- an item without an icon, with an empty trait, or equippable with no slot;
- a recipe with no output, or an input without an item.
