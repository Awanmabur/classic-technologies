
const body=document.body,header=document.getElementById('header'),loader=document.getElementById('loader'),progress=document.getElementById('progress'),topBtn=document.getElementById('top'),menu=document.getElementById('menu'),cursor=document.getElementById('cursor'),floatContact=document.getElementById('floatContact');
window.addEventListener('load',()=>setTimeout(()=>loader&&loader.classList.add('hide'),420));
const year=document.getElementById('year'); if(year) year.textContent=new Date().getFullYear();
document.querySelectorAll('[data-split]').forEach(el=>{const words=el.textContent.trim().split(' ');el.textContent='';words.forEach((w,i)=>{const s=document.createElement('span');s.textContent=w;s.style.setProperty('--i',i);el.appendChild(s);});});
function closeMenu(){body.classList.remove('menu-open'); if(menu) menu.setAttribute('aria-expanded','false');}
if(menu) menu.addEventListener('click',ev=>{ev.stopPropagation();const open=body.classList.toggle('menu-open');menu.setAttribute('aria-expanded',open?'true':'false');});
document.addEventListener('click',ev=>{if(innerWidth<=900&&body.classList.contains('menu-open')&&!ev.target.closest('.nav')) closeMenu();});
document.addEventListener('keydown',ev=>{if(ev.key==='Escape') closeMenu();});
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',closeMenu));

// Smooth nav scrolling: stop just above each section, 5px below the fixed navbar edge
function scrollToSectionWithNavOffset(hash){
  if(!hash || hash==='#') return false;
  const target=document.querySelector(hash);
  if(!target) return false;
  const navEl=header ? header.querySelector('.nav') : null;
  const navBottom=navEl ? navEl.getBoundingClientRect().bottom : 0;
  const offset=Math.max(5, navBottom + 5);
  const top=Math.max(0, window.scrollY + target.getBoundingClientRect().top - offset);
  window.scrollTo({top,behavior:'smooth'});
  history.replaceState(null,'',hash);
  return true;
}
document.querySelectorAll('.nav-link').forEach(a=>a.addEventListener('click',ev=>{
  const hash=a.getAttribute('href');
  if(hash && hash.startsWith('#')){
    ev.preventDefault();
    closeMenu();
    scrollToSectionWithNavOffset(hash);
  }
}));

