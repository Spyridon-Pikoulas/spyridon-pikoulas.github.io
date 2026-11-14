---
layout: guide
title: "RPG Skill Tree & XP System"
guide: "RPG Skill Tree & XP System"
nav: Overview
order: 1
permalink: /docs/progression-skill-tree/
description: "The guide to RPG Skill Tree & XP System, an Unreal Engine 5.6 to 5.8 plugin for XP, levels and skill trees, usable from Blueprint, replicated and saved."
---

# RPG Skill Tree & XP System

XP, levels and skill trees for Unreal Engine 5.6 to 5.8, as one C++ plugin with all of it usable
from Blueprint. Tracks and trees are data assets, the screens come ready, and progress works in
multiplayer and saves into your own save game.

{% include figure.html src="demo-tree.jpg" size="wide" alt="The demo's tree screen: three trees side by side, Agility, Foraging and Combat, each under its track's level and XP, and on the right the selected node Dash with its requirements met, its cost and the Learn button." caption="The plugin's tree screen in its demo: three tracks, each with its own tree." %}

## What it does

- **Tracks** level a player up by XP: a character level, or Farming, Fishing and Combat apart.
  Each has its own XP curve, cap and points per level, and can boost XP by source.
- **Skill trees** are made of ranked nodes, each costing its track's points. A node can require
  other nodes, a level or gameplay tags, or be one of an exclusive choice. The tree asset draws a
  preview as you edit it and checks that every node can be learned.
- **Rewards** come with each rank or level: a gameplay tag, a stat, a Gameplay Ability System
  ability or effect, or an event for your own Blueprints.
- **Ready-made UI**: XP bars, a level-up toast and a tree screen for mouse, keyboard and gamepad,
  each replaceable by your own Widget Blueprint.
- **Multiplayer**: the server owns progress; learning and respecs asked for on a client are
  checked there.
- **Save**: one node writes all progress into your save game, and one reads it back.

## What's in the zip

| Folder | What it holds |
|---|---|
| `Source/ProgressionTree` | The plugin itself: tracks, trees, the components, rewards, UI, save and multiplayer. |
| `Source/ProgressionTreeEditor` | The editor's part: the asset types, the tree preview and the checks on save. |
| `Source/ProgressionTreeDemo` | The demo's game mode and characters. Nothing of yours depends on it. |
| `Content/Input` | The input action and the mapping context for the tree screen. |
| `Content/Icons`, `Content/UI` | The demo's skill icons and the screens' icon material. |
| `Content/Demo` | The demo yard map and its tracks and trees. |

It turns on the engine's **Enhanced Input** and **Gameplay Abilities** plugins with it
([Install](install.md#enable-it-in-your-project)), and runs on Windows, Mac and Linux.

## The demo

The tree screen above is from the plugin's own map, `Demo/L_Demo`: a yard with three tracks to
level up.

1. Show the plugin's content in the Content Browser ([how](install.md#enable-it-in-your-project)).
2. Open `ProgressionTree Content/Demo/L_Demo` and press **Play**.

| Track | Its XP | Its tree |
|---|---|---|
| Agility | running, and the orb on the high ledge | a faster run, a double jump, a dash |
| Foraging | picking mushrooms (<kbd>E</kbd>) | faster gathering, from further, two at a time |
| Combat | punching the training dummies (left click) | harder hits, more often critical |

<kbd>K</kbd> opens the trees, and the respec stone by the start unlearns them for a mushroom a
point. <kbd>F5</kbd> saves and <kbd>F9</kbd> loads. Its World Settings use the demo's own game
mode, so it plays the same in any project; <kbd>F1</kbd> hosts a listen server and <kbd>F2</kbd>
joins one on the same PC, to try multiplayer.

{% include figure.html src="demo-levelup.jpg" alt="The demo's fenced training ground in play: the character among the training dummies, a damage number over one, the three XP bars at the top left with +310 XP on Combat, and a Combat 4 level-up toast at the top." caption="The training ground, where punching the dummies earns Combat XP." %}

## Where to go next

- [Install](install.md): from Fab to the plugin enabled in your project.
- [Quickstart](quickstart.md): a track and a tree in your own map, in fifteen minutes.
- [How-tos](how-to.md): XP from kills and quests, abilities, stats, respecs, your own UI, save,
  multiplayer.
- [Concepts](concepts.md): how tracks, trees, rewards and stats fit together.
- [Reference](reference.md): every Blueprint node, setting and console command.
- [Troubleshooting](troubleshooting.md): when something doesn't happen as it should.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
