# Memory Game

A classic memory card-matching game built with vanilla JavaScript, HTML and CSS.
No frameworks, no build step — just open `index.html` and play.

## Deploy

https://subtle-stroopwafel-476026.netlify.app

## Features

- 4×4 board with 8 pairs of cards (numbers 1–8)
- Shuffled on every new game
- Click counter — tracks how many cards you turned
- Match counter — tracks matched pairs out of 8
- Victory modal with total steps when all pairs are matched
- Leaderboard — top 10 results stored in `localStorage` (no duplicates)
- RU / EN language toggle

## How to play

1. Click any card to reveal its number.
2. Click a second card.
   - If the numbers match, both stay open.
   - If not, they flip back after 1.5 seconds.
3. Match all 8 pairs to win.
4. Your result is saved to the leaderboard — check it via **Ranking Table**.

## How to run locally

The game is a static site — no build tools required.