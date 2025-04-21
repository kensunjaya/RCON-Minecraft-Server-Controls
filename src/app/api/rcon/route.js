'use server';
import { Rcon } from 'rcon-client';

export async function POST(req) {
  const { command } = await req.json();

  if (!command) {
    return new Response(JSON.stringify({ error: 'Command is required' }), { status: 400 });
  }

  try {
    const rcon = new Rcon({
      host: '147.185.221.27',
      port: 52405,
      password: process.env.RCON_PASSWORD || 'abcd1234',
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out')), 10000)
    );

    const rconPromise = (async () => {
      await rcon.connect();
      const result = await rcon.send(command);
      await rcon.end();
      return result;
    })();

    const result = await Promise.race([rconPromise, timeoutPromise]);

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to connect to RCON' }),
      { status: 500 }
    );
  }
}
