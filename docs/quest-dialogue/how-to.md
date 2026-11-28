---
layout: guide
title: "How-tos · Quest & Dialogue System"
nav: How-tos
order: 4
permalink: /docs/quest-dialogue/how-to/
description: "Answers to the common tasks in Quest & Dialogue System: counting kills, rewards, quest chains, a choice with two endings, failing and repeating quests, dialogue events, voice, your own UI, save and multiplayer."
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

## A choice with two endings

The demo's Sela's Secret: Sela tells the player a secret, and the player keeps it or tells the
bailiff. Each answer is a path to a stage of its own, and each stage ends the quest.

1. Give the quest three stages, and fill in each one's **Id**: `Hear`, `Kept` and `Told`.
2. In `Hear`, add two objectives: `Keep` ("Keep her secret") and `Tell` ("Tell the bailiff"). Open
   `Keep`'s **Then**, set **To** to **Stage** and pick `Kept` in **Stage**; do the same for `Tell`
   with `Told`. With only paths in it, `Hear` waits for one of them.
3. Give `Kept` and `Told` an objective each, such as `Token` ("Show Mira the token") and `Bailiff`
   ("Tell Bram"). Set the `Kept` stage's own **Then** to **Complete**, so it ends the quest though
   `Told` comes after it. `Told` is the last stage, so its **Next** completes the quest.
4. Write each stage's **Text** for its path. The log lists every stage the quest has been at, so
   their text tells the player which way they went.
5. In Sela's script, complete one objective or the other from a choice:

    ```text
    Sela: The bailiff's tax chest isn't lost. I took it, and gave it back to the farms.
    * Your secret's safe with me. -> keep
    * The bailiff should hear about this. -> tell

    == keep
    do complete Secret Keep
    Sela: Then take this road token. Show it to Mira.
    end

    == tell
    do complete Secret Tell
    Sela: I see. Then I'd best be gone by morning.
    end
    ```

    Completing `Keep` moves the quest to `Kept` at once, and `Tell` is Skipped.

6. Where people should answer each path differently, test it. Sela's script opens with:

    ```text
    if Secret reached Kept -> kept
    if Secret reached Told -> told
    ```

    and Mira's asks for the token only on its path, while the quest is under way:
    `if Secret reached Kept and Secret is active -> token`.

Open the quest to check it: its [graph](graph.md#a-quests-graph) wires `Hear`'s two objectives to
`Kept` and `Told`, and `Kept`'s **done** to **Completed**. Dragging those pins sets the same Thens
as steps 2 and 3. In Play, the graph lights the path the player took.

To give each ending its own reward, after **On Quest State Changed** with **Completed** (see
[rewards](#give-a-reward-when-a-quest-completes)), branch on **Has Reached Stage** with `Kept`.
To move the quest without an objective, call **Go To Stage**, or write `do goto Secret Told` in a
script.

```cpp
if (NewState == EQDQuestState::Completed && Quests->HasReachedStage(Quest, "Kept"))
{
    Gold += 20;
}
```

## Fail a quest

- **On time**: when the quest starts, start a timer (**Set Timer by Event**) on the server; when
  it runs out, call **Fail Quest** if **Get Quest State** is still **Active**.
- **By an objective**: **Fail Objective** on a required objective fails the quest; an
  [optional](concepts.md#quests) one, or a path, fails only itself.
- **By a path**: an objective whose **Then** is **Fail** fails the quest as it completes
  ([branches](concepts.md#branches)).
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

## Show a hand-over, or play your own animations

`do give` in a script has the speaker hand the player something, and `do take` the player hand it
to the speaker: both turn a hand palm up and reach out until the hands meet, half a second in.
**Reach**, the third gesture, bends down to the ground for a pickup; play it with **Play Gesture**.

These are the plugin's own poses, bent over whatever your Anim Blueprint plays, on any skeleton
with the UE5 mannequin's bone names. To use your own animations instead:

1. Add a **Gesture Component** to your character's Blueprint (the player's, and an NPC's).
2. Under **Gesture Montages**, add an entry for each gesture you have an animation for, and pick
   its montage. Its slot must be one your Anim Blueprint plays, such as `DefaultSlot`.
3. Set **Contact Time** to the second the hand gets there in your montages.

A gesture without a montage keeps the plugin's pose; untick **Gesture Poses** to play none.

**On Gesture** fires as one starts, the place to show what changes hands: in the demo the glowcap
or token appears in the giver's hand, and moves to the taker's at **Contact Time**. The player's
character needs its own Gesture Component for other players to see its gestures; without one,
the plugin adds one that plays on the local screen only.

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
    | Quest log | `QuestList`, `ObjectiveList`, `PastList`, `StateMark` | panel |
    | | `TitleText`, `StateText`, `StageText` | Text |
    | | `TrackButton`, `AbandonButton` | Button |
    | Tracker | `TitleText` | Text |
    | | `ObjectiveList` | panel |

    A panel is a Vertical Box or the like; `ChoiceBox` gets a button per option, and
    `ContinueHint` shows while a line waits. Each is optional: leave out what you don't show.

3. Set your Widget Blueprint in **Project Settings > Plugins > Quest & Dialogue**.

To draw lines entirely your own way, override **Show Line** in the dialogue widget and call
**Continue** and **Choose**; in the log and tracker, override **Refresh**. Every name is in the
[reference](reference.md#ui).

## Show what the player can talk to

A **QD Glint** is a small sparkle on whatever the player can talk to or pick up. The demo's people
carry one by the shoulder, and its mushrooms one over the cap.

1. In the Blueprint of the NPC or item, click **Add** and search `QD Glint`.
2. Move it to where it should shine. Set **Range** to the distance it should show from.
3. When the thing can't be used any more, such as an item picked up, call **Set Glint On** with
   it unticked; tick it again when it can.

While the player talks to someone, that one's glint hides, and it comes back when the talk ends.

To turn glints off, untick the component's **Glint On** for one, or **Glints** in **Project
Settings > Plugins > Quest & Dialogue** for the whole game. In play, **Set Glints Shown** on the
**Dialogue Subsystem** turns them all on or off, for an options menu.

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
