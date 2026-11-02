"use client";
import { useEffect, useState } from "react";

type Offer = { id:number; title:string; company:string; location:string; match_score:number; source:string; source_url:string; match_explanation:string; status:string };
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export default function Home() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/offers`);
      if (!response.ok) throw new Error("API indisponible");
      const data: unknown = await response.json();
      if (!Array.isArray(data)) throw new Error("Réponse inattendue");
      // L'API ne garantit pas l'ordre : id décroissant = détectées le plus récemment en premier
      setOffers((data as Offer[]).sort((a, b) => b.id - a.id)); setError("");
    } catch { setError("Impossible de joindre l'API. Vérifie que Docker Compose est démarré."); }
    finally { setLoading(false); }
  }
  useEffect(() => { load(); }, []);
  const filtered = offers.filter(o => `${o.title} ${o.company} ${o.location}`.toLowerCase().includes(query.toLowerCase()));
  async function collect() {
    try {
      const response = await fetch(`${API}/api/collection/run`, { method:"POST" });
      if (!response.ok) throw new Error("Collecte refusée");
      await load();
    } catch { setError("La collecte n'a pas pu être déclenchée."); }
  }
  return <main>
    <header><div><h1>JobRadar</h1><p>Ta veille intelligente des offres d'alternance</p></div><button onClick={collect}>Lancer une recherche</button></header>
    <section className="grid">
      <div className="card"><small>Offres détectées</small><div className="metric">{offers.length}</div></div>
      <div className="card"><small>Nouvelles offres</small><div className="metric">{offers.filter(o=>o.status==="NEW").length}</div></div>
      <div className="card"><small>Très pertinentes</small><div className="metric">{offers.filter(o=>o.match_score>=80).length}</div></div>
      <div className="card"><small>Connecteurs actifs (démo)</small><div className="metric">1</div></div>
    </section>
    <section className="card">
      <header><div><h2>Offres détectées</h2><small>Triées des plus récemment détectées aux plus anciennes</small></div><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Rechercher une offre..." /></header>
      {error && <p role="alert">{error}</p>}
      {loading ? <p>Chargement...</p> : filtered.length===0 ? <p>Aucune offre pour le moment. Lance une recherche de démonstration.</p> :
        filtered.map(o=><article className="offer" key={o.id}><div><strong>{o.title}</strong><p>{o.company} · {o.location} · {o.source}</p><small>{o.match_explanation}</small><p><a href={o.source_url} target="_blank" rel="noreferrer">Voir l'annonce originale ↗</a></p></div><strong>{o.match_score}/100</strong></article>)}
    </section>
  </main>;
}
