/**
 * Guided 60-second resets. Each one is a list of timed phases repeated for a number of rounds,
 * so adding a strategy means adding one entry here. Hidden entries are planned but not
 * written yet; they stay off the Calm screen until their phases exist.
 */

export type PhaseKind = 'in' | 'topUp' | 'out' | 'prompt';

export type Phase = {
  kind: PhaseKind;
  seconds: number;
  cue: string;
};

export type Strategy = {
  id: string;
  name: string;
  /** One plain line on why it works. */
  why: string;
  rounds: number;
  phases: Phase[];
  hidden?: boolean;
};

export const STRATEGIES: Strategy[] = [
  {
    id: 'paced-breathing',
    name: 'Paced breathing',
    why: 'Six slow, even breaths a minute is the rhythm your heart settles into most easily.',
    rounds: 6,
    phases: [
      { kind: 'in', seconds: 5, cue: 'Breathe in for 5' },
      { kind: 'out', seconds: 5, cue: 'Breathe out for 5' },
    ],
  },
  {
    id: 'physiological-sigh',
    name: 'Physiological sigh',
    why: 'A double inhale fully opens the lungs, and a long exhale is your body’s quickest built-in brake.',
    rounds: 6,
    phases: [
      { kind: 'in', seconds: 2, cue: 'Breathe in through your nose' },
      { kind: 'topUp', seconds: 1, cue: 'One more sip of air' },
      { kind: 'out', seconds: 7, cue: 'Long, slow breath out' },
    ],
  },
  {
    id: 'extended-exhale',
    name: 'Extended exhale',
    why: 'Breathing out longer than you breathe in tells your heart it’s safe to slow down.',
    rounds: 6,
    phases: [
      { kind: 'in', seconds: 4, cue: 'Breathe in for 4' },
      { kind: 'out', seconds: 6, cue: 'Breathe out for 6' },
    ],
  },
  {
    id: 'grounding',
    name: '5-4-3-2-1 grounding',
    why: 'Naming what’s around you brings your attention back to right here, right now.',
    rounds: 1,
    phases: [
      { kind: 'prompt', seconds: 12, cue: 'Find 5 things you can see' },
      { kind: 'prompt', seconds: 12, cue: 'Listen for 4 things you can hear' },
      { kind: 'prompt', seconds: 12, cue: 'Notice 3 things you can touch' },
      { kind: 'prompt', seconds: 12, cue: 'Notice 2 things you can smell' },
      { kind: 'prompt', seconds: 12, cue: 'Notice 1 thing you can taste' },
    ],
  },
  { id: 'panoramic-vision', name: 'Panoramic vision', why: '', rounds: 0, phases: [], hidden: true },
  { id: 'name-it', name: 'Name it to tame it', why: '', rounds: 0, phases: [], hidden: true },
  { id: 'muscle-release', name: 'Progressive muscle release', why: '', rounds: 0, phases: [], hidden: true },
  { id: 'cool-water', name: 'Cool water on face', why: '', rounds: 0, phases: [], hidden: true },
];

export const VISIBLE_STRATEGIES = STRATEGIES.filter((s) => !s.hidden);

export const DEFAULT_STRATEGY_ID = 'physiological-sigh';

export function getStrategy(id: string) {
  return VISIBLE_STRATEGIES.find((s) => s.id === id);
}

export function totalSeconds(strategy: Strategy) {
  return strategy.rounds * strategy.phases.reduce((sum, p) => sum + p.seconds, 0);
}

/** "72 seconds" under two minutes, otherwise "2 minutes". */
export function formatDuration(seconds: number) {
  if (seconds < 120) return `${seconds} second${seconds === 1 ? '' : 's'}`;
  return `${Math.round(seconds / 60)} minutes`;
}
