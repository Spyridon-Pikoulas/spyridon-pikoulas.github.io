---
layout: guide
title: "Quickstart · GAS Ability & Status Effect System"
nav: Quickstart
order: 3
permalink: /docs/ability-status/quickstart/
description: "Fifteen minutes from installing GAS Ability & Status Effect System to your Third Person character casting fireballs, frost and poison at targets in your own map, with no Blueprint graph or C++."
---

# Quickstart: casting in your own map

Fifteen minutes from an installed plugin to a character that casts five abilities at targets, with a
HUD, cooldowns and status effects, then an ability of your own. No Blueprint graph or C++ is needed.

The steps use a project made from the **Third Person** template with the plugin enabled
([Install](install.md)). Any Character works the same. To see it all working first,
[play the demo](index.md#play-the-demo).

## 1. Give your character abilities

1. Open `BP_ThirdPersonCharacter`, in `ThirdPerson/Blueprints`.
2. In the **Components** panel, click **Add** and pick **AS Ability System**.

    {% include figure.html src="component.png" size="small" alt="The Components panel of BP_ThirdPersonCharacter: the capsule with its arrow, camera boom, camera and mesh, then ASAbilitySystem, selected, and the character movement." caption="The component added, named **ASAbilitySystem** in the list." %}

3. With it selected, find **Starting Abilities** in the **Details** panel. Click **+** five times
   and pick `DA_Fireball`, `DA_FrostNova`, `DA_PoisonCloud`, `DA_ChainLightning` and `DA_Heal`, in
   that order.

    {% include figure.html src="abilities.png" alt="The Details panel of the ASAbilitySystem component, under Ability System, Setup: Attribute Set Class None, and Starting Abilities with DA_Fireball, DA_FrostNova, DA_PoisonCloud, DA_ChainLightning, DA_Heal and DA_IceLance at index 0 to 5; Starting Values, Starting Effects and Team 0 below." caption="**Starting Abilities**: index 0 goes on key <kbd>1</kbd>, index 1 on <kbd>2</kbd>, and so on. The sixth, Ice Lance, comes in [step 4](#4-make-an-ability-of-your-own)." %}

4. Compile and save.

Press **Play**. Health, mana and stamina bars and a hotbar show at the foot of the screen. The
abilities sit on keys <kbd>1</kbd> to <kbd>5</kbd>, and on a gamepad on the face buttons and
shoulders.

{% include figure.html src="hotbar.jpg" alt="The HUD at the foot of the screen: the health bar reading 100 / 100, the mana and stamina bars, and eight slots numbered 1 to 8, the first six with ability icons and their mana costs, 7 and 8 empty." caption="The HUD the component puts on screen: the bars, and each slot's key and cost (here with Ice Lance on 6)." %}

## 2. Make a target

1. In the Content Browser, right-click and pick **Blueprint Class**, then **Character**. Name it
   `BP_Target` and open it.
2. Select the **Mesh** component. Set **Skeletal Mesh Asset** to `SKM_Manny_Simple` and **Anim
   Class** to `ABP_Unarmed`. Set its **Location** Z to `-90` and its **Rotation** Z to `-90`, so it
   stands on the ground facing forward.

    {% include figure.html src="mesh.png" alt="The Details panel of BP_Target's Mesh component: under Transform, Location 0, 0, -90 and Rotation 0, 0, -90; under Animation, Anim Class ABP_Unarmed_C; under Mesh, Skeletal Mesh Asset SKM_Manny_Simple." caption="The target's mesh: the template's mannequin, standing on the ground." %}

3. Click **Add** and pick **AS Ability System**. Under **Starting Values**, click **+** twice and
   set the entries to **MaxHealth** `300` and **Health** `300`.

    {% include figure.html src="values.png" alt="The Details panel of BP_Target's ASAbilitySystem: Starting Values with two map elements, Element 0 with key ASAttributeSet.MaxHealth and value 300, Element 1 with key ASAttributeSet.Health and value 300." caption="**Starting Values**: each entry's key is an attribute, picked from its list, and its value the number it starts at." %}

4. Click **Add** again and pick **AS Overhead Bar**. Set its **Display Name** to `Target`.

    {% include figure.html src="parts.png" size="small" alt="The Components panel of BP_Target: the capsule with its arrow, ASOverhead and the mesh, then ASAbilitySystem and the character movement." caption="The target's components once both are added: **ASAbilitySystem** and **ASOverhead**." %}

5. Compile and save, then drag three `BP_Target`s into the map, a few metres in front of the
   **Player Start** and close together.

## 3. Play

Press **Play** and face the targets.

1. Press <kbd>1</kbd>. The fireball bursts on a target. Damage numbers rise, and the target's bar
   shows the **Burning** icon and its seconds left.

    {% include figure.html src="burning.jpg" alt="The player facing three targets, the middle one hit: 30 in orange over it beside the Burning icon, and on the hotbar the Fireball slot dimmed with 2 seconds left." caption="A hit: the damage number, the Burning icon over the target's bar, and Fireball cooling down on the hotbar." %}

2. Walk in among the targets and press <kbd>2</kbd>. Frost Nova chills everything within 6 metres,
   two stacks at a time; the icon shows them. A chill on a target already at three stacks freezes
   it.

    {% include figure.html src="frost.jpg" alt="Frost bursting around the player and the three targets; 15 over each target beside the Chilled icon, the middle one still Burning too, and Frost Nova's slot counting down from 6." caption="Frost Nova on all three: 15 frost damage each, and the Chilled icon with its seconds left." %}

3. Hold <kbd>3</kbd>. A circle follows your aim on the ground. Let go to leave a poison cloud there
   for six seconds. Poison stacks once a second on everything inside it.

4. Aim at one target and press <kbd>4</kbd>. Chain Lightning strikes it and jumps on to the others.

    {% include figure.html src="poison.jpg" alt="Lightning arcing from the player's aim through the three targets as they stand in the green poison cloud; 21, 28 and 16 over them, the cloud's ticks of 6 and 9 in green, beside their Poisoned icons at three stacks and their Chilled icons." caption="Chain Lightning jumping through the targets in the poison cloud, each jump weaker than the last." %}

5. Press <kbd>5</kbd>. Heal clears your debuffs and heals you over time.

While an ability cools down, its slot shows a sweep and the seconds left. When an ability can't be
used, a line above the hotbar says why: not enough mana, not ready yet, or a status that blocks it.

To see what is going on, press <kbd>'</kbd> (apostrophe) for the Gameplay Debugger. Its
**AbilityStatus** category lists your attributes, each ability with what stops it now, your
statuses, and the last ability that failed and why.

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's AbilityStatus category over the dimmed game: Health 100/100, Shield 0, Mana 100/100, Stamina 100/100, Team 0; the six abilities by slot, each Silenced (Status.Silenced); Status.Silenced x1 with 1.3 s left; in red, Last failure: DA_Fireball, Blocked (Silenced, Status.Silenced), 1.7 s ago; and Tags: Status.Silenced." caption="The debugger after a Fireball was refused: the player is Silenced, every slot says why it can't cast, and the last failure names the tag." %}

In the console (<kbd>&#96;</kbd>), `Ability.Effect Stunned` stuns the target under the crosshair, and
`Ability.List` writes everything to the log. The [reference](reference.md#debugging) lists the rest.

## 4. Make an ability of your own

1. In your project's Content folder, right-click and pick **Gameplay > AS Ability**. Name it
   `DA_IceLance` and open it.
2. Fill in:

    - **Display Name**: `Ice Lance`
    - **Icon**: `T_Ability_FrostBolt`
    - **Archetype**: **Projectile**
    - **Cost**: `10`, **Cooldown**: `1`, **Cast Time**: `0.3`
    - **Damage**: `20`, **Damage Type**: `Damage.Frost`
    - **Target Effects**: add one, with **Effect** `GE_Chilled` and **Stacks** `1`
    - **Projectile Speed**: `3000`
    - under **Presentation**, **Effect**: `NS_FrostBolt` and **Impact Effect**: `NS_FrostImpact`

    {% include figure.html src="ability.png" alt="The DA_IceLance asset editor: Display Name Ice Lance, Icon T_Ability_FrostBolt, Archetype Projectile, Cost Resource Mana, Cost 10, Cooldown 1, Cast Time 0.3, Damage 20 with Damage Type Damage.Frost, Target Effects with one entry GE_Chilled at 1 stack and Projectile Speed 3000." caption="Ice Lance filled in, down to its projectile. Only its archetype's fields show: a projectile's speed and radius here." %}

3. Save. If anything is missing, the save says so in the **Message Log**.
4. Add `DA_IceLance` to the character's **Starting Abilities** as the sixth entry, and play: it is on
   <kbd>6</kbd>.

Every field is described in the [reference](reference.md#abilities). The archetype decides how the
ability finds its targets: a projectile, an area, a cone, a beam, the caster itself, or a channel
held down.

## Where to go next

- [An enemy that casts back](how-to.md#let-an-enemy-cast-back): the same component on an AI.
- [React to the fight](how-to.md#react-to-damage-healing-and-death) in your own Blueprints: **On
  Damaged**, **On Healed** and **On Died**.
- [Save and load](how-to.md#save-and-load-abilities-and-statuses): one node each way.
- [Multiplayer](how-to.md#play-it-in-multiplayer): it already replicates; what to keep on the server.
- [Change a status's numbers, or make your own status](effects.md#change-a-status).
- [Play animations as abilities cast](how-to.md#play-an-animation-as-an-ability-casts).
