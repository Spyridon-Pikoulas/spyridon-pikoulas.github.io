---
layout: guide
title: "Changelog · NPC Behavior & Daily Life System"
nav: Changelog
order: 9
permalink: /docs/npc-daily-life/changelog/
description: "The versions of NPC Behavior & Daily Life System and what each one changed."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- the brain: utility scoring by considerations and weights, with momentum and priorities, run on
  the server within a time budget a frame;
- 16 behaviours for a town's day, its watch, its fights and a companion, and 4 roles with needs and
  day plans: villager, guard, bandit and companion;
- 13 considerations and 16 steps, and Blueprint children of both for your own;
- NL Spots with capacity, rings, body offsets, roles and patrol routes, and Smart Objects as spots;
- needs, memory with fading facts, sight and hearing through AI Perception, alarm, and factions with
  attitudes;
- NL Character, a ready NPC for the UE5 mannequin, and the Brain component for your own pawns;
- animation by tag: your montages and sequences by anim set, and code poses for the mannequin's
  skeleton until you bind them;
- the plugin's own clock with weekdays and seasons, or your game's through NL Clock; your combat
  through NL Combatant;
- State Tree's Run NPC Behavior task and NPC Alert condition, and the Run State Tree step;
- replication, and save into your save game;
- the glint, a sparkle on what the player can use, on or off for one or for all;
- the score panel, the bubble, the `Npc.*` console commands and the Gameplay Debugger's **NPCLife**
  category;
- the demo town.
