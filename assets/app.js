(function(){'use strict';
var d=document,R=d.documentElement,$=function(s,c){return(c||d).querySelector(s)},$$=function(s,c){return Array.prototype.slice.call((c||d).querySelectorAll(s))};
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
/* simulator */
var svg=$('#simsvg');if(svg){
 var P=$('#person'),zones=$$('.zone',svg),dl=$('#daylight'),st=$('#sim-status'),pos={x:150,y:175},hold={},HOLD=2200,last=null;
 var Z=zones.map(function(g){return{g:g,id:g.id,x:+g.dataset.x,y:+g.dataset.y,w:+g.dataset.w,h:+g.dataset.h,win:g.dataset.win==='1',name:g.dataset.name,halo:$('.halo',g),day:$('.day',g),wl:$('.win',g),pct:$('.pct',g)}});
 function inZ(z){return pos.x>=z.x&&pos.x<=z.x+z.w&&pos.y>=z.y&&pos.y<=z.y+z.h}
 function day(){return dl?+dl.value:35}
 function lvl(z){return Math.max(0,Math.round(100-day()*(z.win?.8:0)))}
 function render(){var now=Date.now(),occ=null,anyOn=false;
  Z.forEach(function(z){var here=inZ(z);if(here){hold[z.id]=now+HOLD;occ=z}z.on=here||(hold[z.id]&&hold[z.id]>now);if(z.on)anyOn=true});
  Z.forEach(function(z){var g=z.g,dim=!z.on&&z.id==='z4'&&anyOn,v=z.on?lvl(z):dim?20:0;
   g.classList.toggle('on',!!z.on);g.classList.toggle('dim',dim);
   z.halo.style.opacity=z.on?Math.max(.15,v/100):'';z.pct.textContent=v+' %';
   if(z.win){z.day.setAttribute('opacity',(day()/100*.1).toFixed(3));if(z.wl)z.wl.setAttribute('opacity',(.35+day()/150).toFixed(2))}});
  var t=occ?occ.name+': presencia detectada · luz artificial '+lvl(occ)+' %':'Sin presencia en la zona actual';
  t+=Z.some(function(z){return z.id==='z4'&&!z.on})&&anyOn?' · pasillo en luz de orientación':'';
  var held=Z.filter(function(z){return z.on&&z!==occ});if(held.length)t+=' · '+held.map(function(z){return z.name}).join(', ')+': retardo de apagado';
  if(day()>=100&&occ&&occ.win)t+=' · basta la luz natural';
  if(st&&t!==last){st.textContent=t;last=t}
  if(Object.keys(hold).some(function(k){return hold[k]>now&&!inZ(Z.filter(function(z){return z.id===k})[0])}))setTimeout(render,400)}
 function move(x,y){pos.x=Math.max(30,Math.min(770,x));pos.y=Math.max(30,Math.min(490,y));P.setAttribute('transform','translate('+pos.x+' '+pos.y+')');render()}
 function pt(e){var p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse())}
 var drag=false;P.addEventListener('pointerdown',function(e){drag=true;P.setPointerCapture(e.pointerId);P.style.cursor='grabbing'});
 P.addEventListener('pointermove',function(e){if(drag){var q=pt(e);move(q.x,q.y)}});
 P.addEventListener('pointerup',function(){drag=false;P.style.cursor=''});P.addEventListener('pointercancel',function(){drag=false});
 svg.addEventListener('click',function(e){if(e.target.closest('#person'))return;var q=pt(e);move(q.x,q.y)});
 P.addEventListener('keydown',function(e){var s=e.shiftKey?60:20,k={ArrowLeft:[-s,0],ArrowRight:[s,0],ArrowUp:[0,-s],ArrowDown:[0,s]}[e.key];if(k){e.preventDefault();move(pos.x+k[0],pos.y+k[1])}});
 $$('[data-go]').forEach(function(b){b.addEventListener('click',function(){var z=Z.filter(function(z){return z.id===b.dataset.go})[0];move(z.x+z.w/2-30,z.y+z.h/2+18)})});
 if(dl)dl.addEventListener('input',render);
 hold.z1=0;render()}
/* finder */
var F=$('#finder');if(F){var cards=$$('#results [data-sys]'),cnt=$('#fcount');
 var qs=new URLSearchParams(location.search);['sistema','montaje','alimentacion'].forEach(function(n){var v=qs.get(n);if(v!==null){var r=F.querySelector('input[name='+n+'][value="'+v+'"]');if(r)r.checked=true}});
 if(qs.get('aplicacion'))F.aplicacion.value=qs.get('aplicacion');if(qs.get('altura'))F.altura.value=qs.get('altura');
 function val(n){var r=F.querySelector('input[name='+n+']:checked');return r?r.value:''}
 function run(){var s=val('sistema'),m=val('montaje'),pw=val('alimentacion'),a=F.aplicacion.value,h=parseFloat(String(F.altura.value).replace(',','.')),n=0;
  cards.forEach(function(c){var ok=(!s||c.dataset.sys===s)&&(m===c.dataset.mount)&&(!pw||c.dataset.power===pw)&&(!a||c.dataset.app.split(' ').indexOf(a)>-1)&&(isNaN(h)||(h>=+c.dataset.hmin&&h<=+c.dataset.hmax));c.hidden=!ok;if(ok)n++});
  cnt.textContent=n+' de '+cards.length+(n===1?' modelo compatible':' modelos compatibles');
  var which=n?'':m!=='techo'?'empty-'+m:(!isNaN(h)&&h>10)?'empty-alt':'empty-gen';
  $$('.empty').forEach(function(e){e.classList.toggle('show',e.id===which)});
  var u=new URLSearchParams();[['sistema',s],['montaje',m==='techo'?'':m],['alimentacion',pw],['aplicacion',a],['altura',isNaN(h)?'':h]].forEach(function(p){if(p[1]!=='')u.set(p[0],p[1])});
  history.replaceState(null,'',location.pathname+(u.toString()?'?'+u:''))}
 F.addEventListener('input',run);F.addEventListener('change',run);F.addEventListener('submit',function(e){e.preventDefault();run()});F.addEventListener('reset',function(){setTimeout(run,0)});run()}
/* coverage */
var C=$('#cov');if(C)$$('.cov-legend button',C).forEach(function(b,i,all){b.addEventListener('click',function(){var on=b.getAttribute('aria-pressed')!=='true';all.forEach(function(x){x.setAttribute('aria-pressed','false')});if(on){b.setAttribute('aria-pressed','true');C.dataset.sel=b.dataset.k}else delete C.dataset.sel});
 b.addEventListener('mouseenter',function(){if(!C.querySelector('[aria-pressed=true]'))C.dataset.sel=b.dataset.k});b.addEventListener('mouseleave',function(){if(!C.querySelector('[aria-pressed=true]'))delete C.dataset.sel})});
/* calculator */
var K=$('#calc');if(K){var nf=function(x,dd){var f=Math.pow(10,dd==null?0:dd),r=Math.round(x*f)/f,p=String(Math.abs(r)).split('.');p[0]=p[0].replace(/\B(?=(\d{3})+(?!\d))/g,'.');return(r<0?'-':'')+p[0]+(p[1]?','+p[1]:'')};
 var v=function(id){var x=parseFloat(String(d.getElementById(id).value).replace(',','.'));return isNaN(x)?0:x};var set=function(id,t){d.getElementById(id).textContent=t};
 function calc(){var n=v('n'),w=v('w'),h=v('h'),dd=v('d'),eur=v('eur'),p=Math.min(100,v('p')),co=v('co2'),kwh=n*w*h*dd/1000,s=kwh*p/100,e=s*eur;
  set('r-eur',nf(e));set('r-kwh',nf(s));set('r-pct',nf(p));set('r-base',nf(kwh));set('r-after',nf(kwh-s));d.getElementById('r-bar').style.width=(100-p)+'%';
  set('f1',nf(n)+' × '+nf(w,1)+' W × '+nf(h,1)+' h × '+nf(dd)+' d ÷ 1.000 = '+nf(kwh)+' kWh/año');set('f2',nf(kwh)+' kWh × '+nf(p,1)+' % = '+nf(s)+' kWh/año');set('f3',nf(s)+' kWh × '+nf(eur,3)+' €/kWh = '+nf(e)+' €/año');
  set('r-co2',co>0?'Emisiones evitadas estimadas: '+nf(s*co)+' kg CO₂/año ('+nf(s)+' kWh × '+nf(co,3)+' kg/kWh)':'Introduzca un factor de emisión para estimar el CO₂ evitado.')}
 K.addEventListener('input',calc);var pb=$$('[data-p]',K);pb.forEach(function(b){b.addEventListener('click',function(){d.getElementById('p').value=b.dataset.p;pb.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});calc()})});calc()}
/* formularios del prototipo: sin envío */
$$('form.pform').forEach(function(f){f.addEventListener('submit',function(e){e.preventDefault();if(f.reportValidity&&!f.reportValidity())return;var m=$('.okmsg',f);if(m){m.classList.add('show');m.focus()}})});
/* menú móvil */
var MN=$('.mnav');if(MN){$$('a',MN).forEach(function(a){a.addEventListener('click',function(){MN.open=false})});d.addEventListener('keydown',function(e){if(e.key==='Escape'&&MN.open){MN.open=false;$('summary',MN).focus()}})}
})();
