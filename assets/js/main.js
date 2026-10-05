(function(){
'use strict';
var CFG=LGR.CFG,IMG=LGR.IMG;
var $=function(s,r){return(r||document).querySelector(s);},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));};
var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var fmt=function(n){var t=CFG.currency+' '+Number(n).toLocaleString('en-US');if(CFG.usdRate)t+=' (about USD '+Math.round(n/CFG.usdRate).toLocaleString('en-US')+')';return t;};

/* static images + contact details */
$$('[data-img]').forEach(function(e){e.src=IMG[e.dataset.img];});
if($('#c-addr')){$('#c-addr').textContent=CFG.address;
var tel=$('#c-tel');tel.textContent=CFG.phone;tel.href='tel:+'+CFG.whatsapp;
var ml=$('#c-mail');ml.textContent=CFG.email;ml.href='mailto:'+CFG.email;
$('#c-fb').href=CFG.facebook;
$('#c-pol').innerHTML=Object.keys(CFG.policies).filter(function(k){return CFG.policies[k];}).map(function(k){return k+': '+CFG.policies[k]+'<br>';}).join('');}

/* room prices come from config.js; markup is static HTML */
CFG.rooms.forEach(function(r){$$('.price[data-room="'+r.id+'"]').forEach(function(p){if(r.price)p.textContent=fmt(r.price)+' per night';});});

/* mobile menu */
var mb=$('.menu'),nv=$('#nav');
if(mb&&nv){mb.addEventListener('click',function(){var o=nv.classList.toggle('open');mb.setAttribute('aria-expanded',o);});
$$('a',nv).forEach(function(a){a.addEventListener('click',function(){nv.classList.remove('open');mb.setAttribute('aria-expanded','false');});});}

/* gallery filter + lightbox (photos are static HTML) */
if($('#galGrid')){
var grid=$('#galGrid'),lb=$('#lb'),lbi=$('img',lb),vis=[],ci=0,opener=null;
function visible(){return $$('.ph',grid).filter(function(b){return !b.hidden;});}
$('#chips').addEventListener('click',function(e){var b=e.target.closest('.chip');if(!b)return;
$$('.chip').forEach(function(c){c.setAttribute('aria-pressed',c===b);});
$$('.ph',grid).forEach(function(p){p.hidden=b.textContent!=='All'&&p.dataset.c!==b.textContent;});});
function show(i){ci=(i+vis.length)%vis.length;var b=vis[ci];lbi.src=b.dataset.src;lbi.alt=$('img',b).alt;}
grid.addEventListener('click',function(e){var b=e.target.closest('.ph');if(!b)return;opener=b;vis=visible();show(vis.indexOf(b));lb.hidden=false;lb.classList.add('on');$('#lbx').focus();});
function closeLB(){lb.classList.remove('on');lb.hidden=true;if(opener)opener.focus();}
$('#lbx').onclick=closeLB;$('#lbp').onclick=function(e){e.stopPropagation();show(ci-1);};$('#lbn').onclick=function(e){e.stopPropagation();show(ci+1);};
lb.addEventListener('click',function(e){if(e.target===lb)closeLB();});
addEventListener('keydown',function(e){if(lb.hidden)return;
if(e.key==='Escape')closeLB();if(e.key==='ArrowLeft')show(ci-1);if(e.key==='ArrowRight')show(ci+1);
if(e.key==='Tab'){var f=[$('#lbx'),$('#lbp'),$('#lbn')],i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();}});
}

/* reveal */
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{threshold:.12});
$$('.rv').forEach(function(el){io.observe(el);});}
else $$('.rv').forEach(function(el){el.classList.add('in');});

/* page init */
$$('nav a').forEach(function(a){if(a.dataset.r===document.body.dataset.page)a.setAttribute('aria-current','page');});
var rm=/[?&]room=([\w-]+)/.exec(location.search);if(rm&&$('#room')&&$('#room option[value="'+rm[1]+'"]'))$('#room').value=rm[1];

/* background: real resort photos that follow the section in view (slow drift + scroll parallax + warm dusk tint).
   An optional video at assets/video/hero.* takes over once it plays and keeps the same scroll parallax. */
