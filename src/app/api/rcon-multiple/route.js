'use server';
import { Rcon } from 'rcon-client';

export async function POST(req) {
  const { commands } = await req.json();
  if (!Array.isArray(commands) || commands.length === 0) {
    return new Response(JSON.stringify({ error: 'Commands must be a non-empty array' }), { status: 400 });
  }

  try {
    const rcon = new Rcon({
      host: '147.185.221.27',
      port: 52405,
      password: process.env.NEXT_PUBLIC_RCON_PASSWORD || 'abcd1234',
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Connection timed out')), 10000)
    );

    const rconPromise = (async () => {
      await rcon.connect();
      const results = [];
      for (const command of commands) {
        const result = await rcon.send(command);
        results.push({ command, result });
      }
      await rcon.end();
      return results;
    })();

    const results = await Promise.race([rconPromise, timeoutPromise]);

    return new Response(JSON.stringify({ results }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to process commands' }),
      { status: 500 }
    );
  }
}