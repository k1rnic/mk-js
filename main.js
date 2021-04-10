function createCharacter(name, weapon = ['заточка']) {
  return {
    name,
    hp: 100,
    weapon,
    attack: function () {
      console.log(`${name} Fight...`);
    },
  };
}

function htmlCreate(element, ...classNames) {
  const $htmlElement = document.createElement(element);
  $htmlElement.classList.add(...classNames);

  return $htmlElement;
}

function createPlayer(player, character) {
  function createLifePanel(character) {
    const $container = htmlCreate('div', 'progressbar');

    const $lifeIndicator = htmlCreate('div', 'life', `life-${character.hp}`);
    const $characterName = htmlCreate('div', 'name');

    $characterName.innerText = character.name;

    $container.append($lifeIndicator, $characterName);

    return $container;
  }

  function createCharacter(character) {
    console.log(character);

    const $container = htmlCreate('div', 'character');
    const $characterImg = htmlCreate('img', 'character-img');

    $characterImg.setAttribute(
      'src',
      `./assets/fighters/${character.name}.gif`,
    );

    $container.appendChild($characterImg);

    return $container;
  }

  const $container = htmlCreate('div', player);

  const lifePanel = createLifePanel(character);
  $container.appendChild(lifePanel);
  $container.appendChild(createCharacter(character));

  return $container;
}

function addToArena(player) {
  const $arena = document.querySelector('.arenas');

  $arena.appendChild(player);
}

const playerOne = createPlayer('player1', createCharacter('policewoman'));
const playerTwo = createPlayer('player2', createCharacter('sister'));

addToArena(playerOne);
addToArena(playerTwo);
