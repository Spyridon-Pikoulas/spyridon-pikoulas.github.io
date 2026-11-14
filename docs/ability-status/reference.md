---
layout: guide
title: "Reference · GAS Ability & Status Effect System"
nav: Reference
order: 7
permalink: /docs/ability-status/reference/
description: "Every Blueprint node, event, field and setting of GAS Ability & Status Effect System: the component, abilities, attributes, statuses, targeting, keys, UI, save, multiplayer, packaging and debugging."
---

# Reference

Every Blueprint node, event, field and setting, to look up. The [quickstart](quickstart.md) walks
through a first setup, [Concepts](concepts.md) explains the damage calculation and who runs what, and
[Status effects](effects.md) gives each status's rule.

## Contents

- [Settings](#settings)
- [Ability System component](#ability-system-component)
- [Abilities](#abilities)
- [The nine abilities](#the-nine-abilities)
- [Archetypes](#archetypes)
- [Targeting](#targeting)
- [Abilities and slots](#abilities-and-slots)
- [Attributes](#attributes)
- [Tags](#tags)
- [Status effect fields](#status-effect-fields)
- [Status and damage nodes](#status-and-damage-nodes)
- [Events](#events)
- [Keys](#keys)
- [UI](#ui)
- [Save](#save)
- [Multiplayer](#multiplayer)
- [Custom abilities in Blueprint](#custom-abilities-in-blueprint)
- [Other ability system components](#other-ability-system-components)
- [Packaging](#packaging)
- [Debugging](#debugging)

## Settings

**Project Settings > Plugins > Ability & Status Effects**. An ability system component left on
None for any of these uses them.

| Setting | Default | What it does |
|---|---|---|
| Status Effects | the plugin's thirteen | The status effects the bars and overheads can show, looked up by their Status tag. Add [your own](effects.md#make-your-own-status) here. |
| Attribute Set | AS Attribute Set | The attributes every component gets. A Blueprint subclass [adds attributes](#attributes). |
| Slot Mapping | `IMC_AbilitySlots` | The mapping context added for the local player, which holds the slots' keys. |
| Slot Actions | `IA_AbilitySlot1` to `8` | One input action a slot, in order. Fewer or more actions make fewer or more slots. |
| HUD Class | AS HUD Widget | The HUD put on the local player's screen. Your [own HUD](#ui). |
| Cooldown Material | `M_AS_CooldownSweep` | The hotbar's cooldown sweep: a UI material with a **Fraction** scalar parameter, 0 when ready and 1 when just used. |
| Reticle Material | `M_AS_Reticle` | The ground reticle, on a plane scaled to the area's radius. |
| Damage Numbers | on | Floating combat text over whatever is hit or healed. |

The plugin's content is in its own folder, which the Content Browser shows with **Show Engine
Content** and **Show Plugin Content** on ([Install](install.md#find-its-content)). To change keys for every player, copy `IMC_AbilitySlots` into your project, edit the
copy and set it here.

## Ability System component

**AS Ability System** is a Gameplay Ability System component ready to use: add it to any actor in
the Components panel. A Character also gets its walk speed slowed, hasted and rooted by statuses.

| Property | What it is |
|---|---|
| Attribute Set Class | None uses the setting. |
| Starting Abilities | Granted at the start, in order into slots 0, 1, 2... (keys 1, 2, 3...). |
| Starting Values | Base values set at the start, by attribute: **MaxHealth** `300` and **Health** `300` for a tougher enemy. |
| Starting Effects | Gameplay effects applied at the start: a status, or an effect of your own that lasts. |
| Team | Its side, for the abilities' **Affects**: the same team are allies, and 0 is no team, hostile to everyone else. **Set Team** changes it in play, on the server. |
| Bind Slot Input | Binds the slots' input actions for a locally controlled player. Off if your game calls **Press Slot** itself. |
| Slot Mapping, Slot Actions | None and empty use the settings. |
| Mapping Priority | The slot mapping context's priority, 1 by default. |
| Show HUD | Puts the HUD on the local player's screen. Off for a game with a HUD of its own, and on anything no player controls it does nothing. |
| HUD Class | None uses the setting. |

On a player character, the component goes on the pawn. Its abilities, statuses and attributes
belong to that pawn, and start again with a new one; [save](#save) them to keep them.

Get the component of any actor with **Get Ability System** (Abilities). It finds it through the
actor's Ability System Interface or among its components.

## Abilities

An ability is a data asset: in the Content Browser, right-click and pick **Gameplay > AS Ability**.
The plugin's nine, used by the demo, are in its `Abilities` folder; duplicate one to start from it.

**Display**

| Field | What it is |
|---|---|
| Display Name | Shown before a failure's reason on the HUD ("Fireball: Not enough mana"), and on the hotbar where there is no icon. |
| Description | Yours to show, in a tooltip or a spellbook of your own: the plugin's HUD doesn't. |
| Icon | The hotbar's icon. |

**Ability**

| Field | What it is |
|---|---|
| Archetype | How it finds its targets: see [archetypes](#archetypes). |
| Ability Class | The ability that runs it: **AS Gameplay Ability**, or a [Blueprint subclass](#custom-abilities-in-blueprint). |
| Affects | Whom its effects land on: **Enemies**, **Allies** (its own team, and the caster) or **Everyone**. A Self ability lands on the caster whatever this says. |

**Activation**

| Field | What it is |
|---|---|
| Cost Resource, Cost | What it costs, out of **Mana**, **Stamina** or **Health**; **None** is free. A Health cost needs some health left after it. |
| Cooldown | Seconds before it can be used again, from when it fires. |
| Cast Time | Seconds before it fires, shown on the cast bar; 0 fires at once. Any other ability is busy meanwhile. |
| Range | How far it reaches in cm: a projectile's flight, where an area can be placed, a cone's or beam's length. |
| Blocked By | Tags on the caster that keep it from activating, besides death and the statuses that block abilities. |

**Effects**, on each target

| Field | What it is |
|---|---|
| Damage, Damage Type | Damage through the [damage calculation](concepts.md#damage-and-resistances), typed `Damage.Physical`, `Damage.Fire`, `Damage.Frost`, `Damage.Lightning` or `Damage.Poison`. |
| Healing | Health restored. |
| Target Effects | Gameplay effects applied to each target after the damage or healing, each with **Stacks** applied at once and a **Level**. The [statuses](effects.md#the-statuses) are `GE_Burning`, `GE_Chilled`... in the plugin's `Effects` folder. |
| Self Effects | Applied to the caster as the ability fires, and again on each pulse of a channel: a buff that comes with an attack. |
| Cleanses | Running effects that grant any of these tags, or carry them as asset tags, come off each target. `Effect.Debuff` cleanses every debuff, `Status.Poisoned` only poison. |

**Presentation**

| Field | What it is |
|---|---|
| Cast Montage | Played on the caster as the cast starts. Any montage whose slot the character's Anim Blueprint plays. |
| Hit Montage | Played on each target hit. |
| Cast Effect | A Niagara system at the caster's hand while it casts. |
| Effect | The projectile in flight, a lingering area, a beam, a channel's pulse, or a blink's start. |
| Impact Effect | Where it strikes: a projectile's hit, an area's or cone's burst, each target a beam reaches, a self ability's burst at the feet, a blink's arrival. |
| Cast Sound, Impact Sound | Cast Sound with the cast and a blink's start, Impact Sound with each impact. The plugin comes with no sounds, so they are empty on its abilities, for your own. |
| Hand Socket | The caster's socket the cast effect and projectiles start from, `hand_r` by default; none uses the chest. |

On the asset, **Is Harmful** says whether anything about it harms its targets (damage, or a debuff
among its target effects), and **Is Ground Targeted** whether it aims with the ground reticle.

An effect's system gets user parameters as it plays, for systems of your own: **Radius** (cm) and
**RadiusScale** (Radius / 50) on an area or burst, and **BeamEnd** (a world position) and
**BeamLength** (cm) on a beam.

Saving an ability checks it, and the Message Log lists any problems: no Ability Class or Display
Name, damage without a type, a target or self effect left empty, no range on anything but a self
ability, an area without a radius, a channel without a duration. An ability that does nothing at
all draws a warning.

## The nine abilities

The plugin's own, in its `Abilities` folder, as the demo uses them. Costs are mana unless said.

| Ability | Archetype | Cost | Cooldown | What it does |
|---|---|---|---|---|
| Fireball | Projectile, 0.5 s cast | 15 | 2 s | 30 fire damage to everything within 1.5 m of where it lands, and Burning. |
| Frost Nova | Area around the caster | 25 | 6 s | 15 frost damage and two stacks of Chilled to everything within 6 m. |
| Poison Cloud | Area on the ground, held to aim | 20 | 8 s | A cloud of 3.5 m radius, up to 20 m away, for 6 s: a stack of Poisoned each second on everything inside. |
| Chain Lightning | Beam | 20 | 4 s | 28 lightning damage to the target, jumping on to three more within 9 m, each jump at three quarters of the last. |
| Heal | Self | 25 | 8 s | Heals 40, clears every debuff, then Regeneration. |
| Barrier | Self | 20 | 12 s | Shielded: a shield of 100 for 8 s. |
| Blink | Self | 25 stamina | 5 s | Steps 9 m the way the caster aims, stopping short of walls. |
| Haste | Self | 30 stamina | 15 s | Haste: 50% faster for 6 s. |
| Frost Bolt | Projectile, 0.4 s cast | 10 | 1.5 s | 12 frost damage and a stack of Chilled. The demo's Duelist casts it. |

## Archetypes

| Archetype | What it does | Its fields |
|---|---|---|
| Projectile | A missile flies from the caster's hand to the aim and hits the first thing it meets. Given a radius, it bursts on everything around the hit. | Projectile Speed (cm/s), Projectile Radius (cm), Radius |
| Area | Everything within the radius, at a point placed on the ground or around the caster. Given a duration, it lingers and pulses. | Radius, Around Caster, Duration, Interval |
| Cone | Everything in front of the caster within the range and angle. | Cone Angle (degrees, edge to edge) |
| Beam | An instant line to the target under the crosshair. Given chains, it jumps on to the nearest others in turn, each jump weaker. | Chains, Chain Range, Chain Falloff (each jump's share of the last one's damage and healing) |
| Self | The caster alone: heals, buffs, cleanses. Given a blink distance, the caster steps forward along the aim, stopping short of walls. | Blink Distance |
| Channel | Held down: it pulses on the caster, or on the target under the crosshair, until the duration runs out, the key is let go or the target dies. | Duration, Interval, Channel On Target |

## Targeting

On the player's machine, an ability aims where the camera looks: the line from the camera through
the centre of the screen. While the player looks through another actor's camera (a cutscene's), it
aims from the pawn's own camera along the control rotation.

- **Camera aim.** What the line hits, within the range, is the target; the hit point is where a
  projectile flies or an area lands.
- **Soft target.** When the line hits nothing alive, an enemy within 8 degrees of it and in sight
  counts as aimed at. Projectiles and beams find a target without pixel-perfect aim.
- **Ground reticle.** An area ability that isn't around the caster aims while its key is held: a
  circle the size of its radius follows the aim on the ground, up to its range. Letting go casts
  it there.

Anything without a camera, an AI, aims at the component's aim target: **Set Aim Target**. With
none, it aims straight ahead.

## Abilities and slots

Nodes on the AS Ability System component. Slots count from 0 in Blueprint: slot 0 is key **1**.

| Node | What it does |
|---|---|
| Grant Ability (Ability, Slot, Level) | Server. Gives the ability, into a slot, or into none with -1. An ability already granted moves to the slot, and one already in the slot is left without one. |
| Remove Ability (Ability) | Server. |
| Get Slot Ability (Slot) | The ability in the slot, or none. |
| Get Slot Count | How many slots there are: the slot actions' count. |
| Get Granted Abilities | Every granted ability, in a slot or not. |
| Try Activate (Ability) | Tries the ability now. False, and **On Ability Failed**, when it can't. |
| Press Slot (Slot), Release Slot (Slot) | What a slot's key does: activates its ability, or aims a ground-targeted one until released. For a game that binds keys itself. |
| Can Activate (Ability) | Whether it could activate now, and why not in **Failure**, without trying. |
| Get Cooldown Remaining (Ability) | Seconds of cooldown left (0 when ready), and its full **Duration**. |
| Get Last Failure | The last activation that failed and why. |
| Get Cast (Ability, Progress, Channel) | True while an ability casts or channels, with how far along (0 to 1). |
| Set Aim Target (Target), Get Aim Target | What an AI aims at. |
| Is Dead, Revive (Health Fraction) | Death is health at 0: it cancels the actor's abilities and takes off every buff and debuff. Revive (server) clears it and sets health to its fraction of the maximum. |
| Is Hostile To (Other) | Whether the other is an enemy, for **Affects**: on another team, or either on team 0. |

A failure (**AS Failure Info**) has the **Ability**, the **Reason**, the **Tag** that blocked it,
a **Message** for the player and the world **Time** it happened. The reasons: **Not Granted**,
**Cooldown**, **Cost**, **Blocked** (dead, stunned, frozen, silenced, or one of the ability's
Blocked By tags), **Busy** (casting something else) and **No Target** (unused by the plugin: an
ability with nothing in reach still fires). **Describe Failure** turns one into a line: "Not enough
mana", "Silenced", "Already casting".

## Attributes

Every component gets the **AS Attribute Set** (or the setting's subclass). Its values start at these
and change with **Starting Values**, gameplay effects and statuses.

| Attribute | Starts at | What it is |
|---|---|---|
| Health, MaxHealth | 100 | At 0, the actor dies. |
| Mana, MaxMana | 100 | |
| Stamina, MaxStamina | 100 | |
| Shield | 0 | Takes damage before health. Shielded adds to it. |
| HealthRegen, ManaRegen, StaminaRegen | 0, 4, 10 | Per second. |
| Armor | 0 | Lessens physical damage: damage × 100 / (100 + Armor). 100 armor halves it. |
| FireResistance, FrostResistance, LightningResistance, PoisonResistance | 0 | Fractions: 0.25 takes a quarter off, 1 takes none, a negative value takes more. |
| DamageTaken | 1 | Multiplies all damage taken. Vulnerable raises it. |
| Power | 1 | Multiplies all damage dealt. Weakened lowers it. |
| CritChance | 0.1 | 0 to 1: the chance a hit is critical. A status's damage over time never is. |
| CritMultiplier | 1.5 | A critical hit's damage multiplier. |
| MoveSpeed | 1 | Multiplies a Character's walk speed. Rooted, Stunned and Frozen hold it still. |

Read one with **Get Attribute**, or with the engine's **Get Float Attribute** and **Attribute
Changed** nodes.

To add attributes of your own, make a Blueprint class whose parent is **AS Attribute Set**, add
variables of type **Gameplay Attribute Data**, replicated, and set it as **Attribute Set** in the
settings or as a component's **Attribute Set Class**.

## Tags

| Tag | Means |
|---|---|
| `Status.Burning`, `Status.Chilled`... | The actor has the status now. Each status grants its tag while it runs. |
| `Immune.Burning`... and `Immune.Debuff` | The actor can't get that status, or any debuff. |
| `Effect.Buff`, `Effect.Debuff` | On every status, so a cleanse can take off all of one kind. |
| `Damage.Physical`, `.Fire`, `.Frost`, `.Lightning`, `.Poison` | A damage type: which defence counts against it. |
| `Ability`, `Ability.Spell` | On every ability the plugin runs. Stunned and Frozen block `Ability`, Silenced blocks `Ability.Spell`. |
| `State.Dead` | Health reached 0. Nothing lands on the dead, and the dead can't cast. |

## Status effect fields

A status is a Blueprint whose parent is **AS Status Effect**: a gameplay effect with these fields
besides the engine's own (**Duration**, **Period**, **Stacking**, **Modifiers**, **Components**).
[Status effects](effects.md) gives each status's values.

| Field | What it is |
|---|---|
| Tick Damage, Damage Type | Damage each period, per stack, through the damage calculation. |
| Tick Healing | Healing each period, per stack. |

Both need an execution with the **Calculation Class** **AS Damage Calculation**, as the plugin's
statuses have.
| Overflow Into | Effects applied in place of a stack past **Stack Limit Count**, which also ends this status: Chilled into Frozen. |

Its **AS Status UI Data** component, among its **Components**:

| Field | What it is |
|---|---|
| Display Name | The reason given when the status blocks an ability ("Silenced"). |
| Description | Yours to show, in a tooltip of your own: the plugin's HUD shows the icon, stacks and seconds left. |
| Icon | The icon on the HUD and over the bars. |
| Status Tag | The tag the status grants while it runs, which every machine finds it by. The debugger lists statuses by it. |
| Debuff | A red frame on its icon; a buff's is green. |
| Loop Effect, Loop Socket, Loop Offset | The Niagara system attached to the target while it runs, at the socket (none is the root) and offset; on a socket it stays upright, the offset in world axes (Z up). |
| Apply Sound | Played as it lands. |

## Status and damage nodes

In the **Abilities > Status** and **Abilities > Damage** categories (Get Attribute in **Abilities**), on any actor with an ability
system component. The ones that change things run on the server, and return false elsewhere.

| Node | What it does |
|---|---|
| Apply Status (Target, Effect, Stacks, Instigator) | Applies a status, or any gameplay effect, a number of stacks at once. False when it couldn't (immune, dead, no component). |
| Cleanse (Target, Tags) | Removes the running effects that grant or carry any of the tags. Returns how many. |
| Has Status (Target, Status) | Whether it has the status tag (`Status.Burning`...). |
| Get Status Stacks (Target, Status) | Its stacks, 0 without it. |
| Get Status Info (Status) | The status's name, description, icon and effect, from the Status Effects setting. |
| Apply Damage (Target, Amount, Damage Type, Instigator) | Damage through the damage calculation, as if the instigator had hit: a trap, a fall, a weapon of your own. True once sent; false with no component, an amount of 0 or off the server. |
| Apply Healing (Target, Amount, Instigator) | The same for healing. |
| Get Attribute (Actor, Attribute) | An attribute's current value, and whether the actor has it. |

On the component itself: **Apply Effect** (Effect, Stacks, Level, Instigator), which returns the
running effect's handle; **Cleanse** (Tags); and **Get Statuses**, an **AS Status View** for each
running status, longest first: its **Status** tag, **Info** (its UI data), **Stacks**, **Time Left**
and **Duration** in seconds, both -1 for a status that lasts until removed.

## Events

On the AS Ability System component (**Bind Event** in its Details panel, or the **+** beside the
event). The server sends damage, healing, deaths and casts to every machine. On Died always
arrives; On Damaged, On Healed and On Cast Started are sent as effects are, and a lost packet can
drop one on a client, so keep a score or a quest from them on the server.

| Event | When |
|---|---|
| On Damaged (Target, Amount, Absorbed, Damage Type, Critical, Instigator) | It took a hit. **Amount** is the whole of it, after the damage calculation; **Absorbed** is the part the shield took, so health went down by Amount − Absorbed. |
| On Healed (Target, Amount, Instigator) | It was healed. |
| On Died (Target, Killer) | Its health reached 0. It can't act or be hit until revived. |
| On Ability Failed (Caster, Failure) | An activation failed, on the machine that tried: the owning player's, or the server's for an AI. |
| On Cast Started (Caster, Ability) | An ability started casting. |
| On Abilities Changed (Owner) | An ability was granted, removed or moved to another slot. |

For a status starting or ending, use the engine's **Wait Gameplay Tag Add To Actor** and **Wait
Gameplay Tag Remove From Actor** on its tag, or check **Has Status**.

## Keys

The slots' keys come from the slot mapping context: **1** to **8**, and on a gamepad the left, top
and right face buttons, the shoulders, the triggers and the d-pad's up. The plugin adds the
context for each local player whose pawn has the component.

| Node | What it does |
|---|---|
| Set Slot Key (Slot, Key) | Rebinds a slot's keyboard or mouse key for this player; its gamepad button stays. On the player's own machine; [saved](#save) with the rest. |
| Get Slot Key (Slot, Gamepad) | The slot's key now, as the hotbar shows it. |

## UI

Each local player gets the HUD: health with its shield, mana and stamina bars, the hotbar with
keys, costs and cooldown sweeps, buff and debuff icons with stacks and seconds left, the cast bar,
the reason an ability failed, and floating combat text. It is built in C++ with UMG.

- **Your own look:** make a Widget Blueprint whose parent class is **AS HUD Widget**, design it,
  and set it as the HUD Class (the setting, or the component's). A subclass with a tree of its own
  keeps it, with the floating combat text over it. Its **Refresh** event fires each frame. Read what to show from its **Get Ability
  System**: **Get Statuses**, **Get Cooldown Remaining**, **Get Cast**, and the attributes. **Set
  Ability System** points it at another component.
- **No HUD:** turn off **Show HUD** on the component.
- **Bars over heads:** add an **AS Overhead Bar** component to an enemy or ally. It shows the
  **Display Name**, health with shield and statuses with stacks over the actor, for every other
  player. It hides on death and on the player's own pawn.

## Save

Two nodes, in **Abilities > Save**:

- **Save Ability State** (Actor) gives back an **AS Saved State**. Put it in a variable of your
  SaveGame Blueprint and save that as usual. It holds:
    - **Attributes**: each attribute's base value, by `AttributeSet.Attribute` name;
    - **Abilities**: each granted ability with its **Slot** (-1 for none), **Level** and **Cooldown
      Left**;
    - **Effects**: each running effect, a status or your own, with its **Level**, **Stacks** and
      **Time Left** (-1 for one that lasts until removed);
    - **Slot Keys**: each rebound slot's key.
- **Load Ability State** (Actor, State) puts it back, on the server, once the pawn is possessed, and
  returns true. The saved values replace the current ones, and a state saved dead loads dead,
  without **On Died**. The keys apply on the player's own machine. On a client, or with a state
  that holds nothing (a variable never saved into), it changes nothing but the keys and returns
  false.

The same are **Save State** and **Load State** on the component. A saved ability or effect is kept
by its asset path; one removed from the project since is skipped.

## Multiplayer

Everything replicates. Abilities are locally predicted: the player's own machine starts the cast,
spends the cost and starts the cooldown at once, and the server confirms or rolls them back. The
server decides hits, damage and statuses. Projectiles and lingering areas are replicated actors;
beams, bursts and status effects play on every machine. The demo is tested as a listen server with
two players.

For a player, the component goes on the pawn. These run on the server only, and do nothing on a
client: **Grant Ability**, **Remove Ability**, **Apply Effect**, **Cleanse**, **Revive**, **Apply
Status**, **Apply Damage**, **Apply Healing** and **Load Ability State** (apart from its keys).
Call them from server code or a Run on Server event. **Try Activate**, **Press Slot** and **Set
Slot Key** work from the owning player's machine.

## Custom abilities in Blueprint

For what the fields don't cover, a Blueprint class whose parent is **AS Gameplay Ability**, set as
an ability's **Ability Class** ([steps](how-to.md#write-what-an-ability-does-in-blueprint)). It can
override:

- **Fire** (Aim Point, Aim Actor): the ability's work on the server, once the cast is done or
  each pulse of a channel. Call the parent to keep the archetype's work.
- **Apply To Target** (Target, Scale): what one hit does, by default the asset's damage, healing,
  effects and cleanse, with Scale for a chain's falloff.

**Get Ability Asset** and **Get Caster Component** give the asset and the caster. Cost, cooldown,
cast time, prediction and the HUD stay as they are.

## Other ability system components

The **AS Attribute Set** works on any Gameplay Ability System component, as in Lyra or GAS
Companion: add it to the sets the component starts with
([steps](how-to.md#use-it-with-your-own-ability-system-component)). On such a component:

- **works:** damage and healing, from the plugin's abilities, statuses, **Apply Damage** and
  **Apply Healing**, with armor, resistances and the shield; damage over time; stacks, overflow
  (Chilled into Frozen), immunity and cleanse; the modifiers on attributes, Weakened's Power and
  Vulnerable's DamageTaken; death, as the `State.Dead` tag with abilities cancelled and buffs and
  debuffs removed. The status and damage nodes, and **Get Attribute**.
- **needs the AS Ability System component:** casting the plugin's abilities, slots and keys; the
  events; HealthRegen, ManaRegen and StaminaRegen; MoveSpeed on a Character's walk speed, and
  Rooted, Stunned and Frozen holding it still; the HUD, overhead bars, debugger and save; **Revive**.
  On your own component, take off the `State.Dead` loose tag and set Health to bring the actor back.

## Packaging

A packaged game holds the assets something references. The plugin cooks what its settings name,
with each status's icon and effect, and an ability goes in when a character, a Blueprint or a map
references it. The demo's Barrier, Blink, Frost Bolt and Haste are on no default loadout, so they
ship only once your assets use them. An ability you grant only by name, from a console command or a
string, needs a hard reference, a **Primary Asset Types to Scan** entry of type `ASAbility` on
its folder, cook rule Always Cook (Project Settings > Asset Manager), or its folder under
**Additional Asset Directories to Cook** (Project Settings > Packaging).

## Debugging

The Gameplay Debugger (<kbd>'</kbd>, the apostrophe) has an **AbilityStatus** category: the viewed
actor's attributes; each ability with its slot and what stops it now (ready, its cooldown, the cost,
a status or a tag that blocks it, or how far its cast is); its statuses with stacks and time left;
the last failure; and its tags. Its number is in the list at the top; press it to show or hide the
category.

Console commands (the <kbd>`</kbd> key), in the editor and in Development builds; a Shipping build
leaves them out. Grant and Effect change the game, so they run where the server is: in Play, on a
listen server's host or alone. A name or slot they don't know does nothing, and the log lists the
ones they do.

| Command | What it does |
|---|---|
| `Ability.Grant <Ability> [Slot]` | Grants an ability (`Fireball`, `DA_Fireball`, or its path as **Copy Reference** gives it) to the player, into the slot of that key (`1` for the first) or, with none given, no slot. A packaged game holds only the abilities it cooked ([Packaging](#packaging)). |
| `Ability.Effect <Status> [Stacks] [self]` | Applies a status (`Burning`, `Status.Burning`, or any gameplay effect's path) to the actor under the crosshair, or to the player with `self`. |
| `Ability.List` | Writes what the debugger shows of the player to the log. |

The log category is `LogAbilityStatus`.