function update(){const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=h>0?(y/h*100)+'%':'0%'; if(header) header.classList.toggle('scrolled',y>24); if(topBtn) topBtn.classList.toggle('show',y>720); if(floatContact) floatContact.classList.toggle('show',y>520); document.querySelectorAll('[data-scroll-card]').forEach((card,i)=>{const r=card.getBoundingClientRect(),amt=Math.max(-1,Math.min(1,(r.top-innerHeight*.62)/innerHeight));card.style.setProperty('--y',(amt*34)+'px');card.style.setProperty('--rr',(amt*(i%2?-3:3))+'deg');}); const dots=[...document.querySelectorAll('#sideDots a')]; if(dots.length){let active='home';dots.forEach(d=>{const id=d.getAttribute('href').slice(1),sec=document.getElementById(id);if(sec&&sec.getBoundingClientRect().top<innerHeight*.48) active=id;});dots.forEach(d=>d.classList.toggle('active',d.getAttribute('href')==='#'+active));}}
addEventListener('scroll',update,{passive:true}); update(); if(topBtn) topBtn.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
const reveal=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('show');reveal.unobserve(e.target);}}),{threshold:.16});document.querySelectorAll('.reveal,.scroll-card,.trust-badge').forEach(el=>reveal.observe(el));
const spy=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;const id=e.target.id;document.querySelectorAll('.nav-link').forEach(a=>a.classList.toggle('active',a.getAttribute('href')==='#'+id));}),{rootMargin:'-40% 0px -55% 0px',threshold:.01});document.querySelectorAll('main section[id]').forEach(s=>spy.observe(s));
document.querySelectorAll('.btn').forEach(btn=>btn.addEventListener('click',ev=>{const r=btn.getBoundingClientRect(),sp=document.createElement('span');sp.className='ripple';sp.style.left=(ev.clientX-r.left)+'px';sp.style.top=(ev.clientY-r.top)+'px';btn.appendChild(sp);sp.addEventListener('animationend',()=>sp.remove());}));
document.querySelectorAll('.tilt').forEach(el=>{el.addEventListener('pointermove',ev=>{if(innerWidth<760)return;const r=el.getBoundingClientRect(),x=ev.clientX-r.left,y=ev.clientY-r.top;el.style.transform=`rotateX(${((y/r.height)-.5)*-7}deg) rotateY(${((x/r.width)-.5)*7}deg) translateY(-4px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});
document.querySelectorAll('.magnetic').forEach(el=>{el.addEventListener('pointermove',ev=>{if(innerWidth<760)return;const r=el.getBoundingClientRect(),x=ev.clientX-r.left-r.width/2,y=ev.clientY-r.top-r.height/2;el.style.transform=`translate(${x*.12}px,${y*.14}px)`;});el.addEventListener('pointerleave',()=>el.style.transform='');});
if(matchMedia('(pointer:fine)').matches&&cursor){addEventListener('pointermove',ev=>{cursor.style.opacity='1';cursor.style.left=ev.clientX+'px';cursor.style.top=ev.clientY+'px';});document.querySelectorAll('a,button,.tilt,.flow-card,.bento-card,.project-stack-card,.trust-badge').forEach(el=>{el.addEventListener('pointerenter',()=>cursor.classList.add('big'));el.addEventListener('pointerleave',()=>cursor.classList.remove('big'));});}
document.querySelectorAll('.estimate-option').forEach(o=>o.addEventListener('click',()=>{document.querySelectorAll('.estimate-option').forEach(b=>b.classList.remove('active'));o.classList.add('active');const t=document.getElementById('estimateTitle'),d=document.getElementById('estimateDesc'),l=document.getElementById('estimateList');if(t)t.textContent=o.dataset.title;if(d)d.textContent=o.dataset.desc;if(l){l.innerHTML='';o.dataset.list.split('|').forEach(x=>{const li=document.createElement('li');li.textContent=x;l.appendChild(li);});}}));
document.querySelectorAll('.faq-question').forEach(q=>q.addEventListener('click',()=>{const item=q.closest('.faq-item'),ans=item.querySelector('.faq-answer'),open=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(it=>{it.classList.remove('open');const a=it.querySelector('.faq-answer');if(a)a.style.maxHeight='0px';});if(!open){item.classList.add('open');ans.style.maxHeight=ans.scrollHeight+'px';}}));
document.querySelectorAll('.pill').forEach((p,i,arr)=>p.addEventListener('click',()=>{arr.forEach(x=>x.classList.remove('active'));p.classList.add('active');}));
const form=document.getElementById('contactForm'),status=document.getElementById('formStatus'); if(form) form.addEventListener('submit',e=>{e.preventDefault();if(status)status.classList.add('show');form.reset();setTimeout(()=>status&&status.classList.remove('show'),6500);});

// Count-up stats when the hero statistics scroll into view
const countObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(!entry.isIntersecting)return;entry.target.classList.add('show');entry.target.querySelectorAll('.count-up').forEach(el=>{if(el.dataset.done)return;el.dataset.done='1';const target=parseInt(el.dataset.value||'0',10),suffix=el.dataset.suffix||'';let start=null;function step(ts){if(start===null)start=ts;const p=Math.min(1,(ts-start)/1050);const eased=1-Math.pow(1-p,3);el.textContent=Math.round(target*eased)+suffix;if(p<1)requestAnimationFrame(step)}requestAnimationFrame(step);});countObserver.unobserve(entry.target)}),{threshold:.25});document.querySelectorAll('.hero-stat-grid,.hero-stat').forEach(el=>countObserver.observe(el));


// Production hash offset fix: apply the same navbar offset when opening a page with #section in the URL.
window.addEventListener('load',()=>{
  if(location.hash){
    setTimeout(()=>{
      if(typeof scrollToSectionWithNavOffset==='function') scrollToSectionWithNavOffset(location.hash);
    },80);
  }
});
