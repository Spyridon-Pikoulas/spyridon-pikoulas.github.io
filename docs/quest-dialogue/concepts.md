---
layout: guide
title: "Concepts · Quest & Dialogue System"
nav: Concepts
order: 5
permalink: /docs/quest-dialogue/concepts/
description: "How Quest & Dialogue System's parts fit together: quests, stages and objectives, progress by gameplay tags, the quest component, dialogue, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md)'s quest and want to build your own.

## Quests

A **quest** is a data asset: a title, a description, and **stages** run one after another. A
stage holds **objectives**, which all run at once; the stage completes when its required ones
have, and the last stage completing completes the quest. An **optional** objective doesn't hold
its stage up. If it is still open when its stage completes it fails, except in the last stage,
where it completes with the quest.

A quest is always in one of five **states**:

| State | Means |
|---|---|
| Inactive | never started |
| Active | under way; any number of quests can be active at once |
| Completed | done; it starts again only if it is **Repeatable** |
| Failed | failed by your game or a required objective; it can start again |
| Abandoned | given up by the player; it can start again |

Whether a quest **can start** is decided in one place: not active, not completed unless
repeatable, its **Required Quests** completed and its **Required Tags** held. **Start Quest**,
`do start` in a script, a Quest Trigger and the `{can start}` condition all ask the same thing.

## Progress by tags

Quests never watch your game. Your game tells them what happened, with a gameplay tag:

```text
your Blueprint ── Report Quest Event (Kill.Wolf) ──> the player's Quest Component
    each active objective whose Event Tag is Kill.Wolf, or Kill, counts it
        an objective at its Count completes; a stage with its objectives done completes
            the last stage completes the quest
```

So one report can move several quests, and the code that kills a wolf needn't know which quests
care. The plugin's own reporters are the same node underneath: the **Quest Trigger** reports as a
pawn walks in, a Speaker's **Talk Event Tag** as talking starts, and a script's `do report`.

The player also holds **tags** of their own: given by **Add Tag**, a script's `do add`, or a
quest's **Tags on Complete**. They are the player's memory of what happened ("met Mira", "has the
captain's pass"), checked by quests' **Required Tags** and scripts' `has` conditions. They are the
quest system's own, apart from any Gameplay Ability System tags on the pawn.

## The Quest Component

A player's quests, their progress, their tags and the tracked quest live in a **Quest Component**.
The plugin puts it on the player's **PlayerState** as it is made, which outlives the pawn: dying
and respawning keeps every quest. **Get Quest Component** finds it from the player's pawn,
controller, PlayerState or a widget, so you rarely need to know where it is.

The **tracked quest** is the one the tracker shows. A quest with **Track on Start** becomes it
as it starts; when it ends, the earliest-started quest still active takes its place.

## Dialogue

A conversation starts as a `.qds` **script**, a text file. Importing it makes a **dialogue asset**,
the script checked and compiled. Running it takes three parts:

| Part | What it is |
|---|---|
| **Speaker Component** | on whoever talks: names the dialogue and where in it to start |
| **Dialogue Subsystem** | one per local player: runs one dialogue at a time, shows it in the dialogue widget, opens the quest log, and binds <kbd>E</kbd> and <kbd>J</kbd> |
| **Dialogue Runner** | steps through a dialogue line by line, checking conditions and doing actions; the subsystem has one, and you can make your own for a UI of yours |

A script's actions (`do start Ring`, `do add Met.Mira`) go through the player's Quest Component,
exactly as Blueprint calls do. `do event` reaches your Blueprints through **On Dialogue Event**.

## Multiplayer

| Runs on | What |
|---|---|
| the server | every player's quests and tags; Quest Triggers; rewards you give |
| the owning player's machine | a replicated copy of their own quests; dialogue; the widgets |

A change asked for on a client (from a Blueprint, a script or the quest log) is sent to the
server, which makes it and replicates the result back, a round trip later. The details are in the
reference's [Multiplayer](reference.md#multiplayer).

## Save

**Get Save Data** returns everything the component holds that matters across sessions: each
quest's state, stage and objective progress, the player's tags and the tracked quest. **Load Save
Data** puts it back, on the server, as a restore rather than a change: a quest completed before
the save doesn't complete again, so no reward is paid twice. The reference's [Events](reference.md#events)
say which events a load does fire, and its [Save](reference.md#save) has the rest. A
conversation in progress isn't saved; talking again starts from the Speaker's **Start Label**.
