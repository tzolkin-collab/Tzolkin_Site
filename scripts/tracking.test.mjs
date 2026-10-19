import test from 'node:test';
import assert from 'node:assert/strict';
import {
  buildMetaCall, buildDataLayerEvent, needsEventId, newEventId, metaEventFor,
} from '../src/client/shared/utils/tracking-core.ts';

test('mapeia eventos internos para eventos da Meta', () => {
  assert.deepEqual(metaEventFor('lead'), { method: 'track', name: 'Lead' });
  assert.deepEqual(metaEventFor('whatsapp_click'), { method: 'track', name: 'Contact' });
  assert.deepEqual(metaEventFor('form_started'), { method: 'trackCustom', name: 'FormStarted' });
  assert.equal(metaEventFor('page_view'), null);
});

test('params da Meta só levam service/suite, nunca dado pessoal', () => {
  const call = buildMetaCall('lead', { service: 'Site', suite: 'Pro', email: 'a@b.c', whatsapp: '11999999999', fullName: 'X' });
  assert.deepEqual(call.params, { service: 'Site', suite: 'Pro', content_name: 'Site' });
  assert.deepEqual(buildMetaCall('form_started').params, {});
  assert.equal(buildMetaCall('page_view'), null);
});

test('só lead recebe event_id', () => {
  assert.equal(needsEventId('lead'), true);
  for (const e of ['form_started', 'whatsapp_click', 'page_view']) assert.equal(needsEventId(e), false);
});

test('event_id é único e tem fallback sem randomUUID', () => {
  const a = newEventId(globalThis.crypto);
  assert.match(a, /^[0-9a-f-]{36}$/);
  assert.notEqual(a, newEventId(globalThis.crypto));
  assert.match(newEventId({}), /^ev-/);
});

test('dataLayer mantém nome estável e payload não sobrescreve event/event_id', () => {
  const out = buildDataLayerEvent('lead', { service: 'Site', event: 'forjado', event_id: 'x' }, 'abc');
  assert.equal(out.event, 'lead');
  assert.equal(out.event_id, 'abc');
  assert.equal(out.service, 'Site');
  assert.equal('event_id' in buildDataLayerEvent('form_started', {}), false);
});
