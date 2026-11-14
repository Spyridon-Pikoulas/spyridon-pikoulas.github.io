---
layout: guide
title: "Troubleshooting · NPC Behavior & Daily Life System"
nav: Troubleshooting
order: 8
permalink: /docs/npc-daily-life/troubleshooting/
description: "Fixes for NPC Behavior & Daily Life System: NPCs that stand still, slide, T-pose or walk through walls, No free spot, animations that don't play, NPCs that ignore the player, your own pawn or project, multiplayer and save."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start with the NPC's score panel:
in Play, open the console (<kbd>&#96;</kbd>) and type `Npc.Debug` and its name. It shows what the
NPC is doing, what it could do and why each scores what it does. `Npc.Why` prints the same in the
Output Log, and the Gameplay Debugger's **NPCLife** category (<kbd>'</kbd>) shows its senses and
memory too.

## The plugin isn't in the Plugins window

Search for `NPC Behavior`: it is listed as **NPC Behavior & Daily Life System**. If it still isn't
there, it isn't installed to this engine version: it supports 5.6, 5.7 and 5.8
([Install](install.md)).

## The NPC isn't there, or stands in a T-pose

- **No mesh.** A new NL Character's **Mesh** is empty, so there's only a capsule to see in the
  editor and nothing in Play. Set its **Skeletal Mesh Asset** ([Quickstart](quickstart.md#1-place-a-villager)).
- **No Anim Blueprint.** Without one the mesh stands in its bind pose, arms out. Set **Animation
  Mode** to **Use Animation Blueprint** and **Anim Class** to your character's.

## The NPC stands still

Open its score panel.

- **No choices listed.** The brain has no **Role** and no **Behaviors**. Set a role.
- **Everything scores 0**, and the terms say why:
    - **No free Eat spot** (or Sleep, Work...): there is no NL Spot of the behaviour's kind in the level, or all are taken
      (see [below](#no-free-spot)).
    - **Plan 0**: the day plan names something else now, and no behaviour of that activity can run.
    - **Hours 0**: outside the behaviour's hours.
- **The panel shows a choice, but it doesn't move.** See the next problem.
- **No panel at all, and `Npc.Debug` says there's no NPC called that.** The brain isn't in the
  world being played: is the actor in a sublevel or World Partition cell that's loaded? The
  command's answer lists the NPCs there are.
- **The clock is stopped.** `Npc.Speed 0`, a **Set Speed** of 0, or **Minutes Per Second** 0 in
  the settings. Nothing changes with the hour then.

## The NPC chooses a behaviour but doesn't walk there

- **No navmesh.** NPCs walk on the navmesh, so the level needs a **Nav Mesh Bounds Volume** over
  where they walk. Press <kbd>P</kbd> in the viewport: the floor they cross should be green.
  Without a navmesh an NPC walks straight at its spot, into walls.
- **The spot is off the navmesh**: on a table, in a wall, or past a gap. Move it onto the green.
  After 60 seconds of trying (**Give Up** on **Go To Spot**), the NPC gives up and chooses again.
- **Your own pawn has no AI Controller.** Set its **AI Controller Class** to **NL AI Controller**
  (or yours) and **Auto Possess AI** to **Placed in World or Spawned**. Without one, the brain
  puts the actor at its spots instead of walking it.

## The NPC slides instead of walking

Its Anim Blueprint doesn't read the character's speed: set **Anim Class** to the one your player
uses, such as the template's `ABP_Unarmed`. A pose shows over it, but walking is your Anim
Blueprint's.

## No free spot

The behaviour needs a spot and none of its kind is free for this NPC.

- **The kinds don't match.** The spot's **Kind** must be the behaviour's **Spot** tag exactly:
  `NPC.Spot.Eat` for Eat. `Npc.Spots` lists every spot, its kind and who has it.
- **All taken.** Each spot holds **Capacity** NPCs. Place more spots, or raise **Capacity** with a
  **Spread** to stand them in a ring.
- **Kept for another role.** The spot's **Only For** names a role this NPC hasn't.

## The NPC doesn't bend to work, sit or lie down

- **Its skeleton's bones aren't named as the UE5 mannequin's** (`spine_01`, `thigh_l` and so on),
  so the plugin's poses find nothing to bend. Bind your own animations by tag
  ([how-to](how-to.md#use-your-own-character-and-animations)).
- **A montage is playing** from your anim set or your Anim Blueprint: montages take over from the
  poses. Tick **Over Montages** on the mesh to pose over them.
- **It's still on its way.** The pose plays once it's at the spot: the bubble says the behaviour,
  and the panel's step says what it's doing.

## My animation doesn't play

- **A Sequence needs a slot.** An anim set entry with a **Sequence** plays in the anim set's
  **Slot** (`DefaultSlot`). Your Anim Blueprint's graph needs a **Slot** node of that name before
  the output pose.
- **A Montage plays in its own slot**, which your Anim Blueprint needs in its graph too.
- **The tag doesn't match.** The entry's **Tag** must be the one set, or a parent of it: the
  [table](reference.md#animation-tags) says which behaviour sets which. A spot's **Anim Tag** wins
  over the behaviour's.
- **The anim set isn't used.** Set it on the role, or the brain's **Anim Set** to override.
- **On saving it says "plays nothing".** An entry has neither a montage nor a sequence.

## NPCs ignore the player

By default the player's pawn is `NPC.Faction.Player`, which only bandits are hostile to: villagers
and guards are friendly, and see nothing to react to.

- To make guards hostile to the player, add an attitude rule in **Project Settings > Plugins > NPC
  Life**: **A** `NPC.Faction.Guard`, **B** `NPC.Faction.Player`, **Hostile**.
- Footsteps and noises are heard only when your game makes them: call **Make NPC Noise**, or
  `Npc.Noise` to try it. A noise makes NPCs suspicious; seeing a hostile alarms them.
- Sight reaches 25 m ahead, within 70° either side, and walls hide you.

## Villagers flicker between two behaviours

Two scores so close that **Momentum** (0.15) doesn't hold one. Raise the brain's **Momentum**, or
give one behaviour a higher **Weight**. A **Cooldown** on a behaviour keeps it from coming straight
back.

## The NPC doesn't eat or sleep when I jump the clock

`Npc.Time` and **Set Time** jump without the hours between, so needs don't fall on the way: an NPC
fed at 08:00 is as fed at a jumped-to noon, and Eat may lose to anything else she could do. Set the need (`Npc.Need Ada Food 0.3`), or run the
clock fast (`Npc.Speed 30`) to see needs fall.

## It works in the template but not in my project

- **Your project's level has no navmesh** ([above](#the-npc-chooses-a-behaviour-but-doesnt-walk-there)).
- **Your NPCs are your own pawns.** Each needs a **Brain** component and an AI Controller; see [your
  own character](how-to.md#use-your-own-character-and-animations).
- **Your game mode spawns NPCs.** Spawn them as you would any pawn; the brain starts with them.
  Give each a **Save Id** if you save.
- **Lyra or another framework.** The plugin needs nothing of your game mode, player or HUD: an NL Character placed in a level lives there whatever the game. Pawns of the framework's own need the
  Brain and an AI Controller as above.

## Blueprint or C++?

Everything is in Blueprint: every field, node, event, step and consideration, and a Blueprint
child of a step or a consideration to add your own. C++ is there too, with the same names; you
never need it.

## Multiplayer: a client's call changes nothing

Brains run on the server. **Set Need**, **Remember About**, **Set Time**, **Load World** and the
`Npc` commands act on the server; call them from server code, or from a client through an event set
to **Run on Server**. `Npc.Debug` on the server shares the scores; run it on a client too to see the
panel there.

## NPCs aren't put back after loading

- **The NPC has a new name each run.** Spawned NPCs get new actor names, so **Load World** finds no
  NPC by the saved id. Set each one's **Save Id** to something stable as you spawn it.
- **Load World ran on a client.** It returns false there; run it on the server.
- **The save didn't hold it.** The **NL World Save** variable must be on your Save Game object and
  set before **Save Game to Slot**.

## Questions

- **How many NPCs can I have?** Brains think within a budget of 1 ms a frame, and far ones less
  often, so more NPCs think less often rather than slow the frame. `Npc.Spots` prints how many thought last frame and in how long; the
  [settings](reference.md#settings) tune it.
- **Do I need Behavior Trees, State Trees or Smart Objects?** No. They can run behaviours, and
  behaviours can run State Trees ([how-to](how-to.md#run-a-behaviour-from-a-state-tree-or-a-state-tree-from-a-behaviour)),
  but nothing needs them.
- **Does it come with animations?** No: the plugin's poses move the UE5 mannequin's skeleton, and
  your animations replace them by tag.

Questions and bug reports are welcome in the listing's comments on Fab, or by email to
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com).
