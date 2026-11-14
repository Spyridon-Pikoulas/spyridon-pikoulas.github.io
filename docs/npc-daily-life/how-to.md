---
layout: guide
title: "How-tos · NPC Behavior & Daily Life System"
nav: How-tos
order: 4
permalink: /docs/npc-daily-life/how-to/
description: "Answers to the common tasks in NPC Behavior & Daily Life System: your own character and animations, your own behaviours, steps and considerations, guards, enemies and companions, your game's clock and combat, saving, State Trees, Smart Objects, multiplayer and the other heyheythere plugins."
---

# How-tos

The tasks buyers come back for, each answered in steps, Blueprint first and C++ after. They build
on the [quickstart](quickstart.md)'s villager and the words in [Concepts](concepts.md).

## Use your own character and animations

**An NPC of your own Blueprint.** Make a Blueprint class from **NL Character** (`BP_Villager`),
then in it:

1. Select **Mesh**: set your **Skeletal Mesh Asset** and **Anim Class**. It already stands in the
   capsule as the UE5 mannequin does (90 down, turned -90); move it if your character differs.
2. Select **Brain**: set its **Role**.

Every NPC placed from it shares them; set **Display Name** per NPC in the level.

**Or your own pawn.** In any Character or Pawn Blueprint, click **Add** and search `NL Brain` for the
brain component (**NL Brain**). It walks the navmesh when an AI Controller possesses it: set **AI Controller Class**
to **NL AI Controller** for its senses and factions, and **Auto Possess AI** to **Placed in World
or Spawned**. An actor with no AI Controller is put at its spots instead of walking there.

**Your animations.** Make an **NL Anim Set** (**Add > Miscellaneous > Data Asset**, then **NL Anim Set**) and add an entry for each tag you have an animation for:

| Field | Value |
|---|---|
| Tag | `NPC.Anim.Sit` |
| Montage | `AM_SitDown`, or leave it empty and set **Sequence** to a looping sit |
| Loop | ticked: played until the tag changes |

Set it as the role's **Anim Set** (or one brain's). A **Sequence** plays in the anim set's
**Slot** (`DefaultSlot`), so your Anim Blueprint needs that slot node in its graph; a **Montage**
plays in its own. A tag with no entry falls back to the plugin's pose for it, on a skeleton with
the UE5 mannequin's bone names. The tags the plugin's behaviours set are in the
[reference](reference.md#animation-tags).

```cpp
// a C++ NPC: the plugin's character, your mesh and role
#include "NLCharacter.h"
#include "NLBrainComponent.h"
#include "NLRole.h"
#include "UObject/ConstructorHelpers.h"

AMyVillager::AMyVillager(const FObjectInitializer& ObjectInitializer) : Super(ObjectInitializer)
{
    static ConstructorHelpers::FObjectFinder<UNLRole> Villager(TEXT("/NPCLife/Roles/R_Villager.R_Villager"));
    Brain->Role = Villager.Object;
}
```

## Make a behaviour of your own

Say your villagers should fish at the river from 6 to 8.

1. Add tags in **Project Settings > Gameplay Tags**: `NPC.Spot.Fish` for the spot and `NPC.Anim.Fish`
   for its animation.
2. Drag `BH_Work` (in `NPCLife Content/Behaviors`) to your own folder, choose **Copy Here**, name
   the copy `BH_Fish`, and set:

    | Field | Value |
    |---|---|
    | Label | `Fish` |
    | Activity | `NPC.Activity.Leisure` |
    | Spot | `NPC.Spot.Fish` |
    | Anim Tag | `NPC.Anim.Fish`, played by your anim set |
    | Held Prop | your fishing rod mesh |

3. Replace its considerations with an **Hours** from `6` to `8`, and keep its **Spot Distance**.
4. Add `BH_Fish` to the role's **Behaviors** (a copy of `R_Villager` in your folder), or to one
   NPC's brain.
5. Place **NL Spot**s of kind `NPC.Spot.Fish` on the river bank, each facing the water.

From 06:00 your villagers walk to a free fishing spot; the score panel shows Fish among their
choices. A behaviour's steps are optional: with none it goes to its spot and uses it. Steps you add
replace that, so start them with **Go To Spot**.

## Keep a spot for one role

The baker's stall is for the baker only. Make a role for her (a copy of `R_Villager` in your
folder), and set the stall's spot's **Only For** to that role. Others look for another spot of the
kind.

