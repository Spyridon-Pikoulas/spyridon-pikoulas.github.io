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
