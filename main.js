//   function doAction(action, fallbackAction) {
//     clearTimeout(this.animationDuration);
//     this.setSprite(action);

//     if (fallbackAction) {
//       this.animationDuration = setTimeout(() => {
//         this.setSprite(fallbackAction);
//       }, CHARACTERS[this.name].animationDuration[action]);
//     }
//   }

//   const player = {
//     id,
//     name,
//     hp: 100,
//     isLost: function () {
//       return this.hp === 0;
//     },
//     punch: function (enemy, damage) {
//       enemy.setDamage(damage);
//       enemy.isLost()
//         ? this.doAction('punch', 'win')
//         : this.doAction('punch', 'pose');
//     },
//     setDamage: function (damage) {
//       this.changeHP(damage);
//       this.renderHP();
//       this.isLost()
//         ? this.doAction('fall', 'lose')
//         : this.doAction('fall', 'pose');
//     },
//     elHP,
//     changeHP,
//     renderHP,
//     create,
//     createLifePanel,
//     createCharacterPlaceholder,
//     doAction,
//     setSprite,
//     ...CHARACTERS[name],
//   };

//   return player.create();
// }

// function createArena(playerOne, playerTwo) {
//   function shufflePlayers(players) {
//     return players.sort(() => Math.random() - 0.5);
//   }

//   function getRandomDamage() {
//     return Math.ceil(Math.random() * 20);
//   }

//   function randomPunch() {
//     const [punisher, enemy] = shufflePlayers([playerOne, playerTwo]);

//     punisher.punch(enemy, getRandomDamage());

//     if (enemy.isLost()) {
//       finishHim(punisher);
//     }
//   }

//   function finishHim(winner) {
//     showResults(winner);
//   }
//   function showResults(winner) {
//     const $results = document.querySelector('.results');

//     $results.innerText = winner ? `${winner.name} wins` : `Draw`;
//     hideControl('restart', false);
//     disableControl('punch', true);
//   }

//   function createControls() {
//     const $restartBtn = createElement('button', {
//       classNames: ['btn', 'restart-btn'],
//     });
//     $restartBtn.innerText = 'restart';
//     $restartBtn.style.visibility = 'hidden';
//     $restartBtn.addEventListener('click', function () {
//       location.reload();
//     });

//     const $punchBtn = createElement('button', {
//       classNames: ['btn', 'punch-btn'],
//     });
//     $punchBtn.innerText = 'lucky punch';
//     $punchBtn.addEventListener('click', randomPunch);

//     document.querySelector('.control').append($punchBtn, $restartBtn);
//   }

//   function hideControl(name, state) {
//     const $control = document.querySelector(`.btn.${name}-btn`);

//     $control.style.visibility = state ? 'hidden' : 'visible';
//   }

//   function disableControl(name, state) {
//     const $control = document.querySelector(`.btn.${name}-btn`);

//     $control.disabled = state;
//   }

//   createControls();

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

  function hit(enemy, damage) {
    return enemy.setDamage(damage);
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
  const $results = document.querySelector('.results');
  const $fightBtn = document.querySelector('.btn.fight-btn');

  $fightBtn.addEventListener('click', fight);

  function getRandomFighter() {
    const fighters = Object.keys(FIGHTERS);

    return fighters[getRandom(fighters.length) - 1];
  }

  function randomHit(player, enemy) {
    player.hit(enemy, getRandom(20));
  }

  function fight() {
    randomHit(playerOne, playerTwo);
    randomHit(playerTwo, playerOne);

    if (playerOne.isLost() || playerTwo.isLost()) {
      congratulate(getWinner(playerOne, playerTwo));
      rematch();
    }
  }

  function congratulate({ name = '' }) {
    $results.innerText = name ? `${name} wins` : `Draw`;
  }

  function getWinner(playerOne, playerTwo) {
    return playerOne.isLost() ? playerTwo : playerOne;
  }

  function rematch() {
    $fightBtn.disabled = true;

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
