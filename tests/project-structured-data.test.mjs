import test from 'node:test';
import assert from 'node:assert/strict';
import { buildProjectStructuredData } from '../src/lib/projectStructuredData.ts';

const project = {
  name: 'I-CA.RE Chartrons', city: 'Bordeaux',
  address: '10 rue Exemple, 33000 Bordeaux', show_address: true,
  lat: '44.856', lng: '-0.567', status: 'en_exploitation',
};
const build = (overrides = {}) => buildProjectStructuredData({
  project, description: 'Description actuellement visible.',
  canonicalPath: '/projets/i-ca-re-chartrons', heroPath: '/images/chartrons.webp',
  ...overrides,
});

test('FR et EN reprennent le texte visible et leur URL, sans ancienne copie française cachée', () => {
  const fr = build();
  const en = build({ description: 'The current English description.', canonicalPath: '/en/projects/i-ca-re-chartrons' });
  assert.equal(fr.description, 'Description actuellement visible.');
  assert.equal(fr.url, 'https://i-ca.re/projets/i-ca-re-chartrons/');
  assert.equal(en.description, 'The current English description.');
  assert.equal(en.url, 'https://i-ca.re/en/projects/i-ca-re-chartrons/');
  assert.equal(en.name, project.name);
  assert.equal(en['@type'], 'MedicalBusiness');
  assert.ok(!('openingHours' in fr));
  assert.ok(!('offers' in fr));
});

test('image locale ou distante valide, sans double préfixe de domaine', () => {
  assert.equal(build().image, 'https://i-ca.re/images/chartrons.webp');
  const external = 'https://images.example.org/cabinets/toulouse.webp';
  assert.equal(build({ heroPath: external }).image, external);
  for (const heroPath of [null, '', '   ', 'data:image/png;base64,AA', 'javascript:alert(1)', 'https://user:pass@example.org/a.jpg']) {
    assert.ok(!('image' in build({ heroPath })), heroPath);
  }
});

test('adresse masquée préservée et coordonnées absentes ou invalides omises', () => {
  assert.equal(build().address.streetAddress, '10 rue Exemple');
  const hidden = build({ project: { ...project, show_address: false } });
  assert.ok(!('streetAddress' in hidden.address));
  assert.ok(!('postalCode' in hidden.address));
  assert.ok(!('geo' in hidden));
  assert.equal(hidden.address.addressLocality, 'Bordeaux');
  assert.equal(build().address.addressRegion, 'Nouvelle-Aquitaine');
  assert.deepEqual(build().geo, { '@type': 'GeoCoordinates', latitude: 44.856, longitude: -0.567 });
  for (const [lat, lng] of [[null, null], ['', ''], ['abc', 0], [91, 0], [0, 181]]) {
    assert.ok(!('geo' in build({ project: { ...project, lat, lng } })));
  }
});
