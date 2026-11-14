---
layout: guide
title: "Concepts · GAS Ability & Status Effect System"
nav: Concepts
order: 5
permalink: /docs/ability-status/concepts/
description: "How GAS Ability & Status Effect System's parts fit together: the component, abilities and archetypes, attributes, statuses, tags, damage and resistances, teams, multiplayer and save."
---

# Concepts

How the parts fit together, and the words the other pages use. Read it once the
[quickstart](quickstart.md)'s character casts and you want to build your own.

## The parts

The plugin is built on Epic's Gameplay Ability System (GAS) and uses its pieces as they are. What it
adds:

| Part | What it is |
|---|---|
| **AS Ability System** | The component an actor needs to cast, be hit and have statuses. It is a GAS ability system component with the slots, HUD, keys, events and save added. |
| **Ability** | A data asset (**AS Ability**): what it costs, how it finds its targets, and what it does to them. Granted to a component, it runs as an **AS Gameplay Ability**, the one GAS ability that reads any asset. |
| **Archetype** | How an ability finds its targets: Projectile, Area, Cone, Beam, Self or Channel ([all six](reference.md#archetypes)). |
| **AS Attribute Set** | The numbers every component has: health, mana, stamina, shield, armor, resistances, power and more ([all of them](reference.md#attributes)). |
| **Status effect** | A GAS gameplay effect with an icon, a Niagara loop, stacks and a duration: `GE_Burning` and the twelve others ([Status effects](effects.md)). |
| **Settings** | **Project Settings > Plugins > Ability & Status Effects**: what every component uses unless it says otherwise. |

## A cast, from key to hit

```text
key 1 ── slot 0 ── Try Activate (DA_Fireball)
    can it?  granted, alive, not stunned or silenced, not busy, cooled down, can pay
        no:  On Ability Failed, and the reason above the hotbar
    cast time: the cast bar, the Cast Montage, the Cast Effect at the hand
    it fires: the cost paid, the cooldown started, the Self Effects applied
    the archetype finds the targets, on the server
        each target: damage, healing, Target Effects, Cleanses
            On Damaged, On Healed, On Died on every machine
```

An ability can't start while another casts: the player is **busy**. A refused cast is Not Granted,
Cooldown, Cost, Busy or Blocked, and for Blocked the tag that blocked it (`State.Dead`, a status, or
one of its **Blocked By**); the HUD, **On Ability Failed**, **Get Last Failure** and the debugger all
show the same.

## Tags

GAS marks everything with gameplay tags, and so does the plugin: `Status.Burning` while a status
runs, `Immune.Burning` or `Immune.Debuff` to keep statuses off, `Effect.Buff` and `Effect.Debuff`
for cleansing by kind, `Damage.Fire` and the other damage types, `Ability.Spell` for what Silenced
blocks, and `State.Dead`. [Tags](reference.md#tags) lists them all.

Your own tags work beside them: an ability's **Blocked By** names tags that keep it from starting, and
your own statuses grant tags your game reacts to.

## Damage and resistances

All damage, from abilities, statuses and **Apply Damage**, goes through one calculation:

1. The damage is multiplied by the attacker's **Power** (1 to start; Weakened takes 0.3 off).
2. **Physical** damage is multiplied by 100 / (100 + the target's **Armor**): 100 armor halves it.
   **Fire**, **frost**, **lightning** and **poison** damage are multiplied by 1 − the target's
   resistance to it, which counts between −1 and 1: 0.25 takes a quarter off, 1 is immune, a
   negative value takes more.
3. It is multiplied by the target's **DamageTaken** (1 to start; Vulnerable adds 0.3).
4. A hit is critical with the attacker's **CritChance** (0.1 to start), multiplied by its
   **CritMultiplier** (1.5). A status's damage over time never is.

The target's **Shield** takes the result first, and health the rest. Damage with no type has no armor
or resistance counted.

The demo's Fire-Warded dummy has a FireResistance of 0.75 and the tag `Immune.Burning`: a Fireball's
30 hits it for 7.5, and never sets it burning. A Vulnerable target with 50 armor hit by a Weakened
attacker for 40 physical damage takes 40 × 0.7 × 100 / 150 × 1.3 ≈ 24.

The damage numbers over the target are coloured by type, and larger with a `!` for a critical hit.

## Who gets hit

An ability's **Affects** says whom it lands on: **Enemies**, **Allies** or **Everyone**. Whether one
actor is an enemy of another is their components' **Team**:

- two actors on the same team (1 and 1) are allies, and an ability on **Enemies** passes them by;
- team 0, the default, is no team: hostile to everyone, and everyone to it;
- the caster always counts as its own ally, so an area heal on **Allies** lands on it too.

A Self ability lands on its caster whatever its **Affects**.

## The server and the client

Everything a component holds replicates: attributes, granted abilities, slots, cooldowns and
statuses.

- **On the player's machine:** the key, the aim from the camera, and the start of the cast. GAS
  predicts it: the cast bar, the cost and the cooldown show at once, and the server confirms or rolls
  them back.
- **On the server:** what the ability hits, the damage, the statuses, deaths, and every node that
  changes things ([which](reference.md#multiplayer)).
- **On every machine:** the events, the effects and the damage numbers. Projectiles and lingering
  areas are replicated actors; beams, bursts and status loops play on each machine.

The HUD and the keys are each local player's own. Rebound keys stay on the player's machine.

## What is saved

**Save Ability State** captures one actor's component:

- every attribute's base value;
- the granted abilities, with their slots, levels and cooldown left;
- the running effects, statuses or your own, with their stacks and time left;
- the rebound keys.

It is a struct to put in your own SaveGame, not a file of its own. Loading it replaces what the actor
has, and an actor saved dead loads dead. Abilities and effects are kept by their asset paths, so one renamed or removed since is skipped.
[Save and load](how-to.md#save-and-load-abilities-and-statuses) gives the steps.
