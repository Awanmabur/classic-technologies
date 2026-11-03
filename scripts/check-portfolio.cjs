const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=process.cwd(),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const home=read('index.html'),portfolio=read('portfolio.html'),data=JSON.parse(read('data/projects.json'));
const start=home.indexOf('<section class="section" id="projects">');
const end=home.indexOf('<section class="section" id="estimator">',start);
assert.ok(start>=0&&end>start,'Portfolio section missing');
const section=home.slice(start,end);
assert.ok(section.includes('class="project-stack-main"><div class="portfolio-project-tabs'),'Tabs must be above the cards in the right-hand column');
assert.ok(section.includes('class="project-stack-intro reveal"'),'Original left project introduction missing');
assert.deepEqual(data.projects.map(x=>x.id),['classic-trip','classic-mart','autobrand-ai','classic-academy','classic-events-pro','classic-finhub','classic-campus','classic-rentals']);
assert.deepEqual(data.mobileApps.map(x=>x.id),['classic-hymnal','lek-jot-de-yecu-kritho']);
assert.equal(section.split('<article class="project-stack-card').length-1,10,'Expected 8 platform and 2 app cards');
assert.equal(section.split('data-app-os="android"').length-1,2);
for(const platform of ['android','ios','windows','macos']){
  assert.ok(section.includes('data-app-platform="'+platform+'"'),'Homepage missing '+platform);
  assert.ok(portfolio.includes('data-app-platform="'+platform+'"'),'Portfolio missing '+platform);
}
const sitemap=read('sitemap.xml'),llms=read('llms.txt');
for(const app of data.mobileApps){
  assert.deepEqual(app.platforms,['android'],'Do not claim unverified platform support');
  assert.ok(app.live.startsWith('https://play.google.com/store/apps/details?id='));
  const slug=app.caseStudy.slice(1),canonical='https://classictechgroup.com'+app.caseStudy;
  const page=read(slug+'.html');
  assert.ok(section.includes('href="'+app.caseStudy+'"'),slug+' homepage link');
  assert.ok(portfolio.includes('href="'+app.caseStudy+'"'),slug+' portfolio link');
  assert.ok(page.includes('href="'+app.live+'"'),slug+' store link');
  assert.ok(page.includes('href="'+canonical+'" rel="canonical"'),slug+' canonical');
  assert.ok(page.includes('data-prerendered="true"'),slug+' must be crawlable');
  assert.ok(sitemap.includes('<loc>'+canonical+'</loc>'),slug+' sitemap');
  assert.ok(llms.includes(canonical),slug+' AI discovery');
  const before=page.split('<script id="schema-org-jsonld" type="application/ld+json">')[1];
  assert.ok(before,slug+' structured data');
  const schema=JSON.parse(before.split('</script>')[0]);
  assert.ok(schema['@graph'].some(x=>x['@type']==='SoftwareApplication'&&x.operatingSystem==='Android'));
}
assert.ok(section.includes('Classic Campus')&&section.includes('Classic Rentals'),'Active platforms lost');
for(const filename of ['project-classic-events-android.html','project-chariot-mobile.html'])
  assert.ok(fs.existsSync(path.join(root,filename)),'Legacy case study removed: '+filename);
console.log('PASS — Classic Technologies layout, 8 active platforms, 2 apps, 4 filters, case studies and SEO links');
