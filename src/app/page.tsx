'use client';
import React, { useEffect, useState } from 'react';
import { PlayerCard } from './components/playercard';
import { Player } from './interfaces/interface';
import { login, sendCommand, sendMultipleCommand } from './utilities/command';
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import { SquareLoader } from 'react-spinners';
import { MdEmail } from "react-icons/md";

export default function Home() {
  const [command, setCommand] = useState('');
  const [response, setResponse] = useState('');
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverIsOnline, setServerIsOnline] = useState(false);
  const [autoClearTextArea, setAutoClearTextArea] = useState(true);
  const [latency, setLatency] = useState(0);
  const [username, setUsername] = useState('');
  const [loginName, setLoginName] = useState('');
  const [userIP, setUserIP] = useState('');
  const [initialLoading, setInitialLoading] = useState(true);

  const tunnelIP = process.env.NEXT_PUBLIC_TUNNEL_IP || 'placeholder';

  const proceed = async () => {
    setLoading(true);
    const response = await sendCommand(command, true);
    setResponse(response);
    if (autoClearTextArea) {
      setCommand('');
    }
    setLoading(false);
  };

  const checkLatency = async (url: string) => {
    const startTime = performance.now();
    try {
      await fetch(url, { method: 'HEAD' });
      const latency = performance.now() - startTime;
      setLatency(Math.round(latency));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setLatency(-1);
    }
  };

  const getUserIpAddress = () => {
    fetch("https://api.ipify.org?format=json")
      .then(response => response.json())
      .then(data => {
        setUserIP(data.ip);
        setUserIP(data.ip);
      })
      .catch(error => {
        console.error(error);
      });
  }

  useEffect(() => {
    setLoginName(localStorage.getItem('username') || '');
    sendCommand('list').then((response) => {
      if (response === 'Failed to connect to RCON') {
        setServerIsOnline(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }
      setServerIsOnline(true);
      const match = response.match(/There are \d+ of a max of \d+ players online:\s*(.*)/);
      if (match) {
        const playerList = match[1].split(', ');
        for (let i = 0; i < playerList.length; i++) {
          playerList[i] = { name: playerList[i] };
        }
        if (playerList.length !== 0 && playerList[0].name !== '') {
          const commands = [];
          for (const player of playerList) {
            commands.push(`xp query ${player.name} levels`);
          }
          sendMultipleCommand(commands).then((responses) => {
            for (let i = 0; i < responses.length; i++) {
              const match = responses[i].result.match(/(\d+)/);
              if (match) {
                playerList[i].xp = parseInt(match[1], 10);
              }
            }
            setPlayers(playerList);
          });
        }
      }
    }).catch(() => {
      setResponse('Failed to fetch online players');
      setServerIsOnline(false);
    }).finally(() => {
      setLoading(false);
      setInitialLoading(false);
    });
    
    checkLatency(tunnelIP);
    getUserIpAddress();
    setInterval(() => checkLatency(tunnelIP), 10000);
    setInterval(() => sendCommand('list').then((response) => {
      if (response === 'Failed to connect to RCON') {
        setServerIsOnline(false);
        setLoading(false);
        setInitialLoading(false);
        return;
      }
      setServerIsOnline(true);
      const match = response.match(/There are \d+ of a max of \d+ players online:\s*(.*)/);
      if (match) {
        const playerList = match[1].split(', ');
        for (let i = 0; i < playerList.length; i++) {
          playerList[i] = { name: playerList[i] };
        }
        if (playerList.length !== 0 && playerList[0].name !== '') {
          const commands = [];
          for (const player of playerList) {
            commands.push(`xp query ${player.name} levels`);
          }
          sendMultipleCommand(commands).then((responses) => {
            for (let i = 0; i < responses.length; i++) {
              const match = responses[i].result.match(/(\d+)/);
              if (match) {
                playerList[i].xp = parseInt(match[1], 10);
              }
            }
            setPlayers(playerList);
          });
        }
      }
    }).catch(() => {
      setResponse('Failed to fetch online players');
      setServerIsOnline(false);
    }), 25000);
  }, []);

  if (initialLoading) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 bg-center bg-cover" style={{ backgroundImage: 'url(/background.webp)' }}>
        <SquareLoader loading={loading} color="white" size='50px' />
      </div>
    )
  }

  else if (!serverIsOnline) {
    return (
      <main className="p-4 font-mono bg-center bg-cover flex flex-col gap-8 items-center justify-center bg-no-repeat h-screen w-full text-white" style={{ backgroundImage: 'url(/background.webp)' }}>
        <div className="hover:cursor-default text-4xl font-semibold">Server is offline</div>
        <div className="hover:cursor-default text-xl text-center">Contact the server administrator for further information</div>
        <a href="mailto:kennethsunjaya@gmail.com" className="hover:text-green-500 transition text-xl flex flex-row items-center gap-3"><MdEmail />kennethsunjaya@gmail.com</a>
      </main>
    );
  }

  return (
    <div>
    { 
      loginName !== '' ?
      <div className="fixed bottom-5 flex items-center justify-center w-full gap-3">
        <div className="text-lg">Signed in as {localStorage.getItem('username')}</div>
        <button onClick={() => {localStorage.removeItem('username'); setLoginName('')}} className="minecraft-btn px-2 ml-5 text-center truncate border-2 border-b-4 hover:text-yellow-200">Logout</button>
      </div>
      :
      <div className="fixed bottom-5 flex items-center justify-center w-full gap-3">
        <input type="text" placeholder="In game name" className="border border-gray-800 rounded p-1 px-2 text-black" onChange={(e) => setUsername(e.target.value)}/>
        <button onClick={async () => {
          const res = await login(username, players);
          if (res) {
            setLoginName(username);
          }
          else {
            setUsername('');
          }
        }} className="minecraft-btn px-2 ml-5 text-center truncate border-2 border-b-4 hover:text-yellow-200">Login</button>
      </div>
    }
    <main className="p-4 bg-center lg:px-[200px] xl:px-[400px] bg-cover bg-no-repeat min-h-screen text-white font-mono bg-black" style={{ backgroundImage: 'url(/background.webp)' }}>
      <div className="flex justify-between text-lg">
        <div>Online Players:</div>
        {latency !== -1 ? <div>Ping: {latency} ms</div> : <MdOutlineSignalCellularNodata className="text-white text-lg"/>}
      </div>
      <div>
        {players.length > 0 && players[0].name !== "" ? (
          <ol>
            {players.map((player, index) => (
              <PlayerCard key={index} userIP={userIP} player={player}></PlayerCard>
            ))}
          </ol>
        ) : (
          <div className="text-lg my-5">No players online</div>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <textarea
          onKeyDown={(e) => {if (e.key === 'Enter') {proceed()}}}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter RCON command.."
          className='border border-gray-800 rounded p-1 my-3 text-black'
        />
        <button 
          onClick={proceed} className='minecraft-btn mx-auto w-64 text-center truncate p-1 border-2 border-b-4 hover:text-yellow-200'>
          EXECUTE COMMAND
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
      <div className="text-xl mt-5">Output:</div>
      {
        response.length !== 0 &&
        <textarea 
        disabled={true} 
        value={response} 
        style={{
          height: `${Math.max(5, response.split('\n').length)}rem`, // Minimum height of 3rem, grows based on the number of lines
          maxHeight: '24rem'
        }}
        className="bg-black bg-opacity-60 text-lg w-full p-1 resize-none" />
      }
      
    </main>
    </div>
  );
}
