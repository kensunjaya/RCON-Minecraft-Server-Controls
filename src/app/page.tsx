/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useEffect, useState } from 'react';
import { PlayerCard } from './components/playercard';
import { Players, ServerData } from './interfaces/interface';
import { login, sendCommand, sendMultipleCommand } from './utilities/command';
import { MdOutlineSignalCellularNodata } from "react-icons/md";
import { SquareLoader } from 'react-spinners';
import { MdEmail } from "react-icons/md";

export default function Home() {
  const [command, setCommand] = useState('');
  const [serverData, setServerData] = useState<ServerData | undefined>(undefined);
  const [response, setResponse] = useState('');
  const [players, setPlayers] = useState<Players>();
  const [loading, setLoading] = useState(true);
  const [serverIsOnline, setServerIsOnline] = useState(false);
  const [autoClearTextArea, setAutoClearTextArea] = useState(true);
  const [latency, setLatency] = useState(-99);
  const [username, setUsername] = useState('');
  const [loginName, setLoginName] = useState('');
  const [userIP, setUserIP] = useState('');

  const tunnelIP = process.env.NEXT_PUBLIC_SERVER_IP || 'placeholder';

  const proceed = async () => {
    if (command.startsWith('restart') || command.startsWith('stop') || command.startsWith('op') || command.startsWith('deop') || command.startsWith('pardon') || command.startsWith('execute') || command.startsWith('ban') || command.startsWith('kick') || command.startsWith('whitelist') || command.startsWith('ban-ip')) {
      setResponse('This command is not allowed');
      return;
    }
    setLoading(true);
    const response = await sendCommand(command, true);
    setResponse(response);
    if (autoClearTextArea) {
      setCommand('');
    }
    setLoading(false);
  };

  const checkMinecraftServerStatus = async (address: string) => {
    try {
      setLoading(true);
      const response = await fetch(`https://api.mcstatus.io/v2/status/java/${address}`);
      setLatency(latency);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setServerData(data);
      if (!data.online) {
        setServerIsOnline(false);
        return;
      }
      setServerIsOnline(data.online);
      setPlayers(data.players);
      if (data.players) {
        const commands = [];
        const playerList = data.players.list;
        for (const player of data.players.list) {
          commands.push(`xp query ${player.name_clean} levels`);
        }
        sendMultipleCommand(commands).then((responses) => {
          for (let i = 0; i < responses.length; i++) {
            const match = responses[i].result.match(/(\d+)/);
            if (match) {
              playerList[i].xp = parseInt(match[1], 10);
            }
          }
          setPlayers({ ...data.players, list: playerList });
        });
      }
    } catch (error) {
      console.error('Failed to fetch server status:', error);
    } finally {
      setLoading(false);
    }
  }

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
    checkMinecraftServerStatus(tunnelIP);
    getUserIpAddress();
  }, []);

  if (serverData === undefined) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-opacity-20 bg-center bg-cover" style={{ backgroundImage: 'url(/background.webp)' }}>
        <SquareLoader loading={loading} color="white" size='50px' />
      </div>
    )
  }

  else if (!serverIsOnline || players === undefined) {
    return (
      <main className="p-4 font-sans bg-center bg-cover flex flex-col gap-8 items-center justify-center bg-no-repeat h-screen w-full text-white" style={{ backgroundImage: 'url(/background.webp)' }}>
        <div className="hover:cursor-default text-4xl font-semibold">Server is OFFLINE</div>
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
        <div className="text-lg bg-black font-sans bg-opacity-50 rounded-md p-1">Signed in as {localStorage.getItem('username')}</div>
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
      <div>{`${serverData.host}`}</div>
      <div dangerouslySetInnerHTML={{ __html: serverData.motd.html.replace(/\n/g, '<br />') }} className="bg-black bg-opacity-50 p-2 my-2" />
      <div className="flex font-sans justify-between text-lg">
        <div>{`Online Players (${players.online} of ${players.max})`}</div>
        {latency !== -1 ? <div>{latency == -99 ? '' : latency + ' ms'}</div> : <MdOutlineSignalCellularNodata className="text-white text-lg"/>}
      </div>
      <div>
        {players.list.length > 0 && players.list[0].name_clean !== "" && (
          <ol>
            {players.list.map((player, index) => (
              <PlayerCard key={index} userIP={userIP} player={player}></PlayerCard>
            ))}
          </ol>
        )}
      </div>
      <div className="flex flex-col gap-5">
        <textarea
          onKeyDown={(e) => {if (e.key === 'Enter') {proceed()}}}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter Minecraft command.."
          className='border border-gray-800 rounded p-1 my-3 text-black'
        />
        <button 
          onClick={proceed} className='minecraft-btn mx-auto text-lg tracking-wider w-64 text-center truncate p-1 border-2 border-b-4 hover:text-yellow-200'>
          EXECUTE COMMAND
        </button>
        <label className="flex font-sans items-center gap-2 text-md">
          <input
            type="checkbox"
            checked={autoClearTextArea}
            onChange={(e) => setAutoClearTextArea(e.target.checked)}
          />
          Auto-clear text area
        </label>
      </div>
      <div className="text-xl font-sans mt-5">Output</div>
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