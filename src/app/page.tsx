'use client';
import { useEffect, useState } from 'react';
import { PlayerCard } from './components/playercard';
import { Player } from './interfaces/interface';
import { sendCommand } from './utilities/command';

export default function Home() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverIsOnline, setServerIsOnline] = useState(false);
  const [autoClearTextArea, setAutoClearTextArea] = useState(true);

  const proceed = async () => {
    setLoading(true);
    const response = await sendCommand(command);
    setResponse(response);
    if (autoClearTextArea) {
      setCommand(''); // Clear the textarea if autoClearTextArea is enabled
    }
    setLoading(false);
  };

  useEffect(() => {
    sendCommand('/list').then((response) => {
      setServerIsOnline(true);
      console.log('Response:', response);
      const match = response.match(/There are \d+ of a max of \d+ players online:\s*(.*)/);
      if (match) {
        const playerList = match[1].split(', ');
        for (let i = 0; i < playerList.length; i++) {
          playerList[i] = { name: playerList[i] };
        }
        setPlayers(playerList);
        console.log('Players currently online:', playerList);
      } else {
        console.log('No players online or failed to parse response');
      }
    }).catch(() => {
      setServerIsOnline(false);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  if (!loading && !serverIsOnline) {
    return (
      <main className="p-4 bg-center bg-cover bg-no-repeat h-screen" style={{ backgroundImage: 'url(/background.webp)' }}>
        <div>Server is offline</div>
      </main>
    );
  }

  return (
    <main className="p-4 bg-center bg-cover bg-no-repeat h-screen text-white font-mono" style={{ backgroundImage: 'url(/background.webp)' }}>
      <div>Online Players:</div>
      <div>
        {players.length > 0 ? (
          <ol>
            {players.map((player, index) => (
              <PlayerCard key={index} index={index + 1} player={player}></PlayerCard>
            ))}
          </ol>
        ) : (
          <p>No players online</p>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter RCON command"
          className='border border-gray-800 rounded p-1 mr-2 text-black'
        />
        <button onClick={proceed} className='minecraft-btn mx-auto w-64 text-center truncate p-1 border-2 border-b-4 hover:text-yellow-200'>
          Send Command
        </button>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={autoClearTextArea}
            onChange={(e) => setAutoClearTextArea(e.target.checked)}
          />
          Auto-clear text area
        </label>
      </div>
      <div className="text-xl mt-5">Response:</div>
      <p className="text-lg">{response}</p>
    </main>
  );
}
