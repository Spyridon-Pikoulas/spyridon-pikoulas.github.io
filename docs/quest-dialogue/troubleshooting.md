---
layout: guide
title: "Troubleshooting · Quest & Dialogue System"
nav: Troubleshooting
order: 8
permalink: /docs/quest-dialogue/troubleshooting/
description: "Fixes for the usual problems with Quest & Dialogue System, from E doing nothing to loading and multiplayer, and answers to the usual questions."
---

# Troubleshooting

Each problem as you'd notice it, its usual causes, and the fix. Start a check with the Gameplay
Debugger (<kbd>'</kbd> in Play): its **Quests** category shows what the player's quests and tags
really are.

## E does nothing near an NPC

- **The NPC has no dialogue.** Its Speaker Component's **Dialogue** is empty.
- **A nearer Speaker has no dialogue.** The talk key goes to the nearest Speaker, with a Dialogue
  or not: set one, or remove the component.
- **You're too far.** The talk key reaches the nearest Speaker within **Talk Radius** (300 cm) of
  the pawn. Raise it in **Project Settings > Plugins > Quest & Dialogue**.
- **Your own input takes E first.** A mapping context of yours with a higher priority than the
  plugin's (1) and <kbd>E</kbd> mapped consumes the key. Raise **Input Context Priority**, or map
  the plugin's `IA_Talk` in your own context and clear **Input Context**.
- **The player isn't on Enhanced Input.** See the note in [Install](install.md#enable-it-in-your-project).
- **Talk Action is cleared** in the settings. Then only your own call to **Talk** or **Talk To
  Nearest** starts dialogue.

## The quest doesn't progress

Type `Quest.List` in the console (<kbd>&#96;</kbd>) and compare:

- **The tag differs.** The report's tag must be the objective's **Event Tag** or a tag under it:
  `Kill.Wolf` counts for `Kill`, not the other way round.
- **The quest isn't active**, or the objective is in a later stage. Reports only count towards
  active quests' current stage. A refused Start is logged at Verbose only (see
  [Debugging](reference.md#debugging)).
- **The trigger never fires.** Its box overlaps actors whose collision object type is **Pawn**,
  so the pawn's capsule must be one, with **Generate Overlap Events** on (both are, on the
  template characters). The pawn must be one a player controls.
- **The call is on a client with Accept Client Requests off.** Then only the server's calls
  count. Report on the server.
- **No Quest Component is found.** **Get Quest Component** with an AI or an actor that isn't the
  player's returns nothing. Pass the player's pawn, controller or PlayerState.

## The script doesn't import, or the asset doesn't change

- **The Message Log** (**Window > Message Log**, under **Asset Tools**) names the line of each
  mistake: an unknown label, quest, objective or tag, a label written twice, a voice path with no
  sound. A script with mistakes still imports; fix the line and reimport.
- **The tag doesn't exist yet.** Add it in **Project Settings > GameplayTags** before importing
  a script that uses it.
- **Changes to the file don't show.** Right-click the asset and pick **Reimport**.
- **A quest or tag was renamed since the import.** A dialogue asset keeps its last import's
  messages, so **Validate Assets** doesn't catch it. Change the name in the script, then
  reimport it.

## The cursor stays, or the game ignores input, after dialogue

The plugin switches to UI input while dialogue or the quest log is open and to Game Only input
after. If your game plays in Game And UI, for a cursor or a menu, set **Input Mode After Dialogue**
in the settings to **Game And UI**, or to **Previous** to get back whatever the player had. A game
that sets input modes itself can fight it: untick **Manage Input Mode**, and handle **On Dialogue
Started** and **On Dialogue Ended** on the Dialogue Subsystem yourself.

## No tracker on screen

- **Show Tracker** is off in the settings.
- **No quest is tracked.** A quest starting becomes tracked if its **Track on Start** is ticked
  or no quest is tracked. Otherwise call **Track Quest** on it while it is active, or pick it in
  the quest log.
- **Your HUD covers it.** The tracker sits at the top right; a full-screen widget of yours above
  it hides it.

## Loading doesn't bring quests back

- **It ran on a client.** **Load Save Data** works on the server only, and **Load Quests From
  Slot** returns false on a client.
- **The quest assets were renamed or moved** since the save. Quests are saved by path: once
  players have saves, keep their names and folders.

## Multiplayer

- **A change shows late on the client.** A client's change goes to the server and comes back with
  replication, a round trip later. Read the result in **On Quests Changed**, not right after the
  call.
- **Quests are lost on map travel.** A new PlayerState starts with an empty Quest Component. Save
  before the travel and load after, or, with seamless travel, carry them over in your
  PlayerState's **Copy Properties** event: **Get Save Data** from this one, **Load Save Data**
  into the new one.
- **A `do event` changes the world only for one player.** Dialogue runs on the player's machine;
  make the change through a server call of yours.

## The Gameplay Debugger or console key doesn't open

On keyboards other than US English, <kbd>'</kbd> and <kbd>&#96;</kbd> may be other keys. Set them
under **Project Settings > Engine > Gameplay Debugger > Activation Key** and **Project Settings >
Engine > Input > Console Keys**.

## FAQ

**Do I need C++?** No: every node is in Blueprint ([how-tos](how-to.md)).

**Can several quests run at once?** Yes, any number: the tracker shows one, the quest log all.

**Can a quest be failed, abandoned or repeated?** Yes ([fail](how-to.md#fail-a-quest),
[repeat](how-to.md#make-a-quest-repeatable)).

**Does it work in multiplayer?** Yes: the server owns each player's quests
([how](how-to.md#make-it-work-in-co-op)).

**Can I keep my own save system?** Yes ([how](how-to.md#save-quests-with-your-own-save-game)).

**Can I use my own dialogue box and quest log?** Yes ([how](how-to.md#give-the-ui-your-own-look)).

**Can the text be translated?** Yes ([how](how-to.md#translate-the-dialogue)).

**Is there a node graph for dialogue?** No: dialogue is written as [text scripts](script.md).

**Does a voice line get cut off?** No: a voiced line waits for its sound, unless the player skips
it.

## Still stuck

Ask in the listing's comments on Fab, or email
[spyridwn.pd@gmail.com](mailto:spyridwn.pd@gmail.com) with your engine version, what you did and
what the Output Log says.
