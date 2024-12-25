export const sendCommand = async (command: string) => {
  console.log(command)
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