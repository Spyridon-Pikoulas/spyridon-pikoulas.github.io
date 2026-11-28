---
layout: guide
title: "Changelog · Quest & Dialogue System"
nav: Changelog
order: 10
permalink: /docs/quest-dialogue/changelog/
description: "Each version of Quest & Dialogue System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 2.1 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [Branching quests](concepts.md#branches): an objective's **Then** makes it a path out of its
  stage, to a stage of its choosing, **Complete** or **Fail**; a stage's **Then** says where the
  quest goes once the stage is done, so an ending can sit in the middle of the list. When a path
  is taken, the stage's other open objectives are **Skipped**, not failed; once every path out of a
  choice has failed, the quest fails. **Advance Quest** and `do advance` follow the stage's Then.
- Each stage has an **Id**. The Quest Component has **Go To Stage**, **Get Stage Id** and **Has
  Reached Stage**; scripts have `do goto Quest Stage` and the condition `Quest reached Stage`.
- [A quest's graph](graph.md#a-quests-graph) lays its stages out by their paths, and edits them:
  drag a stage's pin to a stage or an end to set where it goes, <kbd>Delete</kbd> a wire to set it
  back to **Next**. In Play, it lights the path the player took and rings where they are.
- The quest log shows the stages a quest has passed under the one it is at, and an ended quest's
  whole way, each objective as it was left: Skipped ones, and optional ones left undone, greyed
  with a dash. **Get Journal** gives the same for your own UI.
- The default widgets draw their marks (dot, tick, cross, dash) instead of taking them from the
  font, which drew the tick as √, and their panels are near opaque, so the world doesn't show
  through the text. The tracker steps aside while the quest log is open. `StateText` now holds
  only the state's name; its mark is drawn into a panel named `StateMark`, which your own log
  layout can add.
- Saving a quest checks its paths too: a stage without an Id or with one used twice, a Then to a
  stage that isn't there, a stage nothing goes to, and stages that go round with no way out.
- A [glint](how-to.md#show-what-the-player-can-talk-to) hides on whoever the player is talking
  to, and comes back when the talk ends.
- In the demo, Sela's Secret splits: keep her secret and show her token to Mira, or tell Bram at
  the gate. Each is an ending of its own; telling no longer fails the quest.

Quests and saves from 2.0 load as they are. Stages without an Id are named `Stage1`, `Stage2` and
so on, in order, as the quest loads. A 2.0 save is read as the quests were then, in a line: its
stage is found by position, and its path is every stage up to that one. Saves made from 2.1 find
stages and objectives by Id, so reordering them is safe. In a quest that players have 2.0 saves
of, add new stages after the existing ones, not before them. An objective's state now has a fifth
value, **Skipped**: a Blueprint **Switch** on it, or a UI of yours that colours objectives by
state, needs a case for it. A save game of yours that copies **QD Save Data** field by field
rather than whole must copy its new **Version**, and each quest record's **Stage Id**, **Path**,
**Objective Ids** and **Past**.

## 2.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [The graph](graph.md): a dialogue asset opens as a graph of its statements, with its script's
  text and the selected node's fields beside it. Editing, wiring, adding, labelling and deleting
  nodes writes the `.qds` file line by line and compiles it; the rest of the file stays as written.
  The text can be edited there too.
- A quest asset opens as a graph of what it needs, its stages and its ends, with the dialogue lines
  that start, advance, complete, fail or report to it.
- The demo's scripts ship in `Content/Demo/Dialogue`, beside their dialogue assets.
- In the demo, glowcaps picked before Mira's quest is taken count once it is; the controls card
  holds the general keys, and a conversation's keys show under its box.

Nothing to change on updating: scripts, dialogue assets and quests load as they are. A dialogue
opens with its nodes laid out for it; where you move them is saved in the asset.

## 1.1 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- The [glint](how-to.md#show-what-the-player-can-talk-to), a sparkle on what the player can talk
  to or pick up: the **QD Glint** component, the **Glints** settings, **Set Glints Shown** and
  `Quest.Glints`. The demo's people and mushrooms carry one.
- [Gestures](how-to.md#show-a-hand-over-or-play-your-own-animations): `do give` and `do take` in a
  script hand something over, the speaker's hand meeting the player's; the **Gesture Component**
  plays your montages for them, or the plugin's own poses, and **Reach** for a pickup. The demo's
  player walks up to each glowcap and picks it.

Nothing to change on updating: glints show only on what you give a QD Glint, and gestures play
only where a script says `do give` or `do take`, or your Blueprint plays one.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- quests as data assets, with stages, objectives, requirements, five states, tracking and checks on
  save;
- progress by gameplay tags, from **Report Quest Event**, the Quest Trigger, talking and scripts;
- dialogue as `.qds` text scripts, with choices, conditions, actions, events, voice and
  localisation;
- a dialogue box, quest log and tracker, each replaceable by your own Widget Blueprint;
- replication to each player's own machine, and save into your save game or a slot;
- the Gameplay Debugger's **Quests** category and the `Quest.*` console commands;
- the demo village.
