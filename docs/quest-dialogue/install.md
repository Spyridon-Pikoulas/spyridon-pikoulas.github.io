---
layout: guide
title: "Install · Quest & Dialogue System"
nav: Install
order: 2
permalink: /docs/quest-dialogue/install/
description: "Installing Quest & Dialogue System from Fab into Unreal Engine 5.6 to 5.8, enabling it in a Blueprint or C++ project, updating and removing it."
---

# Install

From Fab to the plugin enabled in your project, in a few minutes. It works the same in a
Blueprint-only project and a C++ one.

## Install it to the engine

1. In the Epic Games Launcher, open **Fab Library** and find **Quest & Dialogue System**.
2. Click **Install to Engine** and pick your engine version (5.6, 5.7 or 5.8).

    The launcher copies the plugin into the engine's `Engine/Plugins/Marketplace` folder, ready
    built. Every project on that engine can now enable it.

## Enable it in your project

1. Open your project and pick **Edit > Plugins**.
2. Search for `Quest & Dialogue` and tick **Quest & Dialogue System**.

    {% include figure.html src="plugins.png" alt="The Plugins window searched for Quest & Dialogue, showing Quest & Dialogue System by heyheythere, version 1.0, ticked." caption="The plugin in **Edit > Plugins**, ticked." %}

3. Click **Restart Now**. The editor reopens with the plugin on.

Enabling it adds, with nothing else to set up:

- a **Quest Component** on every player's PlayerState;
- two keys: <kbd>E</kbd> talks to the nearest speaker and <kbd>J</kbd> opens the quest log (on a
  gamepad, the left face button and **View**);
- the tracker, showing the tracked quest at the top right of the screen;
- **Quest** under **Gameplay** in the Content Browser's right-click menu, and `.qds` dialogue
  scripts dragged in becoming dialogue assets.

Each of these can be changed or turned off under **Project Settings > Plugins > Quest &
Dialogue** ([the settings](reference.md#settings)).

{% include figure.html src="settings.png" alt="Project Settings, Plugins, Quest and Dialogue: Add Quest Component ticked, Talk Action IA_Talk, Talk Radius 300, Quest Log Action IA_QuestLog, Input Context IMC_QuestDialogue with priority 1, the three widget classes None (the plugin's own), Show Tracker and Manage Input Mode ticked, and Input Mode After Dialogue Game Only." caption="The plugin's settings, as it ships." %}

The plugin's own content (its input actions and the demo village) is under **Plugins >
QuestDialogue Content** in the Content Browser. If you don't see it, open the Content Browser's
**Settings** and turn on **Show Engine Content** and **Show Plugin Content**: installed to the
engine, it counts as both.

> [!NOTE]
> The plugin needs **Enhanced Input**, which every project made from Epic's templates already
> uses. A project still on the old input system can enable Enhanced Input under **Edit >
> Plugins** and set it as the default input class in **Project Settings > Input**.

## Use it from C++

Blueprint-only projects need nothing more. In a C++ project, add the module to your game
module's `Build.cs` to call the plugin from your code:

```cpp
PublicDependencyModuleNames.AddRange(new string[] { "QuestDialogue", "GameplayTags" });
```

Then include what you use, such as `QDQuestComponent.h` and `QDLibrary.h`. The
[how-tos](how-to.md) give C++ where both apply.

> [!TIP]
> A team or a build machine needs the plugin too. Copy its folder from
> `Engine/Plugins/Marketplace` into your project's own `Plugins` folder and commit it; the
> project then builds it with its own code, so a machine that packages the game needs Visual
> Studio with its C++ tools, as for any code plugin in a project.
>
> In a Blueprint-only project, also open the copied `QuestDialogue.uplugin` in a text editor and add
> the line `"EnabledByDefault": false,` after `"CanContainContent": true,`. Without it the packaged
> game is the engine's ready-built one, without the plugin, and stops as it starts with "Unable to
> load plugin". The project keeps the plugin ticked in **Edit > Plugins** either way.

## Update it

When a new version is out, the Fab Library offers it. Close the editor, install it to the engine
again, and open your project. Your quests, scripts and save games carry over; the
[changelog](changelog.md) says if a version needs anything of you.

## Remove it

1. Delete or move out of `Content` everything made with it: quest assets, dialogue assets, and
   Speaker Components and Quest Triggers in your maps.
2. Untick it in **Edit > Plugins** and restart the editor.

> [!WARNING]
> Quest and dialogue assets, and maps holding its components, don't load without the plugin.
> Remove them before you disable it, or the editor reports them as missing classes.
