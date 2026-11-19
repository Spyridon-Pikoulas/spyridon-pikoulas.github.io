---
layout: guide
title: "Concepts · RPG Skill Tree & XP System"
nav: Concepts
order: 5
permalink: /docs/progression-skill-tree/concepts/
description: "How RPG Skill Tree & XP System's parts fit together: tracks and XP, skill trees and nodes, rewards, stats, the two components, respecs, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md)'s Hero track and want to plan your own.

## Tracks: XP, levels and points

A **track** is a data asset for one thing a player levels up in: a character level, a class, a
craft. A player can be in any number of tracks at once, each with its own level and XP. A player
is in a track, at level 1, from the first XP given in it or as soon as they have a tree on it: the
Default Trees' tracks show their bars from the start.

```text
Add XP (Track, Amount) ──> the track's XP, multiplied by its boosts
    each time the XP reaches the next level's figure, the level goes up
        each level up gives the track's Points Per Level, and its Level Rewards
```

**Points** belong to their track: Hero points are spent in trees on the Hero track, Farming points
in Farming's. What's left unspent is the track's **Points**; **Get Points** reads it.

## Skill trees and nodes

A **skill tree** is a data asset of **nodes**, tied to one track. Several trees can share a track
(a warrior's three branches), and they then share its points.

A node can be learned up to its **Max Rank** times, each rank for its **Cost** in points. It can
ask for **Required Nodes** in its tree, a **Required Level** of its track, **Required Tags**, and
none of its **Exclusive Group** learned. From the player's side every node is **Locked**,
**Available**, **Owned** or **Maxed** ([the states](reference.md#skill-trees)).

A node's **Id** is its name for good: saves, requirements and your Blueprints use it. Its
**Position** (column, row) places it on the tree screen only.

## Rewards

What a node's ranks, or a track's levels, give. A reward is held while its rank or level is, and
taken back when it isn't (a respec, a level set lower).

| Type | Gives | For |
|---|---|---|
| Tag | a gameplay tag | requirements, doors, dialogue: anything that asks **Has Tag** |
| Stat | a modifier on a stat | numbers your Blueprints read: speed, damage, gold found |
| Ability, Effect | a Gameplay Ability or Gameplay Effect | projects on the Gameplay Ability System |
| Event | a call to **On Reward Event** with the rank | anything else your game does |

## Stats

A **stat** is a named number on the player's **Stat Component**, for a game without the Gameplay
Ability System, or beside it. It has a **base**, your game's own value (gold, health at level 1),
and **modifiers**, from rewards or your own calls; **Get Stat** reads the base with its
modifiers on it ([how](reference.md#stat-component)). A stat nobody has set reads 0. The plugin
reads only two stats itself, a track's **Multiplier Stat** on XP and a tree's **Respec Cost Stat**
as the price of a respec: the rest is for your Blueprints, as the quickstart's character decides
that `RunBonus` is speed.

## The two components

| Component | Holds | Replicates to |
|---|---|---|
| **Progression Component** | the player's tracks, trees, learned nodes and tags | the player who owns it |
| **Stat Component** | the player's stats | every machine |

The plugin adds both to each player's **PlayerState** as it is made, which outlives the pawn: dying
and respawning keeps everything. **Get Progression Component** and **Get Stat Component** find
them from the player's pawn, controller or PlayerState, so you rarely need to know where they are.

## Respecs

A **respec** unlearns nodes: the points come back to the track, and the rewards go. A tree can
put a price on it, paid from a stat such as `Gold`. The nodes and rules are in the
[reference](reference.md#progression-component).

## Multiplayer

The server owns progress. Learning and respecs asked for on a client go to the server, which
checks them as it would its own and replicates the result back a round trip later. The UI runs on
each player's own machine. The details are in the reference's
[Multiplayer](reference.md#multiplayer).

## Save

**Get Save Data** returns what matters across sessions, and **Load Save Data** puts it back on
the server, the rewards with their nodes. What a save holds, and how edits since it are met, is in
the reference's [Save](reference.md#save).
