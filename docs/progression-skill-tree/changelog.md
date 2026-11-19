---
layout: guide
title: "Changelog · RPG Skill Tree & XP System"
nav: Changelog
order: 9
permalink: /docs/progression-skill-tree/changelog/
description: "Each version of RPG Skill Tree & XP System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.1 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- The [glint](how-to.md#show-what-the-player-can-use), a sparkle on what the player can pick up,
  use or train on: the **PT Glint** component, the **Glints** settings, **Set Glints Shown** and
  `Progress.Glints`. The demo's mushrooms, dummies, orb and respec stone carry one.
- The settings page is named **RPG Skill Tree & XP System**, as the plugin is.
- The demo's player punches, gathers and offers mushrooms to the respec stone in poses of its own,
  walking the last step to what it uses; its **Action Montages** take yours instead.

Nothing to change on updating: glints show only on what you give a PT Glint.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- tracks with their own XP curve, cap, points, level rewards and XP boosts;
- skill trees of ranked nodes, with requirements, exclusive choices, a live preview and checks on
  save;
- tag, stat, Gameplay Ability, Gameplay Effect and event rewards, and a Stat Component;
- respecs, free or for a price;
- XP bars, a level-up toast and a tree screen for mouse, keyboard and gamepad, each replaceable
  by your own Widget Blueprint;
- replication, and save into your save game or a slot;
- the Gameplay Debugger's **Progression** category and the `Progress.*` console commands;
- the demo yard.
