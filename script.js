// Настройки игры
// Проверяем, что игра открыта в Telegram
if (window.Telegram?.WebApp?.platform) {
  Telegram.WebApp.expand(); // Раскрываем на весь экран
  Telegram.WebApp.MainButton.setText("🔄 Обновить").show(); // Добавляем кнопку
}
const demonImages = {
  happy: "assets/happy.png",    // Довольный
  hungry: "assets/hungry.png",  // Голодный
  angry: "assets/angry.png",    // Злой
  dead: "assets/dead.png",      // Мёртвый
  default: "assets/happy.png"   // Нейтральный
};

let demon = {
  hunger: 50,
  mood: 50
};

// Функция обновления состояния - ИЗМЕНИТЬ ЭТУ ФУНКЦИЮ ПОЛНОСТЬЮ
function updateStats() {
  const demonImg = document.getElementById("demon");
  
  // Сначала проверяем смерть (это важно!)
  if (demon.hunger <= 0 || demon.mood <= 0) {
    demonImg.src = demonImages.dead; // Сначала меняем картинку
    document.getElementById("hunger").textContent = 0;
    document.getElementById("mood").textContent = 0;
    
    setTimeout(() => { // Даём 50мс на отрисовку картинки
      alert("Бес умер! Начни заново.");
      resetGame();
    }, 50);
    return; // Выходим из функции
  }
  
  // Обновляем цифры
  document.getElementById("hunger").textContent = demon.hunger;
  document.getElementById("mood").textContent = demon.mood;
  
  // Меняем картинку для живого беса
  if (demon.hunger < 20) {
    demonImg.src = demonImages.hungry;
  } 
  else if (demon.mood < 30) {
    demonImg.src = demonImages.angry;
  } 
  else if (demon.mood > 70) {
    demonImg.src = demonImages.happy;
  } 
  else {
    demonImg.src = demonImages.default;
  }
}

// Остальные функции БЕЗ ИЗМЕНЕНИЙ
function feed() {
  demon.hunger = Math.min(demon.hunger + 20, 100);
  updateStats();
}

function play() {
  demon.mood = Math.min(demon.mood + 15, 100);
  demon.hunger = Math.max(demon.hunger - 5, 0);
  updateStats();
}

function clean() {
  demon.mood = Math.min(demon.mood + 10, 100);
  updateStats();
}

// Авто-ухудшение параметров
setInterval(() => {
  demon.hunger -= 10;
  demon.mood -= 7;
  updateStats();
}, 1000);

// Сброс игры
function resetGame() {
  demon.hunger = 50;
  demon.mood = 50;
  updateStats();
}

// Старт игры
updateStats();
