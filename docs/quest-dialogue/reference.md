---
layout: guide
title: "Reference · Quest & Dialogue System"
nav: Reference
order: 7
permalink: /docs/quest-dialogue/reference/
description: "Every Blueprint node and setting of Quest & Dialogue System: quests, progress, dialogue, UI, save, multiplayer and debugging."
---

# Reference

Every Blueprint node, setting, asset field and console command of Quest & Dialogue System. The
[how-tos](how-to.md) put them to use, and [Dialogue scripts](script.md) covers the script format.

## Settings

**Project Settings > Plugins > Quest & Dialogue**.

| Setting | Default | What it does |
|---|---|---|
| Add Quest Component | on | Gives each PlayerState the server makes a Quest Component before its Begin Play, so a new PlayerState after travel gets one too. Not when the PlayerState class, or the game mode's Player Controller Class, has one of its own. Turn it off if you put the component on the pawn. |
| Talk Action | `IA_Talk` (E, gamepad left face button) | Talks to the nearest Speaker. Clear it if your game calls **Talk** itself. |
| Talk Radius | 300 cm | How near the pawn a Speaker must be for the talk action. |
| Quest Log Action | `IA_QuestLog` (J, gamepad View) | Opens and closes the quest log. |
| Input Context | `IMC_QuestDialogue` | The mapping context added for every local player, which holds the two actions' keys. Clear it if your own context maps the actions. |
| Input Context Priority | 1 | That context's priority. |
| Dialogue Widget, Quest Log Widget, Tracker Widget | none: the plugin's own | Your [own widgets](#ui). |
| Show Tracker | on | Shows the tracked quest on screen. |
| Manage Input Mode | on | While dialogue or the quest log is open, input goes to the UI and the cursor shows. On closing, input goes to the mode below and the cursor is as it was. Turn it off if your game handles input modes itself. |
| Input Mode After Dialogue | Game Only | The input mode when both close: **Game Only**, **Game And UI**, or **Previous**, the mode the player had when the first of them opened, with its mouse lock. |

The actions and context are in the plugin's `Input` folder ([shown](install.md#enable-it-in-your-project)
with the plugin's content). To change keys, copy the context into your project, edit the copy, and
set it here.

## Quests

A quest is a data asset (**Content Browser > Gameplay > Quest**).

| Field | Default | What it is |
|---|---|---|
| Title, Description | | Shown in the quest log and tracker. |
| Stages | | Run in order. Each has a **Text**, shown while the quest is at that stage, and **Objectives**, which all run at once. A stage completes when every required objective has. The last stage completing completes the quest. |
| Required Quests | | Quests that must be completed before this one can start. |
| Required Tags | | Gameplay tags the player must hold to start it. |
| Tags on Complete | | Tags the player gets when it completes. |
| Repeatable | off | It can start again once completed. Failed and abandoned quests can always start again. |
| Can Abandon | on | The player can abandon it from the quest log. |
| Track on Start | on | It becomes the tracked quest when it starts. Off, it still does when no quest is tracked. |

**Find Objective** on a quest asset gives an objective's stage and index by its Id.

Each objective has these fields:

| Field | What it is |
|---|---|
| Id | Its name in scripts and in **Complete Objective** and **Fail Objective**. It must be unique within the quest. |
| Text | Shown in the quest log and tracker, with `2/5` after it when Count is above 1. |
| Event Tag | **Report Quest Event** with this tag, or a tag under it, counts towards the objective. |
| Count | The total that completes it, 1 or more: each report adds its own count. |
| Optional | The stage can complete without it. If it is still open when a stage before the last completes, it fails; when the last completes the quest, it completes too. |

A quest is in one of five states: **Inactive**, **Active**, **Completed**, **Failed** or
**Abandoned**. Any number of quests can be active at once. An objective is **Pending** (its stage
not reached yet), **Active**, **Completed** or **Failed**.

Saving a quest checks it (the editor's Data Validation, which runs on save unless you turn it
off), and the Message Log lists what it finds:

