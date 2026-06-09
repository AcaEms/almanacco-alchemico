import { useState, useEffect, useCallback } from "react";
import { collection, doc, setDoc, deleteDoc, onSnapshot, writeBatch } from "firebase/firestore";
import { db } from "./firebase";
import { DEFAULT_MATERIALS, DEFAULT_MONSTERS, METALS, GEMS, ELEMENT_COLORS, RARITY_COLORS } from "./data";
import "./App.css";

const genId = (p) => p + Date.now() + Math.random().toString(36).slice(2, 6);
const elemColor = (e) => ELEMENT_COLORS[(e || "").split("/")[0]] || "#777";
const rarityColor = (r) => RARITY_COLORS[r] || "#888";

function rarityClass(r) {
  const m = { "Comune":"tag-comune","Non comune":"tag-nc","Raro":"tag-raro","Molto Raro":"tag-mr","Molto raro":"tag-mr","Leggendario":"tag-leg","Unico":"tag-unico" };
  return "tag " + (m[r] || "tag-comune");
}

function Toast({ msg }) {
  return msg ? <div className="toast">{msg}</div> : null;
}

function Chip({ label, active, onClick }) {
  return <button className={"chip" + (active ? " active" : "")} onClick={onClick}>{label}</button>;
}

// ── FilterBar ──────────────────────────────────────────────
function FilterBar({ label, options, active, onSelect }) {
  return (
    <div className="filter-group">
      <span className="filter-label">{label}</span>
      <Chip label="Tutti" active={active === "all"} onClick={() => onSelect("all")} />
      {options.map(o => <Chip key={o} label={o} active={active === o} onClick={() => onSelect(o)} />)}
    </div>
  );
}

// ── MatCard ────────────────────────────────────────────────
function MatCard({ m, onEdit, onQty, onAdd }) {
  const ec = elemColor(m.element);
  const rc = rarityColor(m.rarity);
  return (
    <div className={"card" + (m.qty <= 0 ? " qty-zero" : "")} style={{"--rc": rc}} onClick={() => onEdit(m)}>
      <div className="card-bar" style={{background: rc}} />
      <div className="card-head">
        <div className="card-name">{m.name}</div>
        <div className="qty-ctrl" onClick={e => e.stopPropagation()}>
          <button className="qty-btn" onClick={() => onQty(m, -1)}>−</button>
          <span className="qty-badge">x{m.qty}</span>
          <button className="qty-btn" onClick={() => onQty(m, 1)}>+</button>
        </div>
      </div>
      <div className="card-tags">
        <span className={rarityClass(m.rarity)}>{m.rarity}</span>
        <span className="tag tag-el" style={{"--ec": ec}}>{m.element}</span>
        <span className="tag tag-sub">{m.substance}</span>
      </div>
      <div className="card-desc">{m.desc}</div>
      <div className="card-acts" onClick={e => e.stopPropagation()}>
        <button className="act-btn" onClick={() => onEdit(m)}>✏ Modifica</button>
        <button className="act-btn" onClick={() => onAdd(m,"primario")}>★ Prim.</button>
        <button className="act-btn" onClick={() => onAdd(m,"secondario")}>◆ Sec.</button>
        <button className="act-btn" onClick={() => onAdd(m,"terziario")}>● Terz.</button>
      </div>
    </div>
  );
}

// ── MonCard ────────────────────────────────────────────────
function MonCard({ m, onEdit }) {
  return (
    <div className="mon-card" onClick={() => onEdit(m)}>
      <div className="mon-name">{m.name}</div>
      <div className="mon-type">{m.type} · {m.skill}</div>
      <div className="card-tags" style={{marginBottom:6}}>
        {m.elements.map(e => <span key={e} className="tag tag-el" style={{"--ec":elemColor(e),fontSize:8}}>{e}</span>)}
      </div>
      <div style={{fontSize:10,color:"var(--gold-dim)",fontStyle:"italic"}}>{m.drops.length} drop · clicca per dettagli</div>
    </div>
  );
}

// ── StaticCard (metals/gems) ───────────────────────────────
function StaticCard({ name, rarity, elements, desc, extra }) {
  const rc = rarityColor(rarity);
  return (
    <div className="card" style={{"--rc": rc}}>
      <div className="card-bar" style={{background: rc}} />
      <div className="card-head">
        <div className="card-name">{name}</div>
        {extra && <span style={{fontFamily:"var(--font-caps)",fontSize:9,color:"var(--gold-dim)"}}>{extra}</span>}
      </div>
      <div className="card-tags">
        <span className={rarityClass(rarity)}>{rarity}</span>
        {(elements||[]).map(e => <span key={e} className="tag tag-el" style={{"--ec":elemColor(e)}}>{e}</span>)}
      </div>
      <div className="card-desc">{desc}</div>
    </div>
  );
}

