import Component from './component.js';
import Logger from './logger.js';
export class Player {
  #component;
  #lifeIndicator;
  #namePlaceholder;
  #sprite;

  constructor(id, fighter) {
    this.id = id;
    this.fighter = fighter;

    this.#render();
  }

  get looser() {
    return this.fighter.hp === 0;
  }

  get element() {
    return this.#component;
  }

  attack = (enemy, { hit }, defence) => {
    const damage = this.fighter.getRandomDamage(hit);
    const isDefended = enemy.defend({ hit, damage }, defence);

    isDefended ? Logger.defence(this, enemy) : Logger.hit(this, enemy, damage);

    if (enemy.looser && !this.fighter.looser) {
      this.#changeSprite('win');
    }
  };

  defend = (attack, defence) => {
    const isDefended = this.fighter.defend(attack, defence);

    if (!isDefended) {
      this.#renderHP();
    }

    if (this.looser) {
      this.#changeSprite('lose');
    }

    return isDefended;
  };

  #changeSprite = (sprite) => {
    this.fighter.sprite = sprite;
    this.#renderFighter();
  };

  #render = () => {
    this.#component = new Component('div')
      .classes(`player${this.id}`)
      .children(this.#renderLifeIndicator(), this.#renderFighterPlaceholder())
      .get();

    return this.#renderHP().#renderFighter();
  };

  #renderLifeIndicator = () => {
    this.#lifeIndicator = new Component('div').classes('life');
    this.#namePlaceholder = new Component('div', this.fighter.name).classes(
      'name',
    );

    return new Component('div')
      .classes('progressbar')
      .children(this.#lifeIndicator.get(), this.#namePlaceholder.get())
      .get();
  };

  #renderFighterPlaceholder = () => {
    this.#sprite = new Component('img').classes('character-img');

    return new Component('div')
      .classes('character')
      .children(this.#sprite.get())
      .get();
  };

  #renderHP = () => {
    this.#lifeIndicator.styles({ width: `${this.fighter.hp}%` });
    return this;
  };

  #renderFighter = () => {
    this.#sprite.attrs({
      src: this.fighter.sprite,
    });

    return this;
  };
}
