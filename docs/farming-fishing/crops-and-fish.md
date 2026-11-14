---
layout: guide
title: "Crops and fish · Farming & Fishing System"
nav: Crops and fish
order: 6
permalink: /docs/farming-fishing/crops-and-fish/
description: "The ten sample crops and ten sample fish of Farming & Fishing System: their seasons, growing days, regrowth, yields, hours, weather, sizes and the pond and river tables."
---

# Crops and fish

The plugin ships ten crops, ten fish and two fish tables, under
**Plugins > Farming & Fishing System > Data**. Use them as they are, change them, or copy one to
start your own ([a crop](how-to.md#grow-a-crop-of-your-own), [a fish](how-to.md#add-fish-of-your-own)).

{% include figure.html src="content.png" alt="The Content Browser's folder tree open at Plugins, Farming & Fishing System, Data, Crops, beside Fish, Demo, Materials, Meshes and Textures, and the ten crop assets, DA_Crop_Cabbage to DA_Crop_Wheat, DA_Crop_Turnip selected." caption="The sample crops in **Data > Crops**, the fish beside them in **Fish**." %}

## Crops

Each crop's **Item Id** is its name (`Turnip`) and its **Seed Item Id** the name and `Seeds`
(`TurnipSeeds`): those are what your inventory sees. Every crop withers after 3 dry days in a row.

| Crop | Seasons | Ready in | Then | Yield |
|---|---|---|---|---|
| Turnip | Spring | 3 days | cleared | 1 |
| Carrot | Spring, Autumn | 4 days | cleared | 1 |
| Potato | Spring | 6 days | cleared | 1–⁠3 |
| Wheat | Summer, Autumn | 6 days | cleared | 1–⁠2 |
| Cabbage | Autumn, Winter | 7 days | cleared | 1 |
| Sunflower | Summer | 7 days | cleared | 1 |
| Strawberry | Spring, Summer | 7 days | regrows, 2 days | 1–⁠2 |
| Tomato | Summer | 7 days | regrows, 2 days | 2–⁠3 |
| Corn | Summer, Autumn | 9 days | regrows, 3 days | 1 |
| Pumpkin | Autumn | 11 days | cleared | 1 |

The days are watered days, counted at midnight: a crop planted and watered each day is ready that
many mornings later. One planted too near the end of its last season withers when the season
turns. A cleared crop leaves its soil tilled; a regrowing one keeps its fertilizer.

## Fish

Each fish's **Item Id** is its name, and a catch hands your inventory its size in cm as the
quality. Hours run from the first to the second, so 20–5 runs over midnight.

| Fish | Seasons | Hours | Weather | Size, cm | Strength | Stamina | Bite |
|---|---|---|---|---|---|---|---|
| Bluegill | all | all day | any | 10–⁠22 | 0.2 | 3 s | 1.6 s |
| Perch | Spring, Summer, Autumn | 5–⁠20 | any | 15–⁠32 | 0.3 | 4 s | 1.4 s |
| Bass | Spring, Summer | 5–⁠21 | any | 25–⁠55 | 0.5 | 6 s | 1.2 s |
| Trout | Spring, Autumn | 5–⁠12 | any | 25–⁠50 | 0.5 | 6 s | 1.1 s |
| Koi | Spring, Summer | all day | rain | 30–⁠60 | 0.5 | 7 s | 1.1 s |
| Carp | Summer, Autumn | all day | any | 30–⁠70 | 0.6 | 8 s | 1.3 s |
| Salmon | Autumn | 6–⁠19 | any | 45–⁠85 | 0.7 | 8 s | 1.0 s |
| Catfish | Summer | 20–⁠5 | any | 40–⁠90 | 0.7 | 9 s | 1.2 s |
| Pike | Autumn, Winter | 6–⁠18 | any | 50–⁠100 | 0.8 | 9 s | 0.9 s |
| Sturgeon | Winter | 19–⁠4 | any | 80–⁠160 | 0.9 | 12 s | 0.9 s |

**Strength** is how hard the fish pulls against the reel, **Stamina** the seconds of reeling with
the bar green it takes to tire (slack in the green tires it half as fast), and **Bite**, its
**Bite Window**, how long the player has to hook it.

## Fish tables

A bite comes 3 to 10 seconds after the bobber lands, in both. The weight is each fish's share
among the fish that can bite at the cast: on a clear summer noon at the pond, a bluegill bites 4
times in 11.

| Fish | Pond | River |
|---|---|---|
| Bluegill | 4 | |
| Perch | 3 | 2 |
| Trout | | 3 |
| Bass | 2 | 1.5 |
| Carp | 2 | |
| Salmon | | 2 |
| Catfish | 1.5 | |
| Pike | | 1.5 |
| Koi | 0.4 | |
| Sturgeon | | 0.3 |

> [!NOTE]
> The river table has no fish for every hour: on a winter afternoon only the pike bites there, and
> nothing does in the small hours of spring. The pond's bluegill bite always.
