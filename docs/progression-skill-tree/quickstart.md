---
layout: guide
title: "Quickstart · RPG Skill Tree & XP System"
nav: Quickstart
order: 3
permalink: /docs/progression-skill-tree/quickstart/
description: "Fifteen minutes from installing RPG Skill Tree & XP System to a character in your own Unreal map who earns XP, levels up and learns skills."
---

# Quickstart: a skill tree in your own map

Fifteen minutes from an installed plugin to a character who earns XP, levels up and learns
skills. You make a Hero track and a tree of two skills: Sprint, which makes the character run
faster, and High Jump after it. Two small Blueprint graphs connect them to your game.

The steps use a project made from the **Third Person** template with the plugin enabled
([Install](install.md)). Any project whose player uses Enhanced Input works the same.

## 1. Make the track

A track is what a player levels up in, by XP.

1. In the Content Browser, right-click an empty spot and pick **Gameplay > Progression Track**.
   Name it `TK_Hero` and double-click it to open it.
2. Set **Display Name** to `Hero` and **Max Level** to `10`.

    {% include figure.html src="track.png" alt="The TK_Hero track open: Display Name Hero, Max Level 10, no Level XP or Level Curve, Base XP 100, Growth 1.5, Starting Points 1 and Points Per Level 1." caption="The track. The rest stays as it is." %}

    Leave the rest: level 1 to 2 takes 100 XP, each level takes more than the last, and every
    level gives one point to spend.

3. Click **Save**.

## 2. Make the tree

1. Right-click again and pick **Gameplay > Skill Tree**. Name it `ST_Hero` and open it. It starts
   with one node, Id `First`, and the **Preview** at the top draws the tree as you edit it.
2. Set **Display Name** to `Hero` and **Track** to `TK_Hero`.
3. Open **Nodes**, then the node **First**, and fill it in:

    | Field | Value |
    |---|---|
    | Id | `Sprint` |
    | Name | `Sprint` |
    | Description | `Run faster.` |
    | Position | `1`, `0` (column 1, the top row) |
    | Max Rank | `3` |

4. Click **+** beside the node's **Rewards**, open the new reward and set **Type** to **Stat**,
   **Stat** to `RunBonus`, **Op** to **Add** and **Value** to `100`.
5. Click **+** beside **Nodes** for a second node, open it, and fill it in the same way:

    | Field | Value |
    |---|---|
    | Id | `HighJump` |
    | Name | `High Jump` |
    | Description | `Jump higher.` |
    | Position | `1`, `1` |
    | Required Nodes | click **+**, then type `Sprint` |
    | Required Level | `2` |
    | Rewards | one **Stat** reward: `JumpBonus`, **Add**, `200` |

    {% include figure.html src="tree.png" alt="The ST_Hero tree open: the preview draws Sprint above High Jump, joined by a line, and the check under it reads Every node can be learned. Below, Display Name Hero, Track TK_Hero, and the High Jump node opened with its fields." caption="The tree, its preview and check at the top, the second node opened." %}

6. Click **Save**. Under the preview, the check reads "Every node can be learned.". It is
   redrawn as you edit, and otherwise lists what is wrong: a node no one can learn, or a warning
   such as a node without a name.

A node without an **Icon** shows its frame alone; give each one a texture when you have one.

## 3. Give the tree to every player

1. Open **Edit > Project Settings** and pick **Progression & Skill Trees** under **Plugins**.
2. Click **+** beside **Default Trees** and pick `ST_Hero`.

    {% include figure.html src="trees.png" alt="The plugin's settings with Default Trees opened, holding ST_Hero." caption="**Default Trees**: every player starts with these." %}

## 4. Use the stats

The rewards are stats on the player's Stat Component. Your character decides what a stat does:
here, run speed and jump height.

1. Open `ThirdPerson/Blueprints/BP_ThirdPersonCharacter` and its **Event Graph**.
2. Right-click, add **Event Tick**, and from it **Is Valid**.
3. Right-click and add **Get Stat Component**; its **Actor** is **Self** when left empty. Connect
   its result to **Is Valid**'s **Input Object**. It finds the component through the player's
   PlayerState, which the character has once a player possesses it.
4. From **Is Valid**, add **Set Max Walk Speed** (from **Character Movement**), and after it
   **Set Jump Z Velocity**.