var bg=$('#bg'),saver=navigator.connection&&navigator.connection.saveData,small=innerWidth<700;
var secs=$$('[data-bg]'),keys=[];
secs.forEach(function(s){if(keys.indexOf(s.dataset.bg)<0)keys.push(s.dataset.bg);});
if(!keys.length)keys=['g1'];
var stack=document.createElement('div');stack.id='bgs';stack.setAttribute('aria-hidden','true');
var layers={};
keys.forEach(function(k,i){var l=document.createElement('div');l.className='bl';var im=document.createElement('i');l.appendChild(im);stack.appendChild(l);layers[k]=l;
var load=function(){var src=IMG[k];if(!src)return;var t=new Image();t.onload=function(){im.style.backgroundImage='url('+src+')';};t.src=src;};
if(i===0)load();else addEventListener('load',function(){setTimeout(load,400*i);});});
var mist=document.createElement('div');mist.id='mist';mist.setAttribute('aria-hidden','true');
if(bg){bg.parentNode.insertBefore(stack,bg);bg.parentNode.insertBefore(mist,bg);}else{document.body.insertBefore(stack,document.body.firstChild);document.body.insertBefore(mist,stack.nextSibling);}
var cur=null;
function setActive(k){if(k===cur||!layers[k])return;cur=k;Object.keys(layers).forEach(function(n){layers[n].classList.toggle('on',n===k);});}
setActive(keys[0]);
var rail=$('#rail i'),ticking=false,root=document.documentElement;
function upd(){ticking=false;var vh=innerHeight,mid=vh*.5,k=null;
var best=1e9;for(var i=0;i<secs.length;i++){var r=secs[i].getBoundingClientRect(),d=r.top<=mid&&r.bottom>=mid?0:Math.min(Math.abs(r.top-mid),Math.abs(r.bottom-mid));if(d<best){best=d;k=secs[i].dataset.bg;}}
if(k)setActive(k);
var mx=root.scrollHeight-vh,p=mx>0?Math.min(1,Math.max(0,scrollY/mx)):0;
root.style.setProperty('--w',(p*.9).toFixed(3));
if(rail)rail.style.transform='scaleY('+p.toFixed(3)+')';
if(!reduce)root.style.setProperty('--py',(-p*vh*.04).toFixed(1)+'px');}
function req(){if(!ticking){ticking=true;requestAnimationFrame(upd);}}
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('load',req);upd();

/* video (optional) */
if(bg){
if(reduce||saver){$$('source',bg).forEach(function(s){s.remove();});bg.load();}
else{var goVid=function(){if(!document.body.classList.contains('vid')){document.body.classList.add('vid');if(typeof snowStop==='function')snowStop();}};
bg.addEventListener('playing',goVid);bg.addEventListener('timeupdate',function(){if(bg.currentTime>0)goVid();});
if(!bg.paused&&bg.currentTime>0)goVid();}
}
/* light snowfall */
var snowOn=!reduce&&!saver,sc=null,sx=null,flakes=[],sraf=0,lastT=0;
if(snowOn){sc=document.createElement('canvas');sc.id='snow';sc.setAttribute('aria-hidden','true');stack.parentNode.insertBefore(sc,mist.nextSibling);sx=sc.getContext('2d');
var NF=small?24:55;for(var q=0;q<NF;q++)flakes.push({x:Math.random(),y:Math.random(),r:.8+Math.random()*1.6,v:.02+Math.random()*.04,d:Math.random()*6});
var sz=function(){sc.width=innerWidth;sc.height=innerHeight;};addEventListener('resize',sz);sz();
var snowFrame=function(now){var dt=Math.min(.05,(now-lastT)/1000||.016);lastT=now;sx.clearRect(0,0,sc.width,sc.height);sx.fillStyle='rgba(255,255,255,.7)';
flakes.forEach(function(f){f.y+=f.v*dt;f.d+=dt;if(f.y>1.02){f.y=-.02;f.x=Math.random();}var x=(f.x+Math.sin(f.d)*.006)*sc.width;sx.beginPath();sx.arc(x,f.y*sc.height,f.r,0,6.283);sx.fill();});
sraf=requestAnimationFrame(snowFrame);};
var snowGo=function(){if(!sraf&&!document.body.classList.contains('vid')){lastT=performance.now();sraf=requestAnimationFrame(snowFrame);}};
var snowStop=function(){if(sraf){cancelAnimationFrame(sraf);sraf=0;}};
snowGo();
}
document.addEventListener('visibilitychange',function(){
if(document.hidden){if(snowOn)snowStop();if(bg&&!bg.paused)bg.pause();}
else{if(document.body.classList.contains('vid')){if(bg)bg.play().catch(function(){});}else if(snowOn)snowGo();}});

