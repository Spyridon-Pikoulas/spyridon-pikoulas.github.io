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

## 1.2 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- [Attribute points](how-to.md#let-players-spend-attribute-points): an **Attribute Set** asset of
  attributes such as Strength and Vigor, its points from the levels of the tracks you pick, each
  point giving the attribute's rewards. Points are chosen, undone and confirmed together on a new
  attribute screen for mouse, keyboard and gamepad (<kbd>C</kbd>, the gamepad's **Menu**), which
  shows each stat now and after. A respec gives them back, for a price when you set one. They
  replicate and save with the rest.
- The settings' **Default Attribute Sets**, **Attribute Action**, **Attribute Widget** and
  **Percent Stats** (stats such as a crit chance shown as +5%, not +0.05), the
  `Progress.AttributePoints`, `Progress.Attribute` and `Progress.RespecAttributes` commands, and
  the attribute sets in the Gameplay Debugger.
- The demo's Hero set: Might, Vigor, Swiftness and Luck, a point for every level of its three
  tracks. The respec stone gives attribute points back with the trees'.
- One points screen: the trees and the attributes are its two tabs, switched with <kbd>Q</kbd> and
  <kbd>E</kbd> or the bumpers, what is pending kept across.
- Skill picks wait for Confirm, as attribute points do: a click (**A**) picks a rank, a right-click
  (**X**) takes it back for free with the picks that needed it, and <kbd>Enter</kbd> (the right
  trigger) learns them together; on the attribute tab **A** adds a point, **X** takes one back and
  the right trigger confirms. A respec's price is only for what was confirmed. The component's
  **Add Pending Node**, **Remove Pending Node**, **Confirm Pending Nodes** and the rest, and **With
  Picks** on **Get Node State**, **Can Learn Node** and **Get Node Requirements**.
- The tree screen pans with a left drag too. The bumpers change tab, no longer tree; the right
  stick's press zooms, no longer the triggers.
- The tree screen closes on the Tree Action's key also when that key is Tab, which the selected
  node's button took as a move to the next node.
- The demo: <kbd>Shift</kbd> runs, the Dash is on <kbd>Q</kbd>, <kbd>Tab</kbd> opens the trees,
  <kbd>I</kbd> hides the controls card, <kbd>R</kbd> twice starts over and <kbd>G</kbd> opens a guide
  to it, a page on each part. <kbd>E</kbd> gathers whenever a mushroom is in reach, and Quick Hands
  lets the player pick from further off. What the player can gather, use or punch shows its key
  beside it, with the demo's notes; the controls card holds the general keys only. Each field has
  its title over it, and the respec stone is a carved rune stone.

Nothing to change on updating: a save from 1.1 loads as it did, with no attribute points spent.

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