5. Feed them the stats: from the Stat Component, **Get Stat** with `RunBonus`, plus `500`, into
   **Max Walk Speed**; **Get Stat** with `JumpBonus`, plus `700`, into **Jump Z Velocity**.
6. Click **Compile** and **Save**.

{% include figure.html src="graph-stats.png" size="wide" alt="The Event Graph of BP_ThirdPersonCharacter: Event Tick into Is Valid on Get Stat Component, then Set Max Walk Speed to 500 plus Get Stat RunBonus, then Set Jump Z Velocity to 700 plus Get Stat JumpBonus, both on Character Movement." caption="The character's graph: the stats set its speed and jump every frame." %}

A stat the player has no reward for is 0, so the character runs at 500 and jumps at 700 until
they learn a skill. Stats replicate, so this works the same on every machine in multiplayer.

## 5. Give XP

Anything gives XP with one node, **Add XP**. Here a box in the map does.

1. Open **Window > Place Actors**, search for `Trigger Box`, and drag one into the map some way
   from the player start.
2. With the box selected, open the Level Blueprint (**Blueprints > Open Level Blueprint** in the
   toolbar). Right-click and pick **Add Event for TriggerBox > Collision > Add On Actor Begin
   Overlap**.
3. From **Other Actor**, add **Get Progression Component**, and from its result **Add XP**.
4. On **Add XP**, set **Track** to `TK_Hero` and **Amount** to `60`. Connect the event to it.
5. Click **Compile**, then save the map.

{% include figure.html src="graph-xp.png" alt="The Level Blueprint: On Actor Begin Overlap of the Trigger Box into Add XP, whose target is Get Progression Component of Other Actor, with Track TK_Hero and Amount 60." caption="The Level Blueprint: 60 Hero XP for whoever walks into the box." %}

## 6. Play

Press **Play**.

1. Walk into the box, out, and in again: 60 XP each time. The Hero bar at the top left fills, and
   at 100 XP a toast says you reached level 2. The bar adds up gains that come close together, so
   it shows "+120 XP", and 20 of the 283 XP level 2 takes.

    {% include figure.html src="levelup.jpg" alt="The top left of the game: the Hero XP bar at level 2 with +120 XP, and the level-up toast." caption="Level 2, and the point it gave." %}

2. Press <kbd>K</kbd>. The tree screen shows Hero's level, its points, and the two nodes. Click
   **Sprint** to learn it: you now run faster.

    {% include figure.html src="skills.jpg" alt="The tree screen's Hero tree: level 2 at 20 of 283 XP with 1 point left, Sprint learned at rank 1 of 3, and High Jump below it at 0 of 1." caption="Sprint learned: one of its three ranks." %}

3. Hover **High Jump**. With Sprint learned and level 2 reached, it can be learned; before, it
   lists what is missing.

    {% include figure.html src="highjump.jpg" alt="The details of High Jump on the tree screen: Jump higher, +200 JumpBonus per rank, requires Sprint and Hero level 2, both met, cost 1 point, and the Learn High Jump button." caption="High Jump's details: what it gives, what it requires, and its cost." %}

4. Press <kbd>K</kbd> or <kbd>Esc</kbd> to close it.

On a gamepad, **View** opens the screen, the left stick moves between nodes, **A** learns, **Y**
unlearns (a respec), the bumpers change tree and **B** closes.

To watch it all as you play, press <kbd>'</kbd> (apostrophe) for the Gameplay Debugger: its
**Progression** category lists the player's tracks, nodes, tags and stats as they change. In the
console (<kbd>&#96;</kbd>), `Progress.XP TK_Hero 500` gives XP and `Progress.Why ST_Hero HighJump`
says what a node lacks.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's Progression category for PlayerState_0: TK_Hero level 3/10, XP 237/520, 2 points (1 spent); ST_Hero: Sprint 1/3; an empty Tags line; Stats: RunBonus 100." caption="The Gameplay Debugger's **Progression** category, a few boxes later." %}

If something doesn't happen as written, [Troubleshooting](troubleshooting.md) has each step's
usual cause.

## Next

- [Give XP for kills, quests or anything else](how-to.md#give-xp-for-kills-quests-or-anything-else).
- [Grant a Gameplay Ability System ability](how-to.md#grant-a-gameplay-ability-system-ability-from-a-talent)
  from a node.
- [Concepts](concepts.md): how tracks, trees, rewards and stats fit together.