/* booking form */
if($('#form')){
var form=$('#form');
function localISO(d){return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10);}
var today=localISO(new Date());
form.checkin.min=today;form.checkout.min=today;
function nights(){var n=(new Date(form.checkout.value)-new Date(form.checkin.value))/864e5;return n>0?Math.round(n):0;}
function roomOf(id){return CFG.rooms.filter(function(r){return r.id===id;})[0];}
function summary(){var n=nights(),r=roomOf(form.room.value),t='';
if(n){t=n+(n>1?' nights':' night');if(r&&r.price)t+=' · about '+fmt(r.price*n)+' (estimate, confirmed by the resort)';}$('#sum').textContent=t;}
form.addEventListener('input',summary);
form.checkin.addEventListener('change',function(){form.checkout.min=form.checkin.value||today;});
function err(f,m){var el=form[f];$('#e-'+f).textContent=m||'';if(m)el.setAttribute('aria-invalid','true');else el.removeAttribute('aria-invalid');return !m;}
function validate(){var v=form,ok=true,first=null;
function chk(f,m){if(!err(f,m)){ok=false;if(!first)first=v[f];}}
chk('name',v.name.value.trim().length<2?'Enter your name.':'');
var digits=v.phone.value.replace(/\D/g,'');chk('phone',(digits.length<7||digits.length>15)?'Enter a phone number with 7 to 15 digits.':'');
chk('email',(v.email.value&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v.email.value))?'Enter a valid email address.':'');
chk('checkin',!v.checkin.value?'Choose a check-in date.':(v.checkin.value<today?'Check-in cannot be in the past.':''));
chk('checkout',!v.checkout.value?'Choose a check-out date.':(nights()<1?'Check-out must be after check-in.':''));
var g=+v.guests.value;chk('guests',(!g||g<1||g>30)?'Enter 1 to 30 guests.':'');
if(first)first.focus();return ok;}
function ref(){return 'LGR-'+Date.now().toString(36).slice(-5).toUpperCase()+Math.random().toString(36).slice(2,4).toUpperCase();}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
form.addEventListener('submit',async function(e){
e.preventDefault();if(form.site.value)return;if(!validate())return;
var r=roomOf(form.room.value),p={ref:ref(),name:form.name.value.trim(),phone:form.phone.value.trim(),email:form.email.value.trim(),checkin:form.checkin.value,checkout:form.checkout.value,nights:nights(),guests:+form.guests.value,room:r?r.name:'Not sure yet',arrive:form.arrive.value,needs:$$('input[name=needs]:checked').map(function(i){return i.value;}),note:form.note.value.trim()};
var text='Booking request '+p.ref+'\nName: '+p.name+'\nPhone: '+p.phone+(p.email?'\nEmail: '+p.email:'')+'\nCheck-in: '+p.checkin+'\nCheck-out: '+p.checkout+' ('+p.nights+' nights)\nGuests: '+p.guests+'\nStay type: '+p.room+(p.arrive?'\nArriving: '+p.arrive:'')+(p.needs.length?'\nPlease confirm: '+p.needs.join(', '):'')+(p.note?'\nNote: '+p.note:'');
var saved=false,btn=$('#go');btn.disabled=true;btn.textContent='Sending…';
if(CFG.apiUrl){try{var res=await fetch(CFG.apiUrl,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(p)});saved=res.ok;}catch(_){}}
btn.disabled=false;btn.textContent='Send booking request';
var wa='https://wa.me/'+CFG.whatsapp+'?text='+encodeURIComponent(text),em='mailto:'+CFG.email+'?subject='+encodeURIComponent('Booking request '+p.ref)+'&body='+encodeURIComponent(text);
$('#done').innerHTML='<h1 class="pg" tabindex="-1" id="dh">'+(saved?'Request received':'One more step')+'</h1><p class="ref">'+p.ref+'</p><p>'+(saved?'The resort will confirm by phone or WhatsApp. You can also message them now to speed things up.':'Send your request to the resort on WhatsApp or by email. Your booking is only requested once you send it.')+'</p><p><strong>'+esc(p.room)+'</strong> · '+esc(p.checkin)+' to '+esc(p.checkout)+' · '+p.nights+' nights · '+p.guests+' guests</p><div class="row"><a class="btn" href="'+wa+'" target="_blank" rel="noopener">Send on WhatsApp</a><a class="btn ghost" href="'+em+'">Send by email</a></div><p><button class="chip" type="button" id="edit">Edit request</button></p>';
form.hidden=true;$('#done').hidden=false;$('#dh').focus();
$('#edit').onclick=function(){$('#done').hidden=true;form.hidden=false;form.name.focus();};});
}

/* shared: footer fields + floating contact buttons */
$$('[data-cfg]').forEach(function(e){var k=e.dataset.cfg;
if(k==='tel'){e.href='tel:+'+CFG.whatsapp;e.textContent=CFG.phone;}
else if(k==='mail'){e.href='mailto:'+CFG.email;e.textContent=CFG.email;}
else if(k==='fb')e.href=CFG.facebook;
else if(k==='wa')e.href='https://wa.me/'+CFG.whatsapp;});
var fab=document.createElement('div');fab.className='fab';
fab.innerHTML='<a class="wa" href="https://wa.me/'+CFG.whatsapp+'" target="_blank" rel="noopener" aria-label="Chat with the resort on WhatsApp"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1.4-4.2A8 8 0 1 1 8.2 18.6z"/></svg></a><a href="tel:+'+CFG.whatsapp+'" aria-label="Call the resort"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg></a>';
document.body.appendChild(fab);
})();
