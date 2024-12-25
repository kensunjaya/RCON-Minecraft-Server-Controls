import { useEffect, useState } from "react";
import { Player } from "../interfaces/interface";
import { sendCommand } from "../utilities/command";
import Image from 'next/image';

export const PlayerCard = ({ player }: { player: Player }) => {
  const [xp, setXp] = useState(0);
  useEffect(() => {
    sendCommand(`/xp query ${player.name} levels`).then((response) => {
      const match = response.match(/(\d+)/);
      if (match) {
        setXp(parseInt(match[1], 10));
      }
    });
  }, [])
  return (
    <div   
      className="p-3 rounded-lg bg-no-repeat bg-cover text-white shadow-xl border my-3 text-lg font-mono flex justify-between items-center"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/wood.jpg)', 
        backgroundSize: '100px', /* Or a value that fits your design */
        backgroundRepeat: 'repeat' /* Ensures the texture repeats to fill the area */
      }}>
      <Image src={parseInt(player.name[0], 10) % 2 === 0 ? "/steve.jpg" : "/alex.jpg"} alt="" width={30} height={30} className="rounded-sm shadow-xl" />
      <div className="font-mono text-xl mx-3">{player.name}</div>
      <div className="font-mono text-xl ml-auto text-yellow-300">{xp} levels</div>
      <button 
        className="minecraft-btn px-2 mx-5 text-center truncate border-2 border-b-4 hover:text-yellow-200"
        onClick={() => {sendCommand(`/kick ${player.name}`)}}
      >Kick</button>
      {localStorage.getItem('username') !== player.name && localStorage.getItem('username') &&
      <button 
        className="minecraft-btn px-2 mr-5 text-center truncate border-2 border-b-4 hover:text-yellow-200"
        onClick={() => {sendCommand(`/tp ${localStorage.getItem('username')} ${player.name}`)}}
      >Teleport</button>
      }
      
      <button 
        className="minecraft-btn px-2 text-center truncate border-2 border-b-4 hover:text-yellow-200"
        onClick={() => {sendCommand(`/execute at ${player.name} run summon minecraft:lightning_bolt`)}}
      >Zap</button>
    </div>
  );
};
