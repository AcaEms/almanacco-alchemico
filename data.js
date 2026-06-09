@import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700&family=Cinzel:wght@400;600&family=IM+Fell+English:ital@0;1&display=swap');

/* ─── tokens ─────────────────────────────────────────────── */
:root {
  --parchment: #f2e8d5;
  --parchment-dark: #e0cfa8;
  --ink: #1a0f00;
  --ink-light: #3d2500;
  --gold: #c8942a;
  --gold-light: #e8b84b;
  --gold-dim: #7a5518;
  --blood: #7a1c1c;
  --font-title: 'Cinzel Decorative', serif;
  --font-caps: 'Cinzel', serif;
  --font-body: 'IM Fell English', serif;
}

/* ─── reset ──────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background: #0d0800;
  background-image: radial-gradient(ellipse at 20% 50%, rgba(50,20,0,.35) 0%, transparent 60%),
                    radial-gradient(ellipse at 80% 20%, rgba(30,10,40,.25) 0%, transparent 50%);
  min-height: 100vh;
  font-family: var(--font-body);
  color: var(--ink);
}

/* ─── book shell ─────────────────────────────────────────── */
.book {
  max-width: 1200px;
  margin: 20px auto;
  background: var(--parchment);
  background-image: linear-gradient(135deg,#f5ead2 0%,#ebd9b8 30%,#f2e5c8 60%,#e8d5a8 100%);
  border-radius: 3px;
  box-shadow: 0 0 0 2px var(--gold-dim), 0 0 0 6px var(--ink), 0 0 0 8px var(--gold-dim), 0 30px 80px rgba(0,0,0,.8);
  overflow: hidden;
}

/* ─── header ─────────────────────────────────────────────── */
.book-header {
  text-align: center;
  padding: 36px 60px 20px;
  border-bottom: 3px double var(--gold-dim);
  background: linear-gradient(to bottom, rgba(0,0,0,.03), transparent);
}
.header-rune { font-family: var(--font-caps); font-size: 10px; letter-spacing: 8px; color: var(--gold-dim); margin-bottom: 8px; opacity: .7; }
.book-title  { font-family: var(--font-title); font-size: clamp(18px,3vw,28px); color: var(--ink); text-shadow: 1px 1px 0 var(--gold-dim); margin-bottom: 4px; }
.book-sub    { font-style: italic; color: var(--ink-light); font-size: 13px; opacity: .8; margin-bottom: 8px; }
.live-badge  { display: inline-block; font-family: var(--font-caps); font-size: 9px; letter-spacing: 1px; color: #2a7a2a; background: rgba(42,122,42,.08); border: 1px solid rgba(42,122,42,.3); padding: 3px 10px; border-radius: 2px; }

/* ─── tabs ───────────────────────────────────────────────── */
.tab-bar { display: flex; border-bottom: 2px solid var(--gold-dim); background: linear-gradient(to bottom,var(--parchment-dark),var(--parchment)); padding: 0 16px; gap: 2px; flex-wrap: wrap; }
.tab-btn { font-family: var(--font-caps); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 10px 16px; border: none; border-bottom: 3px solid transparent; background: transparent; color: var(--ink-light); cursor: pointer; transition: all .2s; position: relative; top: 2px; }
.tab-btn:hover { color: var(--gold); }
.tab-btn.active { color: var(--gold); border-bottom-color: var(--gold); background: var(--parchment); }

/* ─── main ───────────────────────────────────────────────── */
.book-main { padding: 22px 26px; }

/* ─── search ─────────────────────────────────────────────── */
.search-row { margin-bottom: 14px; }
.search-input { width: 100%; padding: 8px 14px; border: 1px solid var(--gold-dim); border-radius: 2px; background: rgba(255,255,255,.5); font-family: var(--font-body); font-size: 14px; color: var(--ink); outline: none; transition: box-shadow .2s; }
.search-input:focus { box-shadow: 0 0 0 2px rgba(200,148,42,.2); }
.search-input::placeholder { color: var(--gold-dim); font-style: italic; }

/* ─── filters ────────────────────────────────────────────── */
.filter-group { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; margin-bottom: 10px; }
.filter-label { font-family: var(--font-caps); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-dim); padding-right: 6px; border-right: 1px solid var(--parchment-dark); margin-right: 2px; white-space: nowrap; }
.chip { padding: 4px 10px; border-radius: 2px; border: 1px solid var(--parchment-dark); background: rgba(255,255,255,.3); font-family: var(--font-caps); font-size: 8px; letter-spacing: .5px; text-transform: uppercase; cursor: pointer; transition: all .15s; color: var(--ink-light); }
.chip:hover { border-color: var(--gold-dim); color: var(--gold-dim); }
.chip.active { background: var(--ink); color: var(--gold-light); border-color: var(--ink); }

/* ─── toolbar ────────────────────────────────────────────── */
.toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 8px; }
.count { font-family: var(--font-caps); font-size: 9px; letter-spacing: 1px; color: var(--gold-dim); }

