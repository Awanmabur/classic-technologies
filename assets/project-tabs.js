(()=>{
  'use strict';
  const tabs=[...document.querySelectorAll('[data-project-tab]')];
  const panels=[...document.querySelectorAll('[data-project-panel]')];
  if(tabs.length!==2||panels.length!==2)return;

  const platformControls=document.querySelector('[data-app-platform-controls]');
  const platformButtons=[...document.querySelectorAll('[data-app-platform]')];
  const appCards=[...document.querySelectorAll('[data-app-os]')];
  const empty=document.querySelector('[data-app-platform-empty]');
  const mobilePanel=document.querySelector('[data-project-panel="mobile"]');

  function recalculate(){
    requestAnimationFrame(()=>{
      // Recalculate page scroll and reveal positions after the active panel changes height.
      window.dispatchEvent(new Event('scroll'));
    });
  }

  function selectPlatform(os){
    if(!['android','ios','windows','macos'].includes(os))return;
    platformButtons.forEach(button=>{
      button.setAttribute('aria-pressed',String(button.dataset.appPlatform===os));
    });
    let visible=0;
    appCards.forEach(card=>{
      const matched=card.dataset.appOs===os;
      card.hidden=!matched;
      if(matched){
        card.classList.add('show');
        visible++;
      }
    });
    if(empty)empty.hidden=visible>0;
    recalculate();
  }

  function activate(name,focus=false){
    if(name!=='active'&&name!=='mobile')return;
    tabs.forEach(tab=>{
      const on=tab.dataset.projectTab===name;
      tab.setAttribute('aria-selected',String(on));
      tab.tabIndex=on?0:-1;
      if(on&&focus)tab.focus();
    });
    panels.forEach(panel=>{
      panel.hidden=panel.dataset.projectPanel!==name;
      if(!panel.hidden)panel.querySelectorAll('.reveal').forEach(el=>el.classList.add('show'));
    });
    if(platformControls)platformControls.hidden=name!=='mobile';
    if(name==='mobile'&&mobilePanel){
      const selected=platformButtons.find(button=>button.getAttribute('aria-pressed')==='true');
      selectPlatform(selected?.dataset.appPlatform||'android');
    }
    recalculate();
  }

  tabs.forEach((tab,index)=>{
    tab.addEventListener('click',()=>activate(tab.dataset.projectTab));
    tab.addEventListener('keydown',event=>{
      if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
      event.preventDefault();
      const next=event.key==='Home'?0:event.key==='End'?tabs.length-1:
        (index+(event.key==='ArrowRight'?1:-1)+tabs.length)%tabs.length;
      activate(tabs[next].dataset.projectTab,true);
    });
  });
  platformButtons.forEach(button=>button.addEventListener('click',()=>{
    selectPlatform(button.dataset.appPlatform);
    button.focus();
  }));
  selectPlatform('android');
  activate('active');
})();