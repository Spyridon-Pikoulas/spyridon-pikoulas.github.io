---
layout: guide
title: "Install · NPC Behavior & Daily Life System"
nav: Install
order: 2
permalink: /docs/npc-daily-life/install/
description: "Installing NPC Behavior & Daily Life System from Fab into Unreal Engine 5.6 to 5.8, enabling it in a Blueprint or C++ project, updating and removing it."
---

# Install

From Fab to the plugin enabled in your project, in a few minutes. It works the same in a
Blueprint-only project and a C++ one.

## Install it to the engine

1. In the Epic Games Launcher, open **Fab Library** and find **NPC Behavior & Daily Life System**.
2. Click **Install to Engine** and pick your engine version (5.6, 5.7 or 5.8).

    The launcher copies the plugin into the engine's `Engine/Plugins/Marketplace` folder, ready
    built. Every project on that engine can now enable it.

## Enable it in your project

1. Open your project and pick **Edit > Plugins**.
2. Search for `NPC Behavior` and tick **NPC Behavior & Daily Life System**.

    {% include figure.html src="plugins.png" alt="The Plugins window searched for NPC Behavior, showing NPC Behavior & Daily Life System by heyheythere, version 1.0, ticked." caption="The plugin in **Edit > Plugins**, ticked." %}

3. Click **Restart Now**. The editor reopens with the plugin on, and the engine's State Tree,
   Gameplay State Tree, Smart Objects and Enhanced Input plugins with it.

Enabling it adds, with nothing else to set up:

- **NL Character**, a ready NPC, and **NL Spot** in **Place Actors**, and a **Brain** component
  (**NL Brain**) for any actor of yours;
- the world's NPC life: a clock that starts at 08:00 and runs an hour a real minute, and a
  scheduler that thinks every NPC in the level within a time budget;
- the `Npc.*` console commands and the Gameplay Debugger's **NPCLife** category.

Its settings, the clock, the factions and how often NPCs think, are under **Project Settings >
Plugins > NPC Life** ([the settings](reference.md#settings)).

{% include figure.html src="settings.png" alt="Project Settings, Plugins, NPC Life: Start Hour 8, Minutes Per Second 1, Days Per Season 28; Player Faction empty, Attitudes empty, Town Attitudes ticked; Near Distance 4000, Far Distance 12000, Near, Mid and Far Interval 0.5, 1.5 and 4 s, Think Budget 1 ms; Glints ticked, Glint Material M_NLGlint." caption="The plugin's settings page." %}

The plugin's own content (its behaviours, roles, icons and the demo town) is under **Plugins >
NPCLife Content** in the Content Browser. If you don't see it, open the Content Browser's
**Settings** and turn on **Show Engine Content** and **Show Plugin Content**: installed to the
engine, it counts as both.

## Use it from C++

Blueprint-only projects need nothing more. In a C++ project, add the module to your game
module's `Build.cs` to call the plugin from your code:

```cpp
PublicDependencyModuleNames.AddRange(new string[] { "NPCLife", "GameplayTags" });
```

Then include what you use, such as `NLBrainComponent.h`, `NLSubsystem.h` and `NLLibrary.h`. The
[how-tos](how-to.md) give the C++ beside each Blueprint answer.

> [!TIP]
> A team or a build machine needs the plugin too. Copy its folder from
> `Engine/Plugins/Marketplace` into your project's own `Plugins` folder and commit it; the
> project then builds it with its own code, so a machine that packages the game needs Visual
> Studio with its C++ tools, as for any code plugin in a project.
>
> In a Blueprint-only project, also open the copied `NPCLife.uplugin` in a text editor and add the
> line `"EnabledByDefault": false,` after `"CanContainContent": true,`. Without it the packaged game
> is the engine's ready-built one, without the plugin, and stops as it starts with "Unable to load
> plugin". The project keeps the plugin ticked in **Edit > Plugins** either way.

## Update it

When a new version is out, the Fab Library offers it. Close the editor, install it to the engine
again, and open your project. Your NPCs, spots, behaviours and save games carry over; the
[changelog](changelog.md) says if a version needs anything of you.

## Remove it

1. Delete the NL Characters and NL Spots from your levels, the Brain components from your
   actors, your behaviours and roles, and the Blueprints that call its nodes.
2. Untick it in **Edit > Plugins** and restart the editor.

> [!WARNING]
> Levels holding its actors, and Blueprints using its nodes or assets, don't load or compile
> cleanly without the plugin. Remove them before you disable it.
