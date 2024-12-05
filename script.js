document.addEventListener("DOMContentLoaded", () => {
  let players = [];
  let lifePoints = 5;

  const homePage = document.getElementById("home-page");
  const formPage = document.getElementById("player-form-page");
  const gamePage = document.getElementById("game-page");

  const classicModeBtn = document.getElementById("classic-mode-btn");
  const challengeModeBtn = document.getElementById("challenge-mode-btn");
  const backToHomeFormBtn = document.getElementById("back-to-home-form-btn");
  const backToHomeBtn = document.getElementById("back-to-home-btn");
  const restartBtn = document.getElementById("restart-btn");

  const playerNameInput = document.getElementById("player-name");
  const savePlayerBtn = document.getElementById("save-player-btn");
  const playerList = document.getElementById("player-list");
  const startGameBtn = document.getElementById("start-game-btn");

  const gamePlayerList = document.getElementById("game-player-list");
  const popup = document.getElementById("popup");
  const popupMessage = document.getElementById("popup-message");

  const customColors = ['#0062FF', '#FFFF00', '#FF1D1D', '#51FF00'];

  function generateUniqueColor(existingColors) {
    const availableColors = customColors.filter((color) => !existingColors.includes(color));
    return availableColors.length > 0 ? availableColors[0] : `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  }

  function showPage(page) {
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    page.classList.add("active");
  }

  function showPopup(message, isError = false) {
    popupMessage.textContent = message;
    popupMessage.style.color = isError ? 'red' : '#1F242E';
    popup.classList.add("active");
    setTimeout(() => popup.classList.remove("active"), 2000);
  }

  window.showPopup = showPopup;

  classicModeBtn.addEventListener("click", () => {
    lifePoints = 5;
    showPage(formPage);
  });

  challengeModeBtn.addEventListener("click", () => {
    lifePoints = 3;
    showPage(formPage);
  });

  savePlayerBtn.addEventListener("click", () => {
    const playerName = playerNameInput.value.trim();
    if (playerName && players.length < 4) {
      const existingColors = players.map((player) => player.color);
      const assignedColor = generateUniqueColor(existingColors);
      players.push({ name: playerName, life: lifePoints, color: assignedColor });
      playerNameInput.value = "";
      updatePlayerList();
    }
    if (players.length === 4) savePlayerBtn.disabled = true;
  });

  function updatePlayerList() {
    playerList.innerHTML = "";
    players.forEach((player) => {
      const li = document.createElement("li");
      li.style.borderLeft = `5px solid ${player.color}`;
      li.style.padding = "5px";
      li.textContent = `${player.name} (${player.life} Lifes)`;
      playerList.appendChild(li);
    });
    startGameBtn.disabled = players.length < 2;
  }

  startGameBtn.addEventListener("click", () => {
    if (players.length >= 2) {
      const randomIndex = Math.floor(Math.random() * players.length);
      showPopup(`${players[randomIndex].name} starts the game!`);
      setTimeout(() => {
        showPage(gamePage);
        updateGamePage();
      }, 2000);
    } else {
      showPopup("The game requires between 2 and 4 players. Add players before you start!", true);
    }
  });

  function updateGamePage() {
    gamePlayerList.innerHTML = "";
    players.forEach((player) => {
        const li = document.createElement("li");
        li.classList.add("game-player-item");
        li.style.borderColor = player.color;

        const disableMinus = player.life === 0 ? 'disabled' : '';
        const disablePlus = player.life === lifePoints || player.life === 0 ? 'disabled' : '';

        li.innerHTML = `
            <span style="color: ${player.color};">${player.name}</span>
            <div style="display: flex; gap: 0.5rem;">
                <button onclick="updateLives(${players.indexOf(player)}, -1)" ${disableMinus}>-</button>
                <span>${player.life}</span>
                <button onclick="updateLives(${players.indexOf(player)}, 1)" ${disablePlus}>+</button>
            </div>
        `;
        gamePlayerList.appendChild(li);
    });
}



window.updateLives = function (index, change) {
  players[index].life += change;

  if (players[index].life < 0) players[index].life = 0;

  if (players[index].life > lifePoints) players[index].life = lifePoints;

  updateGamePage();
};



  restartBtn.addEventListener("click", () => {
    players = players.map((player) => ({ ...player, life: lifePoints }));
    updateGamePage();
    const randomIndex = Math.floor(Math.random() * players.length);
    showPopup(`${players[randomIndex].name} starts the game again!`);
  });

  backToHomeBtn.addEventListener("click", () => {
    players = [];
    savePlayerBtn.disabled = false;
    updatePlayerList();
    showPage(homePage);
  });

  backToHomeFormBtn.addEventListener("click", () => {
    players = [];
    savePlayerBtn.disabled = false;
    updatePlayerList();
    showPage(homePage);
  });
});