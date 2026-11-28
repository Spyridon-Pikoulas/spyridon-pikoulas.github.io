---
layout: guide
title: "How-tos · World Map, Minimap & Compass System"
nav: How-tos
order: 4
permalink: /docs/map-minimap-compass/how-to/
description: "Answers to the common tasks in World Map, Minimap & Compass System: markers on actors, quest goals, pins from game data, fast travel, caves and floors, the map's look, saving, your own screen and multiplayer."
---

# How-tos

The tasks buyers come back for, each answered in steps, Blueprint first and C++ after. They build
on the [quickstart](quickstart.md)'s map and the words in [Concepts](concepts.md).

## Check what a level is missing

Choose **Tools > Check Map Setup** (or type `Map.CheckSetup` in the editor's console). The Message
Log opens on a **Check Map Setup** page with a line for each thing the level lacks for its maps,
and how to fix it: no Map Region, a region with no map yet or moved since, no navmesh for the
routes, a marker outside every region or with no icon, an area with no name. Where the fix can be
made for you, it is a link: it adds the region or the Nav Mesh Bounds Volume, or captures the map,
and checks again. A line names its actor; click the name to find it in the level.

## Put a marker on an actor

A **Marker** component follows its actor: an NPC, a chest, a cart.

1. Open the actor's Blueprint, click **+ Add** in the Components panel and pick **Marker**.
2. In its Details set an **Icon** (the plugin's are in **Plugins > World Map, Minimap & Compass System > Icons**), a **Label**
   and a **Category**.
3. Tick **On Screen** to show it over its place in the view too, and **Hold At Minimap Rim** to
   keep it on the minimap from afar.

Every instance of the Blueprint now shows on the maps and the compass. Set **Label** per
instance in the level, or from the Blueprint's **Construction Script**.

```cpp
#include "MCMarkerComponent.h"

AMerchant::AMerchant()
{
    Marker = CreateDefaultSubobject<UMCMarkerComponent>(TEXT("Marker"));
    Marker->SetupAttachment(RootComponent);
    Marker->Label = NSLOCTEXT("Game", "Merchant", "Merchant");
    Marker->Category = TEXT("Town");
    Marker->bOnScreen = true;
}
```

## Show what the player can use

A **Glint** is a small sparkle over a chest, a door, a lever or a waystone: something the player can
pick up, open or use. It twinkles within its **Range** and hides behind walls.

1. Open the thing's Blueprint, click **+ Add** in the Components panel and pick **Glint**.
2. Move it to where the sparkle should be, at the lid's edge, say.
3. When the thing can't be used any more (the chest emptied, the door locked), set its **Shown** off.

For a mesh placed in the level with no Blueprint, place a **Glint** actor (**Place Actors > Glint**)
by it and attach it to the mesh in the Outliner.

{% include figure.html src="glint.jpg" alt="A waystone in the demo valley with a small gold star twinkling at its shoulder." caption="The demo's waystones, its notice board and its chest each have a Glint." %}

To turn them off for the whole game, untick **Show Glints** in the [settings](reference.md#settings),
or call **Set Glints Shown** on **Get Map Subsystem** from your options menu.

```cpp
#include "MCGlint.h"

AChest::AChest()
{
    Glint = CreateDefaultSubobject<UMCGlintComponent>(TEXT("Glint"));
    Glint->SetupAttachment(Lid);
}

void AChest::Open()
{
    Glint->bShown = false;
}
```

## Point the player at a quest's goal

**Track Marker** lights a marker on the compass, holds it at the minimap's rim and draws a route
to it.

1. Give the goal a Marker component (or place a **Map Marker** there).
2. When the quest starts, call **Get Player Map** with the player's controller, then **Track
   Marker** with the goal's Marker. With **Show Trail** on, a trail on the ground leads there too.
3. When the goal changes, call **Flash Marker** on its Marker for it to flash on every view.
4. When it's done, call **Stop Tracking**.

With heyheythere's [Quest & Dialogue System](/docs/quest-dialogue/), bind **On Quest State
Changed** on **Get Quest Component**: when **New State** is **Active**, **Track Marker**; when it
is **Completed**, **Stop Tracking**.

```cpp
#include "MCPlayerMapComponent.h"

if (UMCPlayerMapComponent* Map = UMCPlayerMapComponent::GetPlayerMap(PlayerController))
{
    Map->TrackMarker(Goal->FindComponentByClass<UMCMarkerComponent>());
}
```

## Show game data as pins

For many places with no actor of their own (farm plots, ore veins, a quest's search area), add
**pins**: data only, thousands at little cost.

1. Call **Get Map Subsystem**, then **Add Pin** with a **Make Map Pin**: its **Location**, a
   **Label**, an **Icon** and a **Category**.
2. Keep the **Id** it returns, to **Remove Pin** later or to **Track Pin** on the player's map.

In multiplayer, world pins are each machine's own ([Multiplayer](concepts.md#multiplayer)).

```cpp
#include "MCMapSubsystem.h"

FMCPin Pin;
Pin.Location = Plot->GetActorLocation();
Pin.Label = NSLOCTEXT("Game", "Wheat", "Wheat");
Pin.Category = TEXT("Farm");
const FGuid Id = UMCMapSubsystem::Get(this)->AddPin(Pin);
```

## Fast-travel from the map

A marker with **Fast Travel** on, clicked on the world map, fires **On Fast Travel** on the
player's map. Moving the player is yours, so you choose the rules: discovered first, a cost, a
loading screen.

1. Tick **Fast Travel** on your waystones' markers.
2. Add a **Player Map** component to your player controller Blueprint (the plugin then adds
   none), and click **+** beside **On Fast Travel** in its **Details**.
3. In the bound event, take the **Marker**'s **Get Owner** and its location, and call **Teleport**
   on your pawn a little in front of it. Then **Show World Map** with **Show** off on **Get Map
   HUD**, to close the map.

    Teleport on the server: in multiplayer, call a **Run on Server** event of your controller with
    the place to go to.

```cpp
void AMyController::BeginPlay()
{
    Super::BeginPlay();
    if (UMCPlayerMapComponent* Map = UMCPlayerMapComponent::GetPlayerMap(this))  // on a client, there once replicated
    {
        Map->OnFastTravel.AddDynamic(this, &AMyController::Travel);
    }
}

void AMyController::Travel(UMCMarkerComponent* Marker)  // a UFUNCTION
{
    const FVector To = Marker->GetComponentLocation() + Marker->GetForwardVector() * 300.;
    GetPawn()->TeleportTo(To, GetPawn()->GetActorRotation());
    UMCMapHUD::GetMapHUD(this)->ShowWorldMap(false);
}
```

## Keep a place secret till it's found

1. On its Marker (or Map Marker), set **Discovery** to **Unknown** for a ? on the maps, or
   **Hidden** for nothing at all.
2. Set **Discover Radius**, how near the player comes to find it: 15 m by default.

Once a player comes that close, it is theirs: named and drawn, its name on the toast, and saved
with their map. To give it from a quest or a book, call **Discover Marker** on their Player Map,
on the server. **On Marker Discovered** fires for it, as **On Area Discovered** does for an area.

## Map a cave or an upper floor

1. Place a second **Map Region** whose box holds the cave, inside the outer one. Set its **Id**
   (`Cave`) and **Title** (`The Hollow`).
2. Set the box's top just under the cave's ceiling, and its bottom under the cave's floor: the
   camera shoots down from the top.
3. For a cave, tick **Atlas > Underground**. Tag the cave's walls `MapWall` (**Details > Actor >
   Tags**) if the ceiling hides them.
4. Build the navmesh (a **Nav Mesh Bounds Volume** over the cave) so the map can tell the floor
   from what's blocked; the capture builds it if it isn't built.
5. Set **Minimap Reach** to about half the cave's length, such as `1500`, for the minimap to
   draw it large; a valley's 50 m would leave a cave a small strip in it.
6. Click **Capture Map** on the new region.

Walking into the box switches the minimap and the world map to the cave's map, and the player's
**On Region Changed** fires. A floor has its own fog, and draws the route on it alone: a ring
marks where the route goes up or down to another floor.

{% include figure.html src="demo-floors.jpg" alt="The world map inside the demo cave, titled The Hollow: the cave's chambers drawn on parchment, the rock round them hatched, the player's arrow in the main chamber and a dashed route leading out." caption="Inside the demo's cave the world map shows the cave's own floor, The Hollow." %}

## Map a big world

For a world of a few kilometres, one texture is too coarse once the player zooms in. Set the
region's **Detail Levels** to 2 or 3 before **Capture Map**: the map keeps its **Resolution**, and
each level over it is captured at twice the last's, in tiles of 2048 pixels saved beside it. The
minimap and the world map load the tiles they show as they zoom in, and let them go once out of
view.

| Over 4 km, Resolution 4096 | Closest | Tiles | Their disk |
|---|---|---|---|
| Detail Levels 1 | 1 m a pixel | none | none |
| Detail Levels 2 | 49 cm a pixel | 16 | 45 MB |
| Detail Levels 3 | 24 cm a pixel | 80 | 225 MB |

In a World Partition level, **Capture Map** loads each part of the level as it shoots it, so the
whole world needn't be loaded. A 4 km world at Detail Levels 3 took about two minutes. Change the
box, the **Resolution** or **Detail Levels** later and **Check Map Setup** names the tiles as stale
until you capture again.

## Change the map's look

Two things make the look: the **HUD Style**, how the views are drawn, and the region's map, the
picture under them.

**The HUD Style.** In **Project Settings > Plugins > Map, Minimap & Compass**, set **Style** to
**Clean** (in **Plugins > World Map, Minimap & Compass System > Styles**) for dark cards, thin lines
and a frameless minimap. For a look of your own, duplicate **Parchment** or **Clean** and change
its colours, frames, badges, font and **Icons** (an icon drawn in place of another). To let a player
switch, call **Set Style** on their **Get Map HUD**; the trail takes the style's colour too.

**The map.** The region's **Style** and **Atlas** settings change the picture; click **Capture
Map** again to see them.

| For | Set |
|---|---|
| a clean modern map | **Parchment** 0, **Contours** 0, **Shadows** 0.2 |
| an old treasure map | **Parchment** 1, **Colour** 0.4 |
| a flat level | **Contour Interval** 0 (no contours), **Hillshade** 0 |
| the level as it looks | **Style** Photo |

**Your own art.** Set the region's **Source** to **Own Image** and give **Image** your texture:
square, covering the region's square, north up. **Capture Map** then saves its shot as a PNG in
`Saved/MapCompass` to paint over, and leaves your texture be. **Set Map Image** on the region shows
another picture at play.

## Turn the trail on or change it

The trail is off: the route shows on the maps alone. Tick **Show Trail** in **Project Settings >
Plugins > Map, Minimap & Compass** to lay it along the ground for every player, or set the Player
Map's **Show Trail** in play (**Get Player Map**, then **Set Show Trail**) for one, from an option
in your menu, say. **Trail Look** draws its arrows alone (**Arrows**, the default) or on a band of
the HUD Style's **Trail** colour (**Arrows On Band**): set it in the settings, or on the Player Map
(**Set Trail Look**) for one player. Both are drawn by the **Trail Material** in the settings, which
you can swap for your own.

## Keep the route to your roads

The route is the shortest way over the navmesh, so it cuts across the grass. To keep it to your roads:

1. Make a **Nav Area** Blueprint (**Add > Blueprint Class > NavArea**), say *NavArea_Road*.
2. Lay a **Nav Modifier Volume** over each stretch of road, its **Area Class** your road area.
3. Make a **Navigation Query Filter** Blueprint, and in its **Areas** add **NavArea_Default** with
   **Travel Cost Override** ticked and set to 10: the open ground costs ten times what the road does.
4. Set the Player Map's **Route Filter** to it.

The route and the trail now leave a road only where none goes. Over dear ground the search looks at more of the
navmesh: if a long route comes out partly straight, raise **Default Max Search Nodes** on the **RecastNavMesh**.

## Save the map with your game

**Save Map** gives the player's map as one value; keep it in your save game.

1. In your **SaveGame** Blueprint, add a variable `Map` of type **Map Save**.
2. When saving, set it from **Get Player Map** > **Save Map**, then **Save Game to Slot** as you do.
3. When loading, after **Load Game from Slot**, call **Load Map** with the variable.

```cpp
// saving
SaveGame->Map = UMCPlayerMapComponent::GetPlayerMap(PlayerController)->SaveMap();
// loading
UMCPlayerMapComponent::GetPlayerMap(PlayerController)->LoadMap(SaveGame->Map);
```

## Reward discovering a place

**On Area Discovered** fires on the server when a player finds an area: give XP, a trophy, a quest
step.

1. Add a **Player Map** component to your player controller Blueprint, and click **+** beside
   **On Area Discovered** in its **Details**.
2. In the bound event, check **Has Authority**, then reward the player. The **Area**'s **Display
   Name** says where.

With heyheythere's [RPG Skill Tree & XP System](/docs/progression-skill-tree/), call **Get
Progression Component** with **Self**, then **Add XP** with your track and an amount.

## Reveal the whole map

A bought map, a high lookout, a cheat: **Reveal Region** on the player's map, on the server, with
the region (or none for every region). **Reveal At** reveals a disc round a place, **Discover
Area** an area with its toast, and **Reset Discovery** forgets everything. While testing,
`Map.Reveal` does it from the console.

## Lay out your own screen

The plugin's **Map HUD** is a starting point. Three ways to change it:

- **Move or restyle its parts.** Make a Widget Blueprint whose parent is **Map HUD**, lay out
  widgets named **Walking**, **Map Screen**, **Minimap**, **Compass Bar**, **Screen Markers**,
  **Area Toast** and **World Map** (all optional), and set it as **HUD Class** in the settings.
  **Show World Map** and the map key keep working.
- **Use the widgets in your own HUD.** Turn **Show HUD** off and place **Minimap**, **Compass Bar**
  and the others from the palette's **Map** section in your own Widget Blueprint. Open your world
  map widget from your own input, and give it keyboard focus so the gamepad works on it.
- **Draw your own views.** The nodes in the [reference](reference.md) give every marker, pin,
  route point and the fog's state; **World To Map** places them.

## Open the map from a button or your own input

Call **Get Map HUD** with the player's controller, then **Toggle World Map** or **Show World Map**.
To use your own keys, set **Map Keys** in the settings, or empty it and call the node from your
own input action.

## Play with a team

Each player has their own fog and pins without any setup. For shared pins and pings:

1. On the server, set **Team** on each player's **Player Map**: players of the same number share.
2. A pin a player places with **Shared** ticked, or a **Ping**, now reaches the team alone.

Teammates show on each other's minimap, world map and compass, in the team's colour from **Team
Colors** in the settings. Untick **Show Teammates** on the Player Map to hide them.

To try it in the editor, set **Number of Players** to 2 and **Net Mode** to **Play As Listen
Server** in **Play**'s options.
