---
layout: guide
title: "Changelog · Procedural Village Generator"
nav: Changelog
order: 9
permalink: /docs/village-generator/changelog/
description: "The versions of Procedural Village Generator and what each one changed."
---

# Changelog

Each version, newest first. [Install](install.md#update-it) says how to update.

## 1.0.0 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux. The first release:

- villages laid out from a seed: an outline of its own for each seed, two to four roads out of a
  square or your own road splines, lanes, plots along them, a market square, fenced yards, fields,
  a meadow and pine woods round the rim;
- houses from modules on one grid, one to three storeys, rectangles, L and T shapes, on
  foundations to the ground, and a church of a nave and tower with arched windows, a belfry and
  a spire;
- the village type data asset: size, roads, rings of houses, roles and where they go, the square,
  fields and nature, swapped in play with Set Type; and the default type with an inn, a church, a smithy, a bakery and two farms;
- the kit data asset, with Data Validation of missing pieces; and the stylized kit, with five wall
  styles, three roofs, props, trees, grass, crops and ground decals;
- places (Sleep, Work, Sit, Read, Trade, Gather, Door) with claims kept through rebuilds while their
  place stands, Get Home and Get Work Spot,
  and named areas with Is In Area, Random Point In Area and spawn rules;
- edits: pin, move and remove a building, kept through rebuilds, saved with the seed in your
  save game;
- baking to plain actors for World Partition, and unbaking;
- building at run time, async on a background thread, the same village on server and clients;
- the Village Points and Village Clearance PCG nodes, Village Points with the walls' modules too;
- the glint, a sparkle on what the player can use, on any actor and a village's places;
- the demo map;
- the `Village.*` console commands and the debug drawing.