A spot's own **Anim Tag** plays over the behaviour's, so one work behaviour can water at a spot by
the field and sell at one at the stall. The demo's farmer, farmhand and baker go the other way: a
work behaviour each and their spots **Only For** them (`NPCLife Content/Demo`).

## Write a step or a consideration in Blueprint

**A step.** Make a Blueprint class from **NL Step** (`STEP_RingBell`). Override:

- **Start**: runs once as the step begins; return **Running** to go on to **Update**, **Succeeded**
  to move to the next step, **Failed** to end the behaviour.
- **Update**: about ten times a second while it runs, with the same results.
- **Stop**: after it ends, or when the NPC is pulled away mid-step.
- **Describe**: the words the debugger shows (`Ringing the bell`).

The step appears in every behaviour's **Steps** list. Each NPC doing the behaviour gets its own
copy, so keep its state in its own variables. Each event's **Brain** input is the NPC; call **Move
To**, **Has Reached**, **Face Toward**, **Set Anim Tag** and **Bark** on it.

**A consideration.** Make a Blueprint class from **NL Consideration** and override **Get Input**:
return 0 to 1 from anything in reach of **Context**'s **Brain** (the player's distance, a
quest's state, the weather). Its **Label** names it on the panel.

```cpp
#include "NLConsiderations.h"
#include "NLBrainComponent.h"

UCLASS(meta = (DisplayName = "Raining"))
class URainingConsideration : public UNLConsideration
{
    GENERATED_BODY()
public:
    virtual float GetInput_Implementation(const FNLContext& Context) const override
    {
        return UMyWeather::IsRaining(Context.Brain) ? 1.f : 0.f;
    }
};
```

## React in Blueprint to what an NPC does

Bind the brain's events (select the **Brain** in the NPC's Blueprint, then **+** beside the event
in its Details):

| Event | When |
|---|---|
| On Behavior Changed | it switches behaviour: from **Old** to **New** |
| On Step Event | an **Event** step fired its **Event** name: put one in a behaviour where your game should act |
| On Anim Tag Changed | its animation tag changed, on the server and every client |
| On Alert Changed | it turned calm, suspicious or alarmed |
| On Barked | it said something over its head |

For a smithy that rings while the smith works, give his work behaviour the steps **Go To Spot**,
an **Event** `Hammer` and a **Wait** with **Anim Tag** `NPC.Anim.Work`, with **Loop** on, and have
**On Step Event** play the sound when **Event** is `Hammer`.

## Set up guards and a patrol

1. Place an **NL Character** with **Role** `R_Guard`.
2. Place **NL Spot**s of kind `NPC.Spot.Patrol` along the route, each with the same **Route**
   (`Walls`) and an **Order** of `0`, `1`, `2`… The guard walks them in order and back to the
   first, looking round at each.
3. Give a second guard another **Route** to keep them apart.

A guard hears noises: give footsteps, a dropped crate or a gunshot a **Make NPC Noise** (a
footstep `0.3` loud, a shout `1`; **Range** in cm). Noises make him suspicious, and he goes to look
(**Investigate**). A hostile he sees alarms him: he calls the friends within 30 m for help, then
chases. Badly hurt, he flees.

```cpp
#include "NLLibrary.h"

UNLLibrary::MakeNPCNoise(this, GetActorLocation(), 0.3f, this, 1200.f);  // a footstep, heard about 6 m off
```

## Add enemies and set who fights whom

`R_Bandit` patrols, investigates, chases and flees, and is hostile to villagers, guards, players
and companions by the settings' **Town Attitudes**. For factions of your own:

1. Add tags under `NPC.Faction` in **Project Settings > Gameplay Tags** (`NPC.Faction.Wolves`).
2. In **Project Settings > Plugins > NPC Life > Attitudes**, add a rule for each pair: **A**
   `NPC.Faction.Wolves`, **B** `NPC.Faction.Villager`, **Attitude** Hostile. A rule works both
   ways; pairs with no rule are neutral, and a faction is friendly to itself.