- errors: no stages, a stage with no objectives, an objective without an Id or with one used
  twice, an empty entry in **Required Quests**, a quest requiring itself;
- warnings, which stop nothing: no Title, an objective without Text or Event Tag, a stage whose
  objectives are all optional (it completes as soon as it starts).

## Progress

Objectives move when your game reports what happened. You never need to subclass anything for
this.

- **Report Quest Event** (Quest Component), with a tag and a count (under the node's arrow; 1
  by default). Call it when the player kills,
  collects, crafts or opens something. Each active objective whose Event Tag is that tag, or a
  parent of it, counts the report. With the tags `Kill.Wolf` and `Kill.Bandit`, an objective on
  `Kill` counts both.
- **Quest Trigger** (an actor in **Place Actors**). Each time a player's pawn walks into its box,
  it starts **Quest to Start** if that is set and the quest can start. Then it reports **Event
  Tag**, counting **Count**. The box, 400 × 400 × 200 cm before you scale it, overlaps actors whose
  collision object type is **Pawn**, and acts on the server. Use it for reach-a-place objectives.
- **Speaker Component**'s **Talk Event Tag** is reported as the player starts talking to that
  speaker. Use it for talk-to objectives.
- A script's `do report Tag`.

## Quest Component

The player's quests and tags. **Get Quest Component** (with any of the player's PlayerState,
Controller or Pawn, or a widget's owning player) finds it.

Queries:

