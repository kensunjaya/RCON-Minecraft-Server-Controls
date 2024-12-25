'use client';
import { useEffect, useState } from 'react';
import { PlayerCard } from './components/playercard';
import { Player } from './interfaces/interface';
import { sendCommand } from './utilities/command';
import { MdOutlineSignalCellularNodata } from "react-icons/md";

export default function Home() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverIsOnline, setServerIsOnline] = useState(false);
  const [autoClearTextArea, setAutoClearTextArea] = useState(true);
  const [latency, setLatency] = useState(0);

  const proceed = async () => {
    setLoading(true);
    const response = await sendCommand(command);
    setResponse(response);
    if (autoClearTextArea) {
      setCommand(''); // Clear the textarea if autoClearTextArea is enabled
    }
    setLoading(false);
  };

  const checkLatency = async (url: string) => {
    const startTime = performance.now();
    try {
      await fetch(url, { method: 'HEAD' });
      const latency = performance.now() - startTime;
      setLatency(latency);
    } catch (error) {
      console.error(error);
      setLatency(-1);
    }
  }

  useEffect(() => {
    sendCommand('/list').then((response) => {
      setServerIsOnline(true);
      const match = response.match(/There are \d+ of a max of \d+ players online:\s*(.*)/);
      if (match) {
        const playerList = match[1].split(', ');
        for (let i = 0; i < playerList.length; i++) {
          playerList[i] = { name: playerList[i] };
        }
        setPlayers(playerList);
      }
    }).catch(() => {
      setServerIsOnline(false);
    }).finally(() => {
      setLoading(false);
    });
    
    checkLatency('147.185.221.17');
    setInterval(() => checkLatency('147.185.221.17'), 10000);
    setInterval(() => sendCommand('/list').then((response) => {
      setServerIsOnline(true);
      const match = response.match(/There are \d+ of a max of \d+ players online:\s*(.*)/);
      if (match) {
        const playerList = match[1].split(', ');
        for (let i = 0; i < playerList.length; i++) {
          playerList[i] = { name: playerList[i] };
        }
        setPlayers(playerList);
      }
    }).catch(() => {
      setServerIsOnline(false);
    }), 20000);
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
      <div className="flex justify-between text-lg">
        <div>Online Players:</div>
        {latency !== -1 ? <div>Ping: {latency} ms</div> : <MdOutlineSignalCellularNodata className="text-white text-lg"/>}
      </div>
      <div>
        {players.length > 0 && players[0].name !== "" ? (
          <ol>
            {players.map((player, index) => (
              <PlayerCard key={index} player={player}></PlayerCard>
            ))}
          </ol>
        ) : (
          <div className="text-lg my-5">No players online</div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <textarea
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter RCON command.."
          className='border border-gray-800 rounded p-1 mr-2 my-3 text-black'
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
