---
layout: guide
title: "Troubleshooting · GAS Ability & Status Effect System"
nav: Troubleshooting
order: 8
permalink: /docs/ability-status/troubleshooting/
description: "Fixes for the usual problems with GAS Ability & Status Effect System, from a key that does nothing to packaged games, and answers to the usual questions."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start a check with the Gameplay
Debugger (<kbd>'</kbd> in Play): its **AbilityStatus** category shows what the viewed actor really
has, what stops each of its abilities now, and the last one that failed.

## A key does nothing

Look above the hotbar first: an ability that is refused says why there. When nothing shows at all:

- **The pawn has no AS Ability System.** The component goes on the pawn the player possesses, not on
  the PlayerController or a Blueprint that isn't spawned.
- **The slot is empty.** Key <kbd>1</kbd> is the first of **Starting Abilities**; an empty entry
  leaves its slot empty. The hotbar shows the empty slots.
- **Bind Slot Input is off** on the component. Then only your own calls to **Press Slot** or **Try
  Activate** cast.
- **Your own input takes the key first.** A mapping context of yours with a higher priority than the
  plugin's (the component's **Mapping Priority**, 1) and the same key consumes it. Raise **Mapping
  Priority**, or move the plugin's slots to other keys ([rebinding](how-to.md#let-players-rebind-keys)).
- **The player isn't on Enhanced Input.** Every project made from Epic's templates is. An older one
  sets **Default Player Input Class** and **Default Input Component Class** to the Enhanced ones in
  **Project Settings > Input**.

## The ability says why it can't be cast

| It says | Because | Fix |
|---|---|---|
| Not enough mana (stamina, health) | The cost is more than is left. | Wait for regeneration, or lower **Cost**. |
| Not ready yet | It is cooling down: the slot shows the seconds left. | Lower **Cooldown**. |
| Already casting | Another ability is mid-cast or channelling. | Wait for it, or lower its **Cast Time**. |
| Silenced, Stunned, Frozen | A status blocks it. | Wait it out, or cleanse it. |
| Can't do that now | A tag in its **Blocked By**, or a blocking effect of your own. | The debugger names the tag beside the ability. |
| Not learned | The ability isn't granted to this component. | Grant it, or add it to **Starting Abilities**. |
| You're dead | Health is 0. | **Revive** on the server. |

## It casts, but the target takes nothing

- **The target has no AS Ability System**, or another ability system component without the AS
  Attribute Set. Without one, nothing can be damaged or get statuses.
- **They are on the same team.** An ability that affects **Enemies** passes over its caster's team:
  check both components' **Team**. Team 0 is hostile to all.
- **The ability affects Allies.** **Affects** decides whom it lands on: **Enemies** for harm.
- **The target resists it.** A resistance of 1 to its damage type takes all of it, and an
  `Immune.` tag keeps its status off. The debugger shows the target's attributes and tags: aim at it
  and press <kbd>'</kbd>.
- **The projectile is stopped first.** It hits the first thing it meets: a wall, or a collision box
  in front of the target.

## The status shows no icon, or doesn't slow

- **No bar over the target.** Add the **AS Overhead Bar** component to it. The HUD shows only the
  player's own statuses.
- **A status of your own shows nothing.** Add it to **Status Effects** in the
  [settings](reference.md#settings): the bars find a status's icon there, by its tag.
- **Chilled or Rooted don't slow it.** Movement changes only a **Character**'s walk speed. Code of
  yours that sets **Max Walk Speed** each frame overrides it.

## No HUD

- **Show HUD** is off on the component, or **HUD Class** is empty there and in the settings.
- **The component isn't on the pawn the local player controls.** The HUD is for that player; a
  component on an AI or a target shows none.

## No animation plays as it casts

The ability's **Cast Montage** is empty, or the character's Anim Blueprint doesn't play the montage's
slot ([the fix](how-to.md#play-an-animation-as-an-ability-casts)).

## Saving the ability asset lists problems

The **Message Log** names each: no **Ability Class** or **Display Name**, damage without a **Damage
Type**, a target or self effect left empty, no **Range** on anything but a Self ability, an Area
without a **Radius**, a Channel without a **Duration**. An ability that does nothing at all gets a
warning. Fix them and save again.

## In a packaged game an ability or a command is missing

- **An ability granted only by name**, from a string or `Ability.Grant`, isn't packaged: nothing
  references it. Reference it, or add its folder to the cook ([Packaging](reference.md#packaging)).
- **The console commands do nothing in a Shipping build.** They are left out of it: test in a
  Development build.

## In multiplayer, a client's change doesn't stick

- **Granting, applying, loading and reviving run on the server only.** Called on a client they do
  nothing: call them from server code, or a Run on Server event ([which](reference.md#multiplayer)).
- **`Ability.Grant` or `Ability.Effect` in a client's console says to run it on the server.** Use
  the host's window.
- **After a respawn, abilities and statuses start again.** They belong to the pawn's component, and a
  new pawn has a new one. [Save](how-to.md#save-and-load-abilities-and-statuses) them before and
  load them on the new pawn.

## Questions

**Do I need C++?** No. Every node, event and setting is in Blueprint, and the quickstart uses no graph
at all. The C++ headers are public for projects that want them.

**Does it work with GAS Companion, Lyra or my own ability system?** Yes, for damage, the shield,
the statuses and death, on any ability system component that has the AS Attribute Set. Casting the
plugin's abilities, its events and its HUD need its own component
([what works where](reference.md#other-ability-system-components)).

**Does it work on a dedicated server?** It is built on GAS's own replication, with the HUD and keys
only on players' machines, so nothing in it needs a player on the server. It is tested as a listen
server with two players, not yet on a dedicated one.

**Are there sounds?** No. Every ability has empty **Cast Sound** and **Impact Sound** slots, and every
status an **Apply Sound**, for your own.

**Which platforms?** Windows, Mac and Linux, on Unreal Engine 5.6, 5.7 and 5.8.

Still stuck? Write in the listing's comments on Fab, or to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com), with what the debugger and `Ability.List`
show.
