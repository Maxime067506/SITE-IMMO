/* =====================================================================
   reserver.js — Page "Réserver en direct"
   Sélecteur d'appartement + calendrier interactif (sélection de plage)
   + devis live + redirection paiement Stripe. Réutilise les endpoints
   /api/booking/{availability,quote,checkout}.
   ===================================================================== */
(function () {
  'use strict';

  var APTS = [
    { no:'01', name:'Appartement du port',  nameEn:'Port apartment',       loc:'Port de Nice',  locEn:'Nice harbour',    g:4, img:'/img/airbnb/01-amiral/photo-01.jpg',        airbnb:'https://www.airbnb.fr/rooms/1361669686960380718' },
    { no:'02', name:'Son jumeau du port',   nameEn:'Its twin by the port', loc:'Port de Nice',  locEn:'Nice harbour',    g:4, img:'/img/airbnb/02-commodore/photo-01.jpg?v=c1', airbnb:'https://www.airbnb.fr/rooms/1361686663866337495' },
    { no:'03', name:'Avenue Notre-Dame',    nameEn:'Avenue Notre-Dame',    loc:'Hyper centre',  locEn:'City centre',     g:6, img:'/img/airbnb/03-basilique/photo-01.jpg',      airbnb:'https://www.airbnb.fr/rooms/1563266584925477319' },
    { no:'04', name:'Art Déco · gare',      nameEn:'Art Déco · station',   loc:'Quartier gare', locEn:'Station district',g:4, img:'/img/airbnb/04-transatlantique/photo-01.jpg',airbnb:'https://www.airbnb.fr/rooms/1361628609886141688' },
    { no:'05', name:'Ultra design',         nameEn:'Ultra-design',         loc:'Musiciens',     locEn:'Musicians',       g:4, img:'/img/airbnb/06-scherzo/photo-01.jpg?v=e3',   airbnb:'https://www.airbnb.fr/rooms/1446914329011561138' },
    { no:'06', name:'Rue Gounod',           nameEn:'Rue Gounod',           loc:'Musiciens',     locEn:'Musicians',       g:4, img:'/img/airbnb/07-crescendo/photo-01.jpg',      airbnb:'https://www.airbnb.fr/rooms/1361447215596892211' },
    { no:'07', name:'Design',               nameEn:'Design',               loc:'Musiciens',     locEn:'Musicians',       g:4, img:'/img/airbnb/05-adagio/photo-01.jpg?v=d1',    airbnb:'https://www.airbnb.fr/rooms/1447097634568506909' },
    { no:'08', name:'Les Musiciens',        nameEn:'The Musicians',        loc:'Musiciens',     locEn:'Musicians',       g:4, img:'/img/airbnb/08-symphonie/photo-01.jpg',      airbnb:'https://www.airbnb.fr/rooms/1705198304588120041' }
  ];
  function aName(a){ return isEN() && a.nameEn ? a.nameEn : a.name; }
  function aLoc(a){ return isEN() && a.locEn ? a.locEn : a.loc; }

  function isEN(){ return (document.documentElement.lang || 'fr').toLowerCase().indexOf('en') === 0; }
  var FR = {
    choose:'Choisissez votre appartement', pick:'Sélectionnez vos dates sur le calendrier',
    in:'Arrivée', out:'Départ', guests:'Voyageurs', night:'nuit', nights:'nuits', perNight:'/ nuit',
    cleaning:'Frais de ménage', tax:'Taxe de séjour', total:'Total', deposit:'Caution (pré-autorisation, non débitée) :',
    book:'Réserver et payer', avail:'Disponible', booked:'Indisponible', selected:'Votre séjour',
    name:'Nom complet', email:'E-mail', phone:'Téléphone', pay:'Continuer vers le paiement', loading:'Calcul…',
    minN:'Séjour minimum de {n} nuits.', tooSoon:'Réservez un peu plus à l\'avance.',
    unavail:'Ces dates ne sont pas disponibles.', months:['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'],
    wk:['L','M','M','J','V','S','D'], noFee:'Réservez en direct, sans frais de service.', from:'dès', priceNote:'Prix par nuit, sous chaque date'
  };
  var EN = {
    choose:'Choose your apartment', pick:'Select your dates on the calendar',
    in:'Check-in', out:'Check-out', guests:'Guests', night:'night', nights:'nights', perNight:'/ night',
    cleaning:'Cleaning fee', tax:'Tourist tax', total:'Total', deposit:'Deposit (pre-authorisation, not charged):',
    book:'Book & pay', avail:'Available', booked:'Unavailable', selected:'Your stay',
    name:'Full name', email:'Email', phone:'Phone', pay:'Continue to payment', loading:'Calculating…',
    minN:'Minimum stay of {n} nights.', tooSoon:'Please book a little further ahead.',
    unavail:'These dates are not available.', months:['January','February','March','April','May','June','July','August','September','October','November','December'],
    wk:['M','T','W','T','F','S','S'], noFee:'Book direct, no service fee.', from:'from', priceNote:'Nightly price, under each date'
  };
  function T(){ return isEN() ? EN : FR; }

  function eur(c){ return (Number(c||0)/100).toLocaleString(isEN()?'en-GB':'fr-FR',{minimumFractionDigits:0,maximumFractionDigits:2}); }
  function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[c];}); }
  function pad(n){ return (n<10?'0':'')+n; }
  function iso(d){ return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate()); }
  function fromISO(s){ var p=s.split('-'); return new Date(+p[0],+p[1]-1,+p[2]); }
  function addDays(d,n){ var x=new Date(d); x.setDate(x.getDate()+n); return x; }
  function fmtDate(s){ if(!s) return '—'; var p=s.split('-'); return p[2]+'/'+p[1]; }

  function api(path){ return fetch(path).then(function(r){ return r.json().then(function(j){return {status:r.status,body:j};},function(){return {status:r.status,body:{}};}); }); }
  function apiPost(path,body){ return fetch(path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)}).then(function(r){ return r.json().then(function(j){return {status:r.status,body:j};},function(){return {status:r.status,body:{}};}); }); }

  function App(){
    this.apt = APTS[0];
    this.guests = 2;
    this.blocked = {};            // { 'YYYY-MM-DD': true }
    this.prices = {};             // { 'YYYY-MM-DD': cents } (prix de la nuit)
    this.loaded = false;
    this.enter = 1;               // anime l'entree des mois (1 / -1 = sens, 0 = rien)
    this.justSet = null;          // jour qui vient d'etre clique (petite animation)
    this.sweep = false;           // anime le remplissage de la plage choisie
    this.view = new Date(); this.view.setDate(1);
    this.checkIn = null; this.checkOut = null;
    this.quote = null;
    this.elApts = document.getElementById('rz2Apts');
    this.elCal = document.getElementById('rz2Cal');
    this.elSum = document.getElementById('rz2Sum');
  }
  App.prototype.start = function(){
    var self=this;
    // ?apt=03 : ouvre directement la page sur cet appartement
    var want=(location.search.match(/[?&]apt=(\d{1,2})/)||[])[1];
    if(want){ var hit=APTS.filter(function(a){ return a.no===('0'+want).slice(-2); })[0]; if(hit) this.apt=hit; }
    this.renderApts();
    // Flèches : appartement précédent / suivant (boucle)
    [['rz2Prev',-1],['rz2Next',1]].forEach(function(p){
      var b=document.getElementById(p[0]); if(!b) return;
      b.addEventListener('click', function(){
        var i=APTS.indexOf(self.apt), n=APTS.length;
        self.selectApt(APTS[(i+p[1]+n)%n].no);
      });
    });
    this.renderSummary();
    this.selectApt(this.apt.no);
  };

  App.prototype.renderApts = function(){
    var self=this;
    this.elApts.innerHTML = APTS.map(function(a){
      return '<button type="button" class="rz2-apt' + (a.no===self.apt.no?' is-active':'') + '" data-apt="'+a.no+'">' +
        '<div class="rz2-apt-img" style="background-image:url(\''+esc(a.img)+'\')">' +
          '<span class="rz2-apt-no">N° '+a.no+'</span>' +
          '<span class="rz2-apt-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
        '</div>' +
        '<div class="rz2-apt-body"><p class="rz2-apt-name">'+esc(aName(a))+'</p><p class="rz2-apt-loc">'+esc(aLoc(a))+'</p></div>' +
      '</button>';
    }).join('');
    this.elApts.querySelectorAll('[data-apt]').forEach(function(b){
      b.addEventListener('click', function(){ self.selectApt(b.getAttribute('data-apt')); });
    });
  };

  App.prototype.selectApt = function(no){
    var a = APTS.filter(function(x){return x.no===no;})[0]; if(!a) return;
    this.apt = a; this.guests = Math.min(2, a.g);
    this.checkIn = this.checkOut = null; this.quote = null; this.blocked = {};
    this.prices = {}; this.loaded = false; this.enter = 1;
    var box=this.elApts;
    box.querySelectorAll('.rz2-apt').forEach(function(el){
      var on=el.getAttribute('data-apt')===no;
      el.classList.toggle('is-active', on);
      // amène la carte choisie au centre du bandeau (sans faire bouger la page)
      if(on) box.scrollTo({ left: el.offsetLeft - (box.clientWidth - el.offsetWidth)/2, behavior:'smooth' });
    });
    this.renderSummary();
    this.renderCalendar(true);
    this.loadAvailability();
  };

  App.prototype.loadAvailability = function(){
    var self=this, apt=this.apt.no;
    api('/api/booking/availability/?apt='+apt+'&prices=1').then(function(r){
      if (self.apt.no!==apt) return;              // appart changé entre-temps
      var blocked={};
      ((r.body&&r.body.unavailable)||[]).forEach(function(rg){
        var d=fromISO(rg.start), end=fromISO(rg.end);
        while(d<end){ blocked[iso(d)]=true; d=addDays(d,1); }
      });
      self.blocked=blocked; self.prices=(r.body&&r.body.prices)||{}; self.loaded=true;
      self.renderCalendar(); self.renderFrom();
    }).catch(function(){ self.loaded=true; self.renderCalendar(); });
  };

  // "dès 80 € / nuit" : plus petit prix libre sur les 60 prochains jours.
  App.prototype.renderFrom = function(){
    var el=document.getElementById('rz2From'); if(!el) return;
    var t=T(), d=new Date(), best=null;
    for(var i=0;i<60;i++){ var s=iso(addDays(d,i)), p=this.prices[s]; if(p!=null && !this.blocked[s] && (best==null||p<best)) best=p; }
    el.innerHTML = best==null ? '' : esc(t.from)+' <b>'+eur(best)+' €</b> '+esc(t.perNight);
    el.classList.toggle('is-on', best!=null);
  };

  App.prototype.isPast = function(d){ var t=new Date(); t.setHours(0,0,0,0); return d<t; };
  App.prototype.rangeHasBlocked = function(ci,co){
    var d=fromISO(ci), end=fromISO(co);
    while(d<end){ if(this.blocked[iso(d)]) return true; d=addDays(d,1); }
    return false;
  };

  App.prototype.onDay = function(s){
    if(!this.checkIn || (this.checkIn && this.checkOut)){ this.checkIn=s; this.checkOut=null; }
    else { // on a un checkIn, pas de checkOut
      if(s<=this.checkIn){ this.checkIn=s; }
      else if(this.rangeHasBlocked(this.checkIn,s)){ this.checkIn=s; }   // ne peut pas franchir un jour bloqué
      else { this.checkOut=s; this.sweep=true; }
    }
    this.justSet=s;
    this.renderCalendar();
    this.justSet=null; this.sweep=false;
    this.renderSummary();
    if(this.checkIn && this.checkOut) this.updateQuote();
  };

  App.prototype.renderCalendar = function(skeleton){
    var self=this, t=T();
    var m1=new Date(this.view), m2=new Date(this.view.getFullYear(),this.view.getMonth()+1,1);
    var now=new Date(); now.setDate(1);
    var prevOk = this.view>now;
    var enter = (!skeleton && this.enter) ? (this.enter<0?' is-enter from-left':' is-enter') : '';
    this.elCal.innerHTML =
      '<div class="rz2-cal-head"><h3>'+esc(t.pick)+'</h3>' +
        '<div class="rz2-cal-nav">' +
          '<button class="rz2-cal-navbtn" data-nav="-1" '+(prevOk?'':'disabled')+' aria-label="prev">‹</button>' +
          '<button class="rz2-cal-navbtn" data-nav="1" aria-label="next">›</button>' +
        '</div></div>' +
      '<div class="rz2-months'+enter+(this.loaded?' has-prices':'')+'">'+this.month(m1,0)+this.month(m2,1)+'</div>' +
      '<div class="rz2-legend">' +
        '<span><i class="l-av"></i>'+esc(t.avail)+'</span>' +
        '<span><i class="l-bk"></i>'+esc(t.booked)+'</span>' +
        '<span><i class="l-sel"></i>'+esc(t.selected)+'</span>' +
        '<span class="l-note">'+esc(t.priceNote)+'</span>' +
      '</div>';
    if(!skeleton) this.enter=0;
    this.elCal.querySelectorAll('[data-nav]').forEach(function(b){
      b.addEventListener('click', function(){
        var dir=+b.getAttribute('data-nav');
        self.view=new Date(self.view.getFullYear(), self.view.getMonth()+dir,1);
        self.enter=dir; self.renderCalendar();
      });
    });
    if(skeleton) return;
    this.elCal.querySelectorAll('[data-day]').forEach(function(c){
      c.addEventListener('click', function(){ self.onDay(c.getAttribute('data-day')); });
    });
  };

  App.prototype.month = function(md, idx){
    var t=T(), y=md.getFullYear(), m=md.getMonth();
    var firstJs=new Date(y,m,1).getDay(), firstMon=(firstJs+6)%7;
    var days=new Date(y,m+1,0).getDate();
    var cells='', k=0;
    for(var i=0;i<firstMon;i++) cells+='<div class="rz2-day empty"></div>';
    for(var d=1;d<=days;d++){
      var date=new Date(y,m,d), s=iso(date), cl=['rz2-day'], clickable=false, price='';
      if(this.isPast(date)){ cl.push('past'); }
      else if(this.blocked[s]){ cl.push('blocked'); }
      else {
        cl.push('avail'); clickable=true;
        if(this.prices[s]!=null) price='<span class="rz2-pr">'+eur(this.prices[s])+'&#8239;€</span>';
      }
      // aujourd'hui
      var td=new Date(); if(y===td.getFullYear()&&m===td.getMonth()&&d===td.getDate()) cl.push('today');
      // sélection
      if(this.checkIn && s===this.checkIn) cl.push('sel-start');
      if(this.checkOut && s===this.checkOut) cl.push('sel-end');
      if(this.checkIn && this.checkOut && s>this.checkIn && s<this.checkOut){ cl.push('in-range'); if(this.sweep) cl.push('sweep'); }
      if(this.justSet===s) cl.push('pop');
      // --i : ordre d'apparition (entree en cascade, remplissage de la plage)
      var order = this.sweep && this.checkIn ? Math.round((date-fromISO(this.checkIn))/86400000) : (idx*days+k);
      k++;
      cells+='<div class="'+cl.join(' ')+'" style="--i:'+order+'"'+(clickable?' data-day="'+s+'"':'')+'>' +
        '<span class="rz2-dn">'+d+'</span>'+price+'</div>';
    }
    return '<div class="rz2-month"><div class="rz2-month-name">'+t.months[m]+' '+y+'</div>' +
      '<div class="rz2-wk">'+t.wk.map(function(w){return '<span>'+w+'</span>';}).join('')+'</div>' +
      '<div class="rz2-days">'+cells+'</div></div>';
  };

  App.prototype.renderSummary = function(){
    var self=this, t=T(), a=this.apt;
    var gOpts=''; for(var g=1;g<=a.g;g++) gOpts+='<option value="'+g+'"'+(g===this.guests?' selected':'')+'>'+g+'</option>';
    this.elSum.innerHTML =
      '<p class="rz2-sum-apt">'+esc(aName(a))+'</p><p class="rz2-sum-loc">N° '+a.no+' · '+esc(aLoc(a))+'</p>' +
      '<p class="rz2-from" id="rz2From"></p>' +
      '<div class="rz2-dates">' +
        '<div class="rz2-datebox"><div class="d-lbl">'+esc(t.in)+'</div><div class="d-val'+(this.checkIn?'':' empty')+'">'+(this.checkIn?fmtDate(this.checkIn):'—')+'</div></div>' +
        '<div class="rz2-datebox"><div class="d-lbl">'+esc(t.out)+'</div><div class="d-val'+(this.checkOut?'':' empty')+'">'+(this.checkOut?fmtDate(this.checkOut):'—')+'</div></div>' +
      '</div>' +
      '<div class="rz2-field" style="margin-top:14px"><label>'+esc(t.guests)+'</label><select class="rz2-in" id="rz2Guests">'+gOpts+'</select></div>' +
      '<div class="rz2-quote" id="rz2Quote"></div>' +
      '<div class="rz2-gform hidden" id="rz2Gform"></div>' +
      '<div class="rz2-msg" id="rz2Msg"></div>';
    var gsel=document.getElementById('rz2Guests');
    gsel.addEventListener('change', function(){ self.guests=parseInt(gsel.value,10)||1; if(self.checkIn&&self.checkOut) self.updateQuote(); });
    this.renderQuote();
    this.renderFrom();
  };

  App.prototype.setMsg = function(txt,kind){ var m=document.getElementById('rz2Msg'); if(m){ m.textContent=txt||''; m.className='rz2-msg'+(kind?' '+kind:''); } };

  App.prototype.renderQuote = function(){
    var t=T(), q=this.quote, box=document.getElementById('rz2Quote');
    if(!box) return;
    if(!this.checkIn || !this.checkOut){ box.innerHTML='<p class="rz2-hint">'+esc(t.pick)+'</p>'; return; }
    if(!q){ box.innerHTML='<p class="rz2-hint"><span class="rz2-spin" style="border-top-color:var(--ink);border-color:rgba(26,21,18,.2);border-top-color:var(--ink)"></span>'+esc(t.loading)+'</p>'; return; }
    if(!q.ok){ box.innerHTML=''; return; }
    var avg=Math.round(q.nightly_total_cents/q.nights);
    box.innerHTML =
      '<div class="rz2-line"><span>'+eur(avg)+' € <small>'+q.nights+' '+(q.nights>1?t.nights:t.night)+' '+t.perNight+'</small></span><span class="v">'+eur(q.nightly_total_cents)+' €</span></div>' +
      (q.cleaning_fee_cents?'<div class="rz2-line"><span>'+esc(t.cleaning)+'</span><span class="v">'+eur(q.cleaning_fee_cents)+' €</span></div>':'') +
      (q.tourist_tax_cents?'<div class="rz2-line"><span>'+esc(t.tax)+'</span><span class="v">'+eur(q.tourist_tax_cents)+' €</span></div>':'') +
      '<div class="rz2-line rz2-total"><span class="l">'+esc(t.total)+'</span><span class="v">'+eur(q.total_cents)+' €</span></div>' +
      (q.deposit_cents?'<p class="rz2-deposit">'+esc(t.deposit)+' '+eur(q.deposit_cents)+' €</p>':'') +
      '<button class="rz2-btn" id="rz2Book">'+esc(t.book)+'</button>';
    var self=this; document.getElementById('rz2Book').addEventListener('click', function(){ self.onBook(); });
  };

  App.prototype.updateQuote = function(){
    var self=this, a=this.apt.no, ci=this.checkIn, co=this.checkOut, g=this.guests, t=T();
    this.quote=null; this.renderQuote(); this.setMsg('','');
    api('/api/booking/quote/?apt='+a+'&check_in='+ci+'&check_out='+co+'&guests='+g).then(function(r){
      if(self.checkIn!==ci||self.checkOut!==co) return;
      var q=r.body||{};
      if(!q.ok){
        self.quote=q; self.renderQuote();
        if(q.code==='min_nights') self.setMsg(t.minN.replace('{n}',q.min_nights),'err');
        else if(q.code==='too_soon') self.setMsg(t.tooSoon,'err');
        else if(q.code==='unavailable') self.setMsg(t.unavail,'err');
        else self.setMsg(q.error||t.unavail,'err');
        return;
      }
      self.quote=q; self.renderQuote();
    }).catch(function(e){ self.setMsg(String(e.message||e),'err'); });
  };

  App.prototype.onBook = function(){
    var self=this, t=T(), gf=document.getElementById('rz2Gform');
    // Prénom, nom, e-mail et téléphone obligatoires et valides (js/guest-validate.js)
    this.gform = window.DPGuest.mount(gf, {
      lang: isEN()?'en':'fr', button: t.pay, buttonClass: 'rz2-btn',
      onInvalid: function(hint){ self.setMsg(hint,'err'); },
      onSubmit: function(guest, btn){ self.setMsg('',''); self.checkout(guest, btn); }
    });
    gf.classList.remove('hidden');
    var book=document.getElementById('rz2Book'); if(book) book.style.display='none';
    gf.scrollIntoView({behavior:'smooth',block:'nearest'});
  };

  App.prototype.checkout = function(guest, btn){
    var self=this, t=T();
    var body={ apt:this.apt.no, check_in:this.checkIn, check_out:this.checkOut, guests:this.guests, lang:isEN()?'en':'fr' };
    Object.keys(guest).forEach(function(k){ body[k]=guest[k]; });
    btn.disabled=true; btn.innerHTML='<span class="rz2-spin"></span>'+esc(t.loading);
    apiPost('/api/booking/checkout/',body).then(function(r){
      if(r.body&&r.body.url){ window.location.href=r.body.url; return; }
      btn.disabled=false; btn.textContent=t.pay;
      if(r.body&&r.body.code==='guest_invalid' && self.gform) self.gform.markInvalid(r.body.fields);
      if(r.body&&/^code_/.test(r.body.code||'') && self.gform) self.gform.codeRejected(r.body.code==='code_expired');
      self.setMsg((r.body&&r.body.error)||t.unavail,'err');
    }).catch(function(e){ btn.disabled=false; btn.textContent=t.pay; self.setMsg(String(e.message||e),'err'); });
  };

  function boot(){ if(document.getElementById('rz2Apts')) new App().start(); }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
