import { Player } from "../interfaces/interface";
import { sendCommand } from "../utilities/command";
import Image from 'next/image';

export const PlayerCard = ({ player, userIP }: { player: Player; userIP: string }) => {
  return (
    <div
      className="p-3 rounded-lg bg-no-repeat bg-cover text-white shadow-xl border my-3 text-lg font-mono flex flex-wrap items-center gap-3"
      style={{
        backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(/wood.jpg)',
        backgroundSize: '100px',
        backgroundRepeat: 'repeat'
      }}
    >
      <Image
        src={parseInt(player.uuid[0], 10) % 2 === 0 ? "/steve.jpg" : "/alex.jpg"}
        alt=""
        width={30}
        height={30}
        className="rounded-sm shadow-xl"
      />
      <div className="font-mono font-bold text-xl">{player.name_clean}</div>
      <div className="font-mono text-xl ml-auto text-yellow-300">{player.xp ? `${player.xp} levels` : ''}</div>
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
        <button
          className="minecraft-btn px-2 text-center truncate border-2 border-b-4 hover:text-yellow-200"
          onClick={() => { sendCommand(`kick ${player.name_clean} Kicked by ${userIP}`); }}
        >
          Kick
        </button>
        {localStorage.getItem('username') !== player.name_clean && localStorage.getItem('username') ?
          <button
            className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
            onClick={() => { sendCommand(`tp ${localStorage.getItem('username')} ${player.name_clean}`, true); }}
          >
            Teleport
          </button>
          :
          <button
            className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
            onClick={() => { sendCommand(`spreadplayers 0 0 0 100000 false ${player.name_clean}`, true); }}
          >
            RandomTP
          </button>
        }
        <button
          className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
          onClick={() => { sendCommand(`execute at ${player.name_clean} run summon minecraft:lightning_bolt`, true); }}
        >
          Zap
        </button>
        <button
          className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
          onClick={() => { sendCommand(`effect give ${player.name_clean} blindness 9999`, true); }}
        >
          Curse
        </button>
      </div>
    </div>
  );
};
