
  /* ── Navbar blur on scroll ── */
  window.addEventListener('scroll', () => {
    const nav = document.getElementById('main-nav');
    nav.classList.toggle('scrolled', window.scrollY > 10);
  });

  /* ── Parallax ── */
  window.addEventListener('scroll', () => {
    const bg = document.querySelector('.hero-bg');
    if (bg) bg.style.backgroundPositionY = `calc(30% + ${window.scrollY * 0.25}px)`;
  });

  /* ── Category active + indicator ── */
  function setActive(el) {
    document.querySelectorAll('.cat').forEach(c => c.classList.remove('active'));
    el.classList.add('active');
    moveIndicator(el);
    currentCat = el.dataset.cat || 'voos';
    currentFilter = 'Todos';
    showCount = 8;
    showFavsOnly = false;
    if(document.getElementById('fav-tab')) document.getElementById('fav-tab').classList.remove('has-favs');
    if(typeof renderDest === 'function') renderDest(currentCat);
  }

  function moveIndicator(btn) {
    const cats = document.getElementById('categories');
    const indicator = cats.querySelector('.cat-indicator');
    if (!indicator) return;
    const cRect = cats.getBoundingClientRect();
    const bRect = btn.getBoundingClientRect();
    indicator.style.left = (bRect.left - cRect.left) + 'px';
    indicator.style.width = bRect.width + 'px';
  }

  window.addEventListener('load', () => {
    const cats = document.getElementById('categories');
    const indicator = document.createElement('div');
    indicator.className = 'cat-indicator';
    cats.appendChild(indicator);
    const active = cats.querySelector('.cat.active');
    if (active) setTimeout(() => moveIndicator(active), 700);
  });

  /* ── Buscar loading ── */
  function buscar() {
    const btn = document.getElementById('btn-buscar');
    btn.classList.add('loading');
    setTimeout(() => btn.classList.remove('loading'), 1800);
  }

  /* ── Rotating placeholder ── */
  const DESTINOS_LIST = ['Ex: Rio de Janeiro','Ex: Paris, França','Ex: Cancún, México','Ex: Fernando de Noronha','Ex: Buenos Aires','Ex: Lisboa, Portugal','Ex: Bariloche, Argentina','Ex: Gramado, RS','Ex: Nova York, EUA'];
  let phIdx = 0;
  const destInput = document.getElementById('dest-input');
  setInterval(() => {
    if (document.activeElement === destInput) return;
    phIdx = (phIdx + 1) % DESTINOS_LIST.length;
    destInput.placeholder = DESTINOS_LIST[phIdx];
  }, 2400);

  /* ── Autocomplete ── */
  const SUGESTOES = ['Rio de Janeiro, Brasil','São Paulo, Brasil','Salvador, Brasil','Florianópolis, Brasil','Fernando de Noronha, Brasil','Gramado, Brasil','Buenos Aires, Argentina','Bariloche, Argentina','Lisboa, Portugal','Paris, França','Cancún, México','Miami, EUA','Nova York, EUA'];
  function showAutocomplete(val) {
    const ac = document.getElementById('autocomplete');
    if (!val || val.length < 2) { ac.classList.remove('show'); return; }
    const filtered = SUGESTOES.filter(s => s.toLowerCase().includes(val.toLowerCase())).slice(0,5);
    if (!filtered.length) { ac.classList.remove('show'); return; }
    ac.innerHTML = filtered.map(s => `<div class="autocomplete-item" onmousedown="selectDest('${s}')"><svg class="pin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>${s}</div>`).join('');
    ac.classList.add('show');
  }
  function selectDest(val) { destInput.value = val; document.getElementById('autocomplete').classList.remove('show'); }
  function hideAutocomplete() { document.getElementById('autocomplete').classList.remove('show'); }

  /* ── Best season ── */
  const SEASONS = {
    'rio':{'icon':'☀️','text':'Melhor época: Maio a Outubro'},
    'paris':{'icon':'🌸','text':'Melhor época: Abril a Junho'},
    'cancún':{'icon':'🌊','text':'Melhor época: Dezembro a Abril'},
    'noronha':{'icon':'🐠','text':'Melhor época: Agosto a Março'},
    'bariloche':{'icon':'⛷️','text':'Melhor época: Junho a Setembro'},
    'gramado':{'icon':'❄️','text':'Melhor época: Junho a Agosto'},
    'lisboa':{'icon':'🌤️','text':'Melhor época: Março a Outubro'},
    'miami':{'icon':'🌴','text':'Melhor época: Março a Maio'},
    'buenos':{'icon':'🥩','text':'Melhor época: Setembro a Novembro'},
  };
  function showBestSeason(val) {
    const el = document.getElementById('best-season');
    if (!val || val.length < 3) { el.classList.remove('show'); return; }
    const key = Object.keys(SEASONS).find(k => val.toLowerCase().includes(k));
    if (!key) { el.classList.remove('show'); return; }
    el.innerHTML = `<span>${SEASONS[key].icon}</span> ${SEASONS[key].text}`;
    el.classList.add('show');
  }
  function hideBestSeason() { document.getElementById('best-season').classList.remove('show'); }

  /* ── Auto-open volta ── */
  function autoOpenVolta() {
    const volta = document.getElementById('date-volta');
    setTimeout(() => { volta.type = 'date'; volta.focus(); }, 150);
  }

  /* ── Travellers ── */
  const counts = { adults:1, children:0, babies:0 };
  function changeCount(type, delta) {
    if (type==='adults') counts.adults = Math.max(1, counts.adults+delta);
    else if (type==='children') counts.children = Math.max(0, counts.children+delta);
    else counts.babies = Math.max(0, counts.babies+delta);
    document.getElementById(type==='adults'?'adults-val':type==='children'?'children-val':'babies-val').textContent = counts[type];
    updateViajantesLabel();
  }
  function updateViajantesLabel() {
    const parts = [`${counts.adults} adulto${counts.adults>1?'s':''}`];
    if (counts.children) parts.push(`${counts.children} criança${counts.children>1?'s':''}`);
    if (counts.babies) parts.push(`${counts.babies} bebê${counts.babies>1?'s':''}`);
    document.getElementById('viajantes-input').value = parts.join(', ');
  }
  function toggleTravellers() { document.getElementById('travellers-popup').classList.toggle('show'); }
  document.addEventListener('click', e => { if (!e.target.closest('.field-viajantes')) document.getElementById('travellers-popup').classList.remove('show'); });

  /* ── Popular chips ── */
  function selectChip(dest) {
    destInput.value = dest;
    destInput.focus();
    showBestSeason(dest);
  }

  /* ── Chatbot ── */
  function toggleChat() {
    const p = document.getElementById('chat-popup');
    p.style.display = p.style.display === 'none' ? 'block' : 'none';
  }
  document.getElementById('chat-popup').style.display = 'none';

  /* ── Particles ── */
  (function() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let W, H, pts = [];
    function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
    function mkPt() { return { x:Math.random()*W, y:Math.random()*H, r:Math.random()*1.5+.3, a:Math.random(), vx:(Math.random()-.5)*.18, vy:(Math.random()-.5)*.18, va:(Math.random()-.5)*.004 }; }
    function init() { resize(); pts = Array.from({length:80}, mkPt); }
    function draw() {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy; p.a+=p.va;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        p.a=Math.max(.05,Math.min(.7,p.a));
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(255,255,255,${p.a})`; ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    window.addEventListener('resize', resize);
    init(); draw();
  })();

/* ═══ REAL DESTINATION IMAGES ═══ */
/* Using LoremFlickr com tags focadas em cidades, paisagens e arquitetura */
const DEST_IMGS = {
  /* VOOS - Foco em Paisagens Urbanas e Panoramas */
  v1:'https://loremflickr.com/400/220/riodejaneiro,cityscape,copacabana',
  v2:'https://loremflickr.com/400/220/salvador,pelourinho,architecture',
  v3:'https://loremflickr.com/400/220/fortaleza,cityscape,beach',
  v4:'https://loremflickr.com/400/220/florianopolis,landscape,bridge',
  v5:'https://loremflickr.com/400/220/manaus,cityscape,amazonas',
  v6:'https://loremflickr.com/400/220/recife,cityscape,architecture',
  v7:'https://loremflickr.com/400/220/portoalegre,cityscape,landmark',
  v8:'https://loremflickr.com/400/220/belem,architecture,landmark',
  v9:'https://loremflickr.com/400/220/saopaulo,skyline,cityscape',
  v10:'https://loremflickr.com/400/220/salvador,elevadorlacerda,landmark',
  v11:'https://loremflickr.com/400/220/fortaleza,beiramar,landscape',
  v12:'https://loremflickr.com/400/220/belohorizonte,skyline,cityscape',
  v13:'https://loremflickr.com/400/220/fernandodenoronha,landscape,ocean',
  v14:'https://loremflickr.com/400/220/maceio,landscape,coastline',
  v15:'https://loremflickr.com/400/220/saopaulo,avenidapaulista,cityscape',
  v16:'https://loremflickr.com/400/220/riodejaneiro,corcovado,monument',
  v17:'https://loremflickr.com/400/220/natal,landscape,dunes',
  v18:'https://loremflickr.com/400/220/belohorizonte,architecture,city',

  /* ONIBUS - Foco em Marcos Turísticos */
  o1:'https://loremflickr.com/400/220/riodejaneiro,sugarloaf,landscape',
  o2:'https://loremflickr.com/400/220/belohorizonte,pampulha,architecture',
  o3:'https://loremflickr.com/400/220/florianopolis,landscape,coast',
  o4:'https://loremflickr.com/400/220/curitiba,botanicalgarden,landmark',
  o5:'https://loremflickr.com/400/220/portoalegre,cityscape,monument',
  o6:'https://loremflickr.com/400/220/campinas,cityscape,architecture',
  o7:'https://loremflickr.com/400/220/buzios,landscape,village',
  o8:'https://loremflickr.com/400/220/angradosreis,landscape,coastline',
  o9:'https://loremflickr.com/400/220/salvador,faroldabarra,landmark',
  o10:'https://loremflickr.com/400/220/brasilia,architecture,monument',
  o11:'https://loremflickr.com/400/220/saopaulo,buildings,skyline',
  o12:'https://loremflickr.com/400/220/fozdoiguacu,waterfall,landscape',
  o13:'https://loremflickr.com/400/220/florianopolis,bridge,landmark',
  o14:'https://loremflickr.com/400/220/olinda,architecture,historic',
  o15:'https://loremflickr.com/400/220/natal,pontanegra,landscape',
  o16:'https://loremflickr.com/400/220/goiania,cityscape,park',

  /* HOTEIS - Foco em Fachadas e Estruturas (Removido termos genéricos de luxo que trazem fotos de pessoas) */
  h1:'https://loremflickr.com/400/220/hotel,facade,copacabana',
  h2:'https://loremflickr.com/400/220/resort,architecture,ipanema',
  h3:'https://loremflickr.com/400/220/hotel,building,saopaulo',
  h4:'https://loremflickr.com/400/220/resort,landscape,praiadoforte',
  h5:'https://loremflickr.com/400/220/hotel,architecture,fozdoiguacu',
  h6:'https://loremflickr.com/400/220/resort,coastline,maragogi',
  h7:'https://loremflickr.com/400/220/resort,architecture,florianopolis',
  h8:'https://loremflickr.com/400/220/hotel,mountain,camposdojordao',
  h9:'https://loremflickr.com/400/220/pousada,architecture,jericoacoara',
  h10:'https://loremflickr.com/400/220/resort,pool,portodegalinhas',
  h11:'https://loremflickr.com/400/220/lodge,nature,bonito',
  h12:'https://loremflickr.com/400/220/resort,architecture,trancoso',
  h13:'https://loremflickr.com/400/220/resort,landscape,itacare',
  h14:'https://loremflickr.com/400/220/historic,building,paraty',
  h15:'https://loremflickr.com/400/220/lodge,amazon,architecture',
  h16:'https://loremflickr.com/400/220/hotel,skyscraper,saopaulo',

  /* CHALES - Foco em Cabanas e Montanhas */
  c1:'https://loremflickr.com/400/220/cabin,mountain,landscape',
  c2:'https://loremflickr.com/400/220/chalet,architecture,camposdojordao',
  c3:'https://loremflickr.com/400/220/cabin,mantiqueira,landscape',
  c4:'https://loremflickr.com/400/220/lodge,pantanal,landscape',
  c5:'https://loremflickr.com/400/220/chalet,monteverde,architecture',
  c6:'https://loremflickr.com/400/220/historic,architecture,tiradentes',
  c7:'https://loremflickr.com/400/220/chalet,gramado,architecture',
  c8:'https://loremflickr.com/400/220/cabin,nature,canela',
  c9:'https://loremflickr.com/400/220/cabin,landscape,viscondedemaua',
  c10:'https://loremflickr.com/400/220/chalet,architecture,penedo',
  c11:'https://loremflickr.com/400/220/farmhouse,architecture,pirenopolis',
  c12:'https://loremflickr.com/400/220/lodge,landscape,brotas',
  c13:'https://loremflickr.com/400/220/cabin,mountain,minasgerais',
  c14:'https://loremflickr.com/400/220/lodge,waterfall,carrancas',
  c15:'https://loremflickr.com/400/220/chalet,landscape,monteverde',
  c16:'https://loremflickr.com/400/220/cabin,mountain,landscape',

  /* ATRACOES - Foco em Maravilhas Naturais */
  a1:'https://loremflickr.com/400/220/dunes,landscape,lencoismaranhenses',
  a2:'https://loremflickr.com/400/220/waterfall,landscape,chapadadiamantina',
  a3:'https://loremflickr.com/400/220/waterfall,landscape,iguazufalls',
  a4:'https://loremflickr.com/400/220/coastline,landscape,fernandodenoronha',
  a5:'https://loremflickr.com/400/220/landscape,nature,jalapao',
  a6:'https://loremflickr.com/400/220/river,landscape,bonito',
  a7:'https://loremflickr.com/400/220/waterfall,landscape,chapadadosveadeiros',
  a8:'https://loremflickr.com/400/220/wetlands,landscape,pantanal',
  a9:'https://loremflickr.com/400/220/coastline,landscape,praiadosancho',
  a10:'https://loremflickr.com/400/220/dunes,landscape,jericoacoara',
  a11:'https://loremflickr.com/400/220/riverbeach,landscape,alterdochao',
  a12:'https://loremflickr.com/400/220/coastline,landscape,ilhagrande',
  a13:'https://loremflickr.com/400/220/cliffs,landscape,pipa',
  a14:'https://loremflickr.com/400/220/vineyard,landscape,bentogoncalves',
  a15:'https://loremflickr.com/400/220/waterfall,landscape,serradocipo',
  a16:'https://loremflickr.com/400/220/coastline,landscape,ilhadomel',

  /* RESTAURANTES - Mantive focado nos pratos, mas se quiser fachadas troque 'food' por 'restaurant,facade' */
  r1:'https://loremflickr.com/400/220/churrasco,food,meat',
  r2:'https://loremflickr.com/400/220/feijoada,food,brazilian',
  r3:'https://loremflickr.com/400/220/moqueca,food,seafood',
  r4:'https://loremflickr.com/400/220/acaraje,food,bahia',
  r5:'https://loremflickr.com/400/220/tapioca,food,brazilian',
  r6:'https://loremflickr.com/400/220/pizza,food,restaurant',
  r7:'https://loremflickr.com/400/220/paodequeijo,food,minas',
  r8:'https://loremflickr.com/400/220/coxinha,food,snack',
  r9:'https://loremflickr.com/400/220/caipirinha,drink,cocktail',
  r10:'https://loremflickr.com/400/220/buffet,restaurant,food',
  r11:'https://loremflickr.com/400/220/tutudefeijao,food,minas',
  r12:'https://loremflickr.com/400/220/seafood,shrimp,food',
};

function getDestImg(id, scene, name) {
  return DEST_IMGS[id] || ('https://loremflickr.com/400/220/' + encodeURIComponent(name) + ',cityscape,landscape');
}

/* ═══ DATA ═══ */
const DEST_DATA={
  voos:{
    heading:'Destinos de <em>Voos</em>',
    sub:'Rotas pelo Brasil — LATAM, GOL, Azul',
    filters:['Todos','De SP','De RJ','De BH','De BSB','De Recife'],
    all:[
      {id:'v1',name:'Rio de Janeiro',scene:'beach',meta:'São Paulo (GRU/CGH) → GIG',price:'R$ 149',pfrom:true,tag:'hot',b1:'GOL',b2:'LATAM',b3:'1h10',origem:'SP'},
      {id:'v2',name:'Salvador',scene:'coastal',meta:'São Paulo (GRU) → SSA',price:'R$ 289',pfrom:true,tag:'',b1:'LATAM',b2:'Azul',b3:'2h10',origem:'SP'},
      {id:'v3',name:'Fortaleza',scene:'dunes',meta:'São Paulo (GRU) → FOR',price:'R$ 319',pfrom:true,tag:'',b1:'GOL',b2:'Azul',b3:'2h50',origem:'SP'},
      {id:'v4',name:'Florianópolis',scene:'beach',meta:'São Paulo (GRU) → FLN',price:'R$ 179',pfrom:true,tag:'promo',b1:'LATAM',b2:'GOL',b3:'1h30',origem:'SP'},
      {id:'v5',name:'Manaus',scene:'jungle',meta:'São Paulo (GRU) → MAO',price:'R$ 499',pfrom:true,tag:'',b1:'Azul',b2:'LATAM',b3:'3h50',origem:'SP'},
      {id:'v6',name:'Recife',scene:'coastal',meta:'São Paulo (GRU) → REC',price:'R$ 289',pfrom:true,tag:'',b1:'GOL',b2:'LATAM',b3:'2h50',origem:'SP'},
      {id:'v7',name:'Porto Alegre',scene:'vineyard',meta:'São Paulo (GRU) → POA',price:'R$ 199',pfrom:true,tag:'',b1:'GOL',b2:'LATAM',b3:'1h40',origem:'SP'},
      {id:'v8',name:'Belém',scene:'jungle',meta:'São Paulo (GRU) → BEL',price:'R$ 399',pfrom:true,tag:'new',b1:'Azul',b2:'LATAM',b3:'3h30',origem:'SP'},
      {id:'v9',name:'São Paulo',scene:'city',meta:'Rio de Janeiro (GIG) → CGH',price:'R$ 149',pfrom:true,tag:'hot',b1:'GOL',b2:'LATAM',b3:'1h10',origem:'RJ'},
      {id:'v10',name:'Salvador',scene:'coastal',meta:'Rio de Janeiro (SDU) → SSA',price:'R$ 249',pfrom:true,tag:'',b1:'LATAM',b2:'GOL',b3:'2h20',origem:'RJ'},
      {id:'v11',name:'Fortaleza',scene:'dunes',meta:'Rio de Janeiro (GIG) → FOR',price:'R$ 319',pfrom:true,tag:'',b1:'GOL',b2:'Azul',b3:'3h00',origem:'RJ'},
      {id:'v12',name:'Belo Horizonte',scene:'mountain',meta:'Rio de Janeiro (SDU) → CNF',price:'R$ 179',pfrom:true,tag:'',b1:'LATAM',b2:'GOL',b3:'1h00',origem:'RJ'},
      {id:'v13',name:'Fernando de Noronha',scene:'island',meta:'Recife (REC) → FEN',price:'R$ 380',pfrom:true,tag:'new',b1:'LATAM',b2:'Azul',b3:'1h20',origem:'Recife'},
      {id:'v14',name:'Maceió',scene:'coastal',meta:'Recife (REC) → MCZ',price:'R$ 129',pfrom:true,tag:'promo',b1:'LATAM',b2:'GOL',b3:'0h50',origem:'Recife'},
      {id:'v15',name:'São Paulo',scene:'city',meta:'Brasília (BSB) → CGH',price:'R$ 159',pfrom:true,tag:'promo',b1:'GOL',b2:'LATAM',b3:'1h30',origem:'BSB'},
      {id:'v16',name:'Rio de Janeiro',scene:'beach',meta:'Brasília (BSB) → GIG',price:'R$ 189',pfrom:true,tag:'',b1:'GOL',b2:'Azul',b3:'1h40',origem:'BSB'},
      {id:'v17',name:'Natal',scene:'dunes',meta:'Belo Horizonte (CNF) → NAT',price:'R$ 299',pfrom:true,tag:'new',b1:'GOL',b2:'Azul',b3:'3h00',origem:'BH'},
      {id:'v18',name:'São Paulo',scene:'city',meta:'Belo Horizonte (PLU) → CGH',price:'R$ 149',pfrom:true,tag:'promo',b1:'LATAM',b2:'Azul',b3:'1h10',origem:'BH'},
    ]
  },
  onibus:{
    heading:'Passagens de <em>Ônibus</em>',
    sub:'Rotas com empresas verificadas — preços nas rodoviárias',
    filters:['Todos','De SP','De RJ','De BH','De POA','De Salvador'],
    all:[
      {id:'o1',name:'Rio de Janeiro',scene:'bus',meta:'São Paulo (Tietê) → Novo Rio',price:'R$ 89',pfrom:true,tag:'hot',b1:'Comfortbus',b2:'~6h',b3:'Leito R$ 140',origem:'SP'},
      {id:'o2',name:'Belo Horizonte',scene:'colonial',meta:'São Paulo (Tietê) → Rod. BH',price:'R$ 79',pfrom:true,tag:'',b1:'Itapemirim',b2:'~8h30',b3:'Leito R$ 130',origem:'SP'},
      {id:'o3',name:'Florianópolis',scene:'beach',meta:'São Paulo (Tietê) → Rod. Floripa',price:'R$ 99',pfrom:true,tag:'',b1:'Comil',b2:'~11h',b3:'Leito R$ 160',origem:'SP'},
      {id:'o4',name:'Curitiba',scene:'mountain',meta:'São Paulo (Tietê) → Rod. Curitiba',price:'R$ 65',pfrom:true,tag:'promo',b1:'Kaissara',b2:'~6h',b3:'Exec R$ 95',origem:'SP'},
      {id:'o5',name:'Porto Alegre',scene:'vineyard',meta:'São Paulo (Tietê) → Rod. POA',price:'R$ 145',pfrom:true,tag:'',b1:'Unesul',b2:'~18h',b3:'Cama R$ 220',origem:'SP'},
      {id:'o6',name:'Campinas',scene:'city',meta:'São Paulo (Tietê) → Campinas',price:'R$ 25',pfrom:true,tag:'promo',b1:'Cometa',b2:'~1h30',b3:'Executivo',origem:'SP'},
      {id:'o7',name:'Búzios',scene:'coastal',meta:'Rio de Janeiro (Novo Rio) → Búzios',price:'R$ 45',pfrom:true,tag:'new',b1:'JBL Turismo',b2:'~2h30',b3:'Executivo',origem:'RJ'},
      {id:'o8',name:'Angra dos Reis',scene:'island',meta:'Rio de Janeiro (Novo Rio) → Angra',price:'R$ 30',pfrom:true,tag:'',b1:'Costa Verde',b2:'~2h30',b3:'Convencional',origem:'RJ'},
      {id:'o9',name:'Salvador',scene:'coastal',meta:'Rio de Janeiro (Novo Rio) → Salvador',price:'R$ 185',pfrom:true,tag:'',b1:'Gontijo',b2:'~28h',b3:'Leito R$ 280',origem:'RJ'},
      {id:'o10',name:'Brasília',scene:'city',meta:'Belo Horizonte → Rod. BSB',price:'R$ 95',pfrom:true,tag:'hot',b1:'Real Expresso',b2:'~11h',b3:'Exec R$ 140',origem:'BH'},
      {id:'o11',name:'São Paulo',scene:'city',meta:'Belo Horizonte → São Paulo (Tietê)',price:'R$ 79',pfrom:true,tag:'promo',b1:'Itapemirim',b2:'~8h30',b3:'Exec R$ 120',origem:'BH'},
      {id:'o12',name:'Florianópolis',scene:'beach',meta:'Porto Alegre → Floripa',price:'R$ 60',pfrom:true,tag:'',b1:'Unesul',b2:'~5h',b3:'Exec R$ 85',origem:'POA'},
      {id:'o13',name:'Foz do Iguaçu',scene:'waterfall',meta:'Curitiba → Rod. Foz do Iguaçu',price:'R$ 80',pfrom:true,tag:'new',b1:'Catarinense',b2:'~10h',b3:'Exec R$ 120',origem:'Curitiba'},
      {id:'o14',name:'Recife',scene:'coastal',meta:'Salvador → Rod. Recife',price:'R$ 75',pfrom:true,tag:'',b1:'Progresso',b2:'~13h',b3:'Leito R$ 110',origem:'Salvador'},
      {id:'o15',name:'Natal',scene:'dunes',meta:'Fortaleza → Rod. Natal',price:'R$ 55',pfrom:true,tag:'',b1:'Exp. Guanabara',b2:'~4h30',b3:'Convencional',origem:'Fortaleza'},
      {id:'o16',name:'Goiânia',scene:'city',meta:'Brasília → Rod. Goiânia',price:'R$ 35',pfrom:true,tag:'promo',b1:'Exp. Brasília',b2:'~2h30',b3:'Executivo',origem:'BSB'},
    ]
  },
  hoteis:{
    heading:'Hotéis e <em>Pousadas</em>',
    sub:'Hospedagens verificadas pelo Brasil — hotéis, resorts e pousadas boutique',
    filters:['Todos','Luxo','Resort','Pousada','4 estrelas'],
    all:[
      {id:'h1',name:'Copacabana Palace',scene:'city',meta:'Rio de Janeiro, RJ',price:'R$ 1.800/noite',pfrom:false,tag:'hot',b1:'⭐⭐⭐⭐⭐',b2:'Belmond',b3:'9.2 Excepcional',tipo:'Luxo'},
      {id:'h2',name:'Fasano Ipanema',scene:'city',meta:'Rio de Janeiro, RJ',price:'R$ 2.100/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Fasano',b3:'9.4 Excepcional',tipo:'Luxo'},
      {id:'h3',name:'Hotel Emiliano',scene:'city',meta:'São Paulo, SP',price:'R$ 1.200/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Design',b3:'9.1 Excepcional',tipo:'Luxo'},
      {id:'h4',name:'Tivoli Ecoresort',scene:'beach',meta:'Praia do Forte, BA',price:'R$ 750/noite',pfrom:false,tag:'new',b1:'⭐⭐⭐⭐⭐',b2:'Resort',b3:'8.8 Ótimo',tipo:'Resort'},
      {id:'h5',name:'Mabu Thermas Grand',scene:'waterfall',meta:'Foz do Iguaçu, PR',price:'R$ 380/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐',b2:'Resort',b3:'8.5 Ótimo',tipo:'Resort'},
      {id:'h6',name:'Pousada do Toque',scene:'coastal',meta:'São Miguel dos Milagres, AL',price:'R$ 320/noite',pfrom:false,tag:'new',b1:'⭐⭐⭐⭐',b2:'Boutique',b3:'9.3 Excepcional',tipo:'Pousada'},
      {id:'h7',name:'Costão do Santinho',scene:'beach',meta:'Florianópolis, SC',price:'R$ 480/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Resort',b3:'8.7 Ótimo',tipo:'Resort'},
      {id:'h8',name:'Hotel Toriba',scene:'mountain',meta:'Campos do Jordão, SP',price:'R$ 550/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Clássico',b3:'8.9 Ótimo',tipo:'Luxo'},
      {id:'h9',name:'Vila Kalango',scene:'dunes',meta:'Jericoacoara, CE',price:'R$ 290/noite',pfrom:false,tag:'promo',b1:'⭐⭐⭐⭐',b2:'Boutique',b3:'8.6 Ótimo',tipo:'Pousada'},
      {id:'h10',name:'Nannai Resort',scene:'beach',meta:'Porto de Galinhas, PE',price:'R$ 650/noite',pfrom:false,tag:'hot',b1:'⭐⭐⭐⭐⭐',b2:'Resort',b3:'9.0 Excepcional',tipo:'Resort'},
      {id:'h11',name:'Zagaia Eco Resort',scene:'wetland',meta:'Bonito, MS',price:'R$ 260/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐',b2:'Ecoturismo',b3:'8.4 Muito Bom',tipo:'4 estrelas'},
      {id:'h12',name:'Pousada Uxua',scene:'coastal',meta:'Trancoso, BA',price:'R$ 1.400/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Design',b3:'9.5 Excepcional',tipo:'Luxo'},
      {id:'h13',name:'Txai Resort',scene:'coastal',meta:'Itacaré, BA',price:'R$ 900/noite',pfrom:false,tag:'new',b1:'⭐⭐⭐⭐⭐',b2:'Resort',b3:'9.2 Excepcional',tipo:'Resort'},
      {id:'h14',name:'Pousada Literária',scene:'colonial',meta:'Paraty, RJ',price:'R$ 280/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐',b2:'Boutique',b3:'8.8 Ótimo',tipo:'Pousada'},
      {id:'h15',name:'Anavilhanas Lodge',scene:'jungle',meta:'Amazônia, AM',price:'R$ 880/noite',pfrom:false,tag:'new',b1:'⭐⭐⭐⭐',b2:'Ecoturismo',b3:'9.1 Excepcional',tipo:'4 estrelas'},
      {id:'h16',name:'Grand Hyatt SP',scene:'city',meta:'São Paulo, SP',price:'R$ 850/noite',pfrom:false,tag:'',b1:'⭐⭐⭐⭐⭐',b2:'Hyatt',b3:'8.9 Ótimo',tipo:'Luxo'},
    ]
  },
  chales:{
    heading:'Chalés e <em>Refúgios</em>',
    sub:'Chalés reais em meio à natureza brasileira',
    filters:['Todos','Mantiqueira','Serra Gaúcha','Pantanal','Interior RJ','Chapada'],
    all:[
      {id:'c1',name:'Chalés Jardins da Serra',scene:'chale',meta:'Gonçalves, MG',price:'R$ 320/noite',pfrom:false,tag:'hot',b1:'4 pessoas',b2:'Lareira',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c2',name:'Chalés Mata Nativa',scene:'chale',meta:'Campos do Jordão, SP',price:'R$ 280/noite',pfrom:false,tag:'',b1:'2-6 pax',b2:'Lareira',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c3',name:'Pousada Rancho da Serra',scene:'mountain',meta:'Gonçalves, MG',price:'R$ 260/noite',pfrom:false,tag:'',b1:'2 pessoas',b2:'Jacuzzi',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c4',name:'Refúgio Ecológico Caiman',scene:'wetland',meta:'Pantanal, MS',price:'R$ 1.200/noite',pfrom:false,tag:'new',b1:'All-inclusive',b2:'Safari',b3:'Guia incluso',regiao:'Pantanal'},
      {id:'c5',name:'Chalés Serra Verde',scene:'mountain',meta:'Monte Verde, MG',price:'R$ 250/noite',pfrom:false,tag:'promo',b1:'2 pax',b2:'Lareira',b3:'Min. 2 noites',regiao:'Mantiqueira'},
      {id:'c6',name:'Pousada da Cachoeira',scene:'waterfall',meta:'Tiradentes, MG',price:'R$ 220/noite',pfrom:false,tag:'',b1:'2-4 pax',b2:'Piscina',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c7',name:'Chalés Serra Gaúcha',scene:'vineyard',meta:'Gramado, RS',price:'R$ 380/noite',pfrom:false,tag:'hot',b1:'2-5 pax',b2:'Lareira',b3:'Café incluso',regiao:'Serra Gaúcha'},
      {id:'c8',name:'Pousada Caminhos de Pedra',scene:'chale',meta:'Canela, RS',price:'R$ 300/noite',pfrom:false,tag:'',b1:'2 pax',b2:'Café colonial',b3:'Vinhos',regiao:'Serra Gaúcha'},
      {id:'c9',name:'Chalés do Paraíso',scene:'waterfall',meta:'Visconde de Mauá, RJ',price:'R$ 260/noite',pfrom:false,tag:'',b1:'2-4 pax',b2:'Cachoeiras',b3:'Min. 2 noites',regiao:'Interior RJ'},
      {id:'c10',name:'Pousada Finlândia',scene:'chale',meta:'Penedo, RJ',price:'R$ 240/noite',pfrom:false,tag:'new',b1:'2 pax',b2:'Sauna',b3:'Café incluso',regiao:'Interior RJ'},
      {id:'c11',name:'Fazenda Vagafogo',scene:'wetland',meta:'Pirenópolis, GO',price:'R$ 350/noite',pfrom:false,tag:'',b1:'Família',b2:'Trilhas',b3:'Café incluso',regiao:'Chapada'},
      {id:'c12',name:'Chalés Cachoeira Grande',scene:'waterfall',meta:'Brotas, SP',price:'R$ 280/noite',pfrom:false,tag:'promo',b1:'2-4 pax',b2:'Rafting',b3:'Min. 2 noites',regiao:'Interior SP'},
      {id:'c13',name:'Chalés Mantiqueira',scene:'chale',meta:'Delfim Moreira, MG',price:'R$ 260/noite',pfrom:false,tag:'new',b1:'2-6 pax',b2:'Lareira',b3:'Vista Serra',regiao:'Mantiqueira'},
      {id:'c14',name:'Chalés Carrancas',scene:'waterfall',meta:'Carrancas, MG',price:'R$ 200/noite',pfrom:false,tag:'',b1:'2-4 pax',b2:'Cachoeira',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c15',name:'Pousada Lua Nova',scene:'chale',meta:'Monte Verde, MG',price:'R$ 220/noite',pfrom:false,tag:'promo',b1:'2 pax',b2:'Piscina',b3:'Café incluso',regiao:'Mantiqueira'},
      {id:'c16',name:'Rancho Monte Verde',scene:'mountain',meta:'Monte Verde, MG',price:'R$ 210/noite',pfrom:false,tag:'',b1:'2 pax',b2:'Lareira',b3:'Café incluso',regiao:'Mantiqueira'},
    ]
  },

  restaurantes:{
    heading:'Gastronomia e <em>Restaurantes</em>',
    sub:'A culinária brasileira — pratos típicos, churrascarias e experiências gastronômicas',
    filters:['Todos','Nordeste','Sudeste','Sul','Centro-Oeste','Norte'],
    all:[
      {id:'r1',name:'Churrascaria Gaúcha',scene:'vineyard',meta:'Porto Alegre, RS',price:'R$ 89/pessoa',pfrom:false,tag:'hot',b1:'All-you-can-eat',b2:'Carnes nobres',b3:'9.1 Excepcional',regiao:'Sul'},
      {id:'r2',name:'Feijoada Tradicional',scene:'colonial',meta:'Rio de Janeiro, RJ',price:'R$ 65/pessoa',pfrom:false,tag:'hot',b1:'Sábado',b2:'Caipirinha inclusa',b3:'Patrimônio cultural',regiao:'Sudeste'},
      {id:'r3',name:'Moqueca de Camarão',scene:'coastal',meta:'Salvador, BA',price:'R$ 55/pessoa',pfrom:false,tag:'new',b1:'Dendê',b2:'Frutos do mar',b3:'Receita original',regiao:'Nordeste'},
      {id:'r4',name:'Acarajé da Baiana',scene:'coastal',meta:'Salvador, BA',price:'R$ 18/unidade',pfrom:false,tag:'hot',b1:'Vatapá',b2:'Caruru',b3:'Patrimônio UNESCO',regiao:'Nordeste'},
      {id:'r5',name:'Comida Mineira',scene:'mountain',meta:'Belo Horizonte, MG',price:'R$ 45/pessoa',pfrom:false,tag:'',b1:'Tutu',b2:'Frango caipira',b3:'Tradição',regiao:'Sudeste'},
      {id:'r6',name:'Pizza Paulistana',scene:'city',meta:'São Paulo, SP',price:'R$ 70/pizza',pfrom:false,tag:'',b1:'Rodízio',b2:'40+ sabores',b3:'Melhor do Brasil',regiao:'Sudeste'},
      {id:'r7',name:'Tapioca Nordestina',scene:'dunes',meta:'Fortaleza, CE',price:'R$ 15/unidade',pfrom:false,tag:'new',b1:'Queijo coalho',b2:'Fruta',b3:'Sem glúten',regiao:'Nordeste'},
      {id:'r8',name:'Peixe na Telha',scene:'beach',meta:'Florianópolis, SC',price:'R$ 85/casal',pfrom:false,tag:'',b1:'Peixe fresco',b2:'Manteiga',b3:'Vista para o mar',regiao:'Sul'},
      {id:'r9',name:'Churrasco Pantaneiro',scene:'wetland',meta:'Campo Grande, MS',price:'R$ 75/pessoa',pfrom:false,tag:'new',b1:'Fogão de chão',b2:'Cordeiro',b3:'Tradição do cerrado',regiao:'Centro-Oeste'},
      {id:'r10',name:'Tacacá Amazônico',scene:'jungle',meta:'Manaus, AM',price:'R$ 20/cuia',pfrom:false,tag:'',b1:'Jambu',b2:'Tucupi',b3:'Camarão seco',regiao:'Norte'},
      {id:'r11',name:'Pão de Queijo Mineiro',scene:'colonial',meta:'Tiradentes, MG',price:'R$ 8/dúzia',pfrom:false,tag:'promo',b1:'Polvilho azedo',b2:'Queijo minas',b3:'Quentinho',regiao:'Sudeste'},
      {id:'r12',name:'Caldeirada Baiana',scene:'coastal',meta:'Maceió, AL',price:'R$ 60/pessoa',pfrom:false,tag:'promo',b1:'Frutos do mar',b2:'Leite de coco',b3:'Vista para o mar',regiao:'Nordeste'},
    ]
  },
  atracoes:{
    heading:'Parques, Praias e <em>Atrações</em>',
    sub:'Os melhores destinos de natureza, ecoturismo e praias do Brasil',
    filters:['Todos','Nordeste','Centro-Oeste','Sul','Norte','Sudeste'],
    all:[
      {id:'a1',name:'Lençóis Maranhenses',scene:'dunes',meta:'Barreirinhas, MA',price:'Jul – Set',pfrom:false,tag:'hot',b1:'Dunas',b2:'Lagoas',b3:'UNESCO',regiao:'Nordeste'},
      {id:'a2',name:'Chapada Diamantina',scene:'waterfall',meta:'Lençóis, BA',price:'Jun – Set',pfrom:false,tag:'',b1:'Trilhas',b2:'Cachoeiras',b3:'Grutas',regiao:'Nordeste'},
      {id:'a3',name:'Cataratas do Iguaçu',scene:'waterfall',meta:'Foz do Iguaçu, PR',price:'Mar – Out',pfrom:false,tag:'hot',b1:'Patrimônio',b2:'UNESCO',b3:'7 Maravilhas',regiao:'Sul'},
      {id:'a4',name:'Fernando de Noronha',scene:'island',meta:'PE — Nordeste',price:'Ago – Mar',pfrom:false,tag:'new',b1:'Praias',b2:'Golfinhos',b3:'Mergulho',regiao:'Nordeste'},
      {id:'a5',name:'Jalapão',scene:'dunes',meta:'Mateiros, TO',price:'Mai – Out',pfrom:false,tag:'',b1:'Fervedouros',b2:'Dunas',b3:'Aventura',regiao:'Norte'},
      {id:'a6',name:'Bonito',scene:'wetland',meta:'Bonito, MS',price:'Out – Mar',pfrom:false,tag:'',b1:'Mergulho',b2:'Rios cristalinos',b3:'Grutas',regiao:'Centro-Oeste'},
      {id:'a7',name:'Chapada dos Veadeiros',scene:'waterfall',meta:'Alto Paraíso, GO',price:'Jun – Set',pfrom:false,tag:'new',b1:'Cachoeiras',b2:'UNESCO',b3:'Cerrado',regiao:'Centro-Oeste'},
      {id:'a8',name:'Pantanal',scene:'wetland',meta:'MS / MT',price:'Jul – Out',pfrom:false,tag:'',b1:'Safári',b2:'Fauna',b3:'UNESCO',regiao:'Centro-Oeste'},
      {id:'a9',name:'Praia do Sancho',scene:'beach',meta:'Fernando de Noronha, PE',price:'Ago – Mar',pfrom:false,tag:'promo',b1:'Melhor praia BR',b2:'Snorkeling',b3:'Falésias',regiao:'Nordeste'},
      {id:'a10',name:'Jericoacoara',scene:'dunes',meta:'CE — Nordeste',price:'Jul – Jan',pfrom:false,tag:'hot',b1:'Windsurf',b2:'Dunas',b3:'Lagoa Azul',regiao:'Nordeste'},
      {id:'a11',name:'Alter do Chão',scene:'island',meta:'Santarém, PA',price:'Jul – Nov',pfrom:false,tag:'new',b1:'Praia fluvial',b2:'Amazônia',b3:'Mergulho',regiao:'Norte'},
      {id:'a12',name:'Ilha Grande',scene:'island',meta:'Angra dos Reis, RJ',price:'Dez – Mar',pfrom:false,tag:'',b1:'Sem carros',b2:'Trilhas',b3:'Lagoa Azul',regiao:'Sudeste'},
      {id:'a13',name:'Praia da Pipa',scene:'coastal',meta:'Tibau do Sul, RN',price:'Nov – Mar',pfrom:false,tag:'hot',b1:'Falésias',b2:'Golfinhos',b3:'Surf',regiao:'Nordeste'},
      {id:'a14',name:'Vale dos Vinhedos',scene:'vineyard',meta:'Bento Gonçalves, RS',price:'Fev – Mar',pfrom:false,tag:'',b1:'Vinícolas',b2:'Gastronomia',b3:'Ind. Geográfica',regiao:'Sul'},
      {id:'a15',name:'Serra do Cipó',scene:'waterfall',meta:'MG — Sudeste',price:'Abr – Set',pfrom:false,tag:'promo',b1:'Trilhas',b2:'Cachoeiras',b3:'Paredões',regiao:'Sudeste'},
      {id:'a16',name:'Ilha do Mel',scene:'island',meta:'Paranaguá, PR',price:'Dez – Mar',pfrom:false,tag:'new',b1:'Sem carros',b2:'Trilhas',b3:'Praias',regiao:'Sul'},
    ]
  }
};

/* ═══ STATE ═══ */
var currentCat='voos',currentFilter='Todos',showCount=8,showFavsOnly=false;
var favorites=JSON.parse(localStorage.getItem('trekko-favs')||'[]');

function toggleFav(id,e){
  e.stopPropagation();
  var i=favorites.indexOf(id);
  if(i>=0)favorites.splice(i,1); else favorites.push(id);
  localStorage.setItem('trekko-favs',JSON.stringify(favorites));
  renderDest(currentCat);
  updateFavBadge();
}
function toggleFavFilter(){
  showFavsOnly=!showFavsOnly;
  showCount=8;
  renderDest(currentCat);
  document.getElementById('fav-tab').classList.toggle('active-fav',showFavsOnly);
}
function updateFavBadge(){
  var c=favorites.length;
  var el=document.getElementById('fav-count');
  el.textContent=c;
  el.classList.toggle('show',c>0);
}
function renderDest(cat){
  var data=DEST_DATA[cat]; if(!data)return;
  document.getElementById('dest-heading').innerHTML=data.heading;
  document.getElementById('dest-sub').textContent=data.sub;
  var fbar=document.getElementById('dest-filters');
  fbar.innerHTML=data.filters.map(function(f){
    return '<button class="filt'+(f===currentFilter?' active':'')+'" onclick="setDestFilter(\''+f+'\')">'+f+'</button>';
  }).join('');
  var cards=[].concat(data.all);
  if(currentFilter!=='Todos'){
    cards=cards.filter(function(c){
      var match=c.origem||c.tipo||c.regiao||'';
      return match===currentFilter||match.includes(currentFilter.replace('De ',''));
    });
  }
  if(showFavsOnly) cards=cards.filter(function(c){return favorites.indexOf(c.id)>=0;});
  var grid=document.getElementById('dest-grid');
  grid.innerHTML='';
  if(!cards.length){
    grid.innerHTML='<div class="dest-empty"><span class="ei">'+(showFavsOnly?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>':'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>')+'</span>'+(showFavsOnly?'Nenhum favorito ainda. Clique no coração para salvar!':'Nenhum resultado.')+'</div>';
    document.getElementById('ver-mais-wrap').style.display='none';
    updateFavBadge(); return;
  }
  var visible=cards.slice(0,showCount);
  visible.forEach(function(c){
    var faved=favorites.indexOf(c.id)>=0;
    var imgUrl=getDestImg(c.id,c.scene,c.name);
    var tagHtml='';
    if(c.tag==='hot') tagHtml='<span class="d-tag tag-hot"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Popular</span>';
    else if(c.tag==='new') tagHtml='<span class="d-tag tag-new"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Novo</span>';
    else if(c.tag==='promo') tagHtml='<span class="d-tag tag-promo"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Promo</span>';
    var pLabel=c.pfrom?'<small>a partir de </small>':(c.id[0]==='a'?'<small>Melhor época: </small>':'');
    var heartClass=faved?'heart-btn faved':'heart-btn';
    var heartIcon=faved?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    var durHtml=c.dur?'<span style="opacity:.35">·</span><span>'+c.dur+'</span>':'';
    var div=document.createElement('div');
    div.className='d-card';
    // Build img element separately to avoid quote issues
    var img=document.createElement('img');
    img.src=imgUrl;
    img.alt=c.name;
    img.style.cssText='width:100%;height:100%;object-fit:cover;display:block;transition:transform .3s';
    img.onerror=function(){this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#0f1e2e,#1e3a5f)';};
    var thumb=document.createElement('div');
    thumb.className='d-thumb';
    thumb.appendChild(img);
    thumb.innerHTML+=tagHtml;
    var heartBtn=document.createElement('button');
    heartBtn.className=heartClass;
    heartBtn.innerHTML=heartIcon;
    heartBtn.onclick=function(e){toggleFav(c.id,e);};
    thumb.appendChild(heartBtn);
    var priceEl=document.createElement('div');
    priceEl.className='d-price';
    priceEl.innerHTML=pLabel+c.price;
    thumb.appendChild(priceEl);
    div.appendChild(thumb);
    div.innerHTML+='<div class="d-body"><div class="d-name">'+c.name+'</div><div class="d-meta">'+c.meta+durHtml+'</div><div class="d-badges"><span class="d-badge g">'+c.b1+'</span><span class="d-badge b">'+c.b2+'</span><span class="d-badge a">'+c.b3+'</span></div></div>';
    div.onclick=function(e){
      if(e.target.closest('.heart-btn'))return;
      if(c.origem){
        var ori=c.origem==='SP'?'São Paulo':c.origem==='RJ'?'Rio de Janeiro':c.origem==='BH'?'Belo Horizonte':c.origem;
        document.getElementById('origem-input').value=ori;
      }
      document.getElementById('dest-input').value=c.name;
      window.scrollTo({top:0,behavior:'smooth'});
    };
    grid.appendChild(div);
  });

  document.getElementById('ver-mais-wrap').style.display=cards.length>showCount?'':'none';
  updateFavBadge();
}
function setDestFilter(f){currentFilter=f;showCount=8;showFavsOnly=false;document.getElementById('fav-tab').classList.remove('active-fav');renderDest(currentCat);}
function verMais(){showCount+=8;renderDest(currentCat);}
window.addEventListener('load',function(){renderDest('voos');});

/* ══════════════ SPLASH ══════════════ */
window.addEventListener('load',function(){
  setTimeout(function(){
    document.getElementById('splash').classList.add('gone');
    initPrefsSection();
    initRanking();
    startCountdown();
    initPullRefresh();
  },2000);
});

/* ══════════════ BUSCA GLOBAL ══════════════ */
var searchDebounce=null;
var recentSearches=JSON.parse(localStorage.getItem('trekko-recent')||'[]');
var didYouMeanWord='';

function globalSearch(val){
  clearTimeout(searchDebounce);
  document.getElementById('search-clear').classList.toggle('show',val.length>0);
  document.getElementById('recent-searches').classList.remove('show');
  if(!val){renderDest(currentCat);document.getElementById('did-you-mean').classList.remove('show');return;}
  searchDebounce=setTimeout(function(){
    doGlobalSearch(val);
  },250);
}

function doGlobalSearch(val){
  var data=DEST_DATA[currentCat];if(!data)return;
  var q=val.toLowerCase().trim();
  var results=data.all.filter(function(c){
    return c.name.toLowerCase().includes(q)||
           c.meta.toLowerCase().includes(q)||
           (c.b1&&c.b1.toLowerCase().includes(q))||
           (c.b2&&c.b2.toLowerCase().includes(q));
  });
  renderFiltered(results);
  // Did you mean?
  if(results.length===0){
    var best=findClosest(q,data.all.map(function(c){return c.name;}));
    if(best){
      didYouMeanWord=best;
      document.getElementById('did-you-mean').textContent='Você quis dizer "'+best+'"?';
      document.getElementById('did-you-mean').classList.add('show');
    }
  } else {
    document.getElementById('did-you-mean').classList.remove('show');
    if(val.length>2) saveRecentSearch(val);
  }
}

function findClosest(query,words){
  var best=null,bestD=99;
  words.forEach(function(w){
    var d=levenshtein(query,w.toLowerCase());
    if(d<bestD&&d<=4){bestD=d;best=w;}
  });
  return best;
}

function levenshtein(a,b){
  var m=a.length,n=b.length;
  var dp=[];
  for(var i=0;i<=m;i++){dp[i]=[i];}
  for(var j=0;j<=n;j++){dp[0][j]=j;}
  for(var i=1;i<=m;i++){for(var j=1;j<=n;j++){
    dp[i][j]=a[i-1]===b[j-1]?dp[i-1][j-1]:1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  }}
  return dp[m][n];
}

function applyDidYouMean(){
  document.getElementById('global-search').value=didYouMeanWord;
  doGlobalSearch(didYouMeanWord);
  document.getElementById('did-you-mean').classList.remove('show');
}

function clearSearch(){
  document.getElementById('global-search').value='';
  document.getElementById('search-clear').classList.remove('show');
  document.getElementById('did-you-mean').classList.remove('show');
  document.getElementById('recent-searches').classList.remove('show');
  renderDest(currentCat);
}

function saveRecentSearch(val){
  recentSearches=recentSearches.filter(function(r){return r!==val;});
  recentSearches.unshift(val);
  if(recentSearches.length>5)recentSearches=recentSearches.slice(0,5);
  localStorage.setItem('trekko-recent',JSON.stringify(recentSearches));
}

function showRecent(){
  if(document.getElementById('global-search').value)return;
  if(!recentSearches.length)return;
  var wrap=document.getElementById('recent-searches');
  wrap.innerHTML='<span class="recent-label">Recentes:</span>';
  recentSearches.forEach(function(r){
    var btn=document.createElement('button');
    btn.className='recent-chip';
    btn.innerHTML=r+'<span class="r-del" onclick="removeRecent(event,\''+r+'\')">✕</span>';
    btn.onclick=function(e){if(e.target.className==='r-del')return;document.getElementById('global-search').value=r;doGlobalSearch(r);};
    wrap.appendChild(btn);
  });
  wrap.classList.add('show');
}
document.addEventListener('click',function(e){
  if(!e.target.closest('.search-global-inner'))document.getElementById('recent-searches').classList.remove('show');
});
function removeRecent(e,val){
  e.stopPropagation();
  recentSearches=recentSearches.filter(function(r){return r!==val;});
  localStorage.setItem('trekko-recent',JSON.stringify(recentSearches));
  showRecent();
}

function renderFiltered(cards){
  var grid=document.getElementById('dest-grid');
  grid.innerHTML='';
  if(!cards.length){
    grid.innerHTML='<div class="dest-empty"><span class="ei"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>Nenhum resultado encontrado.</div>';
    document.getElementById('ver-mais-wrap').style.display='none';
    return;
  }
  document.getElementById('ver-mais-wrap').style.display='none';
  cards.slice(0,12).forEach(function(c){
    var faved=favorites.indexOf(c.id)>=0;
    var imgUrl=getDestImg(c.id,c.scene,c.name);
    var tagHtml='';
    if(c.tag==='hot') tagHtml='<span class="d-tag tag-hot"><svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg> Popular</span>';
    else if(c.tag==='new') tagHtml='<span class="d-tag tag-new"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> Novo</span>';
    else if(c.tag==='promo') tagHtml='<span class="d-tag tag-promo"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:2px;vertical-align:middle"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Promo</span>';
    var heartClass=faved?'heart-btn faved':'heart-btn';
    var div=document.createElement('div');div.className='d-card';
    var img=document.createElement('img');img.src=imgUrl;img.alt=c.name;
    img.style.cssText='width:100%;height:100%;object-fit:cover;display:block';
    img.onerror=function(){this.style.display='none';this.parentElement.style.background='linear-gradient(135deg,#0f1e2e,#1e3a5f)';};
    var thumb=document.createElement('div');thumb.className='d-thumb';thumb.appendChild(img);
    thumb.innerHTML+=tagHtml;
    var hb=document.createElement('button');hb.className=heartClass;hb.innerHTML=faved?'<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>':'<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';hb.onclick=function(e){toggleFav(c.id,e);};
    thumb.appendChild(hb);
    var pr=document.createElement('div');pr.className='d-price';pr.innerHTML=(c.pfrom?'<small>a partir de </small>':'')+c.price;
    thumb.appendChild(pr);
    div.appendChild(thumb);
    div.innerHTML+='<div class="d-body"><div class="d-name">'+c.name+'</div><div class="d-meta">'+c.meta+'</div><div class="d-badges"><span class="d-badge g">'+c.b1+'</span><span class="d-badge b">'+c.b2+'</span><span class="d-badge a">'+c.b3+'</span></div></div>';
    div.onclick=function(e){if(e.target.closest('.heart-btn'))return;document.getElementById('dest-input').value=c.name;window.scrollTo({top:0,behavior:'smooth'});};
    grid.appendChild(div);
  });
}

/* ══════════════ PREFERÊNCIAS ══════════════ */
var PREF_MAP={
  'Praia':   {cat:'atracoes',filter:'Nordeste',emoji:'🏖️',label:'Praias do Nordeste'},
  'Montanha':{cat:'chales',filter:'Mantiqueira',emoji:'🏔️',label:'Chalés na Mantiqueira'},
  'Cidade':  {cat:'hoteis',filter:'Luxo',emoji:'🌆',label:'Hotéis de Luxo'},
  'Natureza':{cat:'atracoes',filter:'Centro-Oeste',emoji:'🌿',label:'Ecoturismo no Centro-Oeste'},
  'Gastronomia':{cat:'restaurantes',filter:'Todos',emoji:'🍷',label:'Gastronomia Brasileira'},
  'Cultura': {cat:'atracoes',filter:'Sudeste',emoji:'🎭',label:'Cultura no Sudeste'},
};

function initPrefsSection(){
  var d=JSON.parse(localStorage.getItem('trekko-draft')||'{}');
  var prefs=d.prefs||[];
  var name=d.fullname?d.fullname.split(' ')[0]:'';
  if(!prefs.length&&!name)return;
  if(name)document.getElementById('prefs-user-name').textContent=name;
  var container=document.getElementById('prefs-cards');
  var section=document.getElementById('prefs-section');
  var prefList=prefs.length?prefs:Object.keys(PREF_MAP).slice(0,4);
  prefList.forEach(function(p){
    var pm=PREF_MAP[p];if(!pm)return;
    var btn=document.createElement('button');
    btn.className='pref-mini';
    btn.innerHTML=pm.emoji+' '+pm.label;
    btn.onclick=function(){
      var catBtn=document.querySelector('.cat[data-cat="'+pm.cat+'"]');
      if(catBtn)setActive(catBtn);
      if(pm.filter!=='Todos')setTimeout(function(){setDestFilter(pm.filter);},100);
      document.querySelector('.destinations-section').scrollIntoView({behavior:'smooth',block:'start'});
    };
    container.appendChild(btn);
  });
  section.classList.add('show');
}

/* ══════════════ COUNTDOWN ══════════════ */
function startCountdown(){
  function tick(){
    var now=new Date();
    var target=new Date();
    target.setDate(target.getDate()+(7-target.getDay())%7||7);
    target.setHours(23,59,59,0);
    var diff=target-now;
    var d=Math.floor(diff/86400000);
    var h=Math.floor((diff%86400000)/3600000);
    var m=Math.floor((diff%3600000)/60000);
    var s=Math.floor((diff%60000)/1000);
    var p=function(n){return String(n).padStart(2,'0');};
    var el=function(id,v){var e=document.getElementById(id);if(e)e.textContent=p(v);};
    el('cd-d',d);el('cd-h',h);el('cd-m',m);el('cd-s',s);
  }
  tick();setInterval(tick,1000);
}

function applyOffer(dest,id){
  document.getElementById('dest-input').value=dest;
  window.scrollTo({top:0,behavior:'smooth'});
}

/* ══════════════ RANKING ══════════════ */
var RANKING=[
  {name:'Rio de Janeiro',meta:'RJ — Costa Verde',id:'v1',count:148420,trend:'↑'},
  {name:'Fernando de Noronha',meta:'PE — Arquipélago',id:'v13',count:92310,trend:'↑'},
  {name:'Florianópolis',meta:'SC — Ilha da Magia',id:'v4',count:87650,trend:'→'},
  {name:'Salvador',meta:'BA — Capital histórica',id:'v2',count:76200,trend:'↑'},
  {name:'Gramado',meta:'RS — Serra Gaúcha',id:'c7',count:68900,trend:'↓'},
  {name:'Foz do Iguaçu',meta:'PR — Cataratas',id:'o12',count:61400,trend:'↑'},
  {name:'Fortaleza',meta:'CE — Litoral cearense',id:'v3',count:54200,trend:'→'},
  {name:'Bonito',meta:'MS — Ecoturismo',id:'a6',count:48700,trend:'↑'},
];
function initRanking(){
  var list=document.getElementById('ranking-list');if(!list)return;
  var max=RANKING[0].count;
  RANKING.forEach(function(r,i){
    var numClass=i===0?'rank-num gold':i===1?'rank-num silver':i===2?'rank-num bronze':'rank-num';
    var medal=i===0?'🥇':i===1?'🥈':i===2?'🥉':'';
    var img=document.createElement('img');img.className='rank-img';img.src=getDestImg(r.id,'beach',r.name);img.alt=r.name;img.onerror=function(){this.style.background='#1e3a5f';this.src='';};
    var div=document.createElement('div');div.className='rank-item';
    div.appendChild(Object.assign(document.createElement('div'),{className:numClass,innerHTML:medal||(i+1)}));
    div.appendChild(img);
    var info=document.createElement('div');info.className='rank-info';
    info.innerHTML='<div class="rank-name">'+r.name+'</div><div class="rank-meta">'+r.meta+'</div>';
    div.appendChild(info);
    var bwrap=document.createElement('div');bwrap.className='rank-bar-wrap';
    bwrap.innerHTML='<div class="rank-bar"><div class="rank-bar-fill" style="width:0" data-w="'+(r.count/max*100).toFixed(0)+'%"></div></div><div class="rank-count">'+r.count.toLocaleString('pt-BR')+' viajantes</div>';
    div.appendChild(bwrap);
    div.appendChild(Object.assign(document.createElement('div'),{className:'rank-trend',textContent:r.trend==='↑'?'📈':r.trend==='↓'?'📉':'➡️'}));
    div.onclick=function(){document.getElementById('dest-input').value=r.name;window.scrollTo({top:0,behavior:'smooth'});};
    list.appendChild(div);
  });
  // Animate bars after a tick
  setTimeout(function(){
    document.querySelectorAll('.rank-bar-fill').forEach(function(b){b.style.width=b.dataset.w;});
  },600);
}

/* ══════════════ COMPARADOR ══════════════ */
var compareList=[];
var compareMode=false;

function toggleCompareMode(){
  if(compareList.length>=2){openCompare();return;}
  compareMode=!compareMode;
  document.getElementById('dest-grid').classList.toggle('compare-mode',compareMode);
  if(!compareMode){compareList=[];updateCompareBadge();}
}

function addToCompare(id,e){
  e.stopPropagation();
  var checked=e.target.checked;
  if(checked){
    if(compareList.length>=3){e.target.checked=false;return;}
    compareList.push(id);
  } else {
    compareList=compareList.filter(function(i){return i!==id;});
  }
  updateCompareBadge();
}

function updateCompareBadge(){
  document.getElementById('compare-badge').textContent=compareList.length;
  document.getElementById('compare-btn-wrap').classList.toggle('show',true);
}

function openCompare(){
  if(compareList.length<2){alert('Selecione pelo menos 2 destinos para comparar.');return;}
  var allCards=[];
  Object.values(DEST_DATA).forEach(function(cat){cat.all.forEach(function(c){allCards.push(c);});});
  var selected=compareList.map(function(id){return allCards.find(function(c){return c.id===id;});}).filter(Boolean);
  // Find prices as numbers
  var prices=selected.map(function(c){
    var m=c.price.match(/[\d.]+/);return m?parseFloat(m[0].replace('.','')):-1;
  });
  var minP=Math.min.apply(null,prices.filter(function(p){return p>0;}));
  var content=document.getElementById('compare-content');
  var cols=selected.map(function(c,i){
    var isWinner=prices[i]===minP&&prices[i]>0;
    return '<div class="compare-col'+(isWinner?' compare-winner':'')+'">'+
      (isWinner?'<div class="compare-winner-badge"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:text-bottom"><polyline points="20 6 9 17 4 12"></polyline></svg> Melhor preço</div>':'')+
      '<img src="'+getDestImg(c.id,c.scene,c.name)+'" alt="'+c.name+'" style="width:100%;height:100px;object-fit:cover;border-radius:10px;margin-bottom:10px"/>'+
      '<div class="compare-col-name">'+c.name+'</div>'+
      '<div class="compare-item"><div class="compare-item-label">Preço</div><div class="compare-item-val">'+c.price+'</div></div>'+
      '<div class="compare-item"><div class="compare-item-label">Origem</div><div class="compare-item-val" style="color:white;font-size:13px">'+c.meta+'</div></div>'+
      '<div class="compare-item"><div class="compare-item-label">Destaques</div><div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:4px"><span class="d-badge g">'+c.b1+'</span><span class="d-badge b">'+c.b2+'</span></div></div>'+
      '</div>';
  }).join('');
  content.innerHTML='<div class="compare-row" style="grid-template-columns:repeat('+selected.length+',1fr)">'+cols+'</div>';
  document.getElementById('compare-modal').classList.add('show');
}

function closeCompare(){document.getElementById('compare-modal').classList.remove('show');}
document.getElementById('compare-modal').addEventListener('click',function(e){if(e.target===this)closeCompare();});

/* ══════════════ NEWSLETTER ══════════════ */
function subscribeNewsletter(){
  var email=document.getElementById('nl-email').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){document.getElementById('nl-email').focus();return;}
  document.getElementById('nl-success').classList.add('show');
  document.getElementById('nl-email').value='';
  localStorage.setItem('trekko-newsletter',email);
}

/* ══════════════ PULL TO REFRESH ══════════════ */
function initPullRefresh(){
  var startY=0,pulling=false,ind=document.getElementById('pull-indicator');
  document.addEventListener('touchstart',function(e){if(window.scrollY===0)startY=e.touches[0].clientY;});
  document.addEventListener('touchmove',function(e){
    if(window.scrollY!==0)return;
    var dy=e.touches[0].clientY-startY;
    if(dy>60){pulling=true;ind.classList.add('visible');ind.style.transform='translateX(-50%) rotate('+(dy*2)+'deg)';}
  });
  document.addEventListener('touchend',function(){
    if(pulling){setTimeout(function(){renderDest(currentCat);},400);}
    pulling=false;ind.classList.remove('visible');
  });
}

/* ══════════════ SWIPE CAROUSEL (mobile) ══════════════ */
(function(){
  var startX=0,startY=0;
  document.addEventListener('touchstart',function(e){startX=e.touches[0].clientX;startY=e.touches[0].clientY;});
  document.addEventListener('touchend',function(e){
    if(!e.target.closest('.destinations-section'))return;
    var dx=e.changedTouches[0].clientX-startX;
    var dy=e.changedTouches[0].clientY-startY;
    if(Math.abs(dy)>Math.abs(dx)||Math.abs(dx)<50)return;
    if(dx<0){verMais();}
  });
})();
window.addEventListener('load',function(){updateCompareBadge();});

/* ══════════════ CARD MODAL ══════════════ */
var DEST_DESCS = {
  'Rio de Janeiro': 'A Cidade Maravilhosa combina praias icônicas como Copacabana e Ipanema com o imponente Cristo Redentor e o Pão de Açúcar. Uma mistura única de cultura, natureza e alegria carioca que encanta visitantes do mundo inteiro.',
  'Salvador': 'Capital da Bahia e berço da cultura afro-brasileira. O Pelourinho, Patrimônio da UNESCO, guarda igrejas barrocas, capoeira, axé e a melhor gastronomia baiana — de acarajé a moqueca.',
  'Fernando de Noronha': 'Arquipélago vulcânico com as praias mais belas do Brasil. Berço dos golfinhos-rotadores, corais coloridos e mergulhos inesquecíveis. Acesso limitado para preservar o paraíso.',
  'Florianópolis': 'A Ilha da Magia reúne mais de 40 praias para todos os gostos — da tranquila Lagoa da Conceição ao surf radicado em Joaquina. Capital do estado de Santa Catarina.',
  'Manaus': 'Porta de entrada da Amazônia. Teatro Amazonas, encontro das águas do Rio Negro e Solimões, e expedições na maior floresta tropical do planeta são os destaques.',
  'Gramado': 'Cidade gaúcha que transporta o visitante para a Europa. Arquitetura enxaimel, chocolates artesanais, o Natal Luz mais famoso do Brasil e temperatura fresca o ano todo.',
  'Bonito': 'Capital do ecoturismo brasileiro. Rios com águas cristalinas para snorkeling, a Gruta do Lago Azul e a Nascente Azul formam um cenário de tirar o fôlego no Mato Grosso do Sul.',
  'Foz do Iguaçu': 'As Cataratas do Iguaçu, uma das 7 Maravilhas da Natureza, impressionam com 275 quedas d\'água. Patrimônio da Humanidade compartilhado com a Argentina.',
  'default': 'Um destino incrível esperando por você. Paisagens únicas, gastronomia local, cultura rica e experiências que você vai levar para sempre na memória.'
};
var DEST_ROTEIROS = {
  'Rio de Janeiro': [
    {t:'Cristo Redentor e Pão de Açúcar',d:'Vista panorâmica da cidade, teleférico até o Pão de Açúcar ao pôr do sol.'},
    {t:'Copacabana e Ipanema',d:'Manhã na praia, almoço em restaurante local, passeio pelo calçadão.'},
    {t:'Santa Teresa e Lapa',d:'Bonde de Santa Teresa, escadaria Selarón, samba na Lapa à noite.'},
  ],
  'Salvador': [
    {t:'Pelourinho Histórico',d:'Igrejas barrocas, shows de capoeira e acarajé da Dinha.'},
    {t:'Barra e Farol',d:'Farol da Barra, Museu Náutico, praia ao entardecer.'},
    {t:'Mercado Modelo e dique',d:'Artesanato, culinária baiana, passeio de barco na baía.'},
  ],
  'default': [
    {t:'Chegada e exploração',d:'Instalação, passeio pelo centro histórico e mercado local.'},
    {t:'Atrações principais',d:'Visita aos pontos turísticos mais icônicos do destino.'},
    {t:'Gastronomia e cultura',d:'Restaurantes típicos, shows culturais e souvenirs.'},
  ]
};
var WEATHER_DATA = {
  'Rio de Janeiro': {temp:'28°C',cond:'☀️ Ensolarado',humid:'75%'},
  'Salvador': {temp:'30°C',cond:'🌤️ Parcialmente nublado',humid:'82%'},
  'Florianópolis': {temp:'24°C',cond:'🌊 Ventos costeiros',humid:'70%'},
  'Manaus': {temp:'32°C',cond:'🌧️ Chuvas tropicais',humid:'88%'},
  'Gramado': {temp:'14°C',cond:'❄️ Frio com névoa',humid:'80%'},
  'Fernando de Noronha': {temp:'27°C',cond:'☀️ Ensolarado',humid:'72%'},
  'Foz do Iguaçu': {temp:'26°C',cond:'🌦️ Nublado',humid:'78%'},
  'Bonito': {temp:'25°C',cond:'☀️ Ensolarado',humid:'65%'},
  'default': {temp:'25°C',cond:'☀️ Bom tempo',humid:'70%'},
};

function openCardModal(card) {
  var w = WEATHER_DATA[card.name] || WEATHER_DATA.default;
  var desc = DEST_DESCS[card.name] || DEST_DESCS.default;
  var rot = DEST_ROTEIROS[card.name] || DEST_ROTEIROS.default;
  var imgUrl = getDestImg(card.id, card.scene, card.name);
  var rotHTML = rot.map(function(d, i) {
    return '<div class="cm-day"><div class="cm-day-num">' + (i+1) + '</div>' +
      '<div class="cm-day-content"><div class="cm-day-title">' + d.t + '</div>' +
      '<div class="cm-day-desc">' + d.d + '</div></div></div>';
  }).join('');
  document.getElementById('card-modal-inner').innerHTML =
    '<div class="card-modal-hero">' +
      '<img src="' + imgUrl + '" alt="' + card.name + '" onerror="this.style.background=\'#1e3a5f\';this.src=\'\'">' +
      '<div class="card-modal-hero-overlay"></div>' +
      '<div class="weather-badge">' + w.cond + ' ' + w.temp + '</div>' +
      '<div class="card-modal-share-wrap" style="position:absolute;top:14px;right:58px">' +
        '<button class="card-modal-share" onclick="toggleShareMenu(event)">🔗</button>' +
        '<div class="share-menu" id="share-menu">' +
          '<div class="share-item" onclick="shareWpp(\'' + card.name + '\',\'' + card.price + '\')">💬 WhatsApp</div>' +
          '<div class="share-item" onclick="copyLink(\'' + card.name + '\')">📋 Copiar link</div>' +
          '<div class="share-item" onclick="shareNative(\'' + card.name + '\',\'' + card.price + '\')">↗️ Compartilhar</div>' +
        '</div>' +
      '</div>' +
      '<button class="card-modal-close" onclick="closeCardModal()">✕</button>' +
    '</div>' +
    '<div class="card-modal-body">' +
      '<div class="card-modal-title">' + card.name + '</div>' +
      '<div class="card-modal-meta">' + card.meta + '</div>' +
      '<div class="card-modal-stats">' +
        '<div class="cm-stat"><div class="cm-stat-val">' + card.price + '</div><div class="cm-stat-label">' + (card.pfrom ? 'a partir de' : 'Preço') + '</div></div>' +
        '<div class="cm-stat"><div class="cm-stat-val">' + (card.dur || card.b2 || '—') + '</div><div class="cm-stat-label">Duração</div></div>' +
        '<div class="cm-stat"><div class="cm-stat-val">' + w.temp + '</div><div class="cm-stat-label">Temperatura</div></div>' +
      '</div>' +
      '<div class="card-modal-desc">' + desc + '</div>' +
      '<div class="card-modal-weather">' +
        '<span class="cm-weather-icon">' + w.cond.split(' ')[0] + '</span>' +
        '<div class="cm-weather-info"><div class="cm-weather-temp">' + w.temp + '</div>' +
        '<div class="cm-weather-cond">' + w.cond.replace(/^\S+\s*/,'') + ' · Umidade ' + w.humid + '</div></div>' +
      '</div>' +
      '<div class="card-modal-actions">' +
        '<button class="cm-btn-primary" onclick="closeCardModal();document.getElementById(\'dest-input\').value=\'' + card.name + '\';window.scrollTo({top:0,behavior:\'smooth\'})">✈️ Buscar disponibilidade</button>' +
        '<button class="cm-btn-sec" onclick="addPoints(20,\'📝\',\'Roteiro visualizado +20 pts!\')">📋 Salvar roteiro</button>' +
      '</div>' +
      '<div class="cm-roteiro"><div class="cm-roteiro-title">📅 Roteiro sugerido (3 dias)</div>' + rotHTML + '</div>' +
    '</div>';
  document.getElementById('card-modal').classList.add('show');
  document.body.style.overflow = 'hidden';
  addPoints(5, '🔍', 'Destino visualizado +5 pts!');
}
function closeCardModal() {
  document.getElementById('card-modal').classList.remove('show');
  document.body.style.overflow = '';
  document.getElementById('share-menu') && document.getElementById('share-menu').classList.remove('show');
}
document.getElementById('card-modal').addEventListener('click', function(e) {
  if (e.target === this) closeCardModal();
});
document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeCardModal(); });

/* Share */
function toggleShareMenu(e) { e.stopPropagation(); document.getElementById('share-menu').classList.toggle('show'); }
document.addEventListener('click', function() { var sm = document.getElementById('share-menu'); if(sm) sm.classList.remove('show'); });
function shareWpp(name, price) {
  var txt = '✈️ Acabei de encontrar ' + name + ' por ' + price + ' no Trekko! 🌟 trekko.com.br';
  window.open('https://wa.me/?text=' + encodeURIComponent(txt), '_blank');
}
function copyLink(name) {
  navigator.clipboard.writeText('https://trekko.com.br/destino/' + name.toLowerCase().replace(/\s/g,'-')).then(function() { showToast('🔗 Link copiado!'); });
}
function shareNative(name, price) {
  if (navigator.share) { navigator.share({ title:'Trekko — '+name, text:'Encontrei '+name+' por '+price+'!', url:'https://trekko.com.br' }); }
  else copyLink(name);
}
function showToast(msg) {
  var t = document.getElementById('pts-toast');
  if (t) {
    document.getElementById('pts-toast-msg').textContent = msg;
    document.getElementById('pts-toast-icon').textContent = '💬';
    t.classList.add('show'); setTimeout(function(){t.classList.remove('show');}, 2500);
  }
}

/* ══════════════ PATCH renderDest to add click for modal ══════════════ */
var _baseRenderDest = renderDest;
renderDest = function(cat) {
  _baseRenderDest(cat);
  // Hook card clicks to open modal
  setTimeout(function(){
    document.querySelectorAll('.d-card').forEach(function(card, i) {
      var data = DEST_DATA[cat];
      if (!data) return;
      var visible = data.all.slice(0, showCount);
      var c = visible[i];
      if (!c) return;
      var orig = card.onclick;
      card.onclick = function(e) {
        if (e.target.closest('.heart-btn') || e.target.closest('.compare-check')) return;
        openCardModal(c);
      };
    });
  }, 200);
};

/* ══════════════ MAPA REDESIGN JS ══════════════ */


function addPoints(n, icon, msg) {
  points += n;
  localStorage.setItem('trekko-pts', points);
  var ptsValEl = document.getElementById('pts-val');
  if (ptsValEl) ptsValEl.textContent = points;
  var t = document.getElementById('pts-toast');
  if (t) {
    document.getElementById('pts-toast-icon').textContent = icon;
    document.getElementById('pts-toast-msg').textContent = msg;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, 2500);
  }
  // Check badges
  if (points >= 50 && earnedBadges.indexOf('explorer') < 0) earnBadge('explorer');
}

function earnBadge(id) {
  earnedBadges.push(id);
  localStorage.setItem('trekko-badges', JSON.stringify(earnedBadges));
  var badge = BADGES.find(function(b){ return b.id === id; });
  if (!badge) return;
  addPoints(badge.pts, '🏆', 'Badge desbloqueado: ' + badge.name);
}

function showBadges() {
  var earned = BADGES.filter(function(b){ return earnedBadges.indexOf(b.id) >= 0; });
  var html2 = '<div style="padding:20px;max-width:400px"><div style="font-size:18px;font-weight:900;color:white;margin-bottom:16px">⭐ Seus pontos: ' + points + '</div>';
  if (!earned.length) html2 += '<div style="color:#8fa3b8;font-size:14px">Explore destinos, salve favoritos e assine a newsletter para ganhar badges!</div>';
  else earned.forEach(function(b){ html2 += '<div style="display:flex;gap:10px;align-items:center;padding:10px;background:rgba(255,255,255,.04);border-radius:10px;margin-bottom:8px"><span style="font-size:24px">' + b.name.split(' ')[0] + '</span><div><div style="font-size:14px;font-weight:800;color:white">' + b.name.slice(2) + '</div><div style="font-size:12px;color:#8fa3b8">' + b.desc + '</div></div></div>'; });
  html2 += '</div>';
  document.getElementById('card-modal-inner').innerHTML = html2;
  document.getElementById('card-modal').classList.add('show');
}

// Initialize points display
var initPtsVal = document.getElementById('pts-val');
if (initPtsVal) initPtsVal.textContent = points;

/* ══════════════ PRICE FILTER ══════════════ */
var priceMin = 0, priceMax = Infinity;
function applyPriceFilter() {
  var mn = parseFloat(document.getElementById('price-min').value) || 0;
  var mx = parseFloat(document.getElementById('price-max').value) || Infinity;
  priceMin = mn; priceMax = mx;
  filterByPrice();
  addPoints(2, '💰', 'Filtro aplicado +2 pts!');
}
function clearPriceFilter() {
  priceMin = 0; priceMax = Infinity;
  document.getElementById('price-min').value = '';
  document.getElementById('price-max').value = '';
  renderDest(currentCat);
}
function filterByPrice() {
  var data = DEST_DATA[currentCat]; if(!data) return;
  var filtered = data.all.filter(function(c){
    var m = c.price.match(/[\d.]+/);
    if (!m) return true;
    var v = parseFloat(m[0].replace('.',''));
    return v >= priceMin && v <= priceMax;
  });
  renderFiltered(filtered);
}

/* ══════════════ INFINITE SCROLL ══════════════ */
var sentinel = document.getElementById('load-sentinel');
if (sentinel && typeof IntersectionObserver !== 'undefined') {
  var io = new IntersectionObserver(function(entries) {
    if (entries[0].isIntersecting && document.getElementById('ver-mais-wrap').style.display !== 'none') {
      verMais();
    }
  }, { rootMargin: '200px' });
  io.observe(sentinel);
}

/* ══════════════ SCROLL REVEAL ══════════════ */
var revealObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.08 });
document.querySelectorAll('.reveal').forEach(function(el){ revealObserver.observe(el); });

/* ══════════════ PATCH toggleFav for points ══════════════ */
var _origToggleFav = toggleFav;
toggleFav = function(id, e) {
  var wasFaved = favorites.indexOf(id) >= 0;
  _origToggleFav(id, e);
  if (!wasFaved) {
    addPoints(10, '❤️', 'Destino salvo +10 pts!');
    if (favorites.length === 1 && earnedBadges.indexOf('first-fav') < 0) earnBadge('first-fav');
  }
};

/* ══════════════ PATCH subscribeNewsletter for points ══════════════ */
var _origSubNL = subscribeNewsletter;
subscribeNewsletter = function() {
  _origSubNL();
  if (earnedBadges.indexOf('newsletter') < 0) earnBadge('newsletter');
};

/* ══════════════ LAZY LOADING ══════════════ */
if ('IntersectionObserver' in window) {
  var lazyObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(e) {
      if (e.isIntersecting) {
        var img = e.target;
        if (img.dataset.src) { img.src = img.dataset.src; delete img.dataset.src; lazyObserver.unobserve(img); }
      }
    });
  }, { rootMargin: '300px' });
  // Observe future imgs via MutationObserver
  var mutObs = new MutationObserver(function() {
    document.querySelectorAll('img[data-src]').forEach(function(img){ lazyObserver.observe(img); });
  });
  mutObs.observe(document.body, { childList: true, subtree: true });
}

/* ══════════ SCROLL REVEAL ══════════ */
var revealObserver = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.reveal,.fade-in-up').forEach(function(el){revealObserver.observe(el);});

/* ══════════ LAZY LOADING ══════════ */
var lazyObs = new IntersectionObserver(function(entries){
  entries.forEach(function(e){
    if(e.isIntersecting){
      var img=e.target;
      if(img.dataset.src){img.src=img.dataset.src;delete img.dataset.src;}
      img.classList.remove('lazy-loading');img.classList.add('lazy-loaded');
      lazyObs.unobserve(img);
    }
  });
},{rootMargin:'120px'});

/* ══════════ PONTOS / GAMIFICAÇÃO ══════════ */
var trekkoPoints = parseInt(localStorage.getItem('trekko-points')||'0');
var trekkoBadges = JSON.parse(localStorage.getItem('trekko-badges')||'[]');

var BADGES_DEF = [
  {id:'first_fav',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',name:'Primeiro Favorito',desc:'Salvou seu primeiro destino',pts:50},
  {id:'explorer',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/></svg>',name:'Explorador',desc:'Clicou no mapa pela primeira vez',pts:30},
  {id:'5favs',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',name:'Colecionador',desc:'5 destinos favoritos salvos',pts:100},
  {id:'newsletter',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>',name:'Conectado',desc:'Assinou a newsletter',pts:40},
  {id:'compare',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/></svg>',name:'Analista',desc:'Comparou destinos pela primeira vez',pts:60},
  {id:'search',icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',name:'Pesquisador',desc:'Usou a busca inteligente',pts:20},
];

function addPoints(pts,badgeId){
  trekkoPoints+=pts;
  localStorage.setItem('trekko-points',trekkoPoints);
  var el=document.getElementById('points-val');
  if(el)el.textContent=trekkoPoints.toLocaleString('pt-BR');
  if(badgeId && trekkoBadges.indexOf(badgeId)<0){
    trekkoBadges.push(badgeId);
    localStorage.setItem('trekko-badges',JSON.stringify(trekkoBadges));
    var bd=BADGES_DEF.find(function(b){return b.id===badgeId;});
    if(bd)showBadgePopup(bd);
  }
}

function showBadgePopup(bd){
  var pop=document.createElement('div');pop.className='badge-pop';
  pop.innerHTML='<span class="badge-icon">'+bd.icon+'</span><div><div class="badge-text">'+bd.name+'</div><div class="badge-sub">'+bd.desc+' · +'+bd.pts+' pts</div></div>';
  document.body.appendChild(pop);
  setTimeout(function(){pop.classList.add('hide');setTimeout(function(){pop.remove();},500);},3500);
}

function showBadges(){
  openDestModal({
    id:'__badges__',name:'Seus Badges',meta:'Conquistas Trekko',price:trekkoPoints.toLocaleString('pt-BR'),pfrom:false,
    scene:'plane',b1:'',b2:'',b3:'',
    _badges:true
  });
}

// Init points display
window.addEventListener('load',function(){
  var el=document.getElementById('points-val');
  if(el)el.textContent=trekkoPoints.toLocaleString('pt-BR');
});

/* ══════════ MODAL DE DETALHES ══════════ */
var DEST_DESCS = {
  'Rio de Janeiro':'A Cidade Maravilhosa encanta com o Cristo Redentor, praias lendárias como Copacabana e Ipanema, e a vibrante cultura carioca. Entre montanhas e mar, é um dos destinos mais icônicos do mundo.',
  'Fernando de Noronha':'Arquipélago vulcânico com águas cristalinas, tartarugas marinhas e golfinhos. Um paraíso ecológico com acesso controlado que preserva uma das naturezas mais puras do planeta.',
  'Florianópolis':'A Ilha da Magia reúne 42 praias deslumbrantes, lagoas, trilhas e uma gastronomia fresca com frutos do mar. O destino favorito dos surfistas e famílias brasileiras.',
  'Salvador':'Capital da cultura afro-brasileira, com o Pelourinho histórico, capoeira, samba de roda e praias paradisíacas. A energia de Salvador é única e contagiante.',
  'Gramado':'A pequena Europa do Brasil. Arquitetura alemã, chocolaterias, fondue, Natal Luz e uma paisagem serrana que encanta o ano todo. Perfeito para casais e famílias.',
  'Foz do Iguaçu':'As Cataratas do Iguaçu — Patrimônio da Humanidade pela UNESCO e uma das 7 Maravilhas da Natureza — hipnotizam qualquer visitante com seus 275 saltos e névoa eterna.',
  'Fortaleza':'Capital do Ceará com praias de águas mornas, dunas e lagoas de água doce. Ponto de partida para Jericoacoara e os Lençóis Maranhenses.',
  'Bonito':'Capital do Ecoturismo brasileiro com rios de água cristalina, mergulho em grutas, observação de araras e a natureza do Pantanal a poucos quilômetros.',
};

var DEST_ITINERARY = {
  '3dias': [
    {day:'Dia 1',text:'Chegada, check-in e exploração da região central. Jantar em restaurante local típico e passeio noturno pela orla ou centro histórico.'},
    {day:'Dia 2',text:'Dia inteiro nas principais atrações: pontos turísticos, praias ou natureza. Tarde livre para compras e experiências locais.'},
    {day:'Dia 3',text:'Manhã em atração secundária imperdível. Almoço em restaurante recomendado. Partida à tarde ou check-out e retorno.'},
  ],
  '5dias': [
    {day:'Dia 1',text:'Chegada e ambientação. Exploração leve do bairro do hotel. Jantar e descanso.'},
    {day:'Dia 2',text:'Atração principal do destino — museu, parque, praia ou cachoeira mais famosa.'},
    {day:'Dia 3',text:'Passeio de barco, trilha ou excursão para região natural próxima. Pôr do sol especial.'},
    {day:'Dia 4',text:'Gastronomia e cultura local. Mercado, festival ou evento regional. Happy hour com vista.'},
    {day:'Dia 5',text:'Manhã livre para compras de artesanato e souvenirs. Check-out e retorno.'},
  ],
};

var DEST_WEATHER = [
  {icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>',temp:'28°C',label:'Agora'},
  {icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.5 10a4.5 4.5 0 0 0-8.9 1A4 4 0 0 0 7 19h9a4 4 0 0 0 .5-7.9Z"/></svg>',temp:'26°C',label:'Amanhã'},
  {icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>',temp:'24°C',label:'Sábado'},
  {icon:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/></svg>',temp:'22°C',label:'Domingo'},
];

function openDestModal(card){
  addPoints(5,'search');
  var overlay=document.getElementById('dest-modal-overlay');
  var content=document.getElementById('modal-content');
  var imgUrl=getDestImg(card.id,card.scene,card.name);
  var desc=DEST_DESCS[card.name]||('Descubra '+card.name+' e suas atrações únicas. Um destino incrível que vai transformar sua experiência de viagem no Brasil.');

  if(card._badges){
    content.innerHTML='<div style="padding:28px"><h2 style="color:white;font-size:22px;font-weight:900;margin-bottom:20px;display:flex;align-items:center;gap:8px"><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> '+trekkoPoints.toLocaleString('pt-BR')+' Pontos Trekko</h2>'
      + BADGES_DEF.map(function(b){var earned=trekkoBadges.indexOf(b.id)>=0;return '<div style="display:flex;align-items:center;gap:12px;padding:12px;border-radius:12px;background:rgba(255,255,255,'+(earned?'.07':'.03')+');border:1px solid rgba(255,255,255,'+(earned?'.15':'.06')+');margin-bottom:8px;opacity:'+(earned?1:.45)+'"><span style="width:26px;height:26px;display:inline-block">'+b.icon+'</span><div><div style="color:white;font-weight:800;font-size:14px">'+b.name+'</div><div style="color:#8fa3b8;font-size:12px">'+b.desc+' · +'+b.pts+' pts</div></div>'+(earned?'<span style="margin-left:auto;color:#22c55e;font-weight:800;font-size:12px;display:flex;align-items:center;gap:4px"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Conquistado</span>':'')+'</div>';}).join('')
      +'</div>';
    overlay.classList.add('show');
    return;
  }

  content.innerHTML=
    '<img class="modal-gallery" src="'+imgUrl+'" alt="'+card.name+'" onerror="this.style.background=\'linear-gradient(135deg,#0e1c2f,#1e3a5f)\';this.src=\'\'">'
    +'<div class="modal-body">'
      +'<div class="modal-header">'
        +'<div><div class="modal-title">'+card.name+'</div>'
          +'<div class="modal-meta-row">'
            +'<span class="modal-meta-badge d-badge g">'+card.b1+'</span>'
            +'<span class="modal-meta-badge d-badge b">'+card.b2+'</span>'
            +'<span class="modal-meta-badge d-badge a">'+card.b3+'</span>'
          +'</div>'
        +'</div>'
        +'<div class="modal-price-block">'
          +'<div class="modal-price-from">'+(card.pfrom?'a partir de':'')+'</div>'
          +'<div class="modal-price">'+card.price+'</div>'
          +'<div class="cupom-wrap"><div class="cupom-title"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> Cupom de desconto</div><div class="cupom-input-row"><input class="cupom-input" id="modal-cupom-input" placeholder="Digite seu cupom" /><button class="cupom-btn" onclick="applyCupom()">Aplicar</button></div><div class="cupom-success" id="cupom-success"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:text-bottom"><polyline points="20 6 9 17 4 12"></polyline></svg> <span id="cupom-msg">Cupom aplicado!</span></div><div class="cupom-error" id="cupom-error"></div></div><div class="modal-actions">'
            +'<button class="modal-btn-primary" onclick="alert(\'Redirecionando para reserva...\')">Reservar agora</button>'
            +'<button class="modal-btn-secondary" onclick="shareDestination(\''+card.name+'\')"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>'
          +'</div>'
        +'</div>'
      +'</div>'
      +'<div class="modal-tabs">'
        +'<button class="modal-tab active" onclick="switchTab(this,\'tab-desc\')">Sobre</button>'
        +'<button class="modal-tab" onclick="switchTab(this,\'tab-roteiro\')">Roteiro IA</button>'
        +'<button class="modal-tab" onclick="switchTab(this,\'tab-clima\')">Clima</button>'
        +'<button class="modal-tab" onclick="switchTab(this,\'tab-share\')">Compartilhar</button>'
      +'</div>'
      +'<div class="modal-tab-content active" id="tab-desc">'
        +'<div class="modal-section-title">Sobre o destino</div>'
        +'<div class="modal-desc">'+desc+'</div>'
        +'<div class="modal-section-title">Detalhes</div>'
        +'<div class="modal-meta-row"><span class="modal-meta-badge d-badge g">'+card.meta+'</span></div>'
      +'</div>'
      +'<div class="modal-tab-content" id="tab-roteiro">'
        +'<div class="modal-section-title">Roteiro sugerido por IA</div>'
        +'<div style="display:flex;gap:8px;margin-bottom:14px">'
          +'<button class="btn-clear-price" onclick="loadRoteiro(\''+card.name+'\',\'3dias\',this)" data-days="3dias">3 dias</button>'
          +'<button class="btn-clear-price" onclick="loadRoteiro(\''+card.name+'\',\'5dias\',this)" data-days="5dias">5 dias</button>'
          +'<button class="btn-apply-price" onclick="loadRoteiroAI(\''+card.name+'\')"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:text-bottom"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> Gerar com IA</button>'
        +'</div>'
        +'<div id="roteiro-content">'+buildRoteiro('3dias',card.name)+'</div>'
      +'</div>'
      +'<div class="modal-tab-content" id="tab-clima">'
        +'<div class="modal-section-title">Previsão do tempo</div>'
        +'<div class="modal-weather">'
          +DEST_WEATHER.map(function(w){return '<div class="weather-card"><span class="weather-icon" style="width:24px;height:24px;display:inline-block">'+w.icon+'</span><div class="weather-temp">'+w.temp+'</div><div class="weather-label">'+w.label+'</div></div>';}).join('')
        +'</div>'
        +'<div style="margin-top:14px;font-size:13px;color:#8fa3b8">⚠️ Dados simulados. Para previsão real, ative a integração com API de clima.</div>'
      +'</div>'
      +'<div class="modal-tab-content" id="tab-share">'
        +'<div class="modal-section-title">Compartilhar destino</div>'
        +'<div class="share-row">'
          +'<button class="share-btn" onclick="shareWhatsApp(\''+card.name+'\',\''+card.price+'\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:text-bottom"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg> WhatsApp</button>'
          +'<button class="share-btn" onclick="shareTwitter(\''+card.name+'\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:text-bottom"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg> Twitter/X</button>'
          +'<button class="share-btn" onclick="copyLink(\''+card.name+'\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:text-bottom"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Copiar link</button>'
          +'<button class="share-btn" onclick="shareNative(\''+card.name+'\',\''+card.price+'\')"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:text-bottom"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Mais opções</button>'
        +'</div>'
      +'</div>'
    +'</div>';

  overlay.classList.add('show');
  document.body.style.overflow='hidden';
}

function closeDestModal(){
  document.getElementById('dest-modal-overlay').classList.remove('show');
  document.body.style.overflow='';
}

function switchTab(btn,tabId){
  document.querySelectorAll('.modal-tab').forEach(function(t){t.classList.remove('active');});
  document.querySelectorAll('.modal-tab-content').forEach(function(t){t.classList.remove('active');});
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

function buildRoteiro(days,dest){
  var its=DEST_ITINERARY[days]||DEST_ITINERARY['3dias'];
  return its.map(function(it){
    return '<div class="modal-roteiro-day"><div class="modal-roteiro-day-title">'+it.day+' — '+dest+'</div><div class="modal-roteiro-day-text">'+it.text+'</div></div>';
  }).join('');
}

function loadRoteiro(dest,days,btn){
  document.querySelectorAll('[data-days]').forEach(function(b){b.className='btn-clear-price';});
  btn.className='btn-apply-price';
  document.getElementById('roteiro-content').innerHTML=buildRoteiro(days,dest);
}

function loadRoteiroAI(dest){
  var el=document.getElementById('roteiro-content');
  el.innerHTML='<div class="modal-ai-loading"><div class="modal-ai-spinner"></div>Gerando roteiro personalizado com IA...</div>';
  fetch('https://api.anthropic.com/v1/messages',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      model:'claude-sonnet-4-20250514',
      max_tokens:800,
      messages:[{role:'user',content:'Crie um roteiro de 3 dias para '+dest+', Brasil. Para cada dia, escreva 2-3 frases descrevendo as principais atividades de forma inspiradora. Responda apenas o roteiro, sem introdução.'}]
    })
  }).then(function(r){return r.json();}).then(function(d){
    var text=(d.content&&d.content[0]&&d.content[0].text)||'Roteiro gerado!';
    var days=text.split(/Dia \d+/i).filter(function(s){return s.trim();});
    if(days.length>0){
      el.innerHTML=days.map(function(t,i){
        return '<div class="modal-roteiro-day"><div class="modal-roteiro-day-title">✨ Dia '+(i+1)+' — IA Trekko</div><div class="modal-roteiro-day-text">'+t.trim().replace(/:/g,'')+'</div></div>';
      }).join('');
    } else {
      el.innerHTML='<div class="modal-roteiro-day"><div class="modal-roteiro-day-text">'+text+'</div></div>';
    }
    addPoints(20);
  }).catch(function(){
    el.innerHTML='<div class="modal-roteiro-day"><div class="modal-roteiro-day-title">Dia 1</div><div class="modal-roteiro-day-text">Chegue cedo, explore o centro histórico e aproveite o por do sol.</div></div><div class="modal-roteiro-day"><div class="modal-roteiro-day-title">Dia 2</div><div class="modal-roteiro-day-text">Visite a principal atração natural do destino. Tarde para gastronomia local.</div></div><div class="modal-roteiro-day"><div class="modal-roteiro-day-title">Dia 3</div><div class="modal-roteiro-day-text">Manhã livre, compras de artesanato e partida.</div></div>';
  });
}

/* ══════════ COMPARTILHAMENTO ══════════ */
function shareWhatsApp(name,price){
  var txt='🌎 Encontrei '+name+' por apenas '+price+' no Trekko! Confira: '+window.location.href;
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}
function shareTwitter(name){
  var txt='Descobri '+name+' no @Trekko 🗺️ Viaje mais, gaste menos! #Trekko #Viagem';
  window.open('https://twitter.com/intent/tweet?text='+encodeURIComponent(txt),'_blank');
}
function copyLink(name){
  navigator.clipboard.writeText(window.location.href+'?dest='+encodeURIComponent(name)).then(function(){
    alert('Link copiado! 🔗');
  }).catch(function(){alert('Link: '+window.location.href);});
}
function shareNative(name,price){
  if(navigator.share){navigator.share({title:'Trekko — '+name,text:'Viaje para '+name+' por '+price,url:window.location.href});}
  else{copyLink(name);}
}
function shareDestination(name){shareNative(name,'');}

/* ══════════ FILTRO DE PREÇO ══════════ */
var priceMin=null,priceMax=null;
function extractPrice(priceStr){
  if(!priceStr)return -1;
  var m=priceStr.replace(/\./g,'').match(/[\d]+/);
  return m?parseInt(m[0]):-1;
}
function applyPriceFilter(){
  var mn=document.getElementById('price-min').value;
  var mx=document.getElementById('price-max').value;
  priceMin=mn?parseInt(mn):null;
  priceMax=mx?parseInt(mx):null;
  renderDest(currentCat);
  addPoints(5,'search');
}
function clearPriceFilter(){
  priceMin=null;priceMax=null;
  document.getElementById('price-min').value='';
  document.getElementById('price-max').value='';
  renderDest(currentCat);
}

/* ══════════ PATCH renderDest to open modal + price filter + points ══════════ */
var _origRenderDest = renderDest;
renderDest = function(cat){
  _origRenderDest(cat);
  // After render, patch card clicks to open modal
  setTimeout(function(){
    var grid=document.getElementById('dest-grid');
    if(!grid)return;
    var cards=grid.querySelectorAll('.d-card');
    cards.forEach(function(card,i){
      var data=DEST_DATA[cat];
      if(!data||!data.all[i])return;
      var c=data.all[i];
      // Apply price filter visually
      if(priceMin!==null||priceMax!==null){
        var p=extractPrice(c.price);
        if((priceMin!==null&&p<priceMin)||(priceMax!==null&&p>priceMax&&p>0)){
          card.style.display='none';
        }else{card.style.display='';}
      }
      // Override onclick to open modal
      var oldClick=card.onclick;
      card.onclick=function(e){
        if(e.target.closest('.heart-btn'))return;
        openDestModal(c);
      };
    });
    // Lazy load images
    grid.querySelectorAll('img').forEach(function(img){
      lazyObs.observe(img);
    });
    // Reveal
    revealObserver.observe(grid);
  },150);
};

/* ══════════ PATCH toggleFav for points ══════════ */
var _origToggleFav = toggleFav;
toggleFav = function(id,e){
  var wasFaved=favorites.indexOf(id)>=0;
  _origToggleFav(id,e);
  if(!wasFaved){
    addPoints(10,'first_fav');
    if(favorites.length>=5)addPoints(50,'5favs');
  }
};

/* ══════════ PATCH newsletter for points ══════════ */
var _origSubscribe = subscribeNewsletter;
subscribeNewsletter = function(){
  _origSubscribe();
  addPoints(40,'newsletter');
};

/* ══════════ PATCH compare for points ══════════ */
var _origOpenCompare = openCompare;
openCompare = function(){
  _origOpenCompare();
  addPoints(20,'compare');
};

/* ══════════ SCROLL ANIMATIONS INIT ══════════ */
window.addEventListener('load',function(){
  setTimeout(function(){
    document.querySelectorAll('.reveal,.fade-in-up').forEach(function(el){
      revealObserver.observe(el);
    });
  },2100);
});


/* ══════════════ NAVBAR SEARCH ══════════════ */
var navSearchDebounce = null;
var navSearchOpen = false;
var navSearchIdx = -1;
var navSearchResults = [];
var navRecentSearches = JSON.parse(localStorage.getItem('trekko-recent') || '[]');
var navDidYouMeanWord = '';

function getAllCards() {
  var all = [];
  Object.entries(DEST_DATA).forEach(function(entry) {
    entry[1].all.forEach(function(c) { all.push({...c, _cat: entry[0]}); });
  });
  return all;
}

function navSearchInput(val) {
  // Sync both inputs
  var other = document.getElementById(document.activeElement.id === 'nav-search-input' ? 'mobile-search-input' : 'nav-search-input');
  if (other) other.value = val;

  // Clear button visibility
  document.getElementById('nav-search-clear').classList.toggle('show', val.length > 0);

  clearTimeout(navSearchDebounce);
  navSearchDebounce = setTimeout(function() { doNavSearch(val); }, 220);
}

function doNavSearch(val) {
  var dropdown = document.getElementById('nav-search-dropdown');
  navSearchIdx = -1;

  if (!val || val.length < 1) {
    renderNavDropdownRecent();
    return;
  }

  var q = val.toLowerCase().trim();
  var all = getAllCards();
  navSearchResults = all.filter(function(c) {
    return c.name.toLowerCase().includes(q) ||
           c.meta.toLowerCase().includes(q) ||
           (c.b1 && c.b1.toLowerCase().includes(q)) ||
           (c.b2 && c.b2.toLowerCase().includes(q));
  }).slice(0, 7);

  var catLabel = { voos:'✈️ Voo', onibus:'🚌 Ônibus', hoteis:'🏨 Hotel', chales:'🏡 Chalé', atracoes:'🌿 Atração', restaurantes:'🍽️ Restaurante' };

  if (navSearchResults.length === 0) {
    // Did you mean?
    var best = findClosestWord(q, all.map(function(c){ return c.name; }));
    var html2 = '';
    if (best) {
      navDidYouMeanWord = best;
      html2 = '<div class="nsd-no-results">Nenhum resultado para <strong style="color:white">"' + val + '"</strong></div>' +
              '<div class="nsd-did-you-mean show" onmousedown="applyNavDidYouMean()">🔍 Você quis dizer <strong>"' + best + '"</strong>?</div>';
    } else {
      html2 = '<div class="nsd-no-results">Nenhum resultado para <strong style="color:white">"' + val + '"</strong></div>';
    }
    dropdown.innerHTML = html2;
  } else {
    var html2 = '<div class="nsd-section">Resultados</div>';
    html2 += navSearchResults.map(function(c, i) {
      var emoji = catLabel[c._cat] || '📍';
      return '<div class="nsd-item" onmousedown="selectNavResult(' + i + ')" data-idx="' + i + '">' +
        '<span class="nsd-icon">' + c.name[0] + '</span>' +
        '<div><div class="nsd-label">' + c.name + '</div><div class="nsd-sub">' + c.meta + '</div></div>' +
        '<span class="nsd-badge">' + emoji + '</span>' +
        '<span class="nsd-badge" style="color:var(--green);background:rgba(34,197,94,.12)">' + c.price + '</span>' +
        '</div>';
    }).join('');
    dropdown.innerHTML = html2;
    // Also filter dest grid
    filterDestGrid(val);
  }

  dropdown.classList.add('show');
}

function filterDestGrid(val) {
  var q = val.toLowerCase().trim();
  var data = DEST_DATA[currentCat];
  if (!data) return;
  var results = data.all.filter(function(c) {
    return c.name.toLowerCase().includes(q) ||
           c.meta.toLowerCase().includes(q) ||
           (c.b1 && c.b1.toLowerCase().includes(q));
  });
  // Update heading
  var heading = document.getElementById('dest-heading');
  if (heading) heading.innerHTML = 'Resultados para "<em>' + val + '</em>"';
  renderFiltered(results);
  // Save to recent
  if (val.length > 2) saveNavRecent(val);
}

function selectNavResult(idx) {
  var c = navSearchResults[idx];
  if (!c) return;
  saveNavRecent(c.name);
  document.getElementById('nav-search-input').value = c.name;
  document.getElementById('nav-search-clear').classList.add('show');
  closeNavDropdown();
  // Switch to correct category
  var catBtn = document.querySelector('.cat[data-cat="' + c._cat + '"]');
  if (catBtn) setActive(catBtn);
  // Open modal
  setTimeout(function() { openDestModal(c); }, 200);
}

function applyNavDidYouMean() {
  document.getElementById('nav-search-input').value = navDidYouMeanWord;
  var m = document.getElementById('mobile-search-input');
  if (m) m.value = navDidYouMeanWord;
  doNavSearch(navDidYouMeanWord);
}

function navSearchFocus() {
  navSearchOpen = true;
  var val = document.getElementById('nav-search-input').value;
  if (!val) renderNavDropdownRecent();
  else doNavSearch(val);
}

function navSearchBlur() {
  setTimeout(function() {
    closeNavDropdown();
    navSearchOpen = false;
  }, 200);
}

function navSearchKey(e) {
  var items = document.querySelectorAll('.nsd-item');
  if (e.key === 'ArrowDown') {
    navSearchIdx = Math.min(navSearchIdx + 1, items.length - 1);
    items.forEach(function(el, i) { el.style.background = i === navSearchIdx ? 'rgba(255,255,255,.08)' : ''; });
    e.preventDefault();
  } else if (e.key === 'ArrowUp') {
    navSearchIdx = Math.max(navSearchIdx - 1, -1);
    items.forEach(function(el, i) { el.style.background = i === navSearchIdx ? 'rgba(255,255,255,.08)' : ''; });
    e.preventDefault();
  } else if (e.key === 'Enter') {
    if (navSearchIdx >= 0) selectNavResult(navSearchIdx);
    else { var val = document.getElementById('nav-search-input').value; if (val) filterDestGrid(val); }
    closeNavDropdown();
  } else if (e.key === 'Escape') {
    clearNavSearch();
  }
}

function renderNavDropdownRecent() {
  var dropdown = document.getElementById('nav-search-dropdown');
  if (!navRecentSearches.length) {
    renderNavDropdownSuggested();
    return;
  }
  var html2 = '<div class="nsd-recent-label"><span>Recentes</span><button class="nsd-clear-recent" onmousedown="clearNavRecent()">Limpar</button></div>';
  html2 += navRecentSearches.map(function(r) {
    return '<div class="nsd-item" onmousedown="applyNavRecent(\'' + r.replace(/'/g,"\\'") + '\')">' +
      '<span class="nsd-icon">🕐</span>' +
      '<div><div class="nsd-label">' + r + '</div></div>' +
      '</div>';
  }).join('');
  html2 += '<div class="nsd-section" style="border-top:1px solid rgba(255,255,255,.06);margin-top:6px">Sugeridos</div>';
  html2 += getSuggestedItems(3);
  dropdown.innerHTML = html2;
  dropdown.classList.add('show');
}

function renderNavDropdownSuggested() {
  var dropdown = document.getElementById('nav-search-dropdown');
  var html2 = '<div class="nsd-section">Destinos populares</div>';
  html2 += getSuggestedItems(6);
  dropdown.innerHTML = html2;
  dropdown.classList.add('show');
}

function getSuggestedItems(count) {
  var popular = [
    {name:'Rio de Janeiro', meta:'São Paulo → GIG · a partir de R$ 149', cat:'voos', price:'R$ 149', icon:'🌊'},
    {name:'Fernando de Noronha', meta:'Recife → FEN · a partir de R$ 380', cat:'voos', price:'R$ 380', icon:'🐠'},
    {name:'Gramado', meta:'Chalés Serra Gaúcha · R$ 380/noite', cat:'chales', price:'R$ 380', icon:'❄️'},
    {name:'Florianópolis', meta:'São Paulo → FLN · a partir de R$ 179', cat:'voos', price:'R$ 179', icon:'🏖️'},
    {name:'Cataratas do Iguaçu', meta:'Foz do Iguaçu, PR · Patrimônio UNESCO', cat:'atracoes', price:'Mar–Out', icon:'💧'},
    {name:'Salvador', meta:'São Paulo → SSA · a partir de R$ 189', cat:'voos', price:'R$ 189', icon:'🌴'},
  ];
  return popular.slice(0, count).map(function(p, i) {
    return '<div class="nsd-item" onmousedown="applyNavSuggested(' + i + ')">' +
      '<span class="nsd-icon">' + p.icon + '</span>' +
      '<div><div class="nsd-label">' + p.name + '</div><div class="nsd-sub">' + p.meta + '</div></div>' +
      '<span class="nsd-badge" style="color:var(--green);background:rgba(34,197,94,.12)">' + p.price + '</span>' +
      '</div>';
  }).join('');
}

var _navSuggested = [
  {name:'Rio de Janeiro',cat:'voos',id:'v1'},{name:'Fernando de Noronha',cat:'atracoes',id:'a4'},
  {name:'Gramado',cat:'chales',id:'c7'},{name:'Florianópolis',cat:'voos',id:'v4'},
  {name:'Cataratas do Iguaçu',cat:'atracoes',id:'a3'},{name:'Salvador',cat:'voos',id:'v2'},
];
function applyNavSuggested(i) {
  var s = _navSuggested[i]; if(!s) return;
  document.getElementById('nav-search-input').value = s.name;
  document.getElementById('nav-search-clear').classList.add('show');
  saveNavRecent(s.name);
  closeNavDropdown();
  var catBtn = document.querySelector('.cat[data-cat="' + s.cat + '"]');
  if(catBtn) setActive(catBtn);
  var card = DEST_DATA[s.cat] && DEST_DATA[s.cat].all.find(function(c){return c.id===s.id;});
  if(card) setTimeout(function(){openDestModal(card);},200);
}

function applyNavRecent(val) {
  document.getElementById('nav-search-input').value = val;
  document.getElementById('nav-search-clear').classList.add('show');
  doNavSearch(val);
}

function saveNavRecent(val) {
  navRecentSearches = navRecentSearches.filter(function(r){return r!==val;});
  navRecentSearches.unshift(val);
  navRecentSearches = navRecentSearches.slice(0,5);
  localStorage.setItem('trekko-recent', JSON.stringify(navRecentSearches));
}

function clearNavRecent() {
  navRecentSearches = [];
  localStorage.removeItem('trekko-recent');
  renderNavDropdownSuggested();
}

function clearNavSearch() {
  document.getElementById('nav-search-input').value = '';
  var m = document.getElementById('mobile-search-input');
  if (m) m.value = '';
  document.getElementById('nav-search-clear').classList.remove('show');
  closeNavDropdown();
  renderDest(currentCat);
}

function closeNavDropdown() {
  var d = document.getElementById('nav-search-dropdown');
  if (d) d.classList.remove('show');
}

// Close on outside click
document.addEventListener('click', function(e) {
  if (!e.target.closest('#nav-search-wrap') && !e.target.closest('.mobile-search-bar')) {
    closeNavDropdown();
  }
});

// Levenshtein for did you mean
function findClosestWord(query, words) {
  var best = null, bestD = 99;
  words.forEach(function(w) {
    var d = levenshtein(query, w.toLowerCase());
    if (d < bestD && d <= 4) { bestD = d; best = w; }
  });
  return best;
}
function levenshtein(a, b) {
  var m=a.length, n=b.length, dp=[];
  for(var i=0;i<=m;i++) dp[i]=[i];
  for(var j=0;j<=n;j++) dp[0][j]=j;
  for(var i=1;i<=m;i++) for(var j=1;j<=n;j++)
    dp[i][j] = a[i-1]===b[j-1] ? dp[i-1][j-1] : 1+Math.min(dp[i-1][j],dp[i][j-1],dp[i-1][j-1]);
  return dp[m][n];
}

// Remove old globalSearch/doGlobalSearch if they exist  
// (they're now replaced by the nav search above)


/* ══ TEMA CLARO/ESCURO ══ */
var currentTheme = localStorage.getItem('trekko-theme') || 'dark';
(function initTheme(){
  if(currentTheme === 'light') {
    document.body.classList.add('light-mode');
    var btn = document.getElementById('theme-toggle');
    if(btn) btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  } else {
    var btn = document.getElementById('theme-toggle');
    if(btn) btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  }
})();
function toggleTheme(){
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.body.classList.toggle('light-mode', currentTheme === 'light');
  document.getElementById('theme-toggle').innerHTML = currentTheme === 'light' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
  localStorage.setItem('trekko-theme', currentTheme);
}

/* ══ CLIMA REAL (wttr.in - sem API key) ══ */
var weatherCache = {};
function fetchWeather(city) {
  if(weatherCache[city]) return Promise.resolve(weatherCache[city]);
  return fetch('https://wttr.in/' + encodeURIComponent(city) + '?format=j1')
    .then(function(r){ return r.json(); })
    .then(function(d){
      var cur = d.current_condition && d.current_condition[0];
      if(!cur) throw new Error('no data');
      var result = {
        temp: cur.temp_C + '°C',
        feels: cur.FeelsLikeC + '°C',
        desc: cur.lang_pt && cur.lang_pt[0] ? cur.lang_pt[0].value : cur.weatherDesc[0].value,
        humidity: cur.humidity + '%',
        wind: cur.windspeedKmph + ' km/h',
        icon: getWeatherIcon(parseInt(cur.weatherCode))
      };
      weatherCache[city] = result;
      return result;
    });
}
function getWeatherIcon(code) {
  const svgProps = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"';
  if(code === 113) return '<svg ' + svgProps + '><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
  if(code <= 116) return '<svg ' + svgProps + '><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.5 10a4.5 4.5 0 0 0-8.9 1A4 4 0 0 0 7 19h9a4 4 0 0 0 .5-7.9Z"/></svg>';
  if(code <= 122) return '<svg ' + svgProps + '><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>';
  if(code <= 143) return '<svg ' + svgProps + '><path d="M4 14h16M4 18h16M4 10h16"/></svg>';
  if(code <= 176) return '<svg ' + svgProps + '><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/></svg>';
  if(code <= 260) return '<svg ' + svgProps + '><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/></svg>';
  if(code <= 296) return '<svg ' + svgProps + '><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 19v1M8 14v1M16 19v1M16 14v1M12 21v1M12 16v1"/><path d="m9 13-3 8 8-3-3 8"/></svg>';
  if(code <= 320) return '<svg ' + svgProps + '><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/></svg>';
  if(code <= 395) return '<svg ' + svgProps + '><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M8 15h.01M8 19h.01M12 17h.01M12 21h.01M16 15h.01M16 19h.01"/></svg>';
  return '<svg ' + svgProps + '><path d="M12 2v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="M2 12h2"/><path d="m19.07 4.93-1.41 1.41"/><path d="M15.5 10a4.5 4.5 0 0 0-8.9 1A4 4 0 0 0 7 19h9a4 4 0 0 0 .5-7.9Z"/></svg>';
}
function loadNavWeather() {
  var city = 'Goiania'; // default
  var prefs = JSON.parse(localStorage.getItem('trekko-draft')||'{}');
  if(prefs.city) city = prefs.city;
  fetchWeather(city).then(function(w){
    document.getElementById('wnav-icon').innerHTML = w.icon;
    document.getElementById('wnav-temp').textContent = w.temp;
  }).catch(function(){
    document.getElementById('wnav-temp').textContent = '--°C';
  });
}
function openWeatherModal() {
  var city = 'São Paulo';
  var content = document.getElementById('modal-content');
  if(!content) return;
  document.getElementById('dest-modal-overlay').classList.add('show');
  document.body.style.overflow = 'hidden';
  content.innerHTML = '<div style="padding:28px"><h2 style="color:white;font-size:20px;font-weight:900;margin-bottom:20px;display:flex;align-items:center;gap:8px"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg> Clima em tempo real</h2>'
    + '<div style="display:flex;gap:8px;margin-bottom:18px;flex-wrap:wrap">'
    + ['São Paulo','Rio de Janeiro','Fortaleza','Gramado','Manaus','Florianópolis'].map(function(c){
        return '<button class="btn-clear-price" onclick="showCityWeather(\''+c+'\')" style="font-size:13px">'+c+'</button>';
      }).join('')
    + '</div><div id="weather-detail-content"><div class="modal-ai-loading"><div class="modal-ai-spinner"></div>Carregando clima...</div></div></div>';
  showCityWeather(city);
}
function showCityWeather(city) {
  var el = document.getElementById('weather-detail-content');
  if(!el) return;
  el.innerHTML = '<div class="modal-ai-loading"><div class="modal-ai-spinner"></div>Buscando clima de '+city+'...</div>';
  fetchWeather(city).then(function(w){
    el.innerHTML = '<div style="background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.08);border-radius:16px;padding:24px;text-align:center">'
      + '<div style="margin-bottom:8px;display:flex;justify-content:center"><div style="width:64px;height:64px">'+w.icon+'</div></div>'
      + '<div style="font-size:42px;font-weight:900;color:white;margin-bottom:4px">'+w.temp+'</div>'
      + '<div style="font-size:16px;color:#8fa3b8;margin-bottom:20px">'+city+' · '+w.desc+'</div>'
      + '<div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">'
      + '<div class="weather-card"><span class="weather-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg></span><div class="weather-temp" style="font-size:16px">'+w.feels+'</div><div class="weather-label">Sensação</div></div>'
      + '<div class="weather-card"><span class="weather-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></span><div class="weather-temp" style="font-size:16px">'+w.humidity+'</div><div class="weather-label">Umidade</div></div>'
      + '<div class="weather-card"><span class="weather-icon"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/></svg></span><div class="weather-temp" style="font-size:16px">'+w.wind+'</div><div class="weather-label">Vento</div></div>'
      + '</div></div>'
      + '<div style="margin-top:12px;font-size:12px;color:#8fa3b8;text-align:center">Dados em tempo real via wttr.in</div>';
  }).catch(function(){
    el.innerHTML = '<div style="text-align:center;padding:20px;color:#8fa3b8">Não foi possível carregar o clima de '+city+'.</div>';
  });
}
window.addEventListener('load', function(){ setTimeout(loadNavWeather, 2200); });

/* ══ CUPONS ══ */
var CUPONS = {
  'TREKKO10':  { desc:'10% de desconto', type:'percent', value:10 },
  'PRAIA2024': { desc:'R$ 50 de desconto', type:'fixed', value:50 },
  'BEMVINDO':  { desc:'15% para novos usuários', type:'percent', value:15 },
  'VERAO25':   { desc:'25% em hotéis de praia', type:'percent', value:25 },
  'FRETE0':    { desc:'Frete grátis + R$ 20 off', type:'fixed', value:20 },
};
function applyCupom() {
  var code = (document.getElementById('modal-cupom-input').value||'').trim().toUpperCase();
  var ok = document.getElementById('cupom-success');
  var err = document.getElementById('cupom-error');
  ok.classList.remove('show'); err.classList.remove('show');
  if(!code) { err.textContent = 'Digite um cupom.'; err.classList.add('show'); return; }
  var cupom = CUPONS[code];
  if(!cupom) { err.textContent = 'Cupom inválido ou expirado.'; err.classList.add('show'); return; }
  document.getElementById('cupom-msg').textContent = cupom.desc + ' aplicado!';
  ok.classList.add('show');
  localStorage.setItem('trekko-cupom', JSON.stringify({code:code,...cupom}));
  addPoints(15, 'compare', 'Cupom aplicado +15 pts!');
}

/* ══ PWA ══ */
var pwaPrompt = null;
window.addEventListener('beforeinstallprompt', function(e){
  e.preventDefault();
  pwaPrompt = e;
  setTimeout(function(){
    if(!localStorage.getItem('pwa-dismissed'))
      document.getElementById('pwa-banner').classList.add('show');
  }, 5000);
});
document.getElementById('pwa-install-btn').addEventListener('click', function(){
  if(pwaPrompt){ pwaPrompt.prompt(); pwaPrompt.userChoice.then(function(){ closePwaBanner(); }); }
  else { alert('Para instalar: use o menu do seu navegador → "Adicionar à tela inicial"'); closePwaBanner(); }
});
function closePwaBanner(){
  document.getElementById('pwa-banner').classList.remove('show');
  localStorage.setItem('pwa-dismissed','1');
}

/* ══ NOTIFICAÇÕES PUSH ══ */
function requestPushPermission(){
  if(!('Notification' in window)) return;
  Notification.requestPermission().then(function(p){
    if(p === 'granted'){
      addPoints(25, 'newsletter', 'Notificações ativadas +25 pts!');
      setTimeout(function(){
        new Notification('🎉 Trekko', {
          body: 'Alertas de preço ativados! Você será notificado das melhores ofertas.',
          icon: 'uploads/trekko-logo2-transparent.png'
        });
      }, 1000);
    }
  });
}


/* ══════════════ INTEGRAÇÃO COM APIs TREKKO ══════════════ */

// URL base das APIs (funciona local e em produção)
var API_BASE = window.location.hostname === 'localhost'
  ? 'http://localhost:3000'
  : '';  // Em produção usa URL relativa

// ── Autocomplete de aeroportos via /api/aeroportos ────────
var airportDebounce = null;
function searchAirports(val, inputId, dropdownId) {
  clearTimeout(airportDebounce);
  if (!val || val.length < 2) {
    document.getElementById(dropdownId).classList.remove('show');
    return;
  }
  airportDebounce = setTimeout(function() {
    fetch(API_BASE + '/api/aeroportos?q=' + encodeURIComponent(val))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        var dd = document.getElementById(dropdownId);
        if (!data.aeroportos || !data.aeroportos.length) {
          dd.classList.remove('show');
          return;
        }
        dd.innerHTML = data.aeroportos.map(function(a) {
          return '<div class="autocomplete-item" onmousedown="selectAirport(\'' + inputId + '\',\'' + dropdownId + '\',\'' + a.iata + '\',\'' + a.cidade.replace(/'/g,"\\'") + '\')">' +
            '<svg class="pin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>' +
            '<span style="flex:1">' + a.cidade + '</span>' +
            '<span class="ac-sub">' + a.iata + '</span>' +
            '</div>';
        }).join('');
        dd.classList.add('show');
      })
      .catch(function() {
        // silently fail, keep existing autocomplete
      });
  }, 280);
}

function selectAirport(inputId, dropdownId, iata, cidade) {
  var input = document.getElementById(inputId);
  if (input) input.value = cidade + ' (' + iata + ')';
  var dd = document.getElementById(dropdownId);
  if (dd) dd.classList.remove('show');
  // Store IATA code as data attribute for API call
  if (input) input.dataset.iata = iata;
}

// Patch existing inputs to also search airports for voos category
var _origShowDestAC = showDestAC;
showDestAC = function(val) {
  _origShowDestAC(val);
  if (currentCat === 'voos') {
    searchAirports(val, 'dest-input', 'ac-destino');
  }
};

var _origShowOrigemAC = showOrigemAC;
showOrigemAC = function(val) {
  _origShowOrigemAC(val);
  if (currentCat === 'voos') {
    searchAirports(val, 'origem-input', 'ac-origem');
  }
};

// ── Busca REAL via /api/voos ───────────────────────────────
var _origBuscar = buscar;
buscar = function() {
  if (currentCat !== 'voos' && currentCat !== 'onibus') {
    _origBuscar();
    return;
  }

  var btn = document.getElementById('btn-buscar');
  btn.classList.add('loading');

  if (currentCat === 'voos') {
    var origemInput = document.getElementById('origem-input');
    var destInput = document.getElementById('dest-input');
    var dataIda = document.getElementById('date-ida').value;
    var adultos = counts.adults;

    // Extrai código IATA ou usa cidade
    var origIata = origemInput.dataset.iata || origemInput.value.match(/\(([A-Z]{3})\)/)?.[1] || 'GRU';
    var destIata = destInput.dataset.iata || destInput.value.match(/\(([A-Z]{3})\)/)?.[1] || 'GIG';

    if (!dataIda) {
      dataIda = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
    }

    var params = new URLSearchParams({
      origem: origIata,
      destino: destIata,
      data: dataIda,
      adultos: adultos,
    });

    if (currentTripType === 'idavolta') {
      var dataVolta = document.getElementById('date-volta').value;
      if (dataVolta) params.append('volta', dataVolta);
    }

    fetch(API_BASE + '/api/voos?' + params)
      .then(function(r) { return r.json(); })
      .then(function(data) {
        btn.classList.remove('loading');
        if (data.voos && data.voos.length) {
          renderVoosResult(data);
        } else {
          renderDest(currentCat);
        }
        addPoints(5, 'search');
      })
      .catch(function() {
        btn.classList.remove('loading');
        renderDest(currentCat);
      });

  } else if (currentCat === 'hoteis') {
    var destInput = document.getElementById('dest-input');
    var checkin = document.getElementById('date-ida').value;
    var checkout = document.getElementById('date-volta').value;

    fetch(API_BASE + '/api/hoteis?' + new URLSearchParams({
      cidade: destInput.value || 'Rio de Janeiro',
      checkin: checkin || new Date().toISOString().split('T')[0],
      checkout: checkout || new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
      adultos: counts.adults,
    }))
      .then(function(r) { return r.json(); })
      .then(function(data) {
        btn.classList.remove('loading');
        if (data.hoteis && data.hoteis.length) {
          renderHoteisResult(data);
        }
      })
      .catch(function() {
        btn.classList.remove('loading');
        renderDest(currentCat);
      });
  }
};

// ── Renderiza resultados de VOOS ──────────────────────────
function renderVoosResult(data) {
  var grid = document.getElementById('dest-grid');
  var heading = document.getElementById('dest-heading');
  if (!grid) return;

  if (heading) {
    heading.innerHTML = 'Voos encontrados <em>(' + data.total + ')</em>';
  }

  // Badge de modo
  if (data.modo === 'demo') {
    showApiModeBadge('🔶 Modo demo — configure a API Amadeus para voos reais');
  } else if (data.modo === 'real') {
    showApiModeBadge('✅ Dados reais da Amadeus Airlines');
  }

  grid.innerHTML = '';
  document.getElementById('ver-mais-wrap').style.display = 'none';

  data.voos.forEach(function(voo) {
    var div = document.createElement('div');
    div.className = 'd-card';
    var img = document.createElement('img');
    img.src = 'https://source.unsplash.com/400x220/?' + encodeURIComponent(voo.destino) + ',airplane,travel,brazil';
    img.alt = voo.destino;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
    img.onerror = function() { this.style.background = 'linear-gradient(135deg,#0f1e2e,#1e3a5f)'; this.src = ''; };
    var thumb = document.createElement('div');
    thumb.className = 'd-thumb';
    thumb.appendChild(img);
    var priceEl = document.createElement('div');
    priceEl.className = 'd-price';
    priceEl.innerHTML = '<small>a partir de </small>' + voo.precoFormatado;
    thumb.appendChild(priceEl);
    if (voo.isMock) {
      var mockTag = document.createElement('span');
      mockTag.className = 'd-tag tag-promo';
      mockTag.textContent = '📊 Estimado';
      thumb.appendChild(mockTag);
    }
    div.appendChild(thumb);
    div.innerHTML += '<div class="d-body">' +
      '<div class="d-name">' + voo.destino + '</div>' +
      '<div class="d-meta">' + voo.partida.split('T')[0] + ' · ' + voo.partidaFormatado + ' → ' + voo.chegadaFormatado + '</div>' +
      '<div class="d-badges">' +
        '<span class="d-badge g">' + voo.companhiaNome + '</span>' +
        '<span class="d-badge b">' + voo.duracao + '</span>' +
        '<span class="d-badge a">' + (voo.escalas === 0 ? 'Direto' : voo.escalas + ' escala') + '</span>' +
      '</div>' +
      '<div style="margin-top:8px;font-size:11px;color:#8fa3b8">' + voo.bagagem + '</div>' +
      '</div>';
    div.onclick = function() {
      localStorage.setItem('trekko-dest-name', voo.destino);
      localStorage.setItem('trekko-dest-price', voo.precoFormatado);
      localStorage.setItem('trekko-dest-meta', voo.origem + ' → ' + voo.destino);
      window.location.href = 'reserva.html?dest=' + encodeURIComponent(voo.destino) + '&price=' + encodeURIComponent(voo.precoFormatado) + '&meta=' + encodeURIComponent(voo.origem + ' → ' + voo.destino + ' · ' + voo.companhiaNome);
    };
    grid.appendChild(div);
  });
}

// ── Renderiza resultados de HOTÉIS ────────────────────────
function renderHoteisResult(data) {
  var grid = document.getElementById('dest-grid');
  var heading = document.getElementById('dest-heading');
  if (!grid) return;

  if (heading) {
    heading.innerHTML = 'Hotéis em <em>' + data.cidade + '</em>';
  }

  if (data.modo === 'demo') {
    showApiModeBadge('🔶 Modo demo — configure RapidAPI para hotéis reais do Booking.com');
  }

  grid.innerHTML = '';
  document.getElementById('ver-mais-wrap').style.display = 'none';

  data.hoteis.forEach(function(hotel) {
    var div = document.createElement('div');
    div.className = 'd-card';
    var img = document.createElement('img');
    img.src = hotel.imagem;
    img.alt = hotel.nome;
    img.style.cssText = 'width:100%;height:100%;object-fit:cover;display:block';
    img.onerror = function() { this.style.background = 'linear-gradient(135deg,#0f1e2e,#1e3a5f)'; this.src = ''; };
    var thumb = document.createElement('div');
    thumb.className = 'd-thumb';
    thumb.appendChild(img);
    var priceEl = document.createElement('div');
    priceEl.className = 'd-price';
    priceEl.innerHTML = hotel.preco_noite_formatado + '/noite';
    thumb.appendChild(priceEl);
    var stars = document.createElement('span');
    stars.className = 'd-tag tag-hot';
    stars.textContent = '⭐'.repeat(Math.min(hotel.estrelas, 5));
    thumb.appendChild(stars);
    div.appendChild(thumb);
    div.innerHTML += '<div class="d-body">' +
      '<div class="d-name">' + hotel.nome + '</div>' +
      '<div class="d-meta">' + hotel.bairro + ', ' + data.cidade + ' · ' + hotel.noites + ' noite(s)</div>' +
      '<div class="d-badges">' +
        '<span class="d-badge g">' + hotel.nota + ' ' + hotel.avaliacao + '</span>' +
        '<span class="d-badge b">' + hotel.cancelamento + '</span>' +
        '<span class="d-badge a">Total: ' + hotel.preco_total_formatado + '</span>' +
      '</div>' +
      '</div>';
    div.onclick = function() {
      localStorage.setItem('trekko-dest-name', hotel.nome);
      localStorage.setItem('trekko-dest-price', hotel.preco_noite_formatado + '/noite');
      window.location.href = 'reserva.html?dest=' + encodeURIComponent(hotel.nome) + '&price=' + encodeURIComponent(hotel.preco_noite_formatado);
    };
    grid.appendChild(div);
  });
}

// ── Badge de modo API ──────────────────────────────────────
function showApiModeBadge(msg) {
  var existing = document.getElementById('api-mode-badge');
  if (existing) existing.remove();
  var badge = document.createElement('div');
  badge.id = 'api-mode-badge';
  badge.style.cssText = 'background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:8px 14px;font-size:12px;font-weight:700;color:rgba(255,255,255,.6);margin-bottom:14px;display:flex;align-items:center;gap:8px';
  badge.textContent = msg;
  var grid = document.getElementById('dest-grid');
  if (grid && grid.parentNode) {
    grid.parentNode.insertBefore(badge, grid);
  }
}

// ── Carrega clima ao selecionar destino ───────────────────
var destInputEl = document.getElementById('dest-input');
if (destInputEl) {
  destInputEl.addEventListener('change', function() {
    var city = this.value.replace(/\s*\([A-Z]{3}\)$/, '').trim();
    if (city.length > 2) {
      fetch(API_BASE + '/api/clima?cidade=' + encodeURIComponent(city) + '&dias=3')
        .then(function(r) { return r.json(); })
        .then(function(d) {
          var widget = document.getElementById('wnav-icon');
          var temp = document.getElementById('wnav-temp');
          if (widget && d.atual) widget.textContent = d.atual.icone;
          if (temp && d.atual) temp.textContent = d.atual.temp_c + '°C';
        })
        .catch(function() {});
    }
  });
}
