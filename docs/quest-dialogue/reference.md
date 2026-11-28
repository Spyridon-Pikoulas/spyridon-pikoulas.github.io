---
layout: guide
title: "Reference · Quest & Dialogue System"
nav: Reference
order: 8
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
| Show Tracker | on | Shows the tracked quest on screen, except while the quest log, which shows it, is open. |
| Manage Input Mode | on | While dialogue or the quest log is open, input goes to the UI and the cursor shows. On closing, input goes to the mode below and the cursor is as it was. Turn it off if your game handles input modes itself. |
| Input Mode After Dialogue | Game Only | The input mode when both close: **Game Only**, **Game And UI**, or **Previous**, the mode the player had when the first of them opened, with its mouse lock. |
| Glints | on | Every [QD Glint](#glint) shown; off hides them all. |
| Glint Material | `M_QDGlint` | The glints' look: a material with **Color** and **Phase** parameters, drawn as a sprite. |

The actions and context are in the plugin's `Input` folder ([shown](install.md#enable-it-in-your-project)
with the plugin's content). To change keys, copy the context into your project, edit the copy, and
set it here.

## Quests

A quest is a data asset (**Content Browser > Gameplay > Quest**).

| Field | Default | What it is |
|---|---|---|
| Title, Description | | Shown in the quest log and tracker. |
| Stages | | The first is where the quest starts; each goes on to the next unless its **Then** or an objective's says otherwise. See below. |
| Required Quests | | Quests that must be completed before this one can start. |
| Required Tags | | Gameplay tags the player must hold to start it. |
| Tags on Complete | | Tags the player gets when it completes. |
| Repeatable | off | It can start again once completed. Failed and abandoned quests can always start again. |
| Can Abandon | on | The player can abandon it from the quest log. |
| Track on Start | on | It becomes the tracked quest when it starts. Off, it still does when no quest is tracked. |

**Find Objective** on a quest asset gives an objective's stage and index by its Id, and **Find
Stage** a stage's index by its Id.

Each stage has these fields:

| Field | What it is |
|---|---|
| Id | Its name in Thens, scripts, **Go To Stage** and saves. It must be unique within the quest. A stage without one is named `Stage1`, `Stage2` and so on, by its place, as the quest loads or the stage is added. |
| Text | Shown in the quest log while the quest is at the stage. |
| Objectives | Run at once. The stage completes when every required one has. |
| Then | Where the quest goes once the stage completes. A stage whose required objectives are all paths is a choice: it is left only by them. |

Each objective has these fields:

| Field | What it is |
|---|---|
| Id | Its name in scripts and in **Complete Objective** and **Fail Objective**. It must be unique within the quest. |
| Text | Shown in the quest log and tracker, with `2/5` after it when Count is above 1. |
| Event Tag | **Report Quest Event** with this tag, or a tag under it, counts towards the objective. |
| Count | The total that completes it, 1 or more: each report adds its own count. |
| Optional | The stage can complete without it. If it is still open when the stage completes, it fails; when that completes the quest, it completes too. |
| Then | **Next**, the default, for none. Anything else makes the objective a path out of its stage: as it completes, the quest goes there at once, and the stage's other open objectives are Skipped. Failing a path fails only the objective, unless it was the last way out of a choice. |

A **Then** has a **To**, one of:

| To | The quest goes |
|---|---|
| Next | to the following stage, or completes after the last |
| Stage | to the stage named in **Stage**, a list of the quest's Ids |
| Complete | nowhere: it completes |
| Fail | nowhere: it fails |

A quest is in one of five states: **Inactive**, **Active**, **Completed**, **Failed** or
**Abandoned**. Any number of quests can be active at once. An objective is **Pending** (its stage
not reached yet), **Active**, **Completed**, **Failed** or **Skipped**: still open when the quest
left its stage by a path or **Go To Stage**, or a path not taken, however the stage was left.

Saving a quest checks it (the editor's Data Validation, which runs on save unless you turn it
off), and the Message Log lists what it finds:

- errors: no stages, a stage with no objectives, a stage without an Id or with one another stage
  has, an objective without an Id or with one used twice, a Then to a stage that isn't there, a
  stage from which the quest never ends (every way on comes back round), an empty entry in
  **Required Quests**, a quest requiring itself;
- warnings, which stop nothing: no Title, an objective without Text or Event Tag, a stage whose
  objectives are all optional and none a path (it completes as soon as it starts), a stage that is
  never reached.

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
| Get Quest Status | whether the player has had the quest, and its state, stage, path (the stages it has been at since it last started, as indices), and each objective's progress and state |
| Get Stage Id | the Id of the stage the quest is at, or ended at; none if it never started |
| Has Reached Stage | whether the quest has been at the stage, by Id, since it last started: the path it took, the ending it reached |
| Get Quests | every quest the player has had, in the order first started |
| Get Quests In State | the quests in one state, such as every active quest |
| Can Start Quest | whether it can start: not active, not completed unless repeatable, its required quests completed and its required tags held |
| Has Tag | whether the player holds the tag, or a tag under it |
| Get Tags | every tag the player holds |
| Get Tracked Quest | the quest the tracker shows, or none |
| Get Objectives (library) | the current stage's objectives, ready to show: Id, text with count, progress, count, state, optional |
| Get Stage Text (library) | the current stage's text, or the quest's description |
| Get Journal (library) | every stage the quest has been at since it last started, in order, each with its Id, text and objectives as they stand or as the quest left them |
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
| Advance Quest | completes the active quest's current stage, whatever its objectives; the quest goes where the stage's **Then** says |
| Go To Stage | moves the active quest to the stage, by Id; the current stage's open objectives are Skipped. A stage that isn't there moves nothing and logs a warning |
| Complete Objective | completes one objective of the current stage, by Id; a path takes the quest where its Then says |
| Fail Objective | fails one objective; failing a required one fails the quest, failing a path only closes it, unless it was a choice's last way out, which fails the quest |
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
| On Objective Updated | Quest, Objective Index, Progress, State | an objective's progress or state changes, including to Skipped as the quest leaves its stage |
| On Tracked Quest Changed | Quest | the tracked quest changes; none when nothing is |
| On Quests Changed | | after any change to quests or tags; the place to refresh UI |
| On Quests Restored | | once after **Load Save Data**, and on a client once its quests first arrive |

Quests that a load or a client's first replication restores fire none of the first three
events: a quest completed before the save isn't completed again, so its reward isn't paid twice.
Read restored quests in **On Quests Restored**. A quest the load itself moves on does fire them,
on the server only: one saved past its last stage completes, for the first time, and one whose
current stage's required objectives are all done moves on as the stage's Then says.

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
| Set Glints Shown, Are Glints Shown | every [QD Glint](#glint) this player sees, on or off; it starts as the settings' **Glints** |
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
| On Hand Over | a `do give` (To Player ticked) or `do take`; the subsystem's runner plays the [gestures](#gestures) for it |

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
- **QDQuestLogWidget**: `QuestList`, `TitleText`, `StateMark` and `StateText` (the selected quest's
  state: its mark is drawn into the first), `StageText`, `ObjectiveList`, `TrackButton`,
  `AbandonButton` and `PastList` (the stages passed, from **Get Journal**), or override
  **Refresh**. It has **Select Quest**, **Get Selected Quest** and **Close** too.
- **QDTrackerWidget**: `TitleText` and `ObjectiveList`, or override **Refresh**.

**Refresh** runs whenever the player's quests change, and once as the widget is made.
**Get Quest Component** in the widget gives the component, or none on a client until it has
replicated.

Keys: the dialogue box continues on Enter, Space, a click or the gamepad's bottom face button,
and picks options with 1 to 9. The quest log closes on Escape, the gamepad's right face button
or **Menu** button, or its own action.

## Glint

**QD Glint**, a component: a small sparkle on what the player can talk to or pick up, shown while
the player's view is within **Range** of it, and hidden on whoever the player is talking to until
the talk ends. It twinkles on a beat of its own.

| | Default | |
|---|---|---|
| Glint On | on | Off hides this one, such as a pickup already taken. **Set Glint On** changes it in play. |
| Range | 1500 cm | How near the view comes before it shows. |
| Size | 16 cm | |
| Color | warm gold | |
| Is Glint Shown | | whether it shows now |

## Gestures

**Gesture Component**: a character's gestures, each your montage where you set one, the plugin's
own pose otherwise.

| | Default | |
|---|---|---|
| Gesture Montages | none | a montage for each gesture: **Reach**, **Give** or **Take** |
| Gesture Poses | on | the plugin's poses for gestures without a montage; off, they play no animation and **On Gesture** still fires |
| Contact Time | 0.5 s | when the hand gets there; the plugin's poses are timed to it |
| Play Gesture | | plays it here, and for every player when called on the server or the owning client |
| Play Gesture On | | plays it on another actor within 15 m, adding a Gesture Component that plays locally if it has none |
| Get Gesture Length | | its seconds: the montage's, or the pose's |
| On Gesture | | as a gesture starts, on each machine that plays it |

The poses need a skeleton with the UE5 mannequin's bone names (`pelvis`, `spine_01`, `spine_03`,
`spine_05`, `neck_01`, `head` and the arms'); on any other they don't play.

## Save

Quests save into your own save game, or into a slot of their own.

- **Your own save game**: add a variable of type **QD Save Data** to it. Before saving, set it
  from **Get Save Data**. After loading, pass it to **Load Save Data** on the server.
- **A slot of their own**: **Save Quests To Slot** and **Load Quests From Slot**, slot `Quests`
  and user 0 unless you give others (**User Index** is under the node's arrow). They return whether it worked; Load
  returns false for an empty slot, and on a client, where it loads nothing.

Quests are saved by asset path, each with its state, stage, path and the current stage's
objectives. From 2.1, **QD Save Data**'s **Version** is 1, and each quest's record holds the
**Stage Id**, the **Path** as Ids, the **Objective Ids** and **Past**, the states each stage on the
path was left with, for the log. If a quest has changed since the save, loading keeps what still
fits:

- stages and objectives are found by Id, so reordering them is safe; an objective added since
  starts open;
- a stage whose Id is gone is found by its saved position instead, with a warning in the log;
- a save from before 2.1 (Version 0) finds the stage and objectives by position, and counts every
  stage up to the saved one as its path;
- a stage past the end completes the quest.

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
  quests and the stage each is at, by Id and number, the active ones' objectives and progress, and
  tags, as they change. With an
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
| `Quest.Glints 0` or `1` | hides or shows the first local player's glints |
| `QD.Gesture <Gesture>` | plays **Reach**, **Give** or **Take** on the first local player's character |

- **Message Log**: a script's import messages, under **Asset Tools**. Run **Validate Assets** on
  a folder to recheck every quest in it. A dialogue asset repeats its last import's messages, so
  after renaming a quest or tag, change the name in the scripts that use it and reimport them.

## Packaging

The plugin's settings name their assets by path: the input actions and context, the glint's
material, and your own widgets. A packaged game cooks only what something references, so the plugin adds these to every
cook itself; nothing needs listing under **Project Settings > Packaging**. Quest and dialogue
assets are cooked as your maps, Blueprints and dialogues reference them. A quest your game only
finds by name (**Find Quest**, `Quest.Start`) needs its folder in **Additional Asset Directories
to Cook**.
