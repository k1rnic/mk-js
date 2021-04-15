function el(tag, text) {
  function attrs(attrs = {}) {
    for (let key in attrs) {
      this.$el.setAttribute(key, attrs[key]);
    }
    return this;
  }

  function styles(styles) {
    if (styles) {
      Object.assign(this.$el.style, styles);
    }
    return this;
  }

  function classes(...cn) {
    this.$el.classList.add(...cn);
    return this;
  }

  function children(...children) {
    this.$el.append(...children);
    return this;
  }

  const $el = document.createElement(tag);

  if (text) {
    $el.innerText = text;
  }

  return { $el, classes, attrs, styles, children };
}

const FIGHTERS = {
  anfisa: {
    weapon: ['fan'],
    animationDuration: {
      punch: 1500,
      fall: 1500,
    },
  },
  afro: {
    weapon: [],
    animationDuration: {
      punch: 1000,
      fall: 2500,
    },
  },
  ladyBoy: {
    weapon: [],
    animationDuration: {
      punch: 1000,
      fall: 1250,
    },
  },
};

const HIT = {
  head: 30,
  body: 25,
  foot: 20,
};
const ATTACK = ['head', 'body', 'foot'];

function getRandom(range) {
  return Math.ceil(Math.random() * range);
}

function createFighter(name) {
  return {
    name,
    hp: 100,
    ...FIGHTERS[name],
  };
}

function createPlayer(id, name) {
  function _createLifeIndicator() {
    this.$lifeIndicator = el('div').classes('life');
    this.$namePlaceholder = el('div', this.name).classes('name');

    return el('div')
      .classes('progressbar')
      .children(this.$lifeIndicator.$el, this.$namePlaceholder.$el).$el;
  }

  function _createFighterPlaceholder() {
    this.$sprite = el('img').classes('character-img');

    return el('div').classes('character').children(this.$sprite.$el).$el;
  }

  function _render() {
    this.$el = el('div')
      .classes(`player${this.id}`)
      .children(
        this._createLifeIndicator(),
        this._createFighterPlaceholder(),
      ).$el;

    return this._renderHP()._renderFighter();
  }

  function _renderHP() {
    this.$lifeIndicator.styles({ width: `${this.hp}%` });
    return this;
  }

  function _renderFighter(sprite = 'pose') {
    this.$sprite.attrs({ src: `./assets/fighters/${this.name}/${sprite}.gif` });
    return this;
  }

  function _changeHP(damage) {
    this.hp = Math.max(0, this.hp - damage);
    return this;
  }

  function isLost() {
    return this.hp === 0;
  }

  function setDamage(damage) {
    return this._changeHP(damage)._renderHP();
  }

  function hit(enemy, attack) {
    return enemy.setDamage(attack.damage);
  }

  const fighter = createFighter(name);

  const player = {
    id,
    isLost,
    hit,
    setDamage,
    _render,
    _renderHP,
    _renderFighter,
    _createLifeIndicator,
    _createFighterPlaceholder,
    _changeHP,
    ...fighter,
  };

  return player._render();
}

function createArena(playerOne, playerTwo) {
  const $arena = document.querySelector('.arenas');
  $arena.append(playerOne, playerTwo);

  return $arena;
}

function createDeadMatch() {
  const playerOne = createPlayer(1, getRandomFighter());
  const playerTwo = createPlayer(2, getRandomFighter());

  const $arena = createArena(playerOne.$el, playerTwo.$el);
  const $chat = document.querySelector('.chat');
  const $results = document.querySelector('.results');
  const $controller = document.querySelector('.controller');

  function getRandomFighter() {
    const fighters = Object.keys(FIGHTERS);

    return fighters[getRandom(fighters.length) - 1];
  }

  $controller.addEventListener('submit', function (e) {
    e.preventDefault();
    fight();
    $controller.reset();
  });

  function getEnemyAttack() {
    const hit = ATTACK[getRandom(ATTACK.length) - 1];
    const defence = ATTACK[getRandom(ATTACK.length) - 1];
    const damage = getRandom(HIT[hit]);

    return { hit, damage, defence };
  }

  function getPlayerAttack() {
    const attack = {};

    for (let i of $controller) {
      if (i.checked && i.name === 'hit') {
        attack.hit = i.value;
        attack.damage = getRandom(HIT[i.value]);
      }

      if (i.checked && i.name === 'defence') {
        attack.defence = i.value;
      }
    }

    return attack;
  }

  function fight() {
    const playerAttack = getPlayerAttack();
    const enemyAttack = getEnemyAttack();

    if (playerAttack.hit !== enemyAttack.defence) {
      playerOne.hit(playerTwo, getPlayerAttack());
      log(
        `[attack] You hit ${playerTwo.name} to ${playerAttack.hit}. Damage ${playerAttack.damage}.`,
        'success',
      );
    } else {
      log(
        `[attack] ${playerTwo.name} repulsed the attack to ${playerAttack.hit}.`,
        'info',
      );
    }

    if (enemyAttack.hit !== playerAttack.defence) {
      playerTwo.hit(playerOne, getEnemyAttack());
      log(
        `[defence] ${playerTwo.name} hit you to ${enemyAttack.hit}. Damage ${enemyAttack.damage}.`,
        'warning',
      );
    } else {
      log(`[defence] You repulsed the attack to ${enemyAttack.hit}.`, 'info');
    }

    if (playerOne.isLost() || playerTwo.isLost()) {
      congratulate(getWinner(playerOne, playerTwo));
      rematch();
    }
  }

  function log(text, level) {
    const message = el('p', `${text}`).classes('message', level).$el;

    $chat.prepend(message);
  }

  function congratulate({ name = '' }) {
    $results.innerText = name ? `${name} wins` : `Draw`;
  }

  function getWinner(playerOne, playerTwo) {
    return playerOne.isLost() ? playerTwo : playerOne;
  }

  function rematch() {
    $controller.remove();
    const $rematchBtn = el('button', 'rematch').classes('btn', 'rematch-btn')
      .$el;

    $rematchBtn.addEventListener('click', function () {
      window.location.reload();
    });

    const $rematchBtnContainer = el('div')
      .classes('reloadWrap')
      .children($rematchBtn).$el;

    $arena.append($rematchBtnContainer);
  }
}

const deadMatch = createDeadMatch();
