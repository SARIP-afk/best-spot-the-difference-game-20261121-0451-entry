// Twin Scenes — every number the game balances on, in one place.
// The canvas is a fixed 1280 x 800 stage; each scene is drawn in its own
// 600 x 560 panel space, twice: once original (left), once changed (right).
export const STAGE_W = 1280;
export const STAGE_H = 800;
export const PANEL_W = 600;
export const PANEL_H = 560;
export const PANEL_Y = 84;
export const PANEL_LEFT_X = 24;
export const PANEL_RIGHT_X = 656;
export const TOP_BAR_H = 64;
export const BOTTOM_BAR_Y = 660;

// How close a click must land to a difference's centre to count, in scene px.
export const FIND_RADIUS = 30;
// Seconds of play per level, and the price of a wrong click.
export const LEVEL_TIME = 180;
export const WRONG_TIME_COST = 5;
// Hints per level; a hint costs points and pulses a ring around one
// difference the player has not found yet.
export const HINTS_PER_LEVEL = 3;
export const HINT_COST = 25;
export const HINT_SECONDS = 3;
// Points: a find, the combo bonus for quick successive finds, and the
// time bonus paid when a level is cleared.
export const FIND_POINTS = 100;
export const COMBO_WINDOW_MS = 6000;
export const COMBO_STEP = 25;
export const TIME_BONUS_PER_SECOND = 5;

// The three scenes, in the order they are played. Each scene's painter and
// its differences live in scenes.js; the names here are what the level tabs
// and the title screen show.
export const LEVELS = [
  { id: 'harbor', name: 'Harbor Sunset', sub: 'a sleepy marina at dusk', time: LEVEL_TIME },
  { id: 'garden', name: 'Garden Cottage', sub: 'a cottage garden at noon', time: LEVEL_TIME },
  { id: 'market', name: 'Lantern Market', sub: 'a night market in full glow', time: LEVEL_TIME },
];
