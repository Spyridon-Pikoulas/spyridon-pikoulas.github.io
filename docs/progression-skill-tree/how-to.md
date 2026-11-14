---
layout: guide
title: "How-tos · RPG Skill Tree & XP System"
nav: How-tos
order: 4
permalink: /docs/progression-skill-tree/how-to/
description: "Answers to the common tasks in RPG Skill Tree & XP System: XP from kills and quests, several tracks, GAS abilities, stats, gating content, respecs, XP curves, your own UI, save and multiplayer."
---

# How-tos

The tasks buyers come back for, each answered in steps, in Blueprint, with C++ where both
apply. They build on the [quickstart](quickstart.md)'s Hero track and tree and the words in [Concepts](concepts.md).

## Give XP for kills, quests or anything else

**Add XP** gives a track XP; it runs on the server only.

1. Where the thing happens (an enemy's death, say), on the server, call **Get Progression
   Component** with the player's pawn, controller or PlayerState.
2. Call **Add XP** with the track, the amount and, if you like, a **Source** tag such as
   `XP.Kill.Wolf`.

The player levels up as far as the XP reaches, and the HUD shows it coming in.

```cpp
#include "PTLibrary.h"
#include "PTProgressionComponent.h"

void AWolf::Die(AController* Killer)
{
    if (UPTProgressionComponent* Progress = UPTLibrary::GetProgressionComponent(Killer))
    {
        Progress->AddXP(HeroTrack, 25, FGameplayTag::RequestGameplayTag("XP.Kill.Wolf"));
    }
}
```

With heyheythere's other plugins, the same node takes their events:

| From | Bind | Then |
|---|---|---|
| [Quest & Dialogue System](/docs/quest-dialogue/) | **On Quest State Changed** on **Get Quest Component** | when **New State** is **Completed**, **Add XP** |
| [Farming & Fishing System](/docs/farming-fishing/) | **On Harvested** on the Farmer Component, **On Fish Caught** on its **Get Fishing** | **Add XP** to a Farming or Fishing track, by count or **Size Cm** |

Bind them in your character Blueprint's **Event Possessed**, which runs on the server. To give each quest its own XP, keep a **Map** variable from quest to XP and look the
completed quest up in it.

## Have a character level and separate skills

A player can level up in any number of tracks at once.

1. Make a track for each: `TK_Hero` for the character level, `TK_Farming`, `TK_Combat`.
2. Make a tree for each and set its **Track**. A tree's nodes cost its own track's points.
3. Add every tree to **Default Trees** in the settings, or give one later with **Add Tree** (on
   the server), when the player meets a trainer, say.

The HUD shows a bar for each track the player has, and the tree screen shows the trees side by
side, each under its track's level and points. A track the player has no XP in starts at level 1.

## Grant a Gameplay Ability System ability from a talent

1. In the node's **Rewards**, add one with **Type** **Ability** and pick the ability class.
2. For a passive bonus, add one with **Type** **Effect** and pick a Gameplay Effect.

Each rank grants the ability, or applies the effect, at the rank as its level; unlearning takes it
away. The player needs an Ability System Component on the PlayerState or its pawn, as the
Gameplay Ability System sets it up (on the pawn, if you put the Progression Component there).

Without the Gameplay Ability System, use an **Event** reward:

1. Give the node a reward with **Type** **Event** and **Event** `Fireball`.
2. Bind **On Reward Event** on **Get Progression Component**.
3. When **Event** is `Fireball`, turn your ability on if **Rank** is above 0, off if it's 0. The
   event fires on the player's machine as well as the server, so put the change behind **Switch
   Has Authority** if it is gameplay rather than a sound or an icon.

With [GAS Ability & Status Effect System](/docs/ability-status/), that is **Grant Ability** on the
character's **AS Ability System** with your ability asset and the rank as its level, and **Remove
Ability** at rank 0.

## Make a stat drive movement, damage or health

Stat rewards add to named numbers on the player's **Stat Component**; your Blueprints decide what
each means.

1. Give a node a reward with **Type** **Stat**, **Stat** `RunBonus`, **Op** **Add**, **Value**
   `100`, or **Op** **Multiply** with `0.1` for +10% a rank.
2. Where your game uses the number, call **Get Stat Component** with the player and **Get Stat**
   with `RunBonus`.

For movement, set **Max Walk Speed** when the stat changes: bind **On Stat Changed** on the Stat
Component, or read it on **Event Tick** as the [quickstart](quickstart.md#4-use-the-stats) does.
For damage, multiply your hit by `1 +` **Get Stat** (`Damage`). A stat no reward has given is 0.

A stat's **base** is your game's own number, set with **Set Base Stat** (a player's gold, their
health at level 1); rewards are **modifiers** on it ([how they add up](reference.md#stat-component)).

## Lock content behind a level or a skill

| To check | Call |
|---|---|
| a track's level | **Get Level** with the track |
| a node learned | **Get Node Rank** with the tree and node id, above 0 |
| a skill that gives a tag | **Has Tag** with the node's Tag reward |

Tags are the easiest to share: give the node a **Tag** reward `Skill.Lockpicking`, and the door
checks **Has Tag** without knowing which tree gave it. The other way round, **Add Tag** from a quest
or a book lets a node's **Required Tags** ask for it.

## Let players respec

1. Call **Respec Node** for one node, or **Respec Tree** for a tree, or for all with none.
2. For a price, set the tree's **Respec Cost Stat** (say `Gold`) and **Respec Cost Per Point**,
   and show **Get Respec Cost** before the player confirms.

When a respec is refused, and why, is in the [reference](reference.md#progression-component).

On the tree screen, <kbd>R</kbd> or **Y** on a gamepad respecs the selected node.

## Use your own XP curve

A track's XP from each level to the next comes from the first of these it has:

1. **Level XP**: a table, the first entry being level 1 to 2.
2. **Level Curve**: a float curve of the XP from level X to the next.
3. **Base XP** and **Growth**: level X to the next takes Base XP × X ^ Growth.

**Points Per Level** and **Starting Points** set the points; **Level Rewards** give extra points or
rewards at chosen levels. **Get XP To Next Level** on the track asset gives any level's
figure, to check a curve from a Blueprint.

## Offer a choice between two paths

Give the two nodes the same **Exclusive Group** name. Once one is learned, the other is locked,
and its tooltip says why. A respec of the learned one opens the choice again.

## Boost XP for a weekend or a perk

- **Source Multipliers** on the track multiply XP from a source tag: `XP.Kill.Boss` at 2. The most
  specific tag counts.
- **Multiplier Stat** names a stat that multiplies every gain: set its base to 2 for the weekend,
  or give it from a node as a perk. Without a base it counts from 1, so a perk's +0.5 **Add** alone
  is 1.5 times the XP.

## Give the tree screen your own look

1. Make a Widget Blueprint and pick **PTTreeWidget** as its parent class (or **PTHudWidget** for
   the bars).
2. Leave its Designer empty, and under **Look** in its Details change the **Title**, **Blur
   Strength**, **Node Size**, **Column Step**, **Row Step** and zoom limits (the HUD's **Bar
   Width** and **Toast Seconds**).
3. Set it in **Project Settings > Plugins > Progression & Skill Trees**.

For a screen entirely your own, lay out its Designer: the plugin's isn't built then. Read the
player's progress with the nodes in the [reference](reference.md#progression-component), and
use the widget's own **Select Node**, **Learn Selected** and **Close**
([all of them](reference.md#your-own-widgets)).

## Save progress with your own save game

1. In your SaveGame Blueprint, add a variable of type **PTSave Data**.
2. Before saving: **Get Progression Component** with the player, **Get Save Data**, and set your
   variable from it.
3. After loading, on the server: **Load Save Data** with your variable.

```cpp
// saving
SaveGame->Progress = UPTLibrary::GetProgressionComponent(PlayerController)->GetSaveData();
// loading, on the server
UPTLibrary::GetProgressionComponent(PlayerController)->LoadSaveData(SaveGame->Progress);
```

Rewards come back with their nodes; what the save holds is in the
[reference](reference.md#save). A game without a save game of its own calls **Save Progress To
Slot** and **Load Progress From Slot**.

## Make it work in multiplayer

| Call | Where |
|---|---|
| Add XP, Set Level, Add Points, Add Tree, tags, stats, Load Save Data | the server only; on a client they log a warning and do nothing |
| Learn Node, Respec Node, Respec Tree | either; a client's call asks the server, which checks it |
| Queries, the UI | either; a client sees changes a round trip later |

To stop clients from learning by themselves, untick **Accept Client Requests** on the
Progression Component. What replicates to whom is in the
[reference](reference.md#multiplayer).
