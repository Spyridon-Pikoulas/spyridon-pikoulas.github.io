---
layout: guide
title: "Quest & Dialogue System"
guide: "Quest & Dialogue System"
nav: Overview
order: 1
permalink: /docs/quest-dialogue/
description: "The guide to Quest & Dialogue System, an Unreal Engine 5.6 to 5.8 plugin for quests and branching dialogue, usable from Blueprint, replicated and saved."
---

# Quest & Dialogue System

Quests and branching dialogue for Unreal Engine 5.6 to 5.8, as one C++ plugin with all of it
usable from Blueprint. Dialogue is written as text scripts, quests are data assets, and both work
in multiplayer and save into your own save game.

{% include figure.html src="demo-talk.jpg" size="wide" alt="Mira the Herbalist talking to the player outside her cottage in the demo village. The dialogue box at the bottom shows her line and two numbered choices." caption="The plugin's demo village: a conversation with two choices, written as a text script." %}

## What it does

- **Quests** are data assets: a title, a description, and stages of objectives that run at once.
  A quest can require other quests or tags, give tags when it completes, repeat, and be tracked on
  screen. Every state is there: inactive, active, completed, failed and abandoned.
- **Progress** comes from one node, **Report Quest Event**, with a gameplay tag and a count. Call
  it from anything in your game. A **Quest Trigger** actor covers "reach this place" objectives,
  and talking to a speaker covers "talk to" ones.
- **Dialogue** is a `.qds` text file: speakers, lines, numbered choices, jumps, and conditions on
  quests and tags. Lines can start and complete quests, give tags and fire events for Blueprint.
  Scripts diff and merge in source control like code.
- **Ready-made UI**: a dialogue box, a quest log and a tracker, each replaceable by your own Widget
  Blueprint.
- **Multiplayer**: the server owns each player's quests and replicates them to that player only.
- **Save**: one node writes every quest and tag into your save game, and one reads them back.

## What's in the zip

| Folder | What it holds |
|---|---|
| `Source/QuestDialogue` | The plugin itself: quests, dialogue, the components, UI, save and multiplayer. |
| `Source/QuestDialogueEditor` | The editor's part: the `.qds` importer, the Quest entry in the Content Browser's menu, and the packaging rule for the settings' assets. |
| `Source/QuestDialogueDemo` | The demo's game mode and characters. Nothing of yours depends on it. |
| `Content/Input` | The input actions and the mapping context for talking and the quest log. |
| `Content/Demo` | The demo village map, its quests and its dialogue scripts. |

It needs the engine's **Enhanced Input** plugin ([Install](install.md#enable-it-in-your-project))
and runs on Windows, Mac and Linux.

## The demo

The village above is the plugin's own map, `Demo/L_Demo`, with three people and three quests.

1. Show the plugin's content in the Content Browser ([how](install.md#enable-it-in-your-project)).
2. Open `QuestDialogue Content/Demo/L_Demo` and press **Play**.

Its World Settings use the demo's own game mode, so it plays the same in any project. **F1** hosts
a listen server and **F2** joins one on the same PC, to try multiplayer. **F5** saves the quests,
**F9** loads them, and **Tab** shows the mouse cursor.

{% include figure.html src="demo-village.jpg" alt="The demo village from above at dusk: cottages, a well, a market stall and lit lamps along the paths, with Mira the Herbalist and Sela the Traveller under their name plates and exclamation marks, and Bram the Gatekeeper by the stall, his plate half behind its roof." caption="Mira, Bram and Sela each have a quest: **!** over a head means it can start, **?** that it is under way." %}

## Where to go next

- [Install](install.md): from Fab to the plugin enabled in your project.
- [Quickstart](quickstart.md): a quest you can play in your own map, in fifteen minutes.
- [How-tos](how-to.md): kills, rewards, quest chains, dialogue events, your own UI, save, co-op.
- [Dialogue scripts](script.md): the `.qds` format, line by line.
- [Reference](reference.md): every Blueprint node, setting and console command.
- [Troubleshooting](troubleshooting.md): when something doesn't happen as it should.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
