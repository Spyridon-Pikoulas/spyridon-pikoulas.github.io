---
layout: guide
title: "How-tos · Quest & Dialogue System"
nav: How-tos
order: 4
permalink: /docs/quest-dialogue/how-to/
description: "Answers to the common tasks in Quest & Dialogue System: counting kills, rewards, quest chains, failing and repeating quests, dialogue events, voice, your own UI, save and multiplayer."
---

# How-tos

The tasks buyers come back for, each answered in steps, in Blueprint, with C++ where both
apply. They build on the [quickstart](quickstart.md)'s quest and the words in [Concepts](concepts.md).

## Count kills or pickups

An objective counts every **Report Quest Event** whose tag is its **Event Tag** or a tag under it.

1. Add tags for what happens, such as `Kill.Wolf` and `Kill.Bandit`.
2. In the quest, give the objective **Event Tag** `Kill.Wolf` and **Count** `5`. An objective on
   `Kill` would count wolves and bandits both.
3. Where the wolf dies, on the server, call **Get Quest Component** with the killer (its pawn,
   controller or PlayerState), then **Report Quest Event** with `Kill.Wolf`.

The objective shows `2/5` in the tracker and log as it counts, and completes at 5. For a pickup,
report its tag where the pickup is taken; for an amount at once, set the node's **Count**
(under its arrow): the objective's Count is a total, and each report adds its own.

```cpp
#include "QDLibrary.h"
#include "QDQuestComponent.h"

void AWolf::Die(AController* Killer)
{
    if (UQDQuestComponent* Quests = UQDLibrary::GetQuestComponent(Killer))
    {
        Quests->ReportQuestEvent(FGameplayTag::RequestGameplayTag("Kill.Wolf"));
    }
}
```

A report counts only towards active quests' current stages: a wolf killed before the quest
starts doesn't count.

## Give a reward when a quest completes

Rewards are your game's own (gold, items, XP), so you give them where the quest component says a
quest completed. The simplest place is your PlayerState Blueprint.

1. Make a Blueprint of class **PlayerState** (say `BP_PlayerState`) and set it as **Player State
   Class** in your game mode.
2. Open it, click **+ Add** in Components and add a **Quest Component**. The plugin then uses this
   one instead of adding its own.
3. Select the component and, under **Events** in its Details, click **+** beside **On Quest State
   Changed**. The event node comes with **Quest**, **New State** and **Old State**.
4. After the event, add **Switch Has Authority** and go on from **Authority** only, so the
   reward is given once, on the server.
5. Add a **Branch** on **New State** `==` **Completed**, then a second **Branch** on **Quest**
   `==` your quest asset, and give that quest's reward after it.

```cpp
// AMyPlayerState: a Quest Component made in the constructor, and OnQuestState a UFUNCTION()
Quests = CreateDefaultSubobject<UQDQuestComponent>(TEXT("Quests"));

void AMyPlayerState::BeginPlay()
{
    Super::BeginPlay();
    if (HasAuthority())
    {
        Quests->OnQuestStateChanged.AddDynamic(this, &AMyPlayerState::OnQuestState);
    }
}

void AMyPlayerState::OnQuestState(UQDQuestAsset* Quest, EQDQuestState NewState, EQDQuestState OldState)
{
    if (NewState == EQDQuestState::Completed && Quest->GetFName() == "Ring")
    {
        Gold += 50;
    }
}
```

The events fire on the server and on the owning player's machine. Give rewards on the server;
use the player's side for sounds and messages. What a load fires is under [Save](concepts.md#save).

## Start a quest without an NPC

- **From a place**: a **Quest Trigger** with **Quest to Start** set starts that quest as a player
  walks in, if it can start. Leave its **Event Tag** empty if it should only start the quest.
- **From anything**: **Get Quest Component** with the player, then **Start Quest**. It starts
  only if **Can Start Quest** holds; **Restart Quest** starts it whatever its state.
- **From a script**: `do start Ring`.

## Change what an NPC says as a quest goes on

A script checks the quest's state at its top and jumps to what fits, as Mira's does:

```text
if Ring is completed -> thanks
if Ring is active -> waiting
```

For a line said once, give a tag when it's said and skip it after:

```text
if has Met.Mira -> again
Mira: I'm Mira. I grow the herbs here.
do add Met.Mira
end

== again
Mira: Back again?
```

