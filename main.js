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

const LOGS = {
  start: (playerOne, playerTwo) => [
    `Часы показывали ${new Date().getHours()}:${(
      '0' + new Date().getMinutes()
    ).slice(-2)}, когда ${playerOne.name} и ${
      playerTwo.name
    } бросили вызов друг другу.`,
  ],
  end: (winner, looser) => [
    `Результат удара ${winner.name}: ${looser.name} - труп`,
    `${looser.name} погиб от удара бойца ${winner.name}`,
    `Результат боя: ${looser.name} - жертва, ${winner.name} - убийца`,
  ],
  hit: (puncher, defender) => [
    `${defender.name} пытался сконцентрироваться, но ${puncher.name} разбежавшись раздробил копчиком левое ухо врага. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} расстроился, как вдруг, неожиданно ${puncher.name} случайно раздробил грудью грудину противника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} зажмурился, а в это время ${puncher.name}, прослезившись, раздробил кулаком пах оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} чесал <вырезано цензурой>, и внезапно неустрашимый ${puncher.name} отчаянно размозжил грудью левый бицепс оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} задумался, но внезапно ${puncher.name} случайно влепил грубый удар копчиком в пояс оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} ковырялся в зубах, но ${puncher.name} проснувшись влепил тяжелый удар пальцем в кадык врага. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} вспомнил что-то важное, но внезапно ${puncher.name} зевнув, размозжил открытой ладонью челюсть противника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, и в это время ${puncher.name} мимоходом раздробил стопой аппендикс соперника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} кашлянул, но внезапно ${puncher.name} показав палец, размозжил пальцем грудь соперника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} пытался что-то сказать, а жестокий ${puncher.name} проснувшись размозжил копчиком левую ногу противника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} забылся, как внезапно безумный ${puncher.name} со скуки, влепил удар коленом в левый бок соперника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} поперхнулся, а за это ${puncher.name} мимоходом раздробил коленом висок врага. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} расстроился, а в это время наглый ${puncher.name} пошатнувшись размозжил копчиком губы оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, но внезапно ${puncher.name} робко размозжил коленом левый глаз противника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} осмотрелся, а ${puncher.name} вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} ковырялся в зубах, как вдруг, неожиданно ${puncher.name} отчаянно размозжил плечом мышцы пресса оппонента. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} пришел в себя, и в это время ${puncher.name} провел разбивающий удар кистью руки, пробив блок, в голень противника. -${puncher.damage} [${defender.hp}/100]`,
    `${defender.name} пошатнулся, а в это время ${puncher.name} хихикая влепил грубый удар открытой ладонью по бедрам врага. -${puncher.damage} [${defender.hp}/100]`,
  ],
  defence: (puncher, defender) => [
    `${puncher.name} потерял момент и храбрый ${defender.name} отпрыгнул от удара открытой ладонью в ключицу.`,
    `${puncher.name} не контролировал ситуацию, и потому ${defender.name} поставил блок на удар пяткой в правую грудь.`,
    `${puncher.name} потерял момент и ${defender.name} поставил блок на удар коленом по селезенке.`,
    `${puncher.name} поскользнулся и задумчивый ${defender.name} поставил блок на тычок головой в бровь.`,
    `${puncher.name} старался провести удар, но непобедимый ${defender.name} ушел в сторону от удара копчиком прямо в пятку.`,
    `${puncher.name} обманулся и жестокий ${defender.name} блокировал удар стопой в солнечное сплетение.`,
    `${puncher.name} не думал о бое, потому расстроенный ${defender.name} отпрыгнул от удара кулаком куда обычно не бьют.`,
    `${puncher.name} обманулся и жестокий ${defender.name} блокировал удар стопой в солнечное сплетение.`,
  ],
  draw: () => 'Ничья - это тоже победа!',
};

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

  function _renderFighter(sprite = 'pose', fallbackSprite = '') {
    clearTimeout(this._animating);
    this.$sprite.attrs({ src: `./assets/fighters/${this.name}/${sprite}.gif` });

    if (fallbackSprite) {
      this._animating = setTimeout(() => {
        this.$sprite.attrs({
          src: `./assets/fighters/${this.name}/${fallbackSprite}.gif`,
        });
      }, FIGHTERS[this.name].animationDuration[sprite]);
    }

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
    this._changeHP(damage)._renderHP();

    this.isLost()
      ? this._renderFighter('fall', 'lose')
      : this._renderFighter('fall', 'pose');
  }

  function hit(enemy, attack) {
    enemy.setDamage(attack.damage);

    enemy.isLost()
      ? this._renderFighter('punch', 'win')
      : this._renderFighter('punch', 'pose');
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
    _animating: false,
    ...fighter,
  };

  return player._render();
}

function createArena(playerOne, playerTwo) {
  const $arena = document.querySelector('.arenas');
  $arena.append(playerOne, playerTwo);

  return $arena;
}

function createLogger() {
  const $chat = document.querySelector('.chat');

  function getRandomLogByType(type, ...args) {
    const logsByType = LOGS[type](...args);
    return logsByType[getRandom(logsByType.length - 1)];
  }

  function log(type, level, ...args) {
    const date = new Date();
    const time = `${date.getHours()}:${('0' + date.getMinutes()).slice(-2)}`;
    const text = getRandomLogByType(type, ...args);

    const message = el('p', `[${time}] ${text}`).classes('message', level).$el;

    $chat.prepend(message);
  }

  return { log };
}

function createDeadMatch() {
  const playerOne = createPlayer(1, getRandomFighter());
  const playerTwo = createPlayer(2, getRandomFighter());

  const $arena = createArena(playerOne.$el, playerTwo.$el);
  const $results = document.querySelector('.results');
  const $controller = document.querySelector('.controller');

  const logger = createLogger();

  logger.log('start', 'info', playerOne, playerTwo);

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
      playerOne.hit(playerTwo, playerAttack);
      logger.log(
        'hit',
        'success',
        {
          name: playerOne.name,
          ...playerAttack,
        },
        playerTwo,
      );
    } else {
      logger.log('defence', 'info', playerOne, playerTwo);
    }

    if (enemyAttack.hit !== playerAttack.defence) {
      playerTwo.hit(playerOne, enemyAttack);
      logger.log(
        'hit',
        'warning',
        {
          name: playerTwo.name,
          ...enemyAttack,
        },
        playerOne,
      );
    } else {
      logger.log('defence', 'info', playerTwo, playerOne);
    }

    if (playerOne.isLost() || playerTwo.isLost()) {
      const winner = getWinner(playerOne, playerTwo);

      congratulate(winner);

      if (playerOne.isLost()) {
        logger.log('end', 'info', playerTwo, playerOne);
      } else if (playerTwo.isLost()) {
        logger.log('end', 'info', playerOne, playerTwo);
      }

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
