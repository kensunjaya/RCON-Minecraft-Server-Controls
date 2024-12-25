import { Rcon } from 'rcon-client';

export async function POST(req) {
  const { command } = await req.json();

  if (!command) {
    return new Response(JSON.stringify({ error: 'Command is required' }), { status: 400 });
  }

  try {
    const rcon = new Rcon({
      host: '147.185.221.17',
      port: 44176,
      password: 'abcd1234',
    });

    await rcon.connect();
    const result = await rcon.send(command);
    await rcon.end();

    return new Response(JSON.stringify({ result }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: 'Failed to connect to RCON' }), { status: 500 });
  }
}
