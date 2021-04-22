import Component from './component.js';

export default function (id, { name, hp, weapon }) {
  this.id = id;
  this.name = name;
  this.hp = hp;
  this.weapon = weapon;

  this._renderLifeIndicator = () => {
    this.$lifeIndicator = new Component('div').classes('life');
    this.$namePlaceholder = new Component('div', this.name).classes('name');

    return new Component('div')
      .classes('progressbar')
      .children(this.$lifeIndicator.get(), this.$namePlaceholder.get())
      .get();
  };

  this._renderFighterPlaceholder = () => {
    this.$sprite = new Component('img').classes('character-img');

    return new Component('div')
      .classes('character')
      .children(this.$sprite.get())
      .get();
  };

  this._render = () => {
    this.$el = new Component('div')
      .classes(`player${this.id}`)
      .children(this._renderLifeIndicator(), this._renderFighterPlaceholder())
      .get();

    return this._renderHP()._renderFighter();
  };

  this._renderHP = () => {
    this.$lifeIndicator.styles({ width: `${this.hp}%` });
    return this;
  };

  this._renderFighter = (sprite = 'pose') => {
    this.$sprite.attrs({ src: `./assets/fighters/${this.name}/${sprite}.gif` });

    return this;
  };

  this._changeHP = (damage) => {
    this.hp = Math.max(0, this.hp - damage);
    return this;
  };

  this.isLost = () => this.hp === 0;

  this.defend = ({ hit, damage }, defence) => {
    if (hit !== defence) {
      this._changeHP(damage)._renderHP();
      if (this.isLost()) {
        this._renderFighter('lose');
      }
    }

    return hit === defence;
  };

  this.hit = (enemy, attack, defence) => {
    const isDefended = enemy.defend(attack, defence);

    if (enemy.isLost() && !this.isLost()) {
      this._renderFighter('win');
    }

    return isDefended;
  };

  this._render();
}
