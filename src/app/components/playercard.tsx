import { Player } from "../interfaces/interface";
import { sendCommand } from "../utilities/command";
import Image from 'next/image';

export const PlayerCard = ({ player, userIP }: { player: Player; userIP: string }) => {

  // useEffect(() => {
  //   sendCommand(`/xp query ${player.name} levels`).then((response) => {
  //     const match = response.match(/(\d+)/);
  //     if (match) {
  //       setXp(parseInt(match[1], 10));
  //     }
  //   });
  // }, []);

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
        src={parseInt(player.name[0], 10) % 2 === 0 ? "/steve.jpg" : "/alex.jpg"}
        alt=""
        width={30}
        height={30}
        className="rounded-sm shadow-xl"
      />
      <div className="font-mono text-xl">{player.name}</div>
      <div className="font-mono text-xl ml-auto text-yellow-300">{player.xp} levels</div>
      <div className="flex flex-wrap gap-2 mt-2 sm:mt-0">
        <button
          className="minecraft-btn px-2 text-center truncate border-2 border-b-4 hover:text-yellow-200"
          onClick={() => { sendCommand(`/kick ${player.name} Kicked by ${userIP}`); }}
        >
          Kick
        </button>
        {localStorage.getItem('username') !== player.name && localStorage.getItem('username') ?
          <button
            className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
            onClick={() => { sendCommand(`/tp ${localStorage.getItem('username')} ${player.name}`, true); }}
          >
            Teleport
          </button>
          :
          <button
            className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
            onClick={() => { sendCommand(`/spreadplayers 0 0 0 100000 false ${player.name}`, true); }}
          >
            RandomTP
          </button>
        }
        <button
          className="minecraft-btn px-3 text-center truncate border-2 border-b-4 hover:text-yellow-200"
          onClick={() => { sendCommand(`/execute at ${player.name} run summon minecraft:lightning_bolt`, true); }}
        >
          Zap
        </button>
      </div>
    </div>
  );
};
