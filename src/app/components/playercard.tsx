import { Player } from "../interfaces/interface";
import { sendCommand } from "../utilities/command";

export const PlayerCard = ({ player, index }: { player: Player; index: number }) => {
  return (
    <div   
      className="p-3 rounded-lg bg-no-repeat bg-cover text-white shadow-md my-3 text-lg font-mono flex justify-between items-center"
      style={{ 
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/wood.jpg)', 
        backgroundSize: '100px', /* Or a value that fits your design */
        backgroundRepeat: 'repeat' /* Ensures the texture repeats to fill the area */
      }}
    >
      <div className="font-mono text-xl">{index}. {player.name}</div>
      <button 
        className="minecraft-btn w-16 ml-auto mr-5 text-center truncate border-2 border-b-4 hover:text-yellow-200"
        onClick={() => {sendCommand(`/kick ${player.name}`)}}
      >Kick</button>
      <button 
        className="minecraft-btn w-16 text-center truncate border-2 border-b-4 hover:text-yellow-200"
        onClick={() => {sendCommand(`/execute at ${player.name} run summon minecraft:lightning_bolt`)}}
      >Zap</button>
    </div>
  );
};
