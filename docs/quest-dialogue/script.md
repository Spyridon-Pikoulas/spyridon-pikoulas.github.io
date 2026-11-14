---
layout: guide
title: "Dialogue scripts · Quest & Dialogue System"
nav: Dialogue scripts
order: 6
permalink: /docs/quest-dialogue/script-format/
description: "The .qds dialogue script format of Quest & Dialogue System: speakers, lines, choices, labels, conditions and actions."
---

# Dialogue scripts

A conversation is a `.qds` text file. Drag it into the Content Browser and it becomes a dialogue
asset; right-click the asset and pick **Reimport** after editing the file. Because scripts are
plain text, they diff and merge in source control, and a writer can
work in any text editor.

A script runs from its first line down, one statement per line. A line that starts with `#` is a
comment; a `#` later in a line is part of it. Indentation and blank lines don't matter. The
keywords (`speaker`, `if`, `do` and its actions, `end`, `has`, `can start`, `is`, `and`, `not`)
are lower case; quest names and states can be in any case.

```text
# Bram, the gatekeeper
speaker Bram: Bram the Gatekeeper

if Gate is completed -> open
Bram: Halt. Nobody passes without the captain's word.
* {has Pass.Captain} I have it here. -> pass
* {can start Gate} Can I help? -> help
* Goodbye.
Bram: Move along, then.
end

== help
do start Gate
Bram: Clear the wolves from the road and I'll think about it. | voice=/Game/Voice/Bram_Wolves
end

== pass
do complete Gate
do event OpenGate
== open
Bram: Go on through.
```

## Lines

```text
Speaker: What they say.
Speaker: What they say. | voice=/Game/Voice/Line_01
```

- The speaker is an id: letters, digits and `_`, not starting with a digit. It shows as the id
  with `_` turned into spaces unless a `speaker` statement names it.
- `| voice=` plays a sound asset with the line. The line moves on when the sound ends, unless
  options follow it; the player can skip it.
- A line waits for the player to continue, with the [dialogue box's keys](reference.md#ui).

```text
speaker Bram: Bram the Gatekeeper
```

- `speaker` gives an id the name shown for it: `speaker Bram: Bram the Gatekeeper` shows Bram's
  lines under "Bram the Gatekeeper". Put it anywhere; it holds for the whole script.

## Options

```text
* Text of the option -> label
* {condition} Text shown only if the condition holds -> label
* Text of an option that carries on after the menu
```

- Options in a row make one menu, shown with the line directly before them. With a `do` or an
  `if` in between, the menu shows on its own, with no speaker or text. The player picks one with
  the mouse, a gamepad, or the number keys 1 to 9.
- An option with `-> label` goes to the label. One without goes on to the first statement after
  the menu.
- An option whose condition fails isn't shown. If no option shows, the menu is skipped.

## Labels and jumps

```text
== label
-> label
-> end
end
```

- `== label` names the place where the next statement starts. Labels are letters, digits and `_`,
  not starting with a digit, and not `end`.
- `-> label` goes there. `-> end` and `end` end the conversation.
- Without a jump, a script runs into the next label's statements, the way `pass` runs into `open`
  above. It ends at the end of the file.
- A Speaker component or **Start Dialogue** can start a script at a label instead of the top.

## Conditions

```text
if condition -> label
```

`if` jumps when the condition holds and goes on to the next statement when it doesn't. The same
conditions work in `{ }` on an option.

| Condition | Holds when |
|---|---|
| `has Tag` | the player holds the gameplay tag, or a tag under it |
| `can start Quest` | the quest can start: not active, not done unless repeatable, its requirements met |
| `Quest is active` | the quest is in that state: `inactive`, `active`, `completed`, `failed` or `abandoned` |

Join conditions with `and`, and put `not` in front of one to turn it around:

```text
if Gate is completed and not has Pass.Used -> again
```

There is no `or`: write two `if` lines to the same label.

On a client, conditions read the player's quests as replicated, so a change made just before (a
`do` above, or the Talk Event Tag reported as talking starts) shows a round trip later. An `if`
right after a `do` still sees the old state there: jump on what the script just did instead.

## Actions

`do` changes the player's quests, or tells your Blueprints something.

| Action | Does |
|---|---|
| `do start Quest` | starts the quest if it can start |
| `do restart Quest` | starts it again from its first stage, whatever its state |
| `do complete Quest` | completes it, if it is active |
| `do complete Quest Objective` | completes one objective of its current stage |
| `do fail Quest` | fails it, if it is active |
| `do fail Quest Objective` | fails one objective; a required one fails the quest |
| `do abandon Quest` | abandons it, if it is active and its **Can Abandon** is ticked |
| `do advance Quest` | completes its current stage |
| `do track Quest` | makes it the tracked quest, if it is active |
| `do report Tag` | reports a quest event, as **Report Quest Event** does |
| `do report Tag 3` | the same, counting 3 towards the objective's **Count** |
| `do add Tag` | gives the player the gameplay tag |
| `do remove Tag` | takes it away |
| `do event Name` | fires **On Dialogue Event** with `Name`, on the speaker's Speaker component and on the player's dialogue subsystem |

`do event` is how a script opens a door, gives an item or plays a sound: bind the event in your
Blueprint and check its name.

## Names

- **Quests** are named by their asset's name, such as `Gate` for a quest asset called `Gate`. If
  two quest assets share a name, give the path: `/Game/Quests/Gate`.
- **Tags** are gameplay tags that must exist in **Project Settings > GameplayTags**.

## Errors

Import checks the whole script and names each problem's line in the Message Log:

- an unknown label, quest, objective or gameplay tag, or a quest name more than one asset has;
- a label defined twice, or a label name that isn't one;
- a voice path with no sound asset;
- a line or option with no text, or a `{` without its `}`;
- a condition, `do` action or `speaker` statement that isn't one, an `if` without its
  `-> label`, or a count that isn't above 0;
- a line that isn't a statement.

A script with errors still imports, but the dialogue asset fails validation until they are fixed.
A line no path can reach, and a script with no statements, get a warning.

## Localisation

All text in a script is localisable. Each line is keyed by its text under the namespace
`QD.<AssetName>`, so editing one line leaves the others' translations alone, and lines with the
same text share one translation. Speaker names are keyed `speaker_<Id>`. Gather it with the
Localization Dashboard: add a gather from packages that covers the folder of your dialogue assets.
