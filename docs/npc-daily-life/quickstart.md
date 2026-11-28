---
layout: guide
title: "Quickstart · NPC Behavior & Daily Life System"
nav: Quickstart
order: 3
permalink: /docs/npc-daily-life/quickstart/
description: "Fifteen minutes from installing NPC Behavior & Daily Life System to a villager in your own Unreal level who works in the morning, eats at noon and sleeps at night, with her score panel showing why."
---

# Quickstart: a villager's day in your level

Fifteen minutes from an installed plugin to a villager who keeps a day in your level: she works
in the morning, eats at noon and goes to bed at night, and her score panel shows why. You place
an NPC and three spots for her, and play. No Blueprint graph is needed.

The steps use the **Third Person** template's level and its mannequin, with the plugin enabled
([Install](install.md)). In your own level, put the spots where they fit; for your own character,
see [Use your own character](how-to.md#use-your-own-character-and-animations).

## 1. Place a villager

1. Open **Window > Place Actors** and search for `NL`. Drag **NL Character** onto the floor south
   of the player start (behind it as the level opens), and name it `Ada` in the Outliner.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for NL, listing NL Character, NL Spot, and the demo's NL Demo Sky, NL Demo Villager and NL Demo Walker." caption="**NL Character** and **NL Spot** in **Place Actors**. The NL Demo ones are the demo town's." %}

2. In its **Details**, select the **Mesh** component and set:

    | Field | Value |
    |---|---|
    | Animation Mode | **Use Animation Blueprint** |
    | Anim Class | `ABP_Unarmed` |
    | Skeletal Mesh Asset | `SKM_Quinn_Simple` |

    {% include figure.html src="mesh.png" alt="The NL Character's Mesh component in Details: Animation Mode Use Animation Blueprint, Anim Class ABP_Unarmed, Skeletal Mesh Asset SKM_Quinn_Simple." caption="The template's Quinn, walking with its own Anim Blueprint." %}

3. Select the **Brain** component and set:

    | Field | Value |
    |---|---|
    | Display Name | `Ada` |
    | Role | `R_Villager` |

    {% include figure.html src="brain.png" alt="The Brain component in Details: Display Name Ada, Role R_Villager, and below them Behaviors, Needs, Faction, Schedule and Anim Set left empty for the role's." caption="The Brain: her name and her role. What's left empty comes from the role." %}

The role is the plugin's villager: her needs (food, energy, company), her eight behaviours, and a
day plan of sleep till 06:00, work from 08:00 to 17:00 with lunch at noon, and company in the
evening.

## 2. Place her spots

A spot is where a behaviour is done: Work at a work spot, Eat at an eat spot.

1. From **Place Actors**, drag three **NL Spot**s onto the floor, name them in the Outliner, and in each one's **Details** set its **Kind**, its **Location** (X and Y; Z stays on the floor) and its **Rotation** Z:

    - `WorkSpot`: Kind `NPC.Spot.Work`, Location `-1100`, `-900`, Rotation Z `180`.
    - `EatSpot`: Kind `NPC.Spot.Eat`, Location `-1100`, `900`, Rotation Z `180`.
    - `SleepSpot`: Kind `NPC.Spot.Sleep`, Location `-1300`, `0`, Rotation Z `0`.

    {% include figure.html src="spot.png" alt="The NL Spot's Details: Kind NPC.Spot.Work, Capacity 1, Spread 0, Anim Tag empty, Body Offset 0, Only For empty, and the Patrol section folded." caption="A work spot. Its arrow is the way the NPC faces while she works." %}

2. NPCs walk on the navmesh, which the Third Person level doesn't have. From **Place Actors >
   Volumes**, drag a **Nav Mesh Bounds Volume** in and scale it over the floor. Press <kbd>P</kbd>
   in the viewport: the floor shows green.
3. Save the level (<kbd>Ctrl</kbd>+<kbd>S</kbd>).

## 3. Play

Press **Play**, and turn round to face south.

1. It's 08:00 on the plugin's clock, which runs an hour a real minute. Ada walks to the work spot
   and bends to her work; the bubble over her head says **Work**.
2. Open the console (<kbd>&#96;</kbd>) and type `Npc.Debug Ada`. Her score panel opens beside her:
   the clock, her needs, her plan, and each thing she could do with its score. Work wins, since
   her plan says work and she's rested and fed. Most of the rest score 0 for want of a spot, such
   as **No free Sit spot**: this level has only her three. A spot of that kind brings it into play.

    {% include figure.html src="panel.jpg" size="wide" alt="The game: Ada at her work spot, bent to her work, and her score panel beside her: Ada, Villager, Monday, Day 1, 08:11, Doing it; Food 79%, Energy 84%, Social 54%; Plan Work 08:00 to 12:00; her choices, Work 0.96 first, Eat 0.11, and the rest at 0: Sleep for the hour, Chat, Sit down, Wander and Take cover for No free Talk, Sit, Wander and Cover spot, Call for help for no foe near." caption="`Npc.Debug Ada`: why she works." %}

3. Type `Npc.Time 12`, then `Npc.Need Ada Food 0.3`. It's noon, so her plan stops work, and
   she's hungry: Eat scores best, and she walks to the eat spot. Food fills while she eats.

    {% include figure.html src="eat.jpg" size="wide" alt="Ada at the eat spot at 12:14, her panel showing Food 38%, Plan Eat 12:00 to 13:00, and Eat chosen at 0.76, with Work at 0." caption="Noon, and hungry: lunch." %}

    Jumping the clock skips the hours in between, so her food didn't fall on the way: that's what
    `Npc.Need` stands in for. Left to run, her needs fall by the hour on their own.

4. Type `Npc.Time 22.5`. She goes to the sleep spot and lies down.

    {% include figure.html src="sleep.jpg" size="wide" alt="Ada lying asleep on the floor at the sleep spot at 22:39, her panel showing Plan Sleep 22:00 to 06:00 and Sleep chosen at 0.79." caption="`Npc.Time 22.5`: bed." %}

5. Type `Npc.Debug off` to close the panel.

`Npc.Why Ada` prints the same scores in the Output Log, term by term, and `Npc.Speed 30` runs the
clock thirty times faster to watch a whole day. For the Gameplay Debugger, press <kbd>'</kbd>
(apostrophe) while looking at her: its **NPCLife** category shows her state.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's NPCLife category over the game: Ada (Villager) at 22:45, day 1, Sleep doing it and at it, her plan, needs, senses calm, memory nothing and each behaviour's score, and Ada asleep under her Sleep bubble." caption="The Gameplay Debugger's **NPCLife** category." %}

If something doesn't happen as written, [Troubleshooting](troubleshooting.md) has the usual
causes.

## Next

- [Use your own character and animations](how-to.md#use-your-own-character-and-animations).
- [Make a behaviour of your own](how-to.md#make-a-behaviour-of-your-own).
- [Concepts](concepts.md): brains, behaviours, roles, day plans and spots.
