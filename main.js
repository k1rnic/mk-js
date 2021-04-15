const CHARACTERS = {
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

function getRandomCharacter() {
  const chars = Object.keys(CHARACTERS);
  return chars[Math.ceil(Math.random() * chars.length) - 1];
}

function createElement(element, ...classNames) {
  const $htmlElement = document.createElement(element);
  $htmlElement.classList.add(...classNames);

  return $htmlElement;
}

function changeHP(damage) {
  this.hp = Math.max(0, this.hp - damage);
}

function elHP() {
  return this.$lifeIndicator;
}

function renderHP() {
  this.elHP().style.width = `${this.hp}%`;
}

function createPlayer(id, name) {
  function createLifePanel() {
    this.$lifeIndicator = createElement('div', 'life');
    this.$lifeIndicator.style.width = `${this.hp}%`;
    this.$characterName = createElement('div', 'name');
    this.$characterName.innerText = this.name;

    const $container = createElement('div', 'progressbar');
    $container.append(this.$lifeIndicator, this.$characterName);

    return $container;
  }

  function createCharacterPlaceholder() {
    this.$sprite = createElement('img', 'character-img');

    const $container = createElement('div', 'character');
    $container.appendChild(this.$sprite);

    return $container;
  }

  function create() {
    this.$element = createElement('div', `player${this.id}`);
    this.$element.append(
      this.createLifePanel(),
      this.createCharacterPlaceholder(),
    );
    this.setSprite('pose');

    return this;
  }

  function setSprite(action) {
    this.$sprite.setAttribute(
      'src',
      `./assets/fighters/${this.name}/${action}.gif`,
    );
  }

  function doAction(action, fallbackAction) {
    clearTimeout(this.animationDuration);
    this.setSprite(action);

    if (fallbackAction) {
      this.animationDuration = setTimeout(() => {
        this.setSprite(fallbackAction);
      }, CHARACTERS[this.name].animationDuration[action]);
    }
  }

  const player = {
    id,
    name,
    hp: 100,
    isLost: function () {
      return this.hp === 0;
    },
    punch: function (enemy, damage) {
      enemy.setDamage(damage);
      enemy.isLost()
        ? this.doAction('punch', 'win')
        : this.doAction('punch', 'pose');
    },
    setDamage: function (damage) {
      this.changeHP(damage);
      this.renderHP();
      this.isLost()
        ? this.doAction('fall', 'lose')
        : this.doAction('fall', 'pose');
    },
    elHP,
    changeHP,
    renderHP,
    create,
    createLifePanel,
    createCharacterPlaceholder,
    doAction,
    setSprite,
    ...CHARACTERS[name],
  };

  return player.create();
}

function createArena(playerOne, playerTwo) {
  function shufflePlayers(players) {
    return players.sort(() => Math.random() - 0.5);
  }

  function getRandomDamage() {
    return Math.ceil(Math.random() * 20);
  }

  function randomPunch() {
    const [punisher, enemy] = shufflePlayers([playerOne, playerTwo]);

    punisher.punch(enemy, getRandomDamage());

    if (enemy.isLost()) {
      finishHim(punisher);
    }
  }

  function finishHim(winner) {
    showResults(winner);
  }

  function showResults(winner) {
    const $results = document.querySelector('.results');

    $results.innerText = winner ? `${winner.name} wins` : `Draw`;
    hideControl('restart', false);
    disableControl('punch', true);
  }

  function createControls() {
    const $restartBtn = createElement('button', 'btn', 'restart-btn');
    $restartBtn.innerText = 'restart';
    $restartBtn.style.visibility = 'hidden';
    $restartBtn.addEventListener('click', function () {
      location.reload();
    });

    const $punchBtn = createElement('button', 'btn', 'punch-btn');
    $punchBtn.innerText = 'lucky punch';
    $punchBtn.addEventListener('click', randomPunch);

    document.querySelector('.control').append($punchBtn, $restartBtn);
  }

  function hideControl(name, state) {
    const $control = document.querySelector(`.btn.${name}-btn`);

    $control.style.visibility = state ? 'hidden' : 'visible';
  }

  function disableControl(name, state) {
    const $control = document.querySelector(`.btn.${name}-btn`);

    $control.disabled = state;
  }

  createControls();

  document
    .querySelector('.arenas')
    .append(playerOne.$element, playerTwo.$element);
}

const arena = createArena(
  createPlayer(1, getRandomCharacter()),
  createPlayer(2, getRandomCharacter()),
);