/* ─── buttons ────────────────────────────────────────────── */
.btn { font-family: var(--font-caps); font-size: 10px; letter-spacing: 1px; text-transform: uppercase; padding: 7px 14px; border-radius: 2px; cursor: pointer; transition: all .15s; border: 1px solid; }
.btn-primary { background: var(--ink); color: var(--gold-light); border-color: var(--ink); }
.btn-primary:hover { background: var(--ink-light); }
.btn-sec { background: transparent; color: var(--gold-dim); border-color: var(--gold-dim); }
.btn-sec:hover { background: rgba(200,148,42,.1); color: var(--gold); }
.btn-danger { background: transparent; color: var(--blood); border-color: var(--blood); margin-left: auto; }
.btn-danger:hover { background: rgba(122,28,28,.1); }

/* ─── cards grid ─────────────────────────────────────────── */
.cards-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(255px,1fr)); gap: 12px; }
.empty { text-align: center; padding: 40px; font-style: italic; color: var(--gold-dim); }

/* ─── card ───────────────────────────────────────────────── */
.card { background: linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.1)); border: 1px solid var(--parchment-dark); border-radius: 2px; overflow: hidden; cursor: pointer; transition: all .2s; position: relative; }
.card:hover { border-color: var(--gold-dim); box-shadow: 0 4px 16px rgba(0,0,0,.12); transform: translateY(-1px); }
.card.qty-zero { opacity: .48; }
.card.qty-zero::after { content: 'ESAURITO'; position: absolute; top: 8px; right: 8px; font-family: var(--font-caps); font-size: 7px; letter-spacing: 1px; color: var(--blood); border: 1px solid var(--blood); padding: 1px 5px; border-radius: 1px; background: var(--parchment); }
.card-bar { height: 3px; }
.card-head { display: flex; justify-content: space-between; align-items: flex-start; padding: 10px 12px 6px; gap: 8px; }
.card-name { font-family: var(--font-caps); font-size: 11px; font-weight: 600; color: var(--ink); line-height: 1.3; }
.card-tags { display: flex; gap: 4px; flex-wrap: wrap; padding: 0 12px 6px; }
.card-desc { font-size: 11px; color: var(--ink-light); font-style: italic; line-height: 1.5; padding: 0 12px 8px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.card-acts { display: flex; gap: 4px; padding: 6px 10px 10px; border-top: 1px solid var(--parchment-dark); flex-wrap: wrap; }
.act-btn { font-family: var(--font-caps); font-size: 8px; letter-spacing: .3px; text-transform: uppercase; padding: 3px 7px; border: 1px solid var(--parchment-dark); background: rgba(255,255,255,.3); color: var(--ink-light); cursor: pointer; border-radius: 1px; transition: all .15s; }
.act-btn:hover { border-color: var(--gold-dim); color: var(--gold-dim); }

/* ─── tags ───────────────────────────────────────────────── */
.tag { font-family: var(--font-caps); font-size: 8px; letter-spacing: .3px; text-transform: uppercase; padding: 2px 6px; border-radius: 1px; border: 1px solid; white-space: nowrap; }
.tag-comune  { color: #555; border-color: #aaa; background: rgba(0,0,0,.04); }
.tag-nc      { color: #1a5a1a; border-color: #5a9a5a; background: rgba(26,90,26,.06); }
.tag-raro    { color: #1a3a7a; border-color: #5a7aba; background: rgba(26,58,122,.06); }
.tag-mr      { color: #4a1a7a; border-color: #8a5aba; background: rgba(74,26,122,.06); }
.tag-leg     { color: var(--gold); border-color: var(--gold-dim); background: rgba(200,148,42,.06); }
.tag-unico   { color: #7a0000; border-color: #ba5a5a; background: rgba(122,0,0,.06); }
.tag-el      { color: var(--ec,#777); border-color: var(--ec,#ccc); background: rgba(0,0,0,.03); }
.tag-sub     { color: var(--ink-light); border-color: var(--parchment-dark); background: rgba(0,0,0,.03); }

/* ─── qty controls ───────────────────────────────────────── */
.qty-ctrl { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
.qty-btn { width: 22px; height: 22px; border: 1px solid var(--gold-dim); background: rgba(255,255,255,.4); color: var(--gold-dim); font-size: 14px; cursor: pointer; border-radius: 2px; display: flex; align-items: center; justify-content: center; transition: all .15s; line-height: 1; }
.qty-btn:hover { background: var(--ink); color: var(--gold-light); border-color: var(--ink); }
.qty-badge { background: var(--ink); color: var(--gold-light); font-family: var(--font-caps); font-size: 9px; padding: 2px 6px; border-radius: 1px; min-width: 28px; text-align: center; }

/* ─── monster grid/card ──────────────────────────────────── */
.mon-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(210px,1fr)); gap: 10px; }
.mon-card { background: rgba(255,255,255,.22); border: 1px solid var(--parchment-dark); border-radius: 2px; padding: 12px; cursor: pointer; transition: all .2s; }
.mon-card:hover { border-color: var(--gold-dim); box-shadow: 0 2px 10px rgba(0,0,0,.1); }
.mon-name { font-family: var(--font-caps); font-size: 12px; color: var(--ink); margin-bottom: 3px; }
.mon-type { font-size: 10px; font-style: italic; color: var(--ink-light); margin-bottom: 6px; }

/* ─── side panel (monster detail) ───────────────────────── */
.side-panel-bg { position: fixed; inset: 0; background: rgba(0,0,0,.4); z-index: 99; display: flex; justify-content: flex-end; }
.side-panel { width: min(420px,100vw); height: 100%; background: var(--parchment); background-image: linear-gradient(170deg,#f5ead2,#e8d5a8); box-shadow: -4px 0 30px rgba(0,0,0,.4); overflow-y: auto; padding: 28px 22px; position: relative; }
.detail-label { font-family: var(--font-caps); font-size: 9px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 5px; margin-top: 14px; }
.drop-line { font-size: 12px; font-style: italic; color: var(--ink-light); padding: 5px 8px; border-left: 2px solid var(--gold-dim); margin-bottom: 4px; }

/* ─── modal ──────────────────────────────────────────────── */
.modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.65); z-index: 200; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal { background: var(--parchment); background-image: linear-gradient(160deg,#f5ead2,#e8d5a8); border-radius: 3px; box-shadow: 0 0 0 2px var(--gold-dim), 0 0 0 5px var(--ink), 0 30px 60px rgba(0,0,0,.6); width: 100%; max-width: 500px; max-height: 90vh; overflow-y: auto; padding: 26px; position: relative; }
.modal-x { position: absolute; top: 12px; right: 14px; background: none; border: none; font-size: 18px; color: var(--gold-dim); cursor: pointer; }
.modal-x:hover { color: var(--gold); }
.modal-title { font-family: var(--font-title); font-size: 15px; color: var(--ink); margin-bottom: 4px; }
.modal-sub { font-family: var(--font-caps); font-size: 8px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--parchment-dark); }
.modal-actions { display: flex; gap: 8px; margin-top: 16px; padding-top: 12px; border-top: 1px solid var(--parchment-dark); flex-wrap: wrap; align-items: center; }

/* ─── modal form fields ──────────────────────────────────── */
.mf { margin-bottom: 10px; }
.mf label { display: block; font-family: var(--font-caps); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 4px; }
.mf input, .mf select, .mf textarea { width: 100%; padding: 7px 10px; border: 1px solid var(--parchment-dark); background: rgba(255,255,255,.55); font-family: var(--font-body); font-size: 13px; color: var(--ink); outline: none; border-radius: 1px; transition: border-color .2s; }
.mf input:focus, .mf select:focus, .mf textarea:focus { border-color: var(--gold-dim); }
.mf textarea { resize: vertical; min-height: 66px; }
.mf-row { display: flex; gap: 10px; }
.mf-row .mf { flex: 1; }

/* ─── drop row editor ────────────────────────────────────── */
.drop-row { display: flex; gap: 6px; align-items: center; margin-bottom: 5px; }
.drop-row input { flex: 1; padding: 5px 8px; border: 1px solid var(--parchment-dark); background: rgba(255,255,255,.5); font-family: var(--font-body); font-size: 12px; font-style: italic; color: var(--ink); border-radius: 1px; outline: none; }
.drop-x { background: none; border: none; color: var(--blood); cursor: pointer; font-size: 13px; padding: 0 4px; opacity: .65; }
.drop-x:hover { opacity: 1; }

/* ─── builder ────────────────────────────────────────────── */
.builder-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 680px) { .builder-grid { grid-template-columns: 1fr; } }
.builder-panel { background: rgba(255,255,255,.2); border: 1px solid var(--parchment-dark); border-radius: 2px; padding: 16px; }
.panel-title { font-family: var(--font-caps); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--gold-dim); margin-bottom: 14px; padding-bottom: 8px; border-bottom: 1px solid var(--parchment-dark); }
.recipe-out { background: rgba(200,148,42,.07); border: 1px solid rgba(200,148,42,.25); border-radius: 2px; padding: 12px; margin-top: 14px; font-size: 12px; color: var(--ink-light); font-style: italic; line-height: 1.7; }
.recipe-out strong { font-family: var(--font-caps); font-size: 9px; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-dim); font-style: normal; display: block; margin-top: 10px; margin-bottom: 3px; }
.recipe-out strong:first-child { margin-top: 0; }
.empty-ing { font-style: italic; color: var(--gold-dim); font-size: 12px; padding: 10px 0; border: 1px dashed var(--parchment-dark); text-align: center; border-radius: 2px; }
.ing-row { display: flex; align-items: center; gap: 8px; padding: 6px 8px; border: 1px dashed var(--parchment-dark); border-radius: 2px; margin-bottom: 5px; background: rgba(255,255,255,.2); }
.ing-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.ing-name { flex: 1; font-size: 12px; font-style: italic; color: var(--ink-light); }
.ing-role { font-family: var(--font-caps); font-size: 8px; letter-spacing: .5px; text-transform: uppercase; color: var(--gold-dim); }

/* ─── toast ──────────────────────────────────────────────── */
.toast { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); background: var(--ink); color: var(--gold-light); font-family: var(--font-caps); font-size: 11px; letter-spacing: 1px; padding: 10px 22px; border-radius: 2px; box-shadow: 0 4px 20px rgba(0,0,0,.5); z-index: 500; white-space: nowrap; animation: slideUp .3s ease; }
@keyframes slideUp { from { opacity:0; transform: translateX(-50%) translateY(12px); } to { opacity:1; transform: translateX(-50%) translateY(0); } }

/* ─── loading ────────────────────────────────────────────── */
.loading-screen { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px; }
.loading-rune { font-size: 48px; color: var(--gold); animation: pulse 1.5s ease-in-out infinite; }
.loading-text { font-family: var(--font-caps); font-size: 12px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-dim); }
@keyframes pulse { 0%,100% { opacity:.4; } 50% { opacity:1; } }

/* ─── footer ─────────────────────────────────────────────── */
.book-footer { font-family: var(--font-caps); font-size: 8px; letter-spacing: 3px; text-transform: uppercase; color: var(--gold-dim); text-align: center; padding: 10px; border-top: 1px solid var(--parchment-dark); opacity: .6; }

/* ─── responsive ─────────────────────────────────────────── */
@media (max-width: 600px) {
  .book { margin: 0; border-radius: 0; }
  .book-header { padding: 24px 20px 16px; }
  .book-main { padding: 16px; }
  .cards-grid { grid-template-columns: 1fr; }
  .tab-btn { font-size: 9px; padding: 8px 10px; }
}
