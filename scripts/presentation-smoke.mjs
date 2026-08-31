// Verifica o build de apresentação sem permitir conexão com o banco real.
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { once } from 'node:events';

const reservation = createServer();
reservation.listen(0, '127.0.0.1');
await once(reservation, 'listening');
const port = reservation.address().port;
await new Promise(resolve => reservation.close(resolve));
const server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '-H', '127.0.0.1', '-p', String(port)], {
  env: { ...process.env, DATABASE_URL: 'postgres://test:synthetic@127.0.0.1:1/disabled' },
  stdio: 'ignore',
});
const origin = `http://127.0.0.1:${port}`;
try {
  let ready = false;
  for (let n = 0; n < 60; n++) {
    if (server.exitCode !== null) throw new Error('Servidor encerrou antes da verificação.');
    try { ready = (await fetch(origin, { signal: AbortSignal.timeout(1000) })).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  assert.ok(ready, 'Build precisa iniciar');
  const home = await (await fetch(origin)).text();
  assert.match(home, /Software para vender, medir e operar\./);
  assert.match(home, /Vender\./);
  const header = home.match(/<header\b[\s\S]*?<\/header>/)?.[0];
  assert.ok(header, 'Header precisa estar presente');
  assert.match(header, /src="\/logotzolkin\.svg"/);
  assert.doesNotMatch(header, /<svg[^>]*aria-label="TZOLKIN Logo"/);
  for (const path of ['/forms', '/forms/contato', '/forms/empresa', '/forms/redes', '/forms/servico']) {
    const response = await fetch(origin + path);
    assert.equal(response.status, 200);
    const html = await response.text();
    assert.match(html, /formulário está temporariamente indisponível/);
    assert.doesNotMatch(html, /<input\b|<textarea\b|<form\b/);
  }
  const response = await fetch(origin + '/api/leads', {
    method: 'POST', headers: { 'Content-Type': 'application/json', origin }, body: '{}',
  });
  assert.equal(response.status, 503, 'Pausa deve preceder validação e persistência');
  assert.match((await response.json()).message, /temporariamente indisponível/);
  console.log('OK: hero correto, cinco rotas sem coleta e API pausada antes da validação.');
} finally {
  if (server.exitCode === null) {
    const exited = once(server, 'exit');
    server.kill();
    await exited;
  }
}
