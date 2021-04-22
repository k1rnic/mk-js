import { getRandom } from './utils.js';

export const FIGHTERS = {
  anfisa: {
    weapon: ['fan'],
  },
  afro: {
    weapon: [],
  },
  ladyBoy: {
    weapon: [],
  },
};

const FIGHTER_NAMES = Object.keys(FIGHTERS);

const HIT = {
  head: 30,
  body: 25,
  foot: 20,
};

const ATTACK = Object.keys(HIT);

export const getFighterByName = (name) => ({
  name,
  hp: 100,
  ...FIGHTERS[name],
});

export const getRandomFighter = () => {
  const name = FIGHTER_NAMES[getRandom(FIGHTER_NAMES.length) - 1];

  return getFighterByName(name);
};

export const getRandomAttack = () => {
  const hit = ATTACK[getRandom(ATTACK.length) - 1];
  const defence = ATTACK[getRandom(ATTACK.length) - 1];
  const damage = getRandom(HIT[hit]);

  return { hit, damage, defence };
};

export const getRandomDamage = (hit) => getRandom(HIT[hit]);
