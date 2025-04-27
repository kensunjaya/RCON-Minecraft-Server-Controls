import { Players } from "../interfaces/interface";

export const sendCommand = async (command: string, playsound = false) => {
  if (playsound) {
    const audio = new Audio('/button.mp3');
    audio.play();
  }
  try {
    const res = await fetch('/api/rcon', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command }),
    });

    const data = await res.json();

    if (res.ok) {
      return data.result
    } else {
      return data.error
    }
  } catch (error) {
    return error
  }
};

export const sendMultipleCommand = async(commands: string[]) => {
  try {
    const response = await fetch('/api/rcon-multiple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ commands }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error:', errorData.error);
      return;
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    return error
  }
}

export const login = async (username: string, onlinePlayers: Players) => {
  const onlinePlayersNames = onlinePlayers.list.map(player => player.name_clean);
  for (const name of onlinePlayersNames) {
    if (name === username) {
      localStorage.setItem('username', username);
      return true
    }
  }
  alert('Username not found in online players list');
  return false;
}