import FIGHTERS from '../data/fighters.js';
import Utils from './utils.js';
export class Fighter {
  static fighterNames = Object.keys(FIGHTERS);

  #sprite;

  constructor(name) {
    this.name = name;
    this.hp = 100;
    this.weapon = FIGHTERS[name]?.weapon;
    this.attack = FIGHTERS[name]?.attack;
    this.sprite = 'pose';
  }

  get sprite() {
    return this.#sprite;
  }

  set sprite(sprite) {
    this.#sprite = `./assets/fighters/${this.name}/${sprite}.gif`;
  }

  defend = ({ hit, damage }, defence) => {
    if (hit !== defence) {
      this.hp = Math.max(0, this.hp - damage);
    }

    return hit === defence;
  };

  getRandomDamage = (attack) => Utils.getRandom(this.attack[attack]);
}

export class RandomFighter extends Fighter {
  constructor() {
    const name =
      Fighter.fighterNames[Utils.getRandom(Fighter.fighterNames.length) - 1];
    super(name);
  }

  static getRandomAttack = (name) => {
    const attackList = Object.keys(FIGHTERS[name].attack);
    const hit = attackList[Utils.getRandom(attackList.length) - 1];
    const defence = attackList[Utils.getRandom(attackList.length) - 1];

    return { hit, defence };
  };
}
