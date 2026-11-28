---
layout: guide
title: "Concepts · Quest & Dialogue System"
nav: Concepts
order: 5
permalink: /docs/quest-dialogue/concepts/
description: "How Quest & Dialogue System's parts fit together: quests, stages and objectives, branches, progress by gameplay tags, the quest component, dialogue, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once you have played the
[quickstart](quickstart.md)'s quest and want to build your own.

## Quests

A **quest** is a data asset: a title, a description, and **stages**. A stage holds
**objectives**, which all run at once; the stage completes when its required ones have, and the
quest goes on to the next stage, or completes after the last, unless the stage
[says otherwise](#branches). An **optional** objective doesn't hold its stage up. If it is still
open when its stage completes it fails, except where that completes the quest: then it completes
with it.

A quest is always in one of five **states**:

| State | Means |
|---|---|
| Inactive | never started |
| Active | under way; any number of quests can be active at once |
| Completed | done; it starts again only if it is **Repeatable** |
| Failed | failed by your game, a required objective, a path to **Fail** or a choice with no way left; it can start again |
| Abandoned | given up by the player; it can start again |

Whether a quest **can start** is decided in one place: not active, not completed unless
repeatable, its **Required Quests** completed and its **Required Tags** held. **Start Quest**,
`do start` in a script, a Quest Trigger and the `{can start}` condition all ask the same thing.

## Branches

By default a quest runs its stages in order. Each stage can say where the quest goes instead, so
a quest can split into **paths** and end in more than one place.

- **A stage's Then** is where the quest goes once the stage's required objectives are done:
  **Next**, the default, is the following stage, or Completed after the last. It can name a stage
  by its **Id**, or **Complete** or **Fail** the quest, so a stage in the middle of the list can be
  an ending. Two paths join again where both go to the same stage.
- **An objective's Then** makes the objective a path out of its stage. The moment it completes,
  the quest goes where it says, whatever else in the stage is still open. A path to **Fail** fails
  the quest, for an objective such as "the merchant dies". Failing a path only closes that way.
- **A choice** is a stage whose required objectives are all paths: it waits until one of them
  completes. Once every path out of it has failed, the quest fails.

When the quest leaves a stage by a path, or by **Go To Stage**, the stage's open objectives become
**Skipped**. Skipped isn't failed: it means another way was taken. The quest log shows the stage the quest is
at and, under it, the stages it has passed, each objective as the quest left it: the way taken
ticked, the ways not taken greyed. Once the quest ends, the log shows the whole way it went.

A quest keeps its **path**: the stages it has been at since it last started, in order. **Has
Reached Stage** asks whether a stage is on it, and **Get Stage Id** gives the stage the quest is
at, or ended at. That is how a game or a script (`if Secret reached Kept`) tells which ending a
player reached.

A stage's **Id** names it in Thens, scripts and saves, and is unique in its quest. Saves find
stages and objectives by Id, so you can reorder them once players have saves. Don't rename an Id
players may have saved at: such a save loads at the stage's old position instead.

## Progress by tags

Quests never watch your game. Your game tells them what happened, with a gameplay tag:

```text
your Blueprint ── Report Quest Event (Kill.Wolf) ──> the player's Quest Component
    each active objective whose Event Tag is Kill.Wolf, or Kill, counts it
        an objective at its Count completes; a stage with its objectives done completes
            the quest goes on to the next stage, or completes after the last
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

### The script and the graph

A dialogue asset opens in the [graph editor](graph.md), the script drawn as nodes. The script stays
the truth; the graph is a way to edit it:

- **A graph edit is a text edit.** Changing a node rewrites its one line of the `.qds` file. A new
  wire adds the fewest lines that say it, such as `-> label` and, when the target has none, a label
  named for it (`mira_1`, which you can rename). Every other line, its spacing, comments and blank
  lines stay as you wrote them, so a graph edit diffs like a hand edit. The file is compiled again
  at once.
- **A text edit redraws the graph.** Reimport, or the editor's **Script** pane, and the graph
  follows.
- **Where the nodes sit is kept in the asset**, not the script, by the label above each node, so
  moving nodes never touches the file, and lines you add in text get a place of their own.
- **The file wins.** If it changed on disk since the editor read it, from a text editor or source
  control, the editor loads it as it is and drops its own change instead of writing over yours.

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
quest's state, stage, path and objective progress, the player's tags and the tracked quest.
**Load Save Data** puts it back, on the server, as a restore rather than a change: a quest completed before
the save doesn't complete again, so no reward is paid twice. The reference's [Events](reference.md#events)
say which events a load does fire, and its [Save](reference.md#save) has the rest. A
conversation in progress isn't saved; talking again starts from the Speaker's **Start Label**.