3. Set the faction on a role, on one brain, or as a tag in any actor's **Tags**.

Untick **Town Attitudes** to start from no rules at all.

## Plug in your own combat

The fight behaviours shove by default. To use your game's health and attacks, implement the **NL
Combatant** interface's functions in the NPC's Blueprint. An NL Character has it already (under
**My Blueprint > Interfaces**); another pawn adds it in **Class Settings > Implemented Interfaces**.
The functions:

- **Get NL Health**: 0 (down) to 1 (unhurt), from your health component. Flee and the Health
  consideration read it.
- **NL Attack**: play your attack on **Target** and return true; false leaves it to the shove.
- **Is NL Defeated**: true once it's out of the fight.

Give the player's pawn the interface too, so NPCs see when the player is down.

## Give the player a companion

1. Place an **NL Character** with **Role** `R_Companion`.
2. In its Blueprint (or the level's), on **Begin Play**: **Get Brain** on it, then set **Leader**
   to **Get Player Pawn**.

It follows a few metres behind, runs to catch up, helps against what attacks you and stands in a
foe's way when hurt. To make it wait, set the brain's **Command** to `NPC.Command.Wait`; set it
to `NPC.Command.Follow`, or clear it, to have it follow again.

## Run the NPCs on your game's clock

1. Make a Blueprint (an Actor or an object your game already has) that holds your time of day, and
   add the **NL Clock** interface. Implement **Get NL Hour** (0 to 24), **Get NL Day** (from 1) and,
   if you have them, **Get NL Day Tags** (`NPC.Day.Monday`, `NPC.Season.Winter`, or your own).
2. On **Begin Play**, call **Set Clock** on the **NL Subsystem** node (search the graph for
   `NL Subsystem`) with it.

The NPCs now keep your hours, and their needs fall as your hours pass. **Set Clock** with nothing
goes back to the plugin's own.

The other way round, to light your level by the plugin's clock, read **Get Hour** on the **NL Subsystem** node. The demo's sky does (`ANLDemoSky` in `Source/NPCLifeDemo`).

```cpp
#include "NLSubsystem.h"

UNLSubsystem::Get(this)->SetClock(MyTimeOfDay);  // a UObject implementing INLClock
```

## Save and load the NPCs

1. Add a variable of type **NL World Save** to your Save Game Blueprint.
2. When saving, on the server: **Save World** on the **NL Subsystem** node, and set the variable from it
   before **Save Game to Slot**.
3. After **Load Game from Slot**: **Load World** with the variable. **Place** puts each NPC back
   where it was; untick it to leave them where the level has them.

Each NPC is found by its **Save Id**, which for an NPC placed in the level is its name. NPCs you
spawn get new names each run: set their brain's **Save Id** to something stable as you spawn them.
**Save State** and **Load State** on one brain do the same for one NPC.

```cpp
#include "NLSubsystem.h"

SaveGame->NPCs = UNLSubsystem::Get(this)->SaveWorld();           // FNLWorldSave NPCs; on your save game
UNLSubsystem::Get(this)->LoadWorld(Loaded->NPCs, /*bPlace=*/ true);
```

## Run a behaviour from a State Tree, or a State Tree from a behaviour

**From a State Tree.** In a State Tree for the **State Tree AI Component** schema, run by that
component on your own AI Controller (NL AI Controller has none), add the task
**Run NPC Behavior** to a state, with its **Behavior** (`BH_Patrol`). While the state is active the
brain does that behaviour whatever the scores say: its spot, steps, animation and needs. With
**End With Behavior** the state ends as the behaviour does. The **NPC Alert** condition tests
whether the NPC is suspicious or alarmed.

From Blueprint the same is **Pin Behavior** and **Unpin** on the brain.

**From a behaviour.** Add the step **Run State Tree** with a State Tree for the **State Tree
Component** schema: the behaviour waits on the tree, and the tree's success is the step's.

## Use Smart Objects as spots

When no NL Spot of a behaviour's kind is free, the brain looks for a Smart Object slot whose
**Activity Tags** hold the kind, within 100 m. In your Smart Object Definition, add `NPC.Spot.Sit`
to a bench slot's activity tags, put a **Smart Object** component with it on the bench, and
villagers sit there.

## Play it in multiplayer

Nothing to set up. The brains run on the server, and every client sees each NPC walk, pose, say
its lines, and its **?** and **!**. Call what changes an NPC (**Set Need**, **Remember About**,
**Load World**, **Set Time**) on the server: from a client, through an event of yours set to **Run
on Server**. **Npc.Debug** run on the server shares the scores; run it on a client too to see the
panel there.

To try it: under **Play**'s options set **Number of Players** to 2 and **Net Mode** to **Play As
Listen Server**, and play the demo town.

## Give the bubble and the panel your own look

Make a Widget Blueprint from **NL Bubble** or **NL Score Panel**, and set it as the brain's
**Bubble Class** or **Panel Class** (on the role's NPCs' Blueprint, or each brain).

- Left with an empty designer, it draws the plugin's own, and its **Refresh** event runs after
  each update: change a colour or add a line.
- With a designer tree of your own, yours is shown; fill it in **Refresh**, a few times a second,
  from **Brain** (**Get Current Label**, **Get Current Icon**, **Get Bark**, **Get Scores**).

Untick the brain's **Show Bubble** for none.

## Show what the player can use

An **NL Glint** is a small sparkle on whatever the player can talk to or use. The demo's
villagers each carry one, over the right shoulder.

1. In the Blueprint of the NPC or prop, click **Add** and search `NL Glint`.
2. Move it to where it should shine. Set **Range** to the distance your game lets the player use
   it from.

To turn glints off, untick the component's **Glint On** for one, or **Glints** in **Project
Settings > Plugins > NPC Life** for the whole game. In play, **Set Glints Shown** on the **NL
Subsystem** node turns them all on or off, for an options menu.

## Use it with heyheythere's other plugins

Each takes a node or two; neither plugin needs the other.

- **[Quest & Dialogue System](/docs/quest-dialogue/)**: a villager remembers you helped. In **On
  Quest State Changed** (on **Get Quest Component**), when **New State** is **Completed**, call
  **Remember About** with the quest giver, `NPC.Fact.Helped` and the player's pawn. A **Memory**
  consideration on `NPC.Fact.Helped` then raises what they'll do for you, and **Recall About** gives
  your dialogue a line for it. A quest giver keeping hours: before **Start Quest**, check their
  brain's **Get Planned Activity** is `NPC.Activity.Work`, or have them **Bark** "Come back in the
  morning".
- **[Farming & Fishing System](/docs/farming-fishing/)**: the town keeps the farm's hours. Make
  the farm the NPCs' clock: an object with the **NL Clock** interface whose **Get NL Hour** returns
  **Get Farm** then **Get Hour**, and **Get NL Day** its **Get Day** plus 1, passed to **Set Clock**.
  For a farmhand who waters a plot, give their work behaviour the steps **Go To Spot**, an
  **Event** `Water` and a **Wait**, as the [smithy](#react-in-blueprint-to-what-an-npc-does)'s, and
  in **On Step Event** call **Get Farm** then **Water** on the tile in front of them.
- **[Ability & Status System](/docs/ability-status/)**: enemies cast by score. Give the enemy the
  **NL Combatant** interface; in **NL Attack**, **Set Aim Target** with **Target** and **Try
  Activate** an ability, returning what it returns. **Get NL Health** returns **Get Attribute**
  Health over MaxHealth.
- **[Progression & Skill Tree](/docs/progression-skill-tree/)**: XP for a defeated bandit. Where
  your NPC goes down (**Is NL Defeated** turning true, or your health's death event), on the server,
  **Get Progression Component** with the player and **Add XP**.
- **[World Map, Minimap & Compass System](/docs/map-minimap-compass/)**: each NPC on the map. Add a
  **Marker** component to your NPC Blueprint with its icon and label; it follows them through their
  day.