| Node | Returns |
|---|---|
| Get Quest State | the quest's state |
| Get Quest Status | whether the player has had the quest, and its state, stage, and each objective's progress and state |
| Get Quests | every quest the player has had, in the order first started |
| Get Quests In State | the quests in one state, such as every active quest |
| Can Start Quest | whether it can start: not active, not completed unless repeatable, its required quests completed and its required tags held |
| Has Tag | whether the player holds the tag, or a tag under it |
| Get Tags | every tag the player holds |
| Get Tracked Quest | the quest the tracker shows, or none |
| Get Objectives (library) | the current stage's objectives, ready to show: Id, text with count, progress, count, state, optional |
| Get Stage Text (library) | the current stage's text, or the quest's description |
| Find Quest (library) | a quest asset by name or path; none when several share the name |
| Get Save Data | everything to save; see [Save](#save) |

Changes:

| Node | Does |
|---|---|
| Start Quest | starts it if **Can Start Quest** holds; it becomes tracked if **Track on Start** is ticked or no quest is tracked |
| Restart Quest | starts it again from its first stage, whatever its state and requirements, tracked as Start Quest does |
| Complete Quest | completes an active quest, whatever its objectives |
| Fail Quest | fails an active quest |
| Abandon Quest | abandons an active quest whose **Can Abandon** is set |
| Advance Quest | completes the active quest's current stage, whatever its objectives |
| Complete Objective | completes one objective of the current stage, by Id |
| Fail Objective | fails one objective; failing a required one fails the quest |
| Report Quest Event | see [Progress](#progress) |
| Add Tag, Remove Tag | gives or takes a gameplay tag, only that exact one; quests and scripts check them |
| Track Quest | sets the tracked quest, if it is active; none clears it |

When the tracked quest ends, the earliest-started quest still active becomes tracked.

**Accept Client Requests** (on by default): changes called on the owning client go to the server.
See [Multiplayer](#multiplayer).

## Events

These are on the Quest Component. Bind them from the PlayerState, or from **Get Quest
Component**. They fire on the server and on the owning player's machine. The client works its
own out from what replicates, so steps within one network update arrive merged: a quest that
starts and completes at once goes from Inactive straight to Completed, with no Objective Updated
for the objective that finished it.

| Event | Gives | When |
|---|---|---|
| On Quest State Changed | Quest, New State, Old State | a quest changes state. Give rewards here when the new state is Completed. |
| On Quest Stage Changed | Quest, Stage | a quest moves to another stage, and at stage 0 as it starts, or restarts unless it was active at stage 0 |
| On Objective Updated | Quest, Objective Index, Progress, State | an objective's progress or state changes |
| On Tracked Quest Changed | Quest | the tracked quest changes; none when nothing is |
| On Quests Changed | | after any change to quests or tags; the place to refresh UI |
| On Quests Restored | | once after **Load Save Data**, and on a client once its quests first arrive |

Quests that a load or a client's first replication restores fire none of the first three
events: a quest completed before the save isn't completed again, so its reward isn't paid twice.
Read restored quests in **On Quests Restored**. A quest the load itself moves on does fire them,
on the server only: one saved past its last stage completes, for the first time, and one whose
current stage's required objectives are all done moves to the next stage.

## Dialogue

**Speaker Component**. Add it to anyone the player can talk to.

| | |
|---|---|
| Dialogue | the dialogue asset, imported from a `.qds` script |
| Start Label | where the script starts; empty is its top |
| Talk Event Tag | reported by the player's machine as talking starts, even when no dialogue does |
| Has Label (dialogue asset) | whether the script has the label |
| Talk | starts the dialogue for a local player; false if it didn't |
| Find Nearest Speaker | the nearest speaker within **Radius** (300 cm) of **From** (self by default) |
| On Dialogue Event | a script's `do event Name` while this speaker talks, with the event and the player |
| On Dialogue Ended | the conversation with this speaker ended, with the player |

A dialogue asset's Details show what its import made, to read, not edit: **Steps**, **Labels**,
**Speakers**, the **Source** script and the import's **Messages**.

**Dialogue Subsystem**, one per local player (**Get Dialogue Subsystem** with the player
controller).

| | |
|---|---|
| Start Dialogue | runs a dialogue asset in the dialogue box, from a label or the top; ends any dialogue running. Use it for dialogue without a Speaker, such as from a trigger or a cutscene's end. False if the dialogue is empty or has no such label, after **On Dialogue Started** and **On Dialogue Ended** have both fired; false with neither when there is no dialogue asset or player controller. |
| Stop Dialogue | ends the dialogue running |
| Talk To Nearest | what the talk action does: talks to the nearest Speaker within **Talk Radius**, with a Dialogue or not, unless a dialogue is running; false if none started |
| Is In Dialogue | whether a dialogue is running |
| Get Speaker | the actor talking |
| Get Runner | the dialogue running, for a UI of your own |
| Set Quest Log Open, Toggle Quest Log, Is Quest Log Open | the quest log |
| Get Quest Component | the player's quest component |
| On Dialogue Started, On Dialogue Ended | a conversation starts or ends |
| On Dialogue Event | a script's `do event Name`, with the speaker |

**Dialogue Runner**. Steps through a dialogue: the subsystem's own, or one you make with
**Construct Object**.

| | |
|---|---|
| Start | from a label or the top, for the player whose Quest Component is **Quests**; false if the dialogue is empty or has no such label. Without the component, quest conditions read every quest as inactive and every tag as not held, quest and tag actions do nothing, and `do event` still fires. |
| Continue | past a line with no options; skips its voice |
| Choose | picks an option of the line shown, by index |
| Stop, Is Running | |
| Get Line | the line shown: speaker and speaker Id, text, options, voice |
| Get Dialogue | the dialogue asset running |
| Play Voice | plays lines' voices, and continues when one ends, unless options follow it; on by default |
| On Line, On Ended, On Event | each line shown; the end; a `do event` |

Dialogue actions change quests through the player's Quest Component, so in multiplayer they
reach the server like any other change. A dialogue that runs 10,000 steps without showing a line
is stopped, with a warning in the log.

## UI

The plugin's three widgets build their own layout, so they work with no setup. To use your own
look, make a Widget Blueprint whose parent class is one of them, and set it in the
[settings](#settings).

- **QDDialogueWidget**: name your widgets `SpeakerText`, `LineText`, `ChoiceBox` (a panel, filled
  with a button per option) and `ContinueHint` (shown while the line waits). Each is optional. Or
  override **Show Line** and draw lines your own way, calling **Continue** and **Choose**.
  **Get Runner** gives the dialogue it shows.
- **QDQuestLogWidget**: `QuestList`, `TitleText`, `StageText`, `ObjectiveList`, `TrackButton`
  and `AbandonButton`, or override **Refresh**. It has **Select Quest**, **Get Selected Quest**
  and **Close** too.
- **QDTrackerWidget**: `TitleText` and `ObjectiveList`, or override **Refresh**.

**Refresh** runs whenever the player's quests change, and once as the widget is made.
**Get Quest Component** in the widget gives the component, or none on a client until it has
replicated.

Keys: the dialogue box continues on Enter, Space, a click or the gamepad's bottom face button,
and picks options with 1 to 9. The quest log closes on Escape, the gamepad's right face button
or **Menu** button, or its own action.

## Save

Quests save into your own save game, or into a slot of their own.

- **Your own save game**: add a variable of type **QD Save Data** to it. Before saving, set it
  from **Get Save Data**. After loading, pass it to **Load Save Data** on the server.
- **A slot of their own**: **Save Quests To Slot** and **Load Quests From Slot**, slot `Quests`
  and user 0 unless you give others (**User Index** is under the node's arrow). They return whether it worked; Load
  returns false for an empty slot, and on a client, where it loads nothing.

Quests are saved by asset path. If a quest has changed since the save, loading keeps what still
fits: a stage past the end completes the quest, and objectives are matched by position.

## Multiplayer

The server owns each player's quests, and replicates them only to that player.

- Changes called on the owning client go to the server. Their result arrives with replication, a
  round trip later. Turn off **Accept Client Requests** on the component and the server ignores
  them. Then only server code changes quests: on clients, dialogue actions, Talk Event Tags and
  the quest log's Track and Abandon buttons do nothing.
- Quest Triggers act on the server only.
- Dialogue runs on the player's own machine.
- A new PlayerState after a travel starts with an empty Quest Component. Save before the travel
  and load after, or, with seamless travel, carry the quests over in the PlayerState's **Copy
  Properties** with **Get Save Data** and **Load Save Data**.

## Debugging

- **Gameplay Debugger** (<kbd>'</kbd> in Play): the **Quests** category lists the player's
  quests and stages, the active ones' objectives and progress, and tags, as they change. With an
  actor selected in it, it shows that actor's player's quests.
- **Log**: the plugin writes under `LogQuestDialogue`. A Start that is refused logs at Verbose
  only; type `Log LogQuestDialogue Verbose` in the console to see it.
- **Console commands**, in every build but Shipping (<kbd>&#96;</kbd>):

| Command | Does |
|---|---|
| `Quest.List` | lists the first local player's quests, objectives and tags in the log |
| `Quest.Start <Quest>` | starts the quest from its first stage, whatever its state and requirements |
| `Quest.Complete <Quest> [Objective]` | completes the quest, or one objective |
| `Quest.Fail <Quest> [Objective]` | fails the quest, or one objective |
| `Quest.Report <Tag> [Count]` | reports a quest event, counting 1 without a count |

- **Message Log**: a script's import messages, under **Asset Tools**. Run **Validate Assets** on
  a folder to recheck every quest in it. A dialogue asset repeats its last import's messages, so
  after renaming a quest or tag, change the name in the scripts that use it and reimport them.

## Packaging

The plugin's settings name their assets by path: the input actions and context, and your own
widgets. A packaged game cooks only what something references, so the plugin adds these to every
cook itself; nothing needs listing under **Project Settings > Packaging**. Quest and dialogue
assets are cooked as your maps, Blueprints and dialogues reference them. A quest your game only
finds by name (**Find Quest**, `Quest.Start`) needs its folder in **Additional Asset Directories
to Cook**.
