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

## 1.3 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- **Passive and triggered abilities**: an ability's **Trigger** sets it off by itself while
  granted (**Passive**), or when its owner's hit lands, when it is hurt, when it kills, or when one
  of its statuses lands, with a **Trigger Chance** and its cooldown as an internal one. An area
  around its caster can **Follow Caster** as an aura. The HUD shows passives over the hotbar, and
  the component's **On Ability Triggered** event fires. See [Triggers](reference.md#triggers).
- **Charges and hold-to-charge**: **Max Charges** holds several uses, each recharging on its own;
  **Charge Time** grows an ability while its key is held, to **Charged Power** and **Charged
  Size**. The hotbar shows charges left, the cast bar the charge.
- **Knockback, pull and a dash**: **Knockback** throws each target clear, or draws it in when
  negative, from the caster or the impact; a self ability's **Dash Distance** rushes the caster
  along the aim, hitting what it passes. A fourteenth status, **Staggered**, holds a target for a
  moment and loses its cast.
- **Projectile patterns**: **Projectile Count** and **Spread** throw a fan; **Homing** steers for
  the target; **Pierce** and **Bounces** pass through targets and glance off walls.
- **AI casting**: a **Cast Ability** task and a **Can Cast** decorator for Behavior Trees, a task
  and a condition of the same names for State Trees, and the component's **Cast At**, **Can Cast
  At** and **Get Best Ability**. See [Let an enemy cast back](how-to.md#let-an-enemy-cast-back).
- **Sounds**: 43 of the plugin's own, on every ability's cast, flight and impact and on every
  status as it lands, and an ability's new **Effect Sound**, looped with a projectile or a
  lingering area.
- **Gameplay Cues**: an ability's cast, effect and impact, and a status's look and sound, play
  through Gameplay Cues; a cue of your own on the asset's **Cast Cue**, **Effect Cue**, **Impact
  Cue** or a status's **Cue** replaces the plugin's. See
  [Your own effects](how-to.md#play-your-own-effects-through-gameplay-cues).
- Five new abilities: **Dash**, **Ignite** and **Thorns** (passives), **Grasp** (a pull) and
  **Frost Aura** (an aura); Frost Bolt throws a fan of three, Fireball charges and Blink has two
  charges. A ninth slot, on <kbd>9</kbd> and the d-pad's left.
- Tested on a dedicated server with two clients as well as a listen server; the
  `Ability.Input` console command lists the player's input bindings.
- The demo: Dash on <kbd>9</kbd>, Ignite and Thorns over the hotbar, a Duelist that throws a fan
  of Frost Bolts from a Behavior Tree, and a Warden that drags you in with Grasp inside its Frost
  Aura, from a State Tree; dusk light and painted people.
- Fixed: a status's look could outlast the status by a few seconds, Frozen's ice above all; it now
  ends the moment the status does, however it ends.

Updating: nothing to do. A project with its own input mapping adds `IA_AbilitySlot9`, or keeps
eight slots by leaving it out of **Slot Actions**.

## 1.2 (November 2026)

Unreal Engine 5.6, 5.7 and 5.8, on Windows, Mac and Linux.

- **Lock-on**: the nearest enemy in view held as the target, cycled left and right, let go when it
  dies, walks out of range or stays out of sight. Middle mouse or **T** and the right stick's click
  lock and let go; the wheel and a flick of the right stick move it. Every ability aims at the
  lock, the camera keeps it in view and the HUD marks it. The **Lock On** settings, the
  component's **Lock On**, **Cycle Lock Target** and **Set Lock Target** nodes and its **On Lock
  Target Changed** event; replicated. See [Targeting](reference.md#targeting).
- **The effects redone**: each ability gathers in the caster's hand as it is cast, in its
  element's colour; projectiles leave a ribbon; impacts, novas and self casts throw a shock ring
  and a sigil on the ground under them and light what is round them. Poison Cloud bursts as it
  lands (its **Impact Effect**, which a lingering area now plays).
- An ability's **Cast Effect** is set on all nine.
- The bars over heads fade where a nearer one is drawn over them, so names don't run together.
- The component's **Set Base Walk Speed**: a game's own run or crouch, under the speed statuses.
- The demo: <kbd>Shift</kbd> runs, <kbd>Tab</kbd> opens a screen of the hotbar's abilities with
  Save, Load and Start over, <kbd>G</kbd> opens a guide to the abilities, statuses and lock-on,
  <kbd>I</kbd> hides the controls card, <kbd>R</kbd> twice starts over with the saves deleted, and
  Alt+Tab leaves the mouse working.

Updating: nothing to do. A project with its own input mapping adds the two lock actions,
`IA_LockOn` and `IA_LockCycle`, or sets its own in the settings.

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
- the [glint](how-to.md#show-what-the-player-can-use), a sparkle on what the player can cast at,
  pick up or use: the **AS Glint** component, the **Glints** settings, **Set Glints Shown** on **AS
  Glints** and `Ability.Glints`;
- the demo training ground, `L_Demo`.
