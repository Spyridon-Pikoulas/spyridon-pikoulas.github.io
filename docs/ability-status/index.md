---
layout: guide
title: "GAS Ability & Status Effect System"
guide: "GAS Ability & Status Effect System"
nav: Overview
order: 1
permalink: /docs/ability-status/
description: "The guide to GAS Ability & Status Effect System, an Unreal Engine 5.6 to 5.8 plugin of ready abilities and status effects on Epic's Gameplay Ability System, usable from Blueprint alone, replicated and saved."
---

# GAS Ability & Status Effect System

Abilities and status effects for Unreal Engine 5.6 to 5.8, built on Epic's Gameplay Ability System
(GAS) and usable from Blueprint alone. Put one component on a character, pick its abilities, and it
casts, with a HUD, keys, damage, multiplayer and saving already done.

**Get it on Fab:** [GAS Ability & Status Effect System](https://www.fab.com/listings/1111c772-f590-4c64-bcc0-af0b26844262).

**Try it first:** the [playable Windows demo](https://github.com/heyheythere-games/ability-status-demo/releases/latest) is free, about 290 MB; unzip it and run the exe.

{% include figure.html src="demo-ground.jpg" size="wide" alt="The demo's training ground at dusk: a Fireball bursting on a Training Dummy, 39 damage and a burn over it; the Fire-Warded dummy and two Training Dummies about it, each with its name and health bar over its head, a glint by the plain ones, and the Warden behind in the blue ring of its Frost Aura; the health, mana and stamina bars, the two passives and a hotbar of nine abilities at the foot of the screen." caption="The demo's training ground: a Fireball bursting among the dummies." %}

## What it does

- **Abilities are data assets.** Right-click, pick **AS Ability** and fill in a form: cost, cooldown,
  cast time, range, damage and its type, healing, the statuses it applies, and its Niagara effects.
  Six archetypes decide how it finds its targets: a projectile, an area, a cone, a chaining beam,
  the caster itself, or a channel held down. Projectiles fan, home, pierce and bounce; a self cast
  can blink or dash; a hit can knock back or pull. Fourteen abilities ship ready.
- **Passives and triggers.** An ability can go off by itself while granted, or when its owner's
  hit lands, when it is hurt, when it kills or when its status lands: Ignite sets targets alight
  now and then, Thorns hurts back, Frost Aura chills all round its bearer. Abilities can hold
  charges, and grow while their key is held.
- **Fourteen status effects.** Burning, Poisoned, Bleeding, Chilled, Frozen, Stunned, Staggered,
  Rooted, Silenced, Weakened, Vulnerable, Shielded, Haste and Regeneration. They stack, run out, and can be
  cleansed or resisted; a fourth chill freezes. Each is a Gameplay Effect Blueprint to change or
  copy.
- **Damage.** One calculation for abilities, statuses and your own traps: the attacker's power,
  armor, resistances to fire, frost, lightning and poison, critical hits, and a shield that takes
  damage before health.
- **A HUD that comes built.** Health, mana and stamina bars, a hotbar with keys, costs, charges and
  cooldown sweeps, the passives over it, buff and debuff icons with stacks and seconds left, a cast bar, the reason a cast failed,
  floating damage numbers and bars over enemies' heads. Restyle it in a Widget Blueprint or replace
  it.
- **Keys.** Nine slots on <kbd>1</kbd> to <kbd>9</kbd> and the gamepad's buttons through Enhanced
  Input, rebindable while playing. Abilities aim where the camera looks, with a ground circle for
  areas.
- **Enemies that cast.** A Cast Ability task and a Can Cast check for Behavior Trees and State
  Trees, and nodes that pick the best ability to cast at a target.
- **Sounds and cues.** 43 sounds of its own on the abilities and statuses, and every effect and
  sound played through Gameplay Cues, which your own cues can replace.
- **Multiplayer and save.** Everything replicates, casts are predicted on the player's machine and
  the server decides hits; tested on a listen server and a dedicated one. One node puts attributes, abilities, cooldowns, statuses and keys into your
  save game, one puts them back.
- **A glint** on what the player can cast at, pick up or use, a small sparkle each target or prop
  can carry and a game can turn off.
- **It says why.** When an ability can't be cast, the HUD says why, and the Gameplay Debugger shows
  attributes, statuses and what stops each ability, live.

<div class="gallery">
{% include figure.html src="demo-frost.jpg" alt="Three dummies chilled by Frost Nova, frost at their feet and the Chilled icon with its stacks over each health bar." caption="Frost Nova chills everything around the caster; a fourth chill freezes." %}
{% include figure.html src="demo-barrier.jpg" alt="The player inside a blue hexagonal bubble beside a poisoned dummy, the shield shown in the health bar and the Shielded icon above it." caption="Barrier's shield takes damage before health." %}
</div>

## What's in the zip

| Folder | What it holds |
|---|---|
| `Source/AbilityStatus` | The plugin: the ability system component, abilities and archetypes, the attribute set, the status effects, the damage calculation, the HUD, save, replication and the debugging tools. |
| `Source/AbilityStatusEditor` | The **AS Ability** entry in the Content Browser, checks on save, and the packaging of the statuses' icons, effects and sounds. |
| `Content/Abilities` | The fourteen abilities: Fireball, Frost Nova, Poison Cloud, Chain Lightning, Heal, Barrier, Blink, Haste, Dash, Frost Bolt, Ignite, Thorns, Grasp and Frost Aura. |
| `Content/Effects` | The fourteen status effects, `GE_Bleeding` to `GE_Weakened`. |
| `Content/FX`, `Content/Icons` | 43 Niagara systems for the abilities and statuses, and their 28 icons. |
| `Content/Audio` | 43 sounds: a cast for each school of magic, flights, loops, impacts and a sound for each status. |
| `Content/Input`, `Content/UI` | The nine slots' and the lock's input actions and their mapping context; the cooldown sweep's, the ground circle's and the lock marker's materials. |
| `Content/Glint` | The glint's material, `M_ASGlint`. |
| `Content/Demo`, `Source/AbilityStatusDemo` | The training ground, `L_Demo`, its town and its code: the player, the dummies, the Duelist's Behavior Tree and the Warden's State Tree, and the demo's keys. |

It needs the engine's **Gameplay Abilities**, **Enhanced Input** and **Niagara** plugins, which are
turned on with it. It runs on Windows, Mac and Linux, in Blueprint-only and C++ projects.

## Play the demo

With the plugin's content showing in the Content Browser ([Install](install.md#find-its-content)),
open **Plugins > GAS Ability & Status Effect System > Demo > L_Demo** and press **Play**.

The map runs its own game mode, so it plays as it is in any project. A card at the left lists the
general keys, and <kbd>I</kbd> hides it; the rest show where they act: each ability's key on its
hotbar slot, the lock's keys under the dummy they would take, and letting go at Poison Cloud's aim.
<kbd>Tab</kbd> opens the demo's screen: the hotbar's abilities, their keys and what each does, and
**Save**, **Load** and **Start over**. <kbd>G</kbd> opens a guide, a page on each ability, the
statuses, lock-on, the passives, the Dash and the Warden. <kbd>Shift</kbd> held runs.

- <kbd>1</kbd> to <kbd>9</kbd> cast Fireball (hold to charge), Frost Nova, Poison Cloud (hold, aim,
  let go), Chain Lightning, Heal, Barrier, Blink (two charges), Haste and Dash. Ignite and Thorns,
  over the hotbar, are passives: nothing to press.
- Middle mouse or <kbd>T</kbd> locks on the dummy nearest the middle of the view, and lets go; the
  mouse wheel moves the lock to the next one left or right. On a gamepad, click and flick the right
  stick.
- The three plain dummies stand close together for Frost Nova and Chain Lightning. The Fire-Warded
  dummy shrugs off most fire and can't burn. The Duelist throws a fan of Frost Bolts back at
  whoever hurts it, from a Behavior Tree. The Warden, from a State Tree, drags you in with Grasp
  inside its Frost Aura, which chills all within 4 m. A glint marks each dummy standing near enough to reach. An emptied dummy is back to full a
  moment later.
- <kbd>F5</kbd> saves and <kbd>F9</kbd> loads your health, mana, cooldowns, statuses and keys.
  <kbd>R</kbd> twice starts over, the saves deleted.
- <kbd>'</kbd> (apostrophe) shows the Gameplay Debugger. <kbd>F1</kbd> hosts a listen server and
  <kbd>F2</kbd> joins one on this PC.

Its people are Epic's mannequins, in a project made from the Third Person template, with the
template's own animations standing in for casting ones: its pistol aim, both hands out at the
target; the end of its pistol draw, both hands at the chest, for a heal; and its landing for another
cast on oneself or all around, and for a hard hit.

## Where to go next

- [Install](install.md): from Fab to the plugin enabled in your project.
- [Quickstart](quickstart.md): your Third Person character casting at targets in your own map, in
  fifteen minutes.
- [How-tos](how-to.md): enemies that cast back, passives and triggers, granting abilities in play,
  events, glints, saving, multiplayer, keys, your own HUD, your own effects and animations.
- [Concepts](concepts.md): how the parts fit together, damage and resistances, who runs what.
- [Status effects](effects.md): each status's rule and numbers, stacking, immunity, cleanse, and
  your own.
- [Reference](reference.md): every Blueprint node, field, setting and console command.
- [Troubleshooting](troubleshooting.md): when an ability doesn't fire, or something else is off.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
