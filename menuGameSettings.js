function startGame() {
    var playerName = document.getElementById("playerName").value
    
     // Sprawdzenie, czy pole jest puste
    if (playerName == "") {
      alert("Proszę podać nazwę gracza")
      return false; // Zatrzymuje dalsze działanie funkcji
    }

    var themeChoice = document.querySelector('input[name="themeChoice"]:checked').value;

    // Create a JSON object
    var playerData = {
      name: playerName
    };

    var themeData = {
        theme: themeChoice
    };
    
    // Convert the JSON object into a string
    var playerDataJSON = JSON.stringify(playerData);
    var themeDataJSON = JSON.stringify(themeData);
    
    // Now playerDataJSON contains the player's data in JSON format
    console.log(playerDataJSON);
    console.log(themeDataJSON);

    localStorage.setItem('playerData', playerDataJSON);
    localStorage.setItem('themeData', themeDataJSON);

    window.location.href = 'game.html'
    // Tutaj możesz przekierować gracza do gry
  }