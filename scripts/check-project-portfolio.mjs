import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const html = read('index.html');
const portfolio = read('portfolio.html');
const catalog = JSON.parse(read('data/projects.json'));
const tabs = read('assets/project-tabs.js');
const start = html.indexOf('<section class="section" id="projects">');
const end = html.indexOf('<section class="section" id="estimator">', start);
assert.ok(start >= 0 && end > start, 'Portfolio section missing');
const section = html.slice(start, end);

assert.ok(section.includes('</aside><div class="project-stack-main"><div class="portfolio-project-tabs'),
  'Project tabs must sit above cards in the RIGHT column, opposite Project section');
const platformStart = section.indexOf('id="portfolio-active-panel"');
const appStart = section.indexOf('id="portfolio-mobile-panel"');
assert.ok(platformStart > 0 && appStart > platformStart);
const active = section.slice(platformStart, appStart);
const apps = section.slice(appStart);
const cards = chunk => (chunk.match(/<article class="project-stack-card/g) || []).length;
assert.equal(cards(active), 8, 'Keep all eight active platforms');
assert.equal(cards(apps), 2, 'Only two verified Dinka Android apps belong in Apps');
assert.equal(catalog.projects.length, 8);
assert.deepEqual(catalog.mobileApps.map(x => x.id), ['classic-hymnal', 'lek-jot-de-yecu-kritho']);

for (const name of ['Classic Campus', 'Classic Rentals']) {
  assert.ok(active.includes(name) && !apps.includes(name), name + ' belongs in Active platforms');
}
for (const name of ['Classic Hymnal', 'Lëk Jöt de Yecu Krïtho']) {
  assert.ok(apps.includes(name) && !active.includes(name), name + ' belongs in Apps');
  assert.ok(portfolio.includes(name), name + ' missing from portfolio directory');
}
for (const appId of [
  'com.classictechnologies.dinkahymnal',
  'com.classictechnologies.lekjotdinkabible',
]) assert.ok(apps.includes(appId) && portfolio.includes(appId), 'Missing Google Play listing ' + appId);
for (const platform of ['android', 'ios', 'windows', 'macos']) {
  assert.ok(section.includes('data-app-platform="' + platform + '"'), 'Missing ' + platform + ' filter');
  assert.ok(tabs.includes("'" + platform + "'"), 'No ' + platform + ' filter handler');
}
assert.ok(apps.includes('data-app-platform-empty'), 'Missing empty state for unverified platforms');

const schema = [...portfolio.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
  .map(x => JSON.parse(x[1])).find(x => x['@type'] === 'CollectionPage');
const published = schema?.hasPart?.find(x => /Published Android/.test(x.name));
assert.equal(published?.itemListElement?.length, 2, 'Structured app listing must include the two published apps');
for (const item of published.itemListElement) assert.ok(item.url.startsWith('https://play.google.com/store/apps/details?id='));

new Function(tabs);
console.log('PASS: Classic Technologies portfolio layout, 8 active platforms, 2 Dinka Android apps, 4 truthful platform filters and SEO listing.');
