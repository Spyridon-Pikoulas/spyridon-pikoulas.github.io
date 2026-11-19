---
layout: guide
title: "Quickstart · Quest & Dialogue System"
nav: Quickstart
order: 3
permalink: /docs/quest-dialogue/quickstart/
description: "Fifteen minutes from installing Quest & Dialogue System to a quest you can play in your own Unreal map, with no Blueprint graph or C++."
---

# Quickstart: a quest in your own map

Fifteen minutes from an installed plugin to a quest you can play: Mira has lost her ring by the
well, she asks you to find it, and thanks you when you have. No Blueprint graph or C++ is needed.

The steps use a project made from the **Third Person** template with the plugin enabled
([Install](install.md)). Any project whose player uses Enhanced Input works the same.

## 1. Add a gameplay tag

Quests hear about what happens in your game through
[gameplay tags](https://dev.epicgames.com/documentation/en-us/unreal-engine/using-gameplay-tags-in-unreal-engine).
Finding the ring will report one.

1. Open **Edit > Project Settings** and pick **GameplayTags** under **Project** on the left.
2. Click **Manage Gameplay Tags...** beside **Gameplay Tag List**. The Gameplay Tag Manager opens.

    {% include figure.html src="tags.png" alt="The Project - GameplayTags settings page, its Gameplay Tags rows down to Gameplay Tag List, which has the Manage Gameplay Tags button." caption="The GameplayTags page; the button is on the **Gameplay Tag List** row." %}

3. Click **+** at the manager's top left, type `Quest.Ring.Found` as the **Name**, and click
   **Add New Tag**. The tag shows in the list, under `Quest` and `Ring`.

## 2. Make the quest

1. In the Content Browser, right-click an empty spot and pick **Gameplay > Quest**. Name the new
   asset `Ring` and double-click it to open it.
2. Fill in **Title** with `Mira's Ring` and **Description** with
   `Mira lost her ring by the old well.`
3. Click **+** beside **Stages** to add a stage, and open it with the arrow beside **Index [0]**.
   Set its **Text** to `Search the well.`
4. Click **+** beside the stage's **Objectives** and open the new objective. Fill in:

    | Field | Value |
    |---|---|
    | Id | `Find` |
    | Text | `Find the ring` |
    | Event Tag | `Quest.Ring.Found` |

    {% include figure.html src="quest.png" alt="The Ring quest asset open: Title Mira's Ring, the description, one stage with the text Search the well, and its objective with Id Find, Text Find the ring, Event Tag Quest.Ring.Found and Count 1." caption="The quest with its stage and objective opened." %}

5. Click **Save**. If anything is missing, such as an objective with no Event Tag, the Message
   Log says so as you save.

## 3. Write the dialogue

Dialogue is a text file in the [script format](script.md). Mira's checks the quest first, so
she says the right thing before, during and after it:

```text
speaker Mira: Mira
if Ring is completed -> thanks
if Ring is active -> waiting
Mira: I lost my ring by the old well. Would you look for it?
* I'll find it. -> yes
* Not now.
Mira: Another time, then.
end

== yes
do start Ring
Mira: Thank you! It's silver, you can't miss it.
end

== waiting
Mira: Any luck by the well?
end

== thanks
Mira: You found it! Thank you.
```

The first line names who speaks: lines starting `Mira:` show under the name "Mira". The `if`
lines jump to a label (`== thanks`) when they hold, `*` lines are choices, and `end` ends the
talk.

1. Save the text above as `Mira.qds`, from any text editor.
2. Drag `Mira.qds` from its folder into the Content Browser. It becomes the dialogue asset
   `Mira`, beside the quest.

    {% include figure.html src="imported.png" alt="The Content Browser showing the dialogue asset Mira, selected, beside the quest asset Ring." caption="The script imported as the dialogue asset `Mira`." %}

If the script has a mistake, the import names its line in the Message Log. After editing the
file, right-click the asset and pick **Reimport**.

## 4. Place Mira

Anyone the player can talk to carries a **Speaker Component**: a character, a statue, a sign.

1. From `Characters/Mannequins/Meshes` in the Content Browser, drag `SKM_Quinn_Simple` into the
   map near the player start.
2. With it selected, click **+ Add** in the Details panel, search for `Speaker`, and pick
   **Speaker Component**.
3. Set the component's **Dialogue** to `Mira`.

    {% include figure.html src="speaker.png" alt="The Details panel of SKM_Quinn_Simple with its Speaker Component, listed as QDSpeaker, selected and Dialogue set to Mira." caption="Mira's Speaker Component, its **Dialogue** set." %}

## 5. Place the ring

A **Quest Trigger** reports its tag when the player walks into its box.

1. Open **Window > Place Actors**, search for `Quest Trigger`, and drag it into the map some way
   from Mira.

    {% include figure.html src="place.png" alt="The Place Actors panel searched for Quest Trigger, with the Quest Trigger actor listed." caption="The Quest Trigger in **Place Actors**." %}

2. In its Details, set **Event Tag** to `Quest.Ring.Found`.

    {% include figure.html src="trigger.png" alt="The Details panel of the Quest Trigger with Event Tag Quest.Ring.Found, Count 1 and no Quest to Start." caption="The trigger reports `Quest.Ring.Found` once, completing the objective." %}

Scale the trigger to fit the spot. Its box catches any pawn a player controls.

## 6. Play

Press **Play**.

1. Walk up to Mira and press <kbd>E</kbd>. She asks for help. Pick **I'll find it.** with the
   mouse or <kbd>1</kbd>, then press <kbd>Enter</kbd> past her thanks. The quest shows at the top
   right.

    {% include figure.html src="talk.jpg" alt="The dialogue box: Mira asks the player to look for her ring by the old well, with the choices I'll find it and Not now." caption="Mira's first line and its two choices." %}

    {% include figure.html src="tracked.jpg" alt="The tracker at the top right of the screen: Mira's Ring, with the objective Find the ring under it." caption="The tracker, once the quest has started." %}

2. Press <kbd>J</kbd>. The quest log lists **Mira's Ring** with its stage and objective. Press
   <kbd>J</kbd> again, or <kbd>Esc</kbd>, to close it.

    {% include figure.html src="log.jpg" alt="The quest log open over the game, listing Mira's Ring as active with its stage text and objective." caption="The quest log." %}

3. Walk into the trigger. The quest completes and leaves the tracker.
4. Walk back to Mira and press <kbd>E</kbd>. She thanks you.

    {% include figure.html src="thanks.jpg" alt="The dialogue box with Mira's line: You found it! Thank you." caption="Mira, once the quest is completed." %}

To watch the quest while you play, press <kbd>'</kbd> (apostrophe) for the Gameplay Debugger: its
**Quests** category lists the player's quests, objectives and tags as they change. Or type
`Quest.List` in the console (<kbd>&#96;</kbd>).

{% include figure.html src="debugger.jpg" alt="The Gameplay Debugger's Quests category: the player's quests, with Ring completed at stage 1 of 1, and an empty Tags line." caption="The Gameplay Debugger's **Quests** category." %}

If something doesn't happen as written, [Troubleshooting](troubleshooting.md) has each step's
usual cause.

## Next

- [Count kills or pickups](how-to.md#count-kills-or-pickups) with one node from your own
  Blueprints.
- [Give a reward when a quest completes](how-to.md#give-a-reward-when-a-quest-completes).
- [Concepts](concepts.md): how quests, tags and dialogue fit together.
