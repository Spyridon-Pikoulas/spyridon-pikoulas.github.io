---
layout: guide
title: "Changelog · Quest & Dialogue System"
nav: Changelog
order: 9
permalink: /docs/quest-dialogue/changelog/
description: "Each version of Quest & Dialogue System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

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