An option can hang on a condition too: `* {has Pass.Captain} I have it here. -> pass` shows only
to a player holding the tag. Every condition is in [Dialogue scripts](script.md#conditions).

## Chain quests

1. In the second quest, add the first to **Required Quests**. It can't start until the first is
   completed.
2. To gate on something else, give the first quest **Tags on Complete** (say `Chapter.Two`) and
   put that tag in later quests' **Required Tags**.
3. In the NPC's script, offer the next quest only when it can start, with a condition on the
   option.

```text
* {can start Gate} Can I help? -> help
```

## Fail a quest

- **On time**: when the quest starts, start a timer (**Set Timer by Event**) on the server; when
  it runs out, call **Fail Quest** if **Get Quest State** is still **Active**.
- **By an objective**: **Fail Objective** on a required objective fails the quest; an
  [optional](concepts.md#quests) one fails only itself.
- **From a script**: `do fail Escort`, or `do fail Escort Protect` for one objective.

A failed quest can start again with **Start Quest**, from its first stage. Ticking **Can
Abandon** lets the player give a quest up from the quest log; an abandoned quest can start again
too.

## Make a quest repeatable

Tick **Repeatable** on the quest: once completed, **Can Start Quest** holds again and a new
**Start Quest** runs it from the top.

For a daily, have its completion give a tag (**Tags on Complete**, `Daily.Herbs.Done`), offer it
only without the tag, and take the tag away when your game's day turns (**Remove Tag**):

```text
* {can start Herbs and not has Daily.Herbs.Done} Need any herbs today? -> herbs
```

## Start dialogue from a trigger or a cutscene

A dialogue needs no Speaker Component.

1. Call **Get Player Controller**, then **Get Dialogue Subsystem** with it.
2. Call **Start Dialogue** with the dialogue asset. Open the node's arrow for **Label** to start
   at a label instead of the top; **Speaker** is the actor whose events fire, and may be empty.

From a Level Sequence, call it from an event track or when the sequence finishes.

```cpp
if (UQDDialogueSubsystem* Dialogue = UQDLibrary::GetDialogueSubsystem(PlayerController))
{
    Dialogue->StartDialogue(Intro, nullptr, "start");
}
```

Dialogue runs on the player's own machine, so call it there: in a listen server's game, a remote
player's controller on the server has no dialogue subsystem.

## Run game code from dialogue

1. In the script, write `do event OpenGate` where it should happen.
2. In the speaker's Blueprint, select its Speaker Component and click **+** beside **On Dialogue
   Event**.
3. After the event, **Switch on Name** on **Event** and add a pin `OpenGate`. Do what it says from
   there.

The player's **Dialogue Subsystem** has the same event, with the speaker, for code that isn't on
the NPC. The event fires on the player's own machine; in multiplayer, change the world through a
server call of yours from there.

## Add voice lines

Put the sound asset's path after the line:

```text
Bram: Clear the wolves from the road. | voice=/Game/Voice/Bram_Wolves
```

The line moves on when the sound ends, and the player can skip it; a line with options waits for
the choice. The import checks that each path is a sound asset.

## Give the UI your own look

1. Make a Widget Blueprint and pick **QDDialogueWidget** as its parent class (or
   **QDQuestLogWidget**, **QDTrackerWidget**).
2. In the Designer, lay it out as you like and give the widgets the plugin should fill these
   names:

    | Widget | Name | Type |
    |---|---|---|
    | Dialogue | `SpeakerText`, `LineText` | Text |
    | | `ChoiceBox` | panel |
    | | `ContinueHint` | any |
    | Quest log | `QuestList`, `ObjectiveList` | panel |
    | | `TitleText`, `StageText` | Text |
    | | `TrackButton`, `AbandonButton` | Button |
    | Tracker | `TitleText` | Text |
    | | `ObjectiveList` | panel |

    A panel is a Vertical Box or the like; `ChoiceBox` gets a button per option, and
    `ContinueHint` shows while a line waits. Each is optional: leave out what you don't show.

3. Set your Widget Blueprint in **Project Settings > Plugins > Quest & Dialogue**.

To draw lines entirely your own way, override **Show Line** in the dialogue widget and call
**Continue** and **Choose**; in the log and tracker, override **Refresh**. Every name is in the
[reference](reference.md#ui).

## Save quests with your own save game

1. In your SaveGame Blueprint, add a variable of type **QD Save Data**.
2. Before saving: **Get Quest Component** with the player, **Get Save Data**, and set your
   variable from it.
3. After loading, on the server: **Get Quest Component**, then **Load Save Data** with your
   variable.

```cpp
// saving
SaveGame->Quests = UQDLibrary::GetQuestComponent(PlayerController)->GetSaveData();
// loading, on the server
UQDLibrary::GetQuestComponent(PlayerController)->LoadSaveData(SaveGame->Quests);
```

A game without a save game of its own calls **Save Quests To Slot** and **Load Quests From Slot**
instead.

## Make it work in co-op

Each player has their own quests, on the server, replicated to that player alone.

| Call | Where |
|---|---|
| Report Quest Event, Start Quest and the other changes | the server, or the owning player's machine (sent to the server) |
| Load Save Data, rewards | the server |
| Start Dialogue, the UI | the player's own machine |
| Queries such as Get Quest State | either; the player's machine sees changes a round trip later |

For a shared objective, report the event to every player's component: loop over the Game State's
**Player Array** and call **Report Quest Event** on each. To stop clients from changing their own
quests, untick **Accept Client Requests** on the Quest Component.

## Translate the dialogue

Every line, option and speaker name in a script, and every quest's text, is localisable. In
**Tools > Localization Dashboard**, add a gather from packages that covers your quest and
dialogue folders, then gather, translate and compile as for the rest of your game. How script
lines are keyed is in [Dialogue scripts](script.md#localisation).
