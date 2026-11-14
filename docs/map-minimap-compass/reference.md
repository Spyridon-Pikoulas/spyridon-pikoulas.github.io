---
layout: guide
title: "Reference · World Map, Minimap & Compass System"
nav: Reference
order: 7
permalink: /docs/map-minimap-compass/reference/
description: "Every Blueprint node, event and setting of World Map, Minimap & Compass System: regions, areas, markers, pins, the player's map, the widgets, the Map HUD, save, multiplayer and debugging."
---

# Reference

Every Blueprint node, event and setting of World Map, Minimap & Compass System. The
[quickstart](quickstart.md) walks through a first map, and the [how-tos](how-to.md) answer the
common tasks. Distances are in centimetres, as everywhere in Unreal.

## Settings

**Project Settings > Plugins > Map, Minimap & Compass**.

| Setting | Default | What it does |
|---|---|---|
| Show HUD | on | Puts the [Map HUD](#map-hud) on every local player's screen as they get a controller. Turn it off if you lay out your own widgets. |
| HUD Class | the plugin's own | A Widget Blueprint made from **Map HUD**, put up instead. |
| HUD Z Order | 0 | Its place among your other widgets on screen. |
| Map Keys | <kbd>M</kbd>, gamepad **Menu** | Open and close the world map. Empty if your game calls **Show World Map** itself. |
| Show Glints | on | A [glint](#glints) over each thing the player can use, till the game's **Set Glints Shown** says otherwise. |
| Manage Input Mode | on | While the world map is open it takes the mouse and gamepad, shows the cursor and holds the player still; on closing, the game gets its input back. Turn it off if your game sets input modes itself. |

## Map Region

An actor: **Place Actors > Map Region**. Its box is what the map covers ([regions](concepts.md#regions-what-a-map-covers)).

| Field | Default | What it is |
|---|---|---|
| Id | the actor's name | The name its discovery is saved under. Keep it once players have saved. |
| Title | none | The heading on the world map. |
| Source | Captured | Captured, At Play or Live. |
| Style | Atlas | Atlas or Photo. |
| Atlas | | The atlas look, [below](#atlas). |
| Resolution | 2048 | The map's side in pixels; a multiple of 1024 when captured or drawn at play. |
| Live Interval | 0.5 s | Between a Live map's captures; 0 for every frame. |
| Minimap Reach | 0 | The minimap's **Reach** while the player is here, in cm, kept between its **Min Reach** and **Max Reach**; 0 leaves it as it is. Outside, the minimap's own reach comes back. A cave or a house wants it closer. |
| Fog | Hidden | What the maps show where the player hasn't been: **Off** (all of it), **Dimmed** or **Hidden** (blank paper). |
| Reveal Radius | 0 | How far round a player walking here the map is revealed, in cm; 0 for their Player Map's **Reveal Radius**. A small level or a cave wants less. |
| Fog Cells | 128 | The discovery grid's side: finer reveals rounder edges and saves more. |
| Image | | The texture **Capture Map** made. |

| Node | What it does |
|---|---|
| **Capture Map** | The button in its Details: shoots the region from above and saves the texture as `<Level>_Map/T_Map_<Id>`. Editor only, also from editor scripts and Editor Utility Blueprints. |
| **Draw Map** (Style) | Draws the map again at play, in the style given, until play ends. The first draw of a session takes a while. |
| **Get Map Texture** | The picture the maps draw. |
| **World To Map**, **Map To World** | Between a place and its map point, 0 to 1 each way: U east (world +Y), V south (world -X). |
| **Encompasses** (Location) | Inside its box. |
| **Get Box**, **Get Region Id** | Its square, and its Id. |

### Atlas

Colours are sRGB; strengths run 0 to 1.

| Field | Default | What it is |
|---|---|---|
| Paper, Ink | cream, brown | The paper and the lines. |
| Shallows, Deeps | | The water's colours at the shore and in the middle. |
| Parchment | 0.5 | How old the paper looks: 0 clean, 1 old parchment gone sepia. |
| Colour | 0.7 | How much of the level's own colour shows through. |
| Hillshade | 0.55 | The ground's relief, lit from the north-west. |
| Contour Interval | 200 | Height between contour lines; 0 for none. |
| Major Contour Every | 5 | Every how many contours one is heavier. |
| Contours | 0.35 | The contour lines' strength. |
| Outlines | 0.8 | Ink round buildings, trees, rocks and water. |
| Shadows | 0.35 | What stands on the ground casts a shadow to the south-east. |
| Cliffs | 0.7 | Rock faces steeper than about 60 degrees: a rock tone, hatching and an inked edge. |
| Underground | off | A cave or cellar: no sun, and what's past its floor drawn as rock. |
| Walkable | 1 | Underground, how plainly the floor a player can walk stands apart from what's blocked: light, inked round its edge, steps across its ramps; rock, pits and what stands in the way dark. The floor is the navmesh's where there is one. 0 draws them alike. |
| Floor Grid | 0 | Underground, a faint grid over the walkable floor this far apart, in cm; 0 for none. |
| Shore Ripples | 3 | Rings drawn out from the shore. |

## Map Area

An actor: **Place Actors > Map Area**. A named place discovered by walking into its box.

| Field | Default | What it is |
|---|---|---|
| Id | the actor's name | Its discovery is saved under it. |
| Display Name | none | Shown by the toast and on the world map. |
| Reveal Whole Area | on | Discovering it reveals its whole box. |
| Name On Map | on | Its name written on the world map once discovered. |

**Get Area Id** and **Encompasses** (Location) read it.

## Markers

The **Marker** component goes on any actor (**+ Add > Marker**); the **Map Marker** actor
(**Place Actors > Map Marker**) is one standing alone. Both have:

| Field | Default | What it is |
|---|---|---|
| Icon | none | A white glyph on transparency, drawn on the badge. The plugin's are in `Content/Icons`. |
| Label | none | Its name on the world map, in tooltips and on screen. |
| Description | none | A line more in the world map's tooltip. |
| Category | none | What the legend groups and filters it under. |
| Color | amber | The badge's colour. |
| Scale | 1 | The badge's size everywhere, 0.25 to 4. |
| Priority | 0 | Drawn over lower ones, its label placed first. |
| Fast Travel | off | Clicked on the world map, it fires the player's **On Fast Travel**. |
| On World Map, On Minimap, On Compass | on | Which views show it. |
| On Screen | off | Shown over its place in the view, or at the screen's edge. |
| Hold At Minimap Rim | off | Out of the minimap's reach, held at its rim with an arrow. The tracked marker always is. |
| Minimap Range, Compass Range, Screen Range | 0 | The view shows it only this close; 0 for any distance. |

## Glints

A small sparkle over something the player can use: a waystone, a chest, a door. The **Glint**
component goes on its actor (**+ Add > Glint**), placed where the sparkle should be; the **Glint**
actor (**Place Actors > Glint**) is one standing alone, attached to what it marks. The
[Glints](#glints-1) widget draws them, hidden behind walls.

| Field | Default | What it is |
|---|---|---|
| Shown | on | Off while the thing can't be used: the chest emptied, the door locked. |
| Range | 1500 | Seen only this close. |
| Color | gold | The sparkle's colour; its heart is always white. |
| Scale | 1 | Its size, 0.25 to 4. |

## Pins

A **Pin** is a marker that is only data.

| Field | Default | What it is |
|---|---|---|
| Id | given when added | Its name, for **Remove Pin**, **Track Pin** and saves. |
| Location | | Where it is in the world. |
| Label, Icon, Category, Color, Scale | Category `Pin`, red | As a marker's. |
| Shared | off | A player's pin seen by their team too. |
| On Minimap, On Compass | on | Which views show it; the world map always does. |

A **Pin Kind** is what the world map offers a player who right-clicks: a **Label**, an **Icon**,
a **Color** and a **Category**.

## Map subsystem

The world's map, on every machine: **Get Map Subsystem**, a world subsystem.

| Node | What it does |
|---|---|
| **Find Region** (Location) | The region a place is in: the smallest holding it. |
| **Get Regions** | Every region, the outermost first. |
| **Find Region By Id**, **Find Area By Id** | By Id. |
| **Get Areas**, **Get Markers** | Every area, every marker. |
| **Find Marker By Label** (Text) | The marker labelled so, else the first whose label holds the text; case ignored. |
| **Add Pin** (Pin) | A world pin on this machine's maps; returns its Id. Thousands cost little. |
| **Remove Pin** (Id), **Clear Pins**, **Get Pins** | World pins. |
| **Set Glints Shown** (Show), **Are Glints Shown** | Every [glint](#glints) drawn, or none; **Show Glints** in the settings to begin with. |

| Event | When |
|---|---|
| **On Map Drawn** (Region) | A map was drawn at play, or again by **Draw Map** or `Map.Capture`. |
| **On Pins Changed** | A world pin was added or removed. |

## Player Map

A player's map: a component on their controller, added as they join. **Get Player Map** finds it
from the controller, its pawn or its PlayerState.

| Field | Default | What it is |
|---|---|---|
| Reveal Radius | 3000 | How far round the player the map is revealed as they walk, in cm, where the region has no **Reveal Radius** of its own. |
| Team | 0 | Players of a team see each other's shared pins and pings. Set it on the server. |
| Ping Life | 6 s | How long a ping shows. |
| Max Pins | 64 | The most pins a player may place. |
| Find Route | on | A route on the navmesh to what is tracked, or to the ground under it, standing off the corners it turns; a straight line where none is found. |

### Discovery

| Node | Runs on | What it does |
|---|---|---|
| **Is Revealed** (Location) | any | The player has seen that place. |
| **Get Revealed Fraction** (Region) | any | How much of the region is discovered, 0 to 1. |
| **Reveal At** (Location, Radius) | server | Reveals a disc round a place, in every region it is in. |
| **Reveal Region** (Region) | server | Reveals the whole region, or every region when none is given. |
| **Discover Area** (Area) | server | As if the player had walked in. |
| **Reset Discovery** | server | Forgets every discovery. |
| **Is Area Discovered** (Area), **Get Discovered Areas** | any | The areas found. |
| **Get Current Region** | any | The region the player's pawn is in. |

| Event | When |
|---|---|
| **On Area Discovered** (Area) | The player found an area; on the server and on their own machine. |
| **On Region Changed** (Region) | The player went into another region, a floor or out of it; on their own machine. |

### Pins and pings

| Node | What it does |
|---|---|
| **Add Pin** (Pin) | A pin of the player's own, kept on the server and saved with their map. Returns its Id; none past **Max Pins**. |
| **Update Pin** (Pin) | The pin with the same Id, changed. |
| **Remove Pin** (Id), **Get Pins**, **Find Pin** (Id) | The player's own pins. |
| **Get Team Pins** | The team's shared pins, as this machine has them. |
| **Ping** (Location) | Points a place out to the team for **Ping Life** seconds. |
| **Get Pings** | The pings showing now. |

| Event | When |
|---|---|
| **On Pins Changed** | The player's pins changed. |
| **On Ping** (Ping) | A ping from the team, or the player, arrived. |

### Tracking and fast travel

| Node | What it does |
|---|---|
| **Track Marker** (Marker) | The marker the compass lights and the route leads to; none to stop. |
| **Track Pin** (Id) | One of the player's pins, a world pin or a team pin. |
| **Stop Tracking** | Nothing tracked. |
| **Get Tracked Marker**, **Get Tracked Pin** | What is tracked. |
| **Get Tracked Location** | Where it stands; false when nothing is. |
| **Get Route** | The route's points from the player. |
| **Request Fast Travel** (Marker) | What the world map does on a click on a **Fast Travel** marker: fires **On Fast Travel**. |

| Event | When |
|---|---|
| **On Tracking Changed** | Something else is tracked, or nothing. |
| **On Fast Travel** (Marker) | The player asked to travel there. Move them in your Blueprint: the plugin doesn't. |

### Save

| Node | What it does |
|---|---|
| **Save Map** | The player's map as a **Map Save**: discovery, areas, pins and what is tracked. |
| **Load Map** (Save) | Back as saved; on a client it asks the server. |

## Widgets

Each is a UMG widget in the **Map** section of the Widget Blueprint palette.

### Minimap

| Field | Default | What it is |
|---|---|---|
| Shape | Round | Round or Square. |
| Turn With Camera | on | The camera's way is up; off keeps north up and turns the player's arrow. |
| Reach | 5000 | How far from the player its edge reaches: its zoom, eased to as it changes. A region's **Minimap Reach** sets it while the player is in the region. |
| Min Reach, Max Reach | 1500, 20000 | **Zoom In** and **Zoom Out** keep the reach between them. |
| Show Route | on | Draws the route to what is tracked. |
| Edge Arrows | on | Holds markers out of reach that ask for it, and the tracked one, at the rim. |

**Zoom In** and **Zoom Out** change the reach by a step.

### Compass Bar

| Field | Default | What it is |
|---|---|---|
| Span | 160° | The bearings shown across its width. |
| Show Distances | on | Each marker's distance under it. |

### World Map

| Field | Default | What it is |
|---|---|---|
| Zoom | 1 | 1 shows the whole map, up to 16. |
| Centre | 0.5, 0.5 | The map point at the view's middle (east, south). |
| Open Zoom | 2 | Opened again after a while, the map centres on the player at this zoom; 0 keeps the view. |
| Show Labels | on | Markers' labels, placed where they fit. |
| Show Legend, Legend Open | on, off | The legend's tab, and the legend itself. |
| Hidden Categories | none | Categories the legend has switched off. |
| Allow Pins | on | The player may place, edit and remove pins. |
| Pin Kinds | Flag, Star, Treasure, Camp | What a right-click offers. |
| Region | none | The region shown; none for the player's own. |

| Node or event | What it does |
|---|---|
| **Focus On Player** (Zoom) | Centres the view on the player. |
| **Set Category Shown** (Category, Shown), **Is Category Shown** | The legend's filter. |
| **Point At** (Location) | Glides the map's cursor to a place and holds it there, its marker's tooltip shown, as a gamepad's cursor would: a tutorial pointing the way. The mouse or gamepad takes it back, and closing the map lets it go. |
| **On Close Requested** | <kbd>Esc</kbd> or the gamepad's **B** was pressed on it. |

Mouse: the wheel zooms, a drag pans, a click tracks a marker (or travels), a right-click places or
edits a pin, the middle button pings. Gamepad, once it has focus: the left stick moves a cursor,
the right stick pans, the triggers zoom, **A** clicks, **X** pins, **Y** opens the legend, **B**
closes, and pressing the right stick pings.

### Screen Markers

Lay it over the whole screen.

| Field | Default | What it is |
|---|---|---|
| Size | 16 | The badge's radius. |
| Lift | 150 | How far above its place a marker floats. |
| Hide Within | 400 | Closer than this a marker fades out. |
| Edge Margin | 0.06 | The screen edge's margin, as a part of the screen. |

### Glints

Lay it over the whole screen.

| Field | Default | What it is |
|---|---|---|
| Size | 48 | A star's reach at its brightest; half that between twinkles. |
| Period | 2.4 s | From one twinkle to the next; each glint keeps its own beat. |
| Hide Behind Walls | on | A trace on the Visibility channel from the camera; off draws them through walls. |

### Area Toast

| Field | Default | What it is |
|---|---|---|
| Duration | 4 s | How long the name shows. |
| Heading | Discovered | The line over the name. |

## Map HUD

The plugin's screen, put up for each local player when **Show HUD** is on.

| Node or event | What it does |
|---|---|
| **Get Map HUD** (Player) | The player's Map HUD, if the plugin put one up. |
| **Show World Map** (Show) | Opens or closes the world map; the input mode follows (**Manage Input Mode**). |
| **Toggle World Map**, **Is World Map Shown** | |
| **On World Map Shown** (Shown) | The map opened or closed. |
| **Set HUD Class** (Class) | On the local player's **Map HUD Subsystem**: this player's HUD made again from your class. |

Its widgets are **Walking** (the panel hidden while the map shows), **Map Screen**, **Minimap**,
**Compass Bar**, **Glints**, **Screen Markers**, **Area Toast** and **World Map**. A Widget Blueprint made from
Map HUD finds its own widgets by these names ([your own screen](how-to.md#lay-out-your-own-screen)).

## Console commands

Type them in the console (<kbd>&#96;</kbd>) while playing.

```console
Map.Reveal            reveals every region to every player (on the server)
Map.Reveal 5000       ... or 50 m round each player
Map.Reset             forgets what every player discovered
Map.Markers           lists the regions, areas and markers in the log
Map.Track Mill        the first player tracks the marker whose label holds "Mill"
Map.Track             ... or stops tracking
Map.Capture           draws every region's map again from the level as it stands
Map.Capture Photo     ... as a photo
```

## Gameplay Debugger

Press <kbd>'</kbd> (apostrophe) while playing. The **Map** category shows the player's region and
team, how much of each region they revealed, the areas found, the markers and pins, and what they
track with its route.
