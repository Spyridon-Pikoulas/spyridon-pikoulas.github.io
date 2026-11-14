---
layout: guide
title: "Changelog · GAS Ability & Status Effect System"
nav: Changelog
order: 9
permalink: /docs/ability-status/changelog/
description: "Each version of GAS Ability & Status Effect System, newest first: its date, engines, what changed and what to do on updating."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- the **AS Ability System** component, ready on any actor, with slots, events, teams and save;
- abilities as data assets on six archetypes (projectile, area, cone, chaining beam, self with an
  optional blink, channel), checked on save, and nine that ship;
- thirteen status effects with stacking, immunity, cleanse and a freeze from a fourth chill, each a
  Gameplay Effect Blueprint to change;
- one damage calculation with power, armor, four resistances, critical hits and a shield, on the
  plugin's component or any other holding its attribute set (Lyra, GAS Companion);
- a HUD built in UMG and replaceable, bars over heads, floating damage numbers;
- eight slots on Enhanced Input, rebindable while playing; camera aim, soft targeting and a ground
  circle for areas;
- replication with GAS prediction, tested as a listen server with two players;
- the Gameplay Debugger's **AbilityStatus** category and the `Ability.Grant`, `Ability.Effect` and
  `Ability.List` console commands;
- the demo training ground, `L_Demo`.