// ── MatModal ───────────────────────────────────────────────
function MatModal({ item, onClose, onSave, onDelete }) {
  const isNew = !item || item._new;
  const [f, setF] = useState(isNew
    ? { name:"", rarity:"", qty:1, substance:"", element:"", source:"", desc:"" }
    : { ...item });
  const s = (k,v) => setF(p => ({...p,[k]:v}));
  const save = () => {
    if (!f.name||!f.rarity||!f.substance||!f.element) { alert("Compila Nome, Rarità, Sostanza, Elemento."); return; }
    onSave({...f, qty: parseInt(f.qty)||0, id: f.id || genId("m")});
  };
  return (
    <div className="modal-bg" onClick={e => e.target===e.currentTarget && onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-title">{isNew ? "Nuovo Materiale" : "Modifica Materiale"}</div>
        <div className="modal-sub">Inventario del gruppo — modifiche visibili a tutti</div>
        <div className="mf"><label>Nome *</label><input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Es: Squama di Drago Rosso"/></div>
        <div className="mf-row">
          <div className="mf"><label>Rarità *</label>
            <select value={f.rarity} onChange={e=>s("rarity",e.target.value)}>
              <option value="">—</option>
              {["Comune","Non comune","Raro","Molto Raro","Leggendario","Unico"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="mf"><label>Quantità</label><input type="number" min="0" value={f.qty} onChange={e=>s("qty",e.target.value)}/></div>
        </div>
        <div className="mf-row">
          <div className="mf"><label>Sostanza *</label>
            <select value={f.substance} onChange={e=>s("substance",e.target.value)}>
              <option value="">—</option>
              {["Osso","Ceramico","Tessuto","Carne","Fluido","Gas","Metallo","Ultraterreno","Pianta","Pelle","Minerale"].map(s=><option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="mf"><label>Elemento *</label>
            <select value={f.element} onChange={e=>s("element",e.target.value)}>
              <option value="">—</option>
              {["Aria","Acqua","Fuoco","Terra","Fulmine","Necrotico","Radiante","Psichico","Forza","Nessuno"].map(e=><option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="mf"><label>Fonte</label><input value={f.source||""} onChange={e=>s("source",e.target.value)} placeholder="Es: Drago Rosso, Acquistato..."/></div>
        <div className="mf"><label>Descrizione</label><textarea value={f.desc||""} onChange={e=>s("desc",e.target.value)} placeholder="Descrizione e possibili usi..."/></div>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={save}>✦ Salva</button>
          <button className="btn btn-sec" onClick={onClose}>Annulla</button>
          {!isNew && <button className="btn btn-danger" onClick={()=>onDelete(f.id)}>🗑 Elimina</button>}
        </div>
      </div>
    </div>
  );
}

// ── MonModal ───────────────────────────────────────────────
function MonModal({ item, onClose, onSave, onDelete }) {
  const isNew = !item || item._new;
  const [f, setF] = useState(isNew
    ? { name:"", type:"", skill:"Natura", elemStr:"", desc:"", drops:[] }
    : { ...item, elemStr: (item.elements||[]).join(", ") });
  const s = (k,v) => setF(p=>({...p,[k]:v}));
  const setDrop = (i,v) => setF(p=>{const d=[...p.drops];d[i]=v;return{...p,drops:d};});
  const addDrop = () => setF(p=>({...p,drops:[...p.drops,""]}));
  const rmDrop = (i) => setF(p=>{const d=[...p.drops];d.splice(i,1);return{...p,drops:d};});
  const save = () => {
    if (!f.name||!f.type){alert("Compila Nome e Tipo.");return;}
    const elements = f.elemStr.split(",").map(e=>e.trim()).filter(Boolean);
    onSave({...f, elements, drops:f.drops.filter(Boolean), id: f.id||genId("mo")});
  };
  return (
    <div className="modal-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-title">{isNew?"Nuovo Mostro":"Modifica Mostro"}</div>
        <div className="modal-sub">Bestiario della campagna — modifiche visibili a tutti</div>
        <div className="mf-row">
          <div className="mf"><label>Nome *</label><input value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Es: Drago di Bronzo"/></div>
          <div className="mf"><label>Tipo *</label>
            <select value={f.type} onChange={e=>s("type",e.target.value)}>
              <option value="">—</option>
              {["Aberrazione","Bestia","Celestiale","Costrutto","Drago","Elementale","Fate","Gigante","Immondizia","Melma","Mostruoso","Non morto","Pianta","Umanoide"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
        </div>
        <div className="mf-row">
          <div className="mf"><label>Abilità raccolta</label>
            <select value={f.skill} onChange={e=>s("skill",e.target.value)}>
              {["Arcano","Natura","Medicina","Investigare"].map(sk=><option key={sk}>{sk}</option>)}
            </select>
          </div>
          <div className="mf"><label>Elementi (virgola-separati)</label><input value={f.elemStr} onChange={e=>s("elemStr",e.target.value)} placeholder="Es: Fuoco, Aria"/></div>
        </div>
        <div className="mf"><label>Descrizione</label><textarea value={f.desc||""} onChange={e=>s("desc",e.target.value)} placeholder="Breve descrizione..."/></div>
        <div className="mf">
          <label>Drop</label>
          {f.drops.map((d,i)=>(
            <div key={i} className="drop-row">
              <input value={d} onChange={e=>setDrop(i,e.target.value)} placeholder="Es: Squama (Pelle/Fuoco) — Raro"/>
              <button className="drop-x" onClick={()=>rmDrop(i)}>✕</button>
            </div>
          ))}
          <button className="btn btn-sec" style={{marginTop:6,fontSize:9}} onClick={addDrop}>+ Aggiungi Drop</button>
        </div>
        <div className="modal-actions">
          <button className="btn btn-primary" onClick={save}>✦ Salva</button>
          <button className="btn btn-sec" onClick={onClose}>Annulla</button>
          {!isNew && <button className="btn btn-danger" onClick={()=>onDelete(f.id)}>🗑 Elimina</button>}
        </div>
      </div>
    </div>
  );
}

// ── MonDetail (slide panel) ────────────────────────────────
function MonDetail({ m, onClose, onEdit }) {
  if (!m) return null;
  return (
    <div className="side-panel-bg" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="side-panel">
        <button className="modal-x" onClick={onClose}>✕</button>
        <div className="modal-title">{m.name}</div>
        <div className="card-tags" style={{marginBottom:12}}>
          <span className="tag tag-sub">{m.type}</span>
          {m.elements.map(e=><span key={e} className="tag tag-el" style={{"--ec":elemColor(e)}}>{e}</span>)}
        </div>
        <p style={{fontSize:13,fontStyle:"italic",color:"var(--ink-light)",marginBottom:12}}>{m.desc}</p>
        <div className="detail-label">Abilità raccolta</div>
        <p style={{fontSize:12,fontStyle:"italic",color:"var(--ink-light)",marginBottom:12}}>
          Int ({m.skill}) per valutare · Des ({m.skill}) per raccogliere
        </p>
        <div className="detail-label">Drop disponibili</div>
        {m.drops.map((d,i)=>(
          <div key={i} className="drop-line">{d}</div>
        ))}
        <div style={{marginTop:16}}>
          <button className="btn btn-sec" onClick={()=>{onEdit(m);onClose();}}>✏ Modifica / Aggiungi Drop</button>
        </div>
      </div>
    </div>
  );
}

// ── Builder Tab ────────────────────────────────────────────
function BuilderTab({ materials, ingredients, setIngredients, showToast }) {
  const [form, setForm] = useState({name:"",type:"",rarity:"",element:"",effect:""});
  const [output, setOutput] = useState(null);
  const s = (k,v) => setForm(p=>({...p,[k]:v}));

  const suggest = () => {
    if (!form.type && !form.element) { alert("Seleziona almeno Tipo ed Elemento."); return; }
    const matching = materials.filter(m => !form.element || m.element.includes(form.element)).slice(0,5);
    const spellMap = {
      Aria:["Volare","Caduta come Piuma","Passare senza Tracce"],
      Fuoco:["Palla di Fuoco","Mani Brucianti","Assorbire Elementi","Dardo di Fuoco"],
      Acqua:["Resistenza agli Elementi","Cura Ferite"],
      Terra:["Pelle di Pietra","Passare senza Tracce"],
      Fulmine:["Saetta","Assorbire Elementi"],
      Necrotico:["Tocco Vampirico","Scagliare Maledizione"],
      Radiante:["Aura Sacra","Luce Sacra"],
      Psichico:["Individuazione del Pensiero","Telepatia"],
      Forza:["Missile Magico","Pelle di Pietra"],
      Nessuno:["Incantamento Arma Magica"],
    };
    const costMap = {Comune:"500 mo","Non comune":"1.000 mo",Raro:"2.000–5.000 mo","Molto Raro":"10.000–25.000 mo",Leggendario:"50.000+ mo"};
    const timeMap = {Comune:"~10 gg","Non comune":"~25 gg",Raro:"~50 gg","Molto Raro":"~125 gg",Leggendario:"Mesi/anni"};
    setOutput({ matching, spells: spellMap[form.element]||[], cost: costMap[form.rarity], time: timeMap[form.rarity] });
  };

  const rmIng = (i) => setIngredients(p=>{const n=[...p];n.splice(i,1);return n;});

  const exportRecipe = () => {
    const lines = [`=== RICETTA: ${form.name||"Senza nome"} ===`,`Tipo: ${form.type||"—"}`,`Rarità: ${form.rarity||"—"}`,`Elemento: ${form.element||"—"}`,`Effetto: ${form.effect||"—"}`,``,`INGREDIENTI:`,...ingredients.map(i=>`  [${i.role.toUpperCase()}] ${i.name}`),``,`[Almanacco Alchemico di Avalin]`];
    navigator.clipboard.writeText(lines.join("\n")).then(()=>showToast("Ricetta copiata!")).catch(()=>alert(lines.join("\n")));
  };

  return (
    <div className="builder-grid">
      <div className="builder-panel">
        <h3 className="panel-title">🗡 Parametri Oggetto</h3>
        <div className="mf"><label>Nome oggetto</label><input value={form.name} onChange={e=>s("name",e.target.value)} placeholder="Es: Spada Lingua di Fiamme"/></div>
        <div className="mf-row">
          <div className="mf"><label>Tipo</label>
            <select value={form.type} onChange={e=>s("type",e.target.value)}>
              <option value="">—</option>
              {["Arma","Armatura","Scudo","Focus Arcano","Focus Druidico","Accessorio","Pozione"].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="mf"><label>Rarità</label>
            <select value={form.rarity} onChange={e=>s("rarity",e.target.value)}>
              <option value="">—</option>
              {["Comune","Non comune","Raro","Molto Raro","Leggendario"].map(r=><option key={r}>{r}</option>)}
            </select>
          </div>
        </div>
        <div className="mf"><label>Elemento dominante</label>
          <select value={form.element} onChange={e=>s("element",e.target.value)}>
            <option value="">—</option>
            {["Aria","Acqua","Fuoco","Terra","Fulmine","Necrotico","Radiante","Psichico","Forza","Nessuno"].map(e=><option key={e}>{e}</option>)}
          </select>
        </div>
        <div className="mf"><label>Effetto desiderato</label><input value={form.effect} onChange={e=>s("effect",e.target.value)} placeholder="Es: danni da fuoco extra, volo..."/></div>
        <div style={{display:"flex",gap:8,marginTop:12}}>
          <button className="btn btn-primary" onClick={suggest}>✦ Suggerisci Materiali</button>
          <button className="btn btn-sec" onClick={()=>{setForm({name:"",type:"",rarity:"",element:"",effect:""});setOutput(null);}}>Azzera</button>
        </div>
        {output && (
          <div className="recipe-out">
            <strong>📦 Materiali in inventario ({form.element||"qualsiasi"})</strong>
            {output.matching.length ? output.matching.map(m=><div key={m.id}>· {m.name} ({m.rarity}) — x{m.qty}</div>) : <div>Nessun materiale corrisponde.</div>}
            {output.cost && <><strong>⏳ Stima costi/tempi ({form.rarity})</strong><div>Costo: {output.cost} · Tempo: {output.time}</div></>}
            {output.spells.length>0 && <><strong>✨ Incantesimi consigliati</strong>{output.spells.map(s=><div key={s}>· {s}</div>)}</>}
            {form.effect && <><strong>📝 Effetto richiesto</strong><div>{form.effect}</div></>}
            <strong>💡 Proporzioni</strong>
            <div>Primario 50% · Secondario 30% · Terziario 20%</div>
          </div>
        )}
      </div>
      <div className="builder-panel">
        <h3 className="panel-title">📜 Ingredienti Selezionati</h3>
        <p style={{fontSize:11,fontStyle:"italic",color:"var(--gold-dim)",marginBottom:10}}>
          Aggiungi materiali dalla scheda "Materiali Trovati" con i tasti Prim./Sec./Terz.
        </p>
        {ingredients.length === 0
          ? <div className="empty-ing">Nessun ingrediente selezionato</div>
          : ingredients.map((ing,i)=>(
            <div key={i} className="ing-row">
              <span className="ing-dot" style={{background:ing.color||"#777"}}/>
              <span className="ing-name">{ing.name}</span>
              <span className="ing-role">{ing.role}</span>
              <button className="drop-x" onClick={()=>rmIng(i)}>✕</button>
            </div>
          ))
        }
        <div style={{display:"flex",gap:8,marginTop:12,flexWrap:"wrap"}}>
          <button className="btn btn-sec" onClick={exportRecipe}>📋 Copia Ricetta</button>
          <button className="btn btn-sec" onClick={()=>setIngredients([])}>🗑 Svuota</button>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// MAIN APP
// ══════════════════════════════════════════════════════════════
export default function App() {
  const [tab, setTab] = useState("materiali");
  const [materials, setMaterials] = useState([]);
  const [monsters, setMonsters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [seeded, setSeeded] = useState(false);
  const [toast, setToast] = useState("");
  const [ingredients, setIngredients] = useState([]);

  // filters
  const [matF, setMatF] = useState({rarity:"all",element:"all",substance:"all",q:""});
  const [monF, setMonF] = useState({element:"all",q:""});
  const [metF, setMetF] = useState({rarity:"all",q:""});
  const [gemF, setGemF] = useState({element:"all",rarity:"all",q:""});

  // modals
  const [matModal, setMatModal] = useState(null);
  const [monModal, setMonModal] = useState(null);
  const [monDetail, setMonDetail] = useState(null);

  // ── Toast helper ──────────────────────────────────────────
  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  }, []);

  // ── Firebase seed (first run) ─────────────────────────────
  const seed = useCallback(async (existingMats, existingMons) => {
    if (seeded) return;
    setSeeded(true);
    const batch = writeBatch(db);
    if (existingMats === 0) {
      DEFAULT_MATERIALS.forEach(m => batch.set(doc(db,"materials",m.id), m));
    }
    if (existingMons === 0) {
      DEFAULT_MONSTERS.forEach(m => batch.set(doc(db,"monsters",m.id), m));
    }
    try { await batch.commit(); } catch(e) { console.error("Seed error", e); }
  }, [seeded]);

  // ── Real-time listeners ───────────────────────────────────
  useEffect(() => {
    let matsLoaded = false, monsLoaded = false;
    let matsCount = -1, monsCount = -1;

    const unsubMat = onSnapshot(collection(db, "materials"), snap => {
      const docs = snap.docs.map(d => d.data());
      setMaterials(docs);
      if (!matsLoaded) { matsLoaded = true; matsCount = docs.length; if (monsLoaded) { seed(matsCount, monsCount); setLoading(false); } }
    });
    const unsubMon = onSnapshot(collection(db, "monsters"), snap => {
      const docs = snap.docs.map(d => d.data());
      setMonsters(docs);
      if (!monsLoaded) { monsLoaded = true; monsCount = docs.length; if (matsLoaded) { seed(matsCount, monsCount); setLoading(false); } }
    });
    return () => { unsubMat(); unsubMon(); };
  }, [seed]);

  // ── Firebase write helpers ────────────────────────────────
  const saveMat = async (m) => {
    await setDoc(doc(db, "materials", m.id), m);
    setMatModal(null);
    showToast(m._new ? "Materiale aggiunto!" : "Materiale aggiornato!");
  };
  const deleteMat = async (id) => {
    if (!window.confirm("Eliminare questo materiale?")) return;
    await deleteDoc(doc(db, "materials", id));
    setMatModal(null);
    showToast("Materiale eliminato.");
  };
  const changeQty = async (m, delta) => {
    const updated = { ...m, qty: Math.max(0, (m.qty||0) + delta) };
    await setDoc(doc(db, "materials", m.id), updated);
    showToast(delta > 0 ? `+1 ${m.name}` : `-1 ${m.name} (rimasti: ${updated.qty})`);
  };

  const saveMon = async (m) => {
    await setDoc(doc(db, "monsters", m.id), m);
    setMonModal(null);
    showToast(m._new ? "Mostro aggiunto!" : "Mostro aggiornato!");
  };
  const deleteMon = async (id) => {
    if (!window.confirm("Eliminare questo mostro?")) return;
    await deleteDoc(doc(db, "monsters", id));
    setMonModal(null);
    showToast("Mostro eliminato.");
  };

  const addIngredient = (m, role) => {
    setIngredients(p => [...p, { id: m.id, name: m.name, role, color: elemColor(m.element) }]);
    showToast(`${m.name} aggiunto come ${role}`);
  };

  // ── Filtered data ─────────────────────────────────────────
  const filteredMats = materials.filter(m => {
    if (matF.rarity !== "all" && m.rarity !== matF.rarity) return false;
    if (matF.element !== "all" && !(m.element||"").includes(matF.element)) return false;
    if (matF.substance !== "all" && m.substance !== matF.substance) return false;
    if (matF.q && !m.name.toLowerCase().includes(matF.q) && !(m.desc||"").toLowerCase().includes(matF.q) && !(m.source||"").toLowerCase().includes(matF.q)) return false;
    return true;
  });

  const filteredMons = monsters.filter(m => {
    if (monF.element !== "all" && !m.elements.includes(monF.element)) return false;
    if (monF.q && !m.name.toLowerCase().includes(monF.q) && !m.type.toLowerCase().includes(monF.q)) return false;
    return true;
  });

  const filteredMets = METALS.filter(m => {
    if (metF.rarity !== "all" && m.rarity !== metF.rarity) return false;
    if (metF.q && !m.name.toLowerCase().includes(metF.q) && !m.desc.toLowerCase().includes(metF.q)) return false;
    return true;
  });

  const filteredGems = GEMS.filter(g => {
    if (gemF.element !== "all" && !g.elements.includes(gemF.element)) return false;
    if (gemF.rarity !== "all" && !g.rarity.toLowerCase().includes(gemF.rarity.toLowerCase())) return false;
    if (gemF.q && !g.name.toLowerCase().includes(gemF.q)) return false;
    return true;
  });

  // ── Render ────────────────────────────────────────────────
  if (loading) return (
    <div className="loading-screen">
      <div className="loading-rune">✦</div>
      <div className="loading-text">Consultando i pergameni...</div>
    </div>
  );

  const TABS = [
    {id:"materiali", label:"📦 Materiali"},
    {id:"mostri",    label:"🐉 Mostri"},
    {id:"builder",   label:"⚗️ Ricette"},
    {id:"metalli",   label:"⚔️ Metalli"},
    {id:"gemme",     label:"💎 Gemme"},
  ];

  const ELEMENTS = ["Aria","Acqua","Fuoco","Terra","Fulmine","Necrotico","Radiante","Psichico","Forza"];
  const RARITIES = ["Comune","Non comune","Raro","Molto Raro","Leggendario"];
  const SUBSTANCES = ["Osso","Pelle","Carne","Fluido","Gas","Tessuto","Metallo","Minerale","Pianta","Ultraterreno"];

  return (
    <div className="book">
      {/* Header */}
      <header className="book-header">
        <div className="header-rune">✦ ✦ ✦ Avalin ✦ ✦ ✦</div>
        <h1 className="book-title">Almanacco Alchemico</h1>
        <div className="book-sub">Guida condivisa ai Materiali, ai Mostri e all'Arte del Crafting</div>
        <div className="live-badge">🟢 Sincronizzato in tempo reale</div>
      </header>

      {/* Tabs */}
      <nav className="tab-bar">
        {TABS.map(t => <button key={t.id} className={"tab-btn"+(tab===t.id?" active":"")} onClick={()=>setTab(t.id)}>{t.label}</button>)}
      </nav>

      <main className="book-main">

        {/* ── MATERIALI ── */}
        {tab === "materiali" && (
          <>
            <div className="search-row">
              <input className="search-input" placeholder="Cerca materiale, fonte, descrizione..." value={matF.q} onChange={e=>setMatF(p=>({...p,q:e.target.value.toLowerCase()}))}/>
            </div>
            <FilterBar label="Rarità" options={RARITIES} active={matF.rarity} onSelect={v=>setMatF(p=>({...p,rarity:v}))}/>
            <FilterBar label="Elemento" options={ELEMENTS} active={matF.element} onSelect={v=>setMatF(p=>({...p,element:v}))}/>
            <FilterBar label="Sostanza" options={SUBSTANCES} active={matF.substance} onSelect={v=>setMatF(p=>({...p,substance:v}))}/>
            <div className="toolbar">
              <span className="count">{filteredMats.length} materiali trovati</span>
              <button className="btn btn-primary" onClick={()=>setMatModal({_new:true})}>+ Aggiungi</button>
            </div>
            {filteredMats.length === 0
              ? <div className="empty">Nessun materiale corrisponde ai filtri.</div>
              : <div className="cards-grid">{filteredMats.map(m=><MatCard key={m.id} m={m} onEdit={setMatModal} onQty={changeQty} onAdd={addIngredient}/>)}</div>
            }
          </>
        )}

        {/* ── MOSTRI ── */}
        {tab === "mostri" && (
          <>
            <div className="search-row">
              <input className="search-input" placeholder="Cerca mostro o tipo..." value={monF.q} onChange={e=>setMonF(p=>({...p,q:e.target.value.toLowerCase()}))}/>
            </div>
            <FilterBar label="Elemento Drop" options={ELEMENTS} active={monF.element} onSelect={v=>setMonF(p=>({...p,element:v}))}/>
            <div className="toolbar">
              <span className="count">{filteredMons.length} mostri trovati</span>
              <button className="btn btn-primary" onClick={()=>setMonModal({_new:true})}>+ Aggiungi</button>
            </div>
            {filteredMons.length === 0
              ? <div className="empty">Nessun mostro corrisponde ai filtri.</div>
              : <div className="mon-grid">{filteredMons.map(m=><MonCard key={m.id} m={m} onEdit={setMonDetail}/>)}</div>
            }
          </>
        )}

        {/* ── BUILDER ── */}
        {tab === "builder" && (
          <BuilderTab materials={materials} ingredients={ingredients} setIngredients={setIngredients} showToast={showToast}/>
        )}

        {/* ── METALLI ── */}
        {tab === "metalli" && (
          <>
            <div className="search-row">
              <input className="search-input" placeholder="Cerca metallo o proprietà..." value={metF.q} onChange={e=>setMetF(p=>({...p,q:e.target.value.toLowerCase()}))}/>
            </div>
            <FilterBar label="Rarità" options={RARITIES} active={metF.rarity} onSelect={v=>setMetF(p=>({...p,rarity:v}))}/>
            <div className="toolbar"><span className="count">{filteredMets.length} metalli trovati</span></div>
            <div className="cards-grid">
              {filteredMets.map(m=><StaticCard key={m.name} name={m.name} rarity={m.rarity} elements={[m.element]} desc={m.desc} extra={m.price}/>)}
            </div>
          </>
        )}

        {/* ── GEMME ── */}
        {tab === "gemme" && (
          <>
            <div className="search-row">
              <input className="search-input" placeholder="Cerca gemma o elemento..." value={gemF.q} onChange={e=>setGemF(p=>({...p,q:e.target.value.toLowerCase()}))}/>
            </div>
            <FilterBar label="Elemento" options={["Fuoco","Freddo","Fulmine","Necrotico","Radiante","Psichico","Acido","Veleno","Forza"]} active={gemF.element} onSelect={v=>setGemF(p=>({...p,element:v}))}/>
            <FilterBar label="Rarità" options={RARITIES} active={gemF.rarity} onSelect={v=>setGemF(p=>({...p,rarity:v}))}/>
            <div className="toolbar"><span className="count">{filteredGems.length} gemme trovate</span></div>
            <div className="cards-grid">
              {filteredGems.map(g=><GemCard key={g.name} g={g}/>)}
            </div>
          </>
        )}

      </main>

      <footer className="book-footer">✦ Almanacco Alchemico di Avalin · Uso interno del gruppo ✦</footer>

      {/* Modals */}
      {matModal && <MatModal item={matModal} onClose={()=>setMatModal(null)} onSave={saveMat} onDelete={deleteMat}/>}
      {monModal && <MonModal item={monModal} onClose={()=>setMonModal(null)} onSave={saveMon} onDelete={deleteMon}/>}
      {monDetail && <MonDetail m={monDetail} onClose={()=>setMonDetail(null)} onEdit={m=>{setMonDetail(null);setMonModal(m);}}/>}

      <Toast msg={toast}/>
    </div>
  );
}
