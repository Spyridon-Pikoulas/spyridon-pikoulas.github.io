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

{% include figure.html src="demo-ground.jpg" size="wide" alt="The demo's training ground: the player throws a fireball at three training dummies with health bars over their heads; the health, mana and stamina bars and a hotbar of eight abilities at the foot of the screen." caption="The demo's training ground: a Fireball on its way to the dummies." %}

## What it does

- **Abilities are data assets.** Right-click, pick **AS Ability** and fill in a form: cost, cooldown,
  cast time, range, damage and its type, healing, the statuses it applies, and its Niagara effects.
  Six archetypes decide how it finds its targets: a projectile, an area, a cone, a chaining beam,
  the caster itself, or a channel held down. Nine abilities ship ready.
- **Thirteen status effects.** Burning, Poisoned, Bleeding, Chilled, Frozen, Stunned, Rooted,
  Silenced, Weakened, Vulnerable, Shielded, Haste and Regeneration. They stack, run out, and can be
  cleansed or resisted; a fourth chill freezes. Each is a Gameplay Effect Blueprint to change or
  copy.
- **Damage.** One calculation for abilities, statuses and your own traps: the attacker's power,
  armor, resistances to fire, frost, lightning and poison, critical hits, and a shield that takes
  damage before health.
- **A HUD that comes built.** Health, mana and stamina bars, a hotbar with keys, costs and cooldown
  sweeps, buff and debuff icons with stacks and seconds left, a cast bar, the reason a cast failed,
  floating damage numbers and bars over enemies' heads. Restyle it in a Widget Blueprint or replace
  it.
- **Keys.** Eight slots on <kbd>1</kbd> to <kbd>8</kbd> and the gamepad's buttons through Enhanced
  Input, rebindable while playing. Abilities aim where the camera looks, with a ground circle for
  areas.
- **Multiplayer and save.** Everything replicates, casts are predicted on the player's machine and
  the server decides hits. One node puts attributes, abilities, cooldowns, statuses and keys into your
  save game, one puts them back.
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
| `Source/AbilityStatusEditor` | The **AS Ability** entry in the Content Browser, checks on save, and the packaging of the statuses' icons and effects. |
| `Content/Abilities` | The nine abilities: Fireball, Frost Nova, Poison Cloud, Chain Lightning, Heal, Barrier, Blink, Haste and Frost Bolt. |
| `Content/Effects` | The thirteen status effects, `GE_Burning` to `GE_Weakened`. |
| `Content/FX`, `Content/Icons` | 25 Niagara systems for the abilities and statuses, and their 22 icons. |
| `Content/Input`, `Content/UI` | The eight slots' input actions and mapping context; the cooldown sweep's and the ground circle's materials. |
| `Content/Demo`, `Source/AbilityStatusDemo` | The training ground, `L_Demo`, its town and its code: the player, the dummies and the demo's keys. |

It needs the engine's **Gameplay Abilities**, **Enhanced Input** and **Niagara** plugins, which are
turned on with it. It runs on Windows, Mac and Linux, in Blueprint-only and C++ projects. It comes
with no sounds: every ability and status has empty sound slots for your own.

## Play the demo

With the plugin's content showing in the Content Browser ([Install](install.md#find-its-content)),
open **Plugins > GAS Ability & Status Effect System > Demo > L_Demo** and press **Play**.

The map runs its own game mode, so it plays as it is in any project. A panel on screen lists the keys,
with **Save** and **Load** buttons that <kbd>Tab</kbd> frees the mouse cursor to click.

- <kbd>1</kbd> to <kbd>8</kbd> cast Fireball, Frost Nova, Poison Cloud (hold, aim, let go), Chain
  Lightning, Heal, Barrier, Blink and Haste.
- The three plain dummies stand close together for Frost Nova and Chain Lightning. The Fire-Warded
  dummy shrugs off most fire and can't burn. The Duelist throws a Frost Bolt back at whoever hurts
  it.
- <kbd>F5</kbd> saves and <kbd>F9</kbd> loads your health, mana, cooldowns, statuses and keys.
- <kbd>'</kbd> (apostrophe) shows the Gameplay Debugger. <kbd>F1</kbd> hosts a listen server and
  <kbd>F2</kbd> joins one on this PC.

Its people are Epic's mannequins, in a project made from the Third Person template, with the
template's own animations standing in for casting ones: its pistol aim, both hands out at the
target, and its landing for a cast on oneself or all around.

## Where to go next

- [Install](install.md): from Fab to the plugin enabled in your project.
- [Quickstart](quickstart.md): your Third Person character casting at targets in your own map, in
  fifteen minutes.
- [How-tos](how-to.md): enemies that cast back, granting abilities in play, events, saving,
  multiplayer, keys, your own HUD and animations.
- [Concepts](concepts.md): how the parts fit together, damage and resistances, who runs what.
- [Status effects](effects.md): each status's rule and numbers, stacking, immunity, cleanse, and
  your own.
- [Reference](reference.md): every Blueprint node, field, setting and console command.
- [Troubleshooting](troubleshooting.md): when an ability doesn't fire, or something else is off.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
