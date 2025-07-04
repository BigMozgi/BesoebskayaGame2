// Настройки игры
if (window.Telegram?.WebApp?.platform) {
  Telegram.WebApp.expand(); // Раскрываем на весь экран
  Telegram.WebApp.MainButton.setText("🔄 Обновить").show(); // Кнопка
}

const demonImages = {
  happy: "assets/happy.png",
  hungry: "assets/hungry.png",
  angry: "assets/angry.png",
  dead: "assets/dead.png",
  default: "assets/happy.png"
};

let demon = {
  hunger: 50,
  mood: 50
};

let isDead = false;

function updateStats() {
  const demonImg = document.getElementById("demon");
  if (!demonImg) {
    console.error("Элемент с id='demon' не найден");
    return;
  }

  // Проверка смерти
  if (demon.hunger <= 0 || demon.mood <= 0) {
    isDead = true;
    demon.hunger = 0;
    demon.mood = 0;
    demonImg.src = demonImages.dead;
    document.getElementById("hunger").textContent = 0;
    document.getElementById("mood").textContent = 0;

    const playDeathSound = () => {
      const audio = new Audio("assets/dead.ogg");
      audio.play().catch(e => console.log("Ошибка звука:", e));
    };

    if (!window.Telegram?.WebApp?.platform) {
      document.body.addEventListener("click", playDeathSound, { once: true });
    } else {
      playDeathSound();
    }

    setTimeout(() => {
      alert("Бес умер! Начни заново.");
      resetGame();
    }, 50);
    return;
  }

  // Состояние демона
  if (demon.hunger < 20) {
    demonImg.src = demonImages.hungry;
  } else if (demon.mood < 30) {
    demonImg.src = demonImages.angry;
  } else if (demon.mood > 70) {
    demonImg.src = demonImages.happy;
  } else {
    demonImg.src = demonImages.default;
  }

  // Обновление текста
  document.getElementById("hunger").textContent = demon.hunger;
  document.getElementById("mood").textContent = demon.mood;
}

// Действия
function feed() {
  if (isDead) return;
  demon.hunger = Math.min(demon.hunger + 20, 100);
  updateStats();
}

function play() {
  if (isDead) return;
  demon.mood = Math.min(demon.mood + 15, 100);
  demon.hunger = Math.max(demon.hunger - 5, 0);
  updateStats();
}

function clean() {
  if (isDead) return;
  demon.mood = Math.min(demon.mood + 10, 100);
  updateStats();
}

// Авто-ухудшение
setInterval(() => {
  if (isDead) return;
  demon.hunger = Math.max(demon.hunger - 10, 0);
  demon.mood = Math.max(demon.mood - 7, 0);
  updateStats();
}, 1000);

// Сброс игры
function resetGame() {
  demon.hunger = 50;
  demon.mood = 50;
  isDead = false;
  updateStats();
}

// Фоновая музыка
const bgMusic = new Audio("assets/fonofaya.ogg");
bgMusic.loop = true;
bgMusic.volume = 0.3;

if (window.Telegram?.WebApp?.platform) {
  bgMusic.play().catch(e => console.log("Не удалось запустить музыку:", e));
}

document.getElementById("music-toggle")?.addEventListener("click", () => {
  bgMusic.paused ? bgMusic.play() : bgMusic.pause();
});
// Гарантированный запуск после клика
if (bgMusic.paused) {
  document.body.addEventListener("click", function startMusic() {
    bgMusic.play().catch(e => console.log("Музыка не воспроизвелась:", e));
    document.body.removeEventListener("click", startMusic);
  });
}
// Старт
updateStats();