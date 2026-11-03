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
// Legacy indexed query URLs must lead to existing case-study files rather than
// open-redirecting or rendering obsolete/duplicate project content.
const legacyPage=read('project.html');
const legacyStart=legacyPage.indexOf('const known = new Set(');
const legacyEnd=legacyPage.indexOf(');',legacyStart);
assert.ok(legacyStart>=0&&legacyEnd>legacyStart,'Legacy project migration allowlist missing');
const legacyIds=JSON.parse(legacyPage.slice(legacyStart+'const known = new Set('.length,legacyEnd));
assert.ok(legacyIds.length>=data.projects.length+data.mobileApps.length);
assert.ok(legacyPage.includes("window.location.replace('https://classictechgroup.com/project-' + id"),
  'Legacy query links must lead to the apex canonical case URLs');
for(const id of legacyIds) assert.ok(fs.existsSync(path.join(root,'project-'+id+'.html')),
  'Legacy mapping points at a missing case study '+id);
// Branding regression checks across every published top-level page.
const htmlPages=fs.readdirSync(root).filter(name=>name.endsWith('.html'));
assert.ok(htmlPages.length>=25,'Published HTML inventory unexpectedly shrank');
for(const filename of htmlPages){
  const page=read(filename);
  // Google's HTML verification token is not a webpage and must remain untouched.
  if(!page.toLowerCase().includes('<html'))continue;
  assert.ok(!page.includes('256707180023'),filename+' still advertises the retired WhatsApp number');
  assert.ok(!page.includes('www.classictechgroup.com'),filename+' contains a noncanonical company URL');
  assert.ok(page.includes('info@classictechgroup.com'),filename+' is missing official contact email');
  assert.ok(page.includes('256773364680'),filename+' is missing the direct-call number');
  assert.ok(page.includes('256781977217'),filename+' is missing the approved WhatsApp number');
}
// Enforce crawlable, self-canonical public sitemap pages without changing the UI.
// The sitemap is the authoritative indexable page inventory, not every HTML file.
const sitemapPaths=[...sitemap.matchAll(/<loc>https:\/\/classictechgroup\.com\/([^<]*)<\/loc>/g)].map(x=>x[1]);
assert.ok(sitemapPaths.length>=20,'Sitemap unexpectedly lost published pages');
assert.equal(new Set(sitemapPaths).size,sitemapPaths.length,'Duplicate sitemap entries');
for(const slug of sitemapPaths){
  const filename=slug?slug+'.html':'index.html';
  assert.ok(fs.existsSync(path.join(root,filename)),'Missing sitemap page: '+filename);
  const page=read(filename),url='https://classictechgroup.com/'+slug;
  assert.ok(page.includes('href="'+url+'" rel="canonical"'),filename+' has a missing or incorrect canonical URL');
  assert.ok(page.includes('content="'+url+'" property="og:url"'),filename+' has a missing or incorrect Open Graph URL');
  assert.ok(/<title>[^<]+<\/title>/i.test(page),filename+' missing page title');
  assert.ok(/name="description"/.test(page),filename+' missing meta description');
  assert.ok(/content="index, follow/.test(page),filename+' is blocked from indexing despite sitemap inclusion');
  assert.ok(/type="application\/ld\+json"/.test(page),filename+' missing structured data');
}
for(const project of data.projects){
  assert.ok(project.desc&&project.desc.length>=160,project.id+' has thin case-study copy');
  assert.ok(!project.live||/^https:\/\//.test(project.live),project.id+' has an invalid public URL');
  assert.ok(fs.existsSync(path.join(root,project.img)),project.id+' has a missing portfolio image');
}
for(const app of data.mobileApps)
  assert.ok(fs.existsSync(path.join(root,app.img)),app.id+' has a missing portfolio image');
// LCP regression: do not block the overlay on slow third-party resources.
const siteScript=read('assets/site.js');
assert.ok(siteScript.includes("if(loader) setTimeout(()=>loader.classList.add('hide'),240)"),
  'Loading overlay must not wait for full window load');
const heroAssets=[
  ['project-classic-trip.html','assets/portfolio/classic-trip.svg'],
  ['project-classic-mart.html','assets/portfolio/classic-mart-dashboard.png'],
  ['project-autobrand-ai.html','assets/portfolio/autobrand-og.png'],
  ['project-classic-academy.html','assets/portfolio/classic-academy-hero.webp'],
  ['project-classic-events-pro.html','assets/portfolio/classic-events-pro.svg'],
  ['project-classic-finhub.html','assets/portfolio/classic-finhub.svg'],
  ['project-classic-campus.html','assets/portfolio/classic-campus.svg'],
  ['project-classic-rentals.html','assets/portfolio/classic-rentals.svg'],
  ['project-classic-hymnal.html','assets/portfolio/classic-hymnal.svg'],
  ['project-lek-jot-de-yecu-kritho.html','assets/portfolio/lek-jot-de-yecu-kritho.svg'],
];
for(const [filename,asset] of heroAssets){
  const page=read(filename);
  assert.ok(fs.existsSync(path.join(root,asset)),filename+' hero asset missing');
  assert.ok(page.includes('rel="preload" as="image" fetchpriority="high" href="'+asset+'"'),filename+' must preload its hero asset');
  assert.ok(page.includes('src="'+asset+'"'),filename+' must show the same hero asset');
  const heroTag=page.match(/<div class="thumb reveal thumb-anim"[^>]*><img[^>]*>/)?.[0]||'';
  for(const attribute of ['loading="eager"','decoding="async"','fetchpriority="high"'])
    assert.ok(heroTag.includes(attribute),filename+' lost hero image attribute '+attribute);
  // Text and hero image must be paintable immediately, even while the 3D transform runs.
  for(const keyframe of ['caseHeroEnter','caseThumbEnter']){
    const rule=page.match(new RegExp('@keyframes '+keyframe+'\\{from\\{[^}]*\\}to\\{[^}]*\\}\\}'));
    assert.ok(rule,filename+' lost its case study '+keyframe+' entrance');
    assert.ok(!rule[0].includes('opacity:0'),filename+' delays main content paint during '+keyframe);
  }
  assert.ok(page.includes("jq('#projectRoot .role-card,#projectRoot .feat-card').smoove"),
    filename+' lost approved lower-page reveal effects');
}
assert.ok(fs.statSync(path.join(root,'assets/portfolio/classic-mart-dashboard.png')).size>20000,
  'Classic Mart original dashboard screenshot is missing or truncated');
assert.ok(!read('project-classic-mart.html').includes('raw.githubusercontent.com/Awanmabur/classic-mart/master/dashboard-preview/'),
  'Avoid third-party host for the LCP screenshot');
for(const [file,description] of [
  ['assets/portfolio/autobrand-og.png','AutoBrand original hero'],
  ['assets/portfolio/classic-academy-hero.webp','Classic Academy original hero'],
]){
  assert.ok(fs.statSync(path.join(root,file)).size>20000,description+' image missing or truncated');
}
for(const [filename,upstream] of [
  ['project-autobrand-ai.html','raw.githubusercontent.com/Awanmabur/AutoBrand-ai/master/public/assets/autobrand-og.png'],
  ['project-classic-academy.html','raw.githubusercontent.com/Awanmabur/classic-academy/main/public/img/hero.webp'],
]){
  assert.ok(!read(filename).includes(upstream),filename+' still relies on remote hero image');
}
// Static local href/src and sitemap destinations must resolve to existing
// files without needing remote checks or any site redesign.
const publishedFiles=new Set(fs.readdirSync(root,{withFileTypes:true})
  .filter(item=>item.isFile()).map(item=>item.name));
const resolvesLocal=raw=>{
  if(!raw||raw[0]==='#'||raw.startsWith('//'))return true;
  if(/^(?:https?:|mailto:|tel:|javascript:|data:)/i.test(raw)||raw.includes('\${'))return true;
  const pathname=raw.split(/[?#]/)[0].replace(/^\/+/,'');
  if(!pathname)return true;
  const options=[pathname,pathname+'.html',pathname+'/index.html'];
  return options.some(candidate=>fs.existsSync(path.join(root,candidate)));
};
for(const filename of htmlPages){
  const page=read(filename);
  if(!page.toLowerCase().includes('<html'))continue;
  for(const match of page.matchAll(/\b(?:href|src)=["']([^"']+)["']/g)){
    assert.ok(resolvesLocal(match[1]),filename+' has a broken local link: '+match[1]);
  }
}
for(const match of sitemap.matchAll(/<loc>https:\/\/classictechgroup\.com\/([^<]*)<\/loc>/g)){
  assert.ok(resolvesLocal('/'+match[1]),'Sitemap references a missing page: '+match[1]);
}
console.log('PASS — Classic Technologies layout, 8 active platforms, 2 apps, 4 filters, case studies, SEO links, branding and local routes');
