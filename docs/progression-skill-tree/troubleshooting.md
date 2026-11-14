---
layout: guide
title: "Troubleshooting · RPG Skill Tree & XP System"
nav: Troubleshooting
order: 8
permalink: /docs/progression-skill-tree/troubleshooting/
description: "Fixes for the usual problems with RPG Skill Tree & XP System: K does nothing, XP doesn't arrive, a node won't learn, stats read 0, stuck input, loading and multiplayer, and answers to the usual questions."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start a check with the Gameplay
Debugger (<kbd>'</kbd> in Play): its **Progression** category shows what the player's tracks,
nodes, tags and stats really are.

## The plugin isn't in the Plugins window

Search for `Skill Tree`: the plugin is listed as **RPG Skill Tree & XP System**, and a search for
"Progression" doesn't find it. If it still isn't there, it isn't installed to this engine version
([Install](install.md)).

## K does nothing

- **Your own input takes K first.** A mapping context of yours with a higher priority than the
  plugin's (1) and <kbd>K</kbd> mapped consumes the key. Raise **Input Context Priority** in
  **Project Settings > Plugins > Progression & Skill Trees**, or map the plugin's `IA_SkillTree`
  in your own context and clear **Input Context**.
- **The player isn't on Enhanced Input.** Every project made from Epic's templates is; an older
  one needs a setting ([Install](install.md#enable-it-in-your-project)).
- **Tree Action is cleared** in the settings. Then only your own call to **Toggle Tree** opens the
  screen.
- **The player has no trees.** The screen opens reading "No skill trees yet": add your tree to
  **Default Trees**, or call **Add Tree**.

## XP doesn't arrive

- **Add XP ran on a client.** It works on the server only, and a client's call writes "AddXP runs
  on the server; a client's call is ignored" to the Output Log. Call it from the server: an
  overlap or a death in the Level Blueprint or on an actor runs there too.
- **No Progression Component is found.** **Get Progression Component** with an actor that isn't a
  player's (an AI, the trigger box itself) returns nothing. In an overlap, pass **Other Actor**.
- **The track is at its Max Level.** XP stops at the cap.

## A node won't learn

Type `Progress.Why ST_Hero HighJump` (your tree and node) in the console (<kbd>&#96;</kbd>): it writes
what the node lacks to the Output Log, as the node's tooltip does on the tree screen.

- **The tree isn't one of the player's.** Add it to **Default Trees**, or call **Add Tree**.
- **Not enough points.** Each level gives the track's **Points Per Level**; several trees on one
  track share them.
- **Its level, required nodes, tags or exclusive group.** The tooltip lists each, met or not.
- **The tree's check finds a problem.** Open the tree: the line under its preview names a node no
  one can ever learn (a cycle, a level past the track's cap) or a requirement naming no node.
- **The call ran on a client with Accept Client Requests off.** Then only the server's calls
  count.

## Stats read 0

- **The name differs.** A reward on `RunBonus` doesn't reach a **Get Stat** of `RunSpeed`;
  **Get Stat Names** lists the ones the player has.
- **The pawn isn't possessed yet.** **Get Stat Component** finds the component through the
  player's PlayerState, which a pawn has once possessed: read it after, and check it with **Is
  Valid**, as the [quickstart](quickstart.md#4-use-the-stats) does.
- **No reward gives it yet.** A stat no reward or base value has set is 0, as it should be.

## The cursor stays, or the game ignores input, after the tree screen

The plugin switches to UI input while the tree screen is open and back to game input after. A
game that sets input modes itself can fight it: untick **Manage Input Mode** in the settings and
handle **On Tree Screen Changed** on **Get Progression UI** yourself.

## The tree shows its asset name as its title

The tree has no **Display Name**; the check under its preview says so. Set it in the tree asset.

## Loading doesn't bring progress back

- **It ran on a client.** **Load Save Data** works on the server only, and **Load Progress From
  Slot** returns false on a client.
- **The tracks or trees were renamed or moved** since the save. They are saved by path: once
  players have saves, keep their names and folders.
- **A node's Id changed.** A node is saved by its Id; renamed, it starts unlearned.

## Multiplayer

- **A change shows late on the client.** A client's request goes to the server and comes back with
  replication, a round trip later. Read the result in **On Progress Changed**, not right after the
  call.
- **Progress is lost on map travel.** A new PlayerState starts with empty components. Save before
  the travel and load after, or, with seamless travel, carry it over in your PlayerState's **Copy
  Properties** event: **Get Save Data** from this one, **Load Save Data** into the new one.
- **Console commands change nothing.** On a client, the commands that change progress do nothing;
  type them on the host.

## The Gameplay Debugger or console key doesn't open

On keyboards other than US English, <kbd>'</kbd> and <kbd>&#96;</kbd> may be other keys. Set them
under **Project Settings > Engine > Gameplay Debugger > Activation Key** and **Project Settings >
Engine > Input > Console Keys**.

## FAQ

**Do I need the Gameplay Ability System?** No. Tags, stats and points work without it, through the
Stat Component. A node can also grant a Gameplay Ability or Effect on a project that uses it
([how](how-to.md#grant-a-gameplay-ability-system-ability-from-a-talent)).

**Do I need C++?** No. Every node is in Blueprint, and the [quickstart](quickstart.md) uses no
C++. The [how-tos](how-to.md) give C++ too, where both apply.

**Does the tree screen work on a gamepad?** Yes ([keys](reference.md#ui)).

**Can a player have several levels, such as a character level and a crafting skill?** Yes: one
track for each, each with its own XP, level and points
([how](how-to.md#have-a-character-level-and-separate-skills)).

**Can players respec?** Yes, a node or a whole tree, free or for a price in a stat such as gold
([how](how-to.md#let-players-respec)).

**Does it work in multiplayer?** Yes. The server owns each player's progress and replicates it to
that player; the tree screen's calls go to the server
([how](how-to.md#make-it-work-in-multiplayer)).

**Can I keep my own save system?** Yes. **Get Save Data** gives a structure to put in your own save
game, and **Load Save Data** takes it back ([how](how-to.md#save-progress-with-your-own-save-game)).

**Does the tree editor update as I edit?** Yes. The tree asset's preview and its check are redrawn
with every change, with no need to reopen it.

## Still stuck

Ask in the listing's comments on Fab, or email
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com) with your engine version, what you did and
what the Output Log says under `LogProgression`.
