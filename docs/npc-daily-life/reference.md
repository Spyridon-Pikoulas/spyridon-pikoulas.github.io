---
layout: guide
title: "Reference · NPC Behavior & Daily Life System"
nav: Reference
order: 7
permalink: /docs/npc-daily-life/reference/
description: "Every setting, actor, component, data asset field, consideration, step, Blueprint node, event, gameplay tag and Npc console command of NPC Behavior & Daily Life System."
---

# Reference

Every setting, field, node and command of NPC Behavior & Daily Life System. The
[quickstart](quickstart.md) walks through a first NPC, [Concepts](concepts.md) explains the
words, and the [how-tos](how-to.md) answer the common tasks. Distances are in centimetres and
hours are game hours on the plugin's clock.

## Settings

**Project Settings > Plugins > NPC Life**.

| Setting | Default | What it does |
|---|---|---|
| Start Hour | 8 | The clock at the start of play, 0 to 24. |
| Minutes Per Second | 1 | Game minutes a real second: 1 is an hour a minute, 60 an hour a second, 0 a stopped clock. |
| Days Per Season | 28 | Days a season lasts, Spring first; 0 for no seasons. Day 1 is a Monday. |
| Player Faction | none | The faction of a player's pawn that carries none of its own. None is `NPC.Faction.Player`. |
| Attitudes | none | Rules of **A**, **B** and an **Attitude** (Friendly, Neutral or Hostile), each both ways, checked before the town's. |
| Town Attitudes | on | The plugin's factions' rules after yours: bandits hostile to villagers, guards, players and companions, who are friends to each other. |
| Near Distance | 4000 | A brain within this of a player thinks every **Near Interval**. |
| Far Distance | 12000 | Beyond this, every **Far Interval**; between the two, every **Mid Interval**. |
| Near Interval | 0.5 s | |
| Mid Interval | 1.5 s | |
| Far Interval | 4 s | |
| Think Budget | 1 ms | The most a frame spends thinking; the brains due past it wait for the next frame. |
| Glints | on | Every [NL Glint](#nl-glint) shown; off hides them all. |
| Glint Material | `M_NLGlint` | The glints' look: a material with **Color** and **Phase** parameters, drawn as a sprite. |

Two factions no rule pairs are neutral to each other; a faction is friendly to itself.

## NL Character

An actor: **Place Actors > NL Character**, or a Blueprint class made from it. A Character with
a brain, a mesh that poses, and the plugin's AI Controller.

| Component | What it is |
|---|---|
| Brain | An NL Brain: its mind ([below](#brain)). |
| Mesh | An NL Pose Mesh: your skeletal mesh and Anim Blueprint, posed by tag ([below](#nl-pose-mesh)). Empty until you set them. |

| Field | Default | What it is |
|---|---|---|
| Max Health | 100 | Its full health; shoves and Apply Damage take from it, and **Health** reads what's left. |
| Health Per Second | 1 | What comes back a second. |

At 0 health it is down: it stops, cowers, and no one fights it until it's back over half. It walks
at 170 cm/s and runs at the brain's **Run Speed**. It answers the [NL Combatant](#nl-combatant)
interface with its health and whether it's down; its **NL Attack** returns false, so it shoves.
**Get Pose Mesh** returns its mesh.

## NL AI Controller

The controller of an NL Character, and one to give your own pawn (**AI Controller Class**). Its AI
Perception:

| Sense | Value |
|---|---|
| Sight | 2500 cm, within 70° of ahead; lost past 3000 cm |
| Hearing | 2000 cm |

It tells hostile, neutral and friendly apart by the brains' factions, so an NPC sees and hears
everyone, and acts on the hostiles it sees and the noises of anyone but a friend.

## Brain

**NL Brain**, the Brain of an NL Character, or on any actor through **Add** (search
`NL Brain`). Its mind runs on the server.

| Field | Default | What it is |
|---|---|---|
| Display Name | the actor's label | Its name in the debugger and to the `Npc` commands. |
| Role | none | Its faction, needs, behaviours, day plan and anim set. |
| Behaviors | none | Beside the role's. |
| Needs | none | Beside the role's; one of the same name replaces the role's. |
| Faction | none | In place of the role's when set. |
| Schedule | none | In place of the role's day plan when not empty. |
| Anim Set | none | In place of the role's when set. |
| Save Id | the actor's name | Its key in a save. Set it on NPCs you spawn. |
| Momentum | 0.15 | Added to the current behaviour's score. |
| Arrive Radius | 40 | How close to a place counts as there. |
| Walk Speed | 0 | cm/s; 0 leaves the movement component's. The brain turns on the component's **Use Acceleration for Paths**, so an Anim Blueprint that walks only while accelerating, as the Third Person template's does, steps along paths instead of sliding. |
| Run Speed | 450 | cm/s, for steps that run. |
| Hand Socket | `hand_r` | The mesh socket a behaviour's **Held Prop** goes on. |
| Show Bubble | on | What it's doing and saying, over its head. |
| Bubble Class | the plugin's | A Widget Blueprint made from [NL Bubble](#widgets). |
| Panel Class | the plugin's | A Widget Blueprint made from [NL Score Panel](#widgets). |
| Head Height | 110 | Over the actor's origin: where the bubble and the panel sit. A pose that lays the body down, such as Sleep, carries them over its head. |
| Panel Pivot | -0.22, 0.6 | Where the score panel sits on the head's point, as a share of its size. |
| Alarm Time | 1.5 s | Seeing a hostile close by this long fills its suspicion (alarmed at 0.8 of it); at the edge of sight, about three times as long. |
| Calming | 0.08 | Suspicion lost a second once nothing is sensed. |
| Target Memory | 8 s | How long a target out of sight is still chased. |
| Leader | none | A companion's leader, for **Follow** and the **Leader Distance** consideration. |
| Command | none | `NPC.Command.Follow` or `NPC.Command.Wait`, for the **Command** consideration. |

### Brain events

| Event | Outputs | When |
|---|---|---|
| On Behavior Changed | Brain, Old, New | it switches behaviour (server, and clients as it replicates). |
| On Step Event | Brain, Event | an [Event step](#steps) runs. |
| On Anim Tag Changed | Brain, Tag | its animation tag changes, on the server and every client. |
| On Alert Changed | Brain, Alert | it turns Calm, Suspicious or Alarmed. |
| On Barked | Brain, Words | it says something. |

### Brain nodes

| Node | What it does |
|---|---|
| Think | Scores every behaviour now and switches to the best. |
| Request Think | Thinks on the next frame rather than when due. |
| Warp | Thinks, then stands at the chosen behaviour's spot at once, in its pose. |
| Pin Behavior (Behavior), Unpin | Runs a behaviour whatever the scores say, till it ends or **Unpin**. |
| Is Pin Done | The pinned behaviour has ended (or none is pinned), and whether its steps all succeeded. |
| Get Scores | The last think's scores, best first, each with its terms. On a client, only while the score panel is open on the server. |
| Get Current Behavior, Get Current Label, Get Current Icon | What it's doing; the label is `Idle` for nothing. |
| Get Current Step Text | What the current step says it's doing (server). |
| Is Doing | Doing the behaviour, rather than on the way to it. |
| Get All Behaviors | Every behaviour it chooses among: the role's, then its own. |
| Get Need (Need), Set Need (Need, Value), Get Need Label | A need's level, 0 to 1; -1 when it has no such need. |
| Remember (Fact, Subject, Strength, Half Life) | Remembers a fact, or strengthens it to **Strength**. Half Life 0 never fades. Past 64 facts the faintest goes. |
| Recall (Fact, Subject), Recall Any (Fact) | How strongly it remembers a fact about a subject, or about anyone; 0 if not. |
| Forget (Fact, Subject) | Forgets it; no subject forgets it about everyone. |
| Get Facts | Everything it remembers. |
| Get Suspicion, Get Alert | 0 to 1, and Calm, Suspicious or Alarmed from it. |
| Get Target, Can See Target, Get Last Sensed Location | The hostile it's after or afraid of, and where it last saw or heard something. |
| Alarm (Against, Where) | Alarms it against an actor: your own game's alarm bell. |
| Hear (Instigator, Where, Loudness) | A noise for this brain only. |
| Get Faction | Its faction, its own or its role's. |
| Get Planned Activity, Get Plan Block | What its day plan names now, and the block. |
| Set Anim Tag (Tag), Get Anim Tag | Plays a tag (none stops). Behaviours and steps set it themselves. |
| Get Body Offset | Where the body is drawn from where it stands, while at a spot with a **Body Offset**. |
| Bark (Words, Seconds), Get Bark | Says words over its head, seen on every client. |
| Show Score Panel (Show) | The `Npc.Debug` panel over it. |
| Get Name String | Its display name. |
| Describe Score (Score) | `Hungry 0.72 × Hours 1.00 × Weight 1.20 + 0.15` |
| Get Save Id, Save State, Load State (State, Place) | One NPC's [save](#save). |
| Move To (Where, Run), Stop Moving, Has Reached (Where, Radius), Is Moving | For steps of your own: walks on the navmesh, straight there without one, or is put there without an AI Controller. |
| Face To (Facing), Face Toward (Where) | Turns it while it stands. |
| Get Spot, Get Home | The current behaviour's spot; and what it guards, its last spot or where it began. |
| Set Doing (Now, Offset) | Marks it as doing the behaviour: needs fill and the panel says so. |

## NL Spot

An actor: **Place Actors > NL Spot**. The NPC stands on it facing its arrow.

| Field | Default | What it is |
|---|---|---|
| Kind | none | The behaviours' **Spot** it serves: `NPC.Spot.Work` and so on. |
| Capacity | 1 | How many use it at once. |
| Spread | 0 | With room for more than one, its users stand on a ring of this radius round it, facing in. |
| Anim Tag | none | Played while an NPC uses it, over the behaviour's own. |
| Body Offset | 0 | Where the body is drawn while it's used, from the spot: X ahead, Y right. With one set, the NPC is put exactly on the spot as it starts, so the body lies where you placed it. |
| Only For | none | A role it's kept for. |
| Route, Order | none, 0 | A patrol point's route and its place on it. |

**Has Room For (User)** and **Get Stand Transform (User)** answer for a step of your own. **Users**
lists who has it.

## NL Pose Mesh

The NL Character's mesh: a skeletal mesh that bends its bones to the NPC's animation tag, over
whatever its Anim Blueprint plays, on a skeleton with the UE5 mannequin's bone names.

| Field | Default | What it is |
|---|---|---|
| Poses | none: the plugin's | An [NL Pose Set](#nl-pose-set) of your own. |
| Over Montages | off | Poses over a playing montage too; off, a montage takes over. |
| Blend Time | 0.35 s | Into and out of a pose. |
| Walking Speed | 40 | cm/s over which the NPC counts as walking, and a pose not kept **While Moving** fades. |

**Set Pose Tag (Tag)** poses a tag whatever the brain plays (none goes back to the brain's).
**Get Posed Tag** gives the tag being posed and how far. **Snap Poses** takes the next moment's poses
whole, without Blend Time, so an NPC you teleport lands in its pose; the brain's **Warp** does it.

The plugin's poses: Block, Cower, Eat, Guard, Look, Sell, Shove, Sit, Sleep, Sow, Talk, Water,
Wave and Work, each `NPC.Anim.<name>`.

## NL Glint

A component (**Add**, search `NL Glint`): a small twinkling sparkle on what the player can talk to
or use. It shows while the player's view is within **Range**, on each player's own screen; a
dedicated server draws none. Place it where it should shine, such as over a shoulder.

| Field | Default | What it is |
|---|---|---|
| Glint On | on | This one shown. |
| Range | 1200 | How near the player's view comes before it shows. |
| Size | 16 | Its width and height. |
| Color | pale gold | Its colour. |

**Set Glint On (On)** turns this one on or off; **Is Glint Shown** says whether it shows now. For
every glint at once, **Set Glints Shown** on the **NL Subsystem** node, `Npc.Glints`, or the
**Glints** setting.

## NL Behavior

A data asset (**Add > Miscellaneous > Data Asset > NL Behavior**), or a Blueprint class made from
it whose **On Started** and **On Ended** events add to it.

| Field | Default | What it is |
|---|---|---|
| Label | | Its name on the bubble and the panel. |
| Icon | none | Its picture on the bubble. |
| Activity | none | What a day plan calls it, for the **Day Plan** consideration. |
| Priority | Normal | Idle, Normal, Urgent or Combat. The best score wins whatever it is; only a higher one takes over from a behaviour that isn't Interruptible. |
| Interruptible | on | Off, it runs its steps to the end once chosen unless a higher priority wins. |
| Weight | 1 | Multiplies the considerations. |
| Considerations | none | [Below](#considerations). With none it scores its **Weight** all the time. |
| Spot | none | The kind of spot it's done at; none, where the NPC is. |
| Any Spot | off | Any free spot of the kind rather than the nearest, as Wander does. |
| Anim Tag | none | Played while at the spot, unless the spot has its own. |
| Restores | none | Each need it fills, by how much a game hour, while doing it at its spot. |
| Steps | none | [Below](#steps), run in order. With none, Go To Spot then Use Spot. |
| Loop | on | Starts the steps over when they're done; off, it ends and the brain chooses again. |
| Cooldown | 0 s | Before it can be chosen again after it ends. |
| Held Prop, Held Transform | none | A mesh carried on the brain's **Hand Socket** while doing it. |

### The plugin's behaviours

In **Plugins > NPCLife Content > Behaviors**.

| Behaviour | Scored by | Does |
|---|---|---|
| **Work** (`BH_Work`) | the day plan, rested, fed, the spot's distance | works at a work spot |
| **Eat** (`BH_Eat`) | hunger, 07:00 to 21:00, weight 1.2 | eats at an eat spot; Food +1.5 an hour |
| **Sleep** (`BH_Sleep`) | 22:00 to 06:00, tiredness, weight 1.1 | lies down at a sleep spot; Energy fills |
| **Chat** (`BH_Socialise`) | 17:00 to 21:00, loneliness, weight 0.9 | talks at a talk spot; Social fills |
| **Sit down** (`BH_Sit`) | Leisure in the day plan (0.3 off it), tiredness, weight 0.6 | sits at a sit spot; Energy fills a little |
| **Wander** (`BH_Wander`) | always 0.12 (Idle) | strolls to any wander spot |
| **Take cover** (`BH_TakeCover`) | alarm, a foe within 30 m (Urgent) | runs to a cover spot away from the foe and cowers |
| **Call for help** (`BH_CallForHelp`) | a foe in sight within 25 m (Combat, weight 1.5, not interruptible, 30 s cooldown) | calls friends within 30 m |
| **Patrol** (`BH_Patrol`) | Patrol in the day plan (0.2 off it), weight 0.5 | walks its route's patrol points |
| **Investigate** (`BH_Investigate`) | suspicion from 0.3 to 0.8 (Urgent) | asks who's there and goes to look |
| **Chase** (`BH_Chase`) | a foe within 30 m, its own health (Combat) | runs at the foe and shoves |
| **Flee** (`BH_Flee`) | a foe within 30 m, hurt, weight 1.3 (Combat) | yields and runs 18 m away |
| **Follow** (`BH_Follow`) | its leader's distance, the Follow command or none, weight 0.8 | keeps within 3 m of its leader |
| **Wait here** (`BH_Wait`) | the Wait command, weight 1.2 | stays put, looking round |
| **Help out** (`BH_Assist`) | a foe within 20 m, its own health (Combat) | chases and shoves it |
| **Bar the way** (`BH_Block`) | a foe within 15 m, hurt, weight 1.1 (Combat) | stands between the foe and its leader, arms out |

Open one for its exact considerations; each one's terms are on the score panel.

## NL Role

A data asset (**Data Asset > NL Role**).

| Field | What it is |
|---|---|
| Label | Its name on the panel. |
| Faction | An `NPC.Faction` tag. |
| Needs | Each with a **Name**, a **Label**, a starting **Value** (0 to 1, default 1) and **Per Hour** (default 0.05), what it falls a game hour. |
| Behaviors | What its NPCs choose among. |
| Schedule | The day plan: blocks of **From**, **To** (wrapping past midnight), **Activity**, and **Days** and **Seasons** (any when empty). The first block that holds wins. |
| Anim Set | The animations its tags play. |

The plugin's roles, in **NPCLife Content > Roles**: `R_Villager`, `R_Guard`, `R_Bandit` and
`R_Companion` ([Concepts](concepts.md#roles-and-day-plans)). The villager's needs:

| Need | Starts at | Falls an hour |
|---|---|---|
| Food | 0.8 | 0.05 |
| Energy | 0.85 | 0.04 |
| Social | 0.55 | 0.04 |

## NL Anim Set

A data asset (**Data Asset > NL Anim Set**): your animations by tag. The plugin ships none.

| Field | Default | What it is |
|---|---|---|
| Slot | `DefaultSlot` | The Anim Blueprint slot a **Sequence** plays in. |
| Entries | none | Each a **Tag**, a **Montage** or a **Sequence**, **Loop** (on: played until the tag changes; off, once) and **Play Rate** (1). |

A tag finds its own entry or its nearest parent's.

## NL Pose Set

A data asset (**Data Asset > NL Pose Set**): poses of your own for an NL Pose Mesh, made
of bone turns rather than animations. Each pose is a **Tag**, **Bones** (each a **Bone** name, a
**Turn** and a **Swing** in degrees in the character's upright frame, the swing's **Phase**, and
**From Rest**, which turns the bone from the skeleton's rest pose rather than from what the Anim
Blueprint plays, as Sleep lays the legs straight), **Rate** (swings a second), **Body Turn** and
**Body Shift** (the whole body, as for lying in bed) and **While Moving** (kept while walking). A
tag finds its own pose or its nearest parent's.

## Considerations

Added to a behaviour's **Considerations**. Each reads one input from 0 to 1 and shapes it; the
score is the behaviour's **Weight** times all of them.

Every consideration has:

| Field | Default | What it is |
|---|---|---|
| Label | a word for what it reads | Its name on the score panel: Base, Hours, Plan, Near, Day, Foe near, Told, Tags, Alarmed or Wary, Health or Hurt, Leader away or By leader; a Need's is the need's label, a Memory's its fact's last part. |
| Invert | off | 1 minus the input: hunger from Food, tiredness from Energy. |
| Exponent | 1 | The input raised to it, 0.1 to 8. |
| Floor | 0 | The least it gives: Floor + (1 − Floor) × input<sup>Exponent</sup>. |
| Curve | none | Over input 0 to 1, in place of Exponent and Floor when it has keys. |

| Consideration | Fields | Input |
|---|---|---|
| Constant | Value 1 | Value. |
| Hours | From 8, To 17, Ramp 1 | 1 from **From** to **To** on the clock (past midnight when To is less; all day when equal), falling to 0 over **Ramp** hours either side. |
| Day Plan | Off Plan 0 | 1 while the day plan names the behaviour's **Activity**, **Off Plan** otherwise. |
| Need | Need | The need's level. Invert it for the lack. |
| Spot Distance | Range 4000 | 1 at the behaviour's spot, 0 at **Range**; 1 for a behaviour with no Spot. |
| Day | Days | 1 on a day whose weekday or season tags match any of **Days**. |
| Memory | Fact, Subject, About Target | How strongly it remembers **Fact** about **Subject** (anyone when none), or about its target. |
| Alert | From 0.8, To 1 | 1 while suspicion is from **From** to **To**. |
| Target | Range 3000, Must See | 1 with a target at hand, 0 at **Range** or with none. |
| Health | | Its [NL Combatant](#nl-combatant) health; 1 without. Invert for hurt. |
| Leader Distance | Range 800 | The leader's distance as a share of **Range**; 0 with no leader. |
| Command | Command, Or No Command | 1 while its **Command** matches; none matches no command. With **Or No Command**, no command matches too. |
| Owner Tags | Tags | 1 while the actor has any of the tags (its Gameplay Tag Asset Interface, or an Ability System's tags through it). |

A Blueprint class made from **NL Consideration** overriding **Get Input (Context)** is one more:
**Context** holds the **Brain**, the **Behavior**, **Has Spot** and **Spot Distance**.

## Steps

Added to a behaviour's **Steps** and run in order on the server. A step that fails ends the
behaviour.

| Step | Fields | What it does |
|---|---|---|
| Go To Spot | Run, Give Up 60 s | Walks to the behaviour's spot and faces along it; fails if it can't reach it in **Give Up**. |
| Use Spot | Anim Tag, Game Minutes 0 | Does the behaviour there: plays the spot's tag (or its own, or the behaviour's) and fills the behaviour's **Restores**, for **Game Minutes** (0: until the brain chooses something else). |
| Wait | Seconds 3, Random 0, Anim Tag | Waits, plus up to **Random** more. |
| Bark | Lines, Seconds 3, Wait | Says one of the lines over its head; goes on at once unless **Wait**. |
| Event | Event | Fires the brain's **On Step Event** with the name, and goes on. |
| Remember | Fact, About Target (on), Subject, Strength 1, Half Life 24 | Remembers a fact about its target or **Subject**. |
| Patrol | Spot, Route, Wait At Point 3 s, Wait Anim | Walks the route's points of kind **Spot** in **Order** (the nearest point's route when none), waiting at each, until something else wins. |
| Investigate | Look 4 s | Goes where it last saw or heard something and looks round. |
| Chase | Reach 140 | Runs at the target till within **Reach**; fails once it's lost. |
| Attack | Reach 180, Damage 15, Push 450, Recover 1 s | One attack: the actor's [NL Attack](#nl-combatant), or a shove (Apply Damage and a push back), then a pause. |
| Flee | Distance 1800 | Runs from the target till that far, to a navigable point. |
| Take Cover | Spot | Runs to the nearest free cover spot farther from the target than from itself. |
| Call For Help | Radius 3000, Lines, Seconds 1.5 | Alarms the friends within **Radius** against its target; waves and says a line. |
| Block | Distance 250, Seconds 4 | Stands between the target and what it guards, arms out. |
| Follow | Distance 300, Run Distance 800 | Keeps within **Distance** of its leader, running past **Run Distance**. |
| Run State Tree | State Tree | Runs a State Tree (State Tree Component schema) and ends as it does. |

A Blueprint class made from **NL Step** overrides **Start (Brain)** and **Update (Brain, Delta
Seconds)**, each returning **Running**, **Succeeded** or **Failed**, **Stop (Brain, Interrupted)**
and **Describe**. Each NPC doing a behaviour has its own copy of its steps.

## State Tree

In the **NPCLifeStateTree** module, enabled with the plugin.

| Node | Fields | What it does |
|---|---|---|
| Run NPC Behavior (a task) | Actor, Behavior, End With Behavior | Pins the behaviour on the actor's brain while the state is active. With **End With Behavior** the state ends as the behaviour does, succeeded or failed. |
| NPC Alert (a condition) | At Least (Alarmed), Invert | The actor's brain is at least that alert. |

## NL Subsystem

The world's NPC life: the clock, the brains and the spots. In Blueprint, the **NL Subsystem** node.

| Node | What it does |
|---|---|
| Get Hour, Get Day, Get Day Tags, Get Clock Text | The hour 0 to 24, the day from 1, its weekday and season tags, and `08:00`. |
| Set Time (Hour, Day) | Sets the clock (server); day 0 keeps the day. Every brain thinks again. |
| Set Speed (Minutes Per Second), Get Speed | The clock's pace; 0 stops it. |
| Set Clock (Clock) | An object with the [NL Clock](#nl-clock) interface as the clock; none for the plugin's own. While yours runs, **Set Time** does nothing, **On New Day** doesn't fire and **Load World** leaves the hour to you. |
| On New Day | An event at each midnight, with the new day. |
| Get Brains, Find Brain (Name) | Every brain; one by display name, save id or actor name. |
| Warp All | Every NPC at the spot of what it would do now. |
| Get Think Stats | How many brains thought last frame and in how many ms. |
| Get Spots | Every NL Spot. |
| Set Glints Shown (Shown), Are Glints Shown | Every [NL Glint](#nl-glint) in the game shown or hidden; the **Glints** setting is where it starts. |
| Save World, Load World (Save, Place) | The clock and every NPC ([save](#save)). |

## Library

Nodes for any actor, under **NPC Life**.

| Node | What it does |
|---|---|
| Get Brain (Actor) | Its brain, or its pawn's when given a controller. |
| Get Subject Id (Actor) | How memories name it: an NPC's save id, `Player` and its number for a player's pawn, or the actor's name. |
| Remember About (NPC, Fact, About, Strength, Half Life) | The NPC remembers a fact about an actor. |
| Recall About (NPC, Fact, About) | How strongly, 0 to 1. |
| Get Faction (Actor) | Its brain's faction, an `NPC.Faction` tag among its **Tags**, or for a player's pawn the **Player Faction** setting. |
| Get Attitude (A, B) | Friendly, Neutral or Hostile, by their factions and the settings. |
| Get Health (Actor), Is Defeated (Actor) | By [NL Combatant](#nl-combatant); 1 and false without it. |
| Make NPC Noise (Location, Loudness 1, Instigator, Range 2000) | A noise the NPCs within **Range** hear: footsteps, a gunshot, a dropped crate. A noise makes NPCs suspicious, never alarmed; louder is more so. |
| Get Tag Leaf (Tag) | `Alarm` from `NPC.Fact.Alarm`. |

## Interfaces

### NL Clock

For your game's time of day, passed to **Set Clock**.

| Function | Returns |
|---|---|
| Get NL Hour | The hour, 0 to 24. |
| Get NL Day | The day, from 1. |
| Get NL Day Tags | Its weekday and season tags, or your own for the **Day** consideration and the day plan's **Days**. |

### NL Combatant

For your game's combat, on an NPC or the player's pawn.

| Function | Returns |
|---|---|
| Get NL Health | 0 (down) to 1 (unhurt). |
| NL Attack (Target) | True if it attacked; false leaves it to the shove. |
| Is NL Defeated | True once out of the fight. |

## Save

| Struct | Fields |
|---|---|
| NL World Save | Hour, Day, Brains |
| NL Brain Save | Id, Needs, Facts, Command, Transform |
| NL Fact | Fact, Subject, Strength (0 to 1; forgotten under 0.05), Half Life (game hours; 0 never fades) |

**Load World** and **Load State** put back needs, memory and command, and with **Place** where
each NPC stood; they return false on a client.

## Widgets

| Class | What it is |
|---|---|
| NL Brain Widget | The base of both: **Set Brain**, **Brain**, and the **Refresh** event a few times a second. |
| NL Bubble | Over an NPC: its behaviour's icon and label, what it says, and **?** or **!** as it grows wary. |
| NL Score Panel | The `Npc.Debug` panel: the clock, needs, day plan, senses and memory, and every behaviour's score with its terms. |

A Widget Blueprint made from either with an empty designer draws the plugin's own; with a designer
tree of its own, it shows that and fills it in **Refresh**.

## Gameplay tags

The plugin's, beside your own in **Project Settings > Gameplay Tags**.

| Tags | Used by |
|---|---|
| `NPC.Spot.` Work, Sit, Sleep, Talk, Eat, Wander, Patrol, Post, Cover | Spots' **Kind** and behaviours' **Spot**. |
| `NPC.Activity.` Sleep, Work, Eat, Socialise, Leisure, Patrol | Behaviours' **Activity** and day plan blocks. |
| `NPC.Faction.` Villager, Guard, Bandit, Player, Companion | Roles, brains and actor **Tags**. |
| `NPC.Fact.` Seen, Heard, Hurt, Helped, Alarm | Memory. |
| `NPC.Command.` Follow, Wait | A companion's **Command**. |
| `NPC.Day.` Monday to Sunday, `NPC.Season.` Spring to Winter | The **Day** consideration and day plan blocks. |

### Animation tags

`NPC.Anim.` Work, Water, Sow, Sell, Eat, Talk, Sit, Sleep, Look, Guard, Wave, Shove, Block and
Cower: each has a pose on the NL Pose Mesh, and an [anim set](#nl-anim-set) entry plays
your animation instead.

| Tag | Set by |
|---|---|
| Work, Eat, Sit, Sleep | the behaviours of the same name, at their spots |
| Talk | Chat, at its spot |
| Look | wandering, waiting, investigating, and at patrol points |
| Wave | calling for help |
| Shove | attacking |
| Block | barring the way |
| Cower | taking cover, and an NPC that's down |
| Water, Sow, Sell | the demo's farmer, farmhand and baker |
| Guard | none: for a guard post's spot of yours |

The brain remembers by itself:

| Fact | About | Half life |
|---|---|---|
| `NPC.Fact.Seen` | a hostile it saw | 24 h |
| `NPC.Fact.Heard` | who made a noise it heard | 6 h |
| `NPC.Fact.Alarm` | whom it was alarmed against: a friend's call for help or its own, being hurt, or **Alarm** | 1 h |
| `NPC.Fact.Hurt` | who hurt it | 48 h |

## Console commands

Typed in the console (<kbd>&#96;</kbd>) while playing. An NPC's name is its display name, save id
or actor name, in any case.

| Command | What it does |
|---|---|
| `Npc.Time <hour> [day]` | Sets the clock (`9.5` for 09:30); every NPC thinks again. |
| `Npc.Speed <minutes>` | Game minutes a real second; 0 stops the clock. |
| `Npc.Warp` | Every NPC at the spot of what it would do now. |
| `Npc.Debug <name>` \| `all` \| `off` | The score panel over an NPC, every NPC, or none. |
| `Npc.Need <name> <need> <0-1>` | Sets a need. |
| `Npc.Fact <name> <fact> [subject] [strength]` | The NPC remembers a fact: a tag, or `Seen` for `NPC.Fact.Seen`. |
| `Npc.Why [name]` | Each NPC's choice at its last think, its best 8 scores and their terms, in the Output Log. |
| `Npc.Score <name> <behaviour>` | One behaviour's score, term by term, from a think it runs then, which may switch the NPC. |
| `Npc.Spots` | Every spot, its kind and who has it, and how many brains thought last frame in how long. |
| `Npc.Noise [loudness] [x y z]` | A noise NPCs hear, at the camera unless placed; friends hear it too. |
| `Npc.Glints 0` \| `1` | Every glint hidden or shown. |

A wrong name or tag answers with the ones there are.

## Gameplay Debugger

Press <kbd>'</kbd> (apostrophe) while playing, looking at an NPC; the **NPCLife** category shows
its name and role, the clock, what it's doing and its step, its day plan, needs, senses and target,
memory, and its scores.

## Data validation

On saving a behaviour, role or anim set (or **Validate Assets**), the editor reports:

| Message | Meaning |
|---|---|
| consideration *n* is empty, step *n* is empty | An empty slot in the list. |
| no considerations, so it scores its Weight at every moment | It always competes at its weight. Right for Wander; add a consideration otherwise. |
| a Weight of 0 is never chosen | |
| a Floor of 1 makes it no factor at all | |
| it restores needs, which fill only during a Use Spot step, and has none | Add a **Use Spot** step, or clear the steps for the default two. |
| Go To Spot does nothing in a behaviour with no Spot | Set the behaviour's **Spot**. |
| a behaviour slot is empty, a day plan block names no activity, every need wants a name of its own | In a role. |
| *tag* plays nothing | An anim set entry with no montage or sequence. |
| every entry wants a tag of its own | An anim set entry with no tag, or one another entry has. |
