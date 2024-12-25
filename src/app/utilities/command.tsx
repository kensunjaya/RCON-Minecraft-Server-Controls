import { Player } from "../interfaces/interface";

export const sendCommand = async (command: string) => {
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

export const login = async (username: string, onlinePlayers: Player[]) => {
  const onlinePlayersNames = onlinePlayers.map(player => player.name);
  for (const name of onlinePlayersNames) {
    if (name === username) {
      localStorage.setItem('username', username);
      return true
    }
  }
  alert('Username not found in online players list');
  return false;
}