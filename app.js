const bullets = [];  // tablica na pociski
const enemies = [];  // tablica na statki

const playerElement = document.querySelector('#player');
const boardElement = document.querySelector('#game-board');

const movePlayer = (direction) => {
  // policz nową pozycję playera
  const newPosition = playerElement.offsetLeft + direction * 10;

// pobierz pozycję planszy
  const { left, right } = boardElement.getBoundingClientRect();

  const playerElementHalfWidth = playerElement.offsetWidth / 2;
  const minLeft = playerElementHalfWidth;
  const maxRight = right - left - playerElementHalfWidth;

  // przesuń playera jeśli mieści się w planszy
  if (newPosition >= minLeft && newPosition <= maxRight) {
    playerElement.style.left = `${newPosition}px`;  // left jak styl inline, nadpisuje wartość ze stylesheeta; należy dodać do stałej px
  }
}

const createBullet = () => {
  // zdefinij pocisk
  const bullet = document.createElement('div');
  bullet.classList = 'bullet';
  bullet.style.left = `${playerElement.offsetLeft}px`;
  bullet.style.bottom = `${playerElement.offsetHeight}px`;

  // dodaj pocisk na tablicę
  boardElement.appendChild(bullet);
  bullets.push(bullet);
}

const handleKeyboard = (e) => {
  switch (e.code) {
    case 'ArrowLeft': movePlayer(-1); break;
    case 'ArrowRight': movePlayer(1); break;
    case 'Space': createBullet();
  }
}

// obsłużenie klawiatury
window.addEventListener('keydown', handleKeyboard);

const checkCollision = (bullet, enemy) => {
  return (bullet.left > enemy.left && bullet.right < enemy.right)
  && (bullet.top < enemy.bottom);
}

const checkBulletCollision = (bullet) => {
  const bulletPosition = bullet.getBoundingClientRect();

  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    const enemyPosition = enemy.getBoundingClientRect();

    // czy pocisk i statek znajdują się w tym samym miejscu
    if (checkCollision(bulletPosition, enemyPosition)) {
      // usuń pocisk
      const idxB = bullets.indexOf(bullet);
      bullets.splice(idxB, 1);
      bullet.remove();

      const idxE = enemies.indexOf(enemy);
      enemies.splice(idxE, 1);
      enemy.remove();

      break;
    }
  }
}

const moveBullets = () => {
  for (let i = 0; i < bullets.length; i++) {
    const bullet = bullets[i];

  // przesuń pocisk
    bullet.style.top = `${bullet.offsetTop - 10}px`;

    if (bullet.offsetTop <= 0) {
    //  usuń pocisk jeśli jest za planszą; splice(start, deleteCount)
    bullets.splice(i, 1);  
    i--;  // odejmij tego bulleta z tablicy
    bullet.remove();  // usunięcie pocisku z kodu html
    } else {
      // sprwdź czy pocisk coś trafił
      checkBulletCollision(bullet);
    }
  }
}

const createEnemy = () => {
  //twórz statki losowo (raz tak, raz nie)
  const shouldCreate = Math.round(Math.random());
  if (!shouldCreate) return;

  // zdefiniuj statek
  const enemy = document.createElement('div');
  enemy.className = 'enemy';
  enemy.style.top = -40 + 'px';
  enemy.style.left = `${Math.floor(Math.random() * (boardElement.offsetWidth - 120) + 60)}px`;

  // dodaj do tablicy
  boardElement.appendChild(enemy);
  enemies.push(enemy);
}

const moveEnemies = () => {
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
    // przesuń statek w dół
    enemy.style.top = `${enemy.offsetTop + 5}px`;

    // usuwaj statek gdy wyjedzie poza mapę
    if (enemy.offsetTop >= boardElement.offsetHeight) {
      enemies.splice(i, 1);
      enemy.remove();
      alert('Koniec gry!');
    }
  }
}

// interwały
setInterval(moveBullets, 50);
setInterval(moveEnemies, 150);
setInterval(createEnemy, 1000);
