import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, X, Plus, Search, Users, Skull, Bug } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';
import { CHARACTERS, type CharacterData } from '@/pages/CharactersPage';
import { bosses, type Boss } from '@/pages/BossesPage';

/* ─── Types ────────────────────────────────────────── */

type ItemType = 'character' | 'boss' | 'creature';

interface Comparable {
  id: string;          // "type:id"
  type: ItemType;
  name: string;
  image: string;
  subtitle: string;
  color: string;
  stats: { hp: number; atk: number; def: number; spd: number; total: number };
}

interface CreatureEntry {
  id: number; name: string; category: 'creatures' | 'monsters';
}

const MAX_COMPARE = 4;
const API_BASE = 'https://api.hyrule-compendium.com/v3/compendium';

/* ─── Creature stats (same hash as CreaturesPage) ──── */

function getCreatureStats(n: string, cat: 'creatures' | 'monsters') {
  const low = n.toLowerCase(); const im = cat === 'monsters';
  let hMin = im ? 20 : 8, hMax = im ? 95 : 50, aMin = im ? 18 : 3, aMax = im ? 90 : 30;
  let dMin = im ? 12 : 5, dMax = im ? 80 : 40, sMin = im ? 8 : 20, sMax = im ? 60 : 92;
  if (/silver|gold|white-?maned|black|blue-?maned|cursed|master/i.test(low)) { hMin += 10; hMax += 5; aMin += 10; aMax += 5; dMin += 8; }
  if (/ganon|blight|kohga|molduking|talus_titan|stalnox|hinox|lynel|guardian_stalker/i.test(low)) { hMin += 25; aMin += 20; dMin += 15; }
  if (/electric|fire|ice|wizzrobe|thunder|blizz|meteo/i.test(low)) { aMin += 12; sMin += 5; }
  if (/butterfly|firefly|cricket|fairy|lizard|sparrow|beetle/i.test(low)) { hMax = Math.min(hMax, 25); aMax = Math.min(aMax, 15); sMin += 20; }
  if (/horse|fox|coyote|wolf|hawk|heron|buck|doe|ostrich/i.test(low)) { sMin += 20; aMin -= 5; }
  if (/guardian|talus|pebblit|lynel|hinox|molduga/i.test(low)) { dMin += 15; hMin += 10; }
  if (/dinraal|farosh|naydra/i.test(low)) { hMin = 90; hMax = 95; aMin = 85; aMax = 92; dMin = 75; dMax = 88; sMin = 50; sMax = 70; }
  const hash = (s: string, min: number, max: number) => { let h = 0; for (let i = 0; i < s.length; i++) h = ((h << 5) - h + s.charCodeAt(i)) | 0; return Math.round(min + ((Math.abs(h) % 10000) / 10000) * (max - min)); };
  return { hp: hash(n + '_hp', hMin, hMax), atk: hash(n + '_atk', aMin, aMax), def: hash(n + '_def', dMin, dMax), spd: hash(n + '_spd', sMin, sMax), total: 0 };
}

function formatCrName(n: string) { return n.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()); }

/* ─── Unified data builder ─────────────────────────── */

function buildComparables(creatures: CreatureEntry[], lang: 'en' | 'es'): Comparable[] {
  const items: Comparable[] = [];

  // Characters
  for (const c of CHARACTERS) {
    items.push({
      id: `character:${c.id}`, type: 'character', name: c.name,
      image: c.image, subtitle: lang === 'es' ? c.gameEs : c.game,
      color: RACE_COLORS[c.race] || '#C6A15B',
      stats: { hp: c.hp, atk: c.atk, def: c.def, spd: c.spd, total: c.hp + c.atk + c.def + c.spd },
    });
  }

  // Bosses
  for (const b of bosses) {
    items.push({
      id: `boss:${b.id}`, type: 'boss', name: b.name,
      image: b.image, subtitle: b.game, color: b.accentColor,
      stats: { hp: b.hp, atk: b.atk, def: b.def, spd: b.spd, total: b.hp + b.atk + b.def + b.spd },
    });
  }

  // Creatures
  for (const cr of creatures) {
    const st = getCreatureStats(cr.name, cr.category);
    st.total = st.hp + st.atk + st.def + st.spd;
    items.push({
      id: `creature:${cr.id}`, type: 'creature', name: formatCrName(cr.name),
      image: `/creatures/${cr.name.replace(/\s+/g, '_')}.png`,
      subtitle: cr.category === 'monsters' ? (lang === 'es' ? 'Monstruo' : 'Monster') : (lang === 'es' ? 'Criatura' : 'Creature'),
      color: cr.category === 'monsters' ? '#8B3A3A' : '#3E6B48',
      stats: st,
    });
  }

  return items;
}

/* ─── Stat Bar ─────────────────────────────────────── */

function StatBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  const pct = max > 0 ? (value / max) * 100 : value;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs w-5">{label}</span>
      <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ backgroundColor: color, width: `${pct}%` }} />
      </div>
      <span className="text-[9px] font-mono text-text-secondary/50 w-6 text-right">{value}</span>
    </div>
  );
}

/* ─── Main Page ────────────────────────────────────── */

export function ComparePage() {
  const { language, theme } = useAppStore();
  const isDark = theme === 'dark';

  const [creatures, setCreatures] = useState<CreatureEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [typeFilter, setTypeFilter] = useState<'all' | ItemType>('all');

  // Fetch creatures
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cr, mo] = await Promise.all([fetch(`${API_BASE}/category/creatures`), fetch(`${API_BASE}/category/monsters`)]);
        const [cd, md] = await Promise.all([cr.json(), mo.json()]);
        if (!cancelled) { setCreatures([...cd.data, ...md.data]); setLoading(false); }
      } catch { if (!cancelled) setLoading(false); }
    })();
    return () => { cancelled = true; };
  }, []);

  const allItems = useMemo(() => buildComparables(creatures, language), [creatures, language]);

  const selectedItems = useMemo(() =>
    selectedIds.map((id) => allItems.find((i) => i.id === id)).filter(Boolean) as Comparable[],
  [allItems, selectedIds]);

  const searchResults = useMemo(() => {
    if (!search.trim()) return [] as Comparable[];
    const q = search.toLowerCase();
    return allItems.filter((i) =>
      i.name.toLowerCase().includes(q) &&
      !selectedIds.includes(i.id) &&
      (typeFilter === 'all' || i.type === typeFilter)
    ).slice(0, 12);
  }, [allItems, search, selectedIds, typeFilter]);

  const addItem = (id: string) => {
    if (selectedIds.length < MAX_COMPARE && !selectedIds.includes(id)) {
      setSelectedIds((p) => [...p, id]);
      setSearch('');
      setShowSearch(false);
    }
  };

  const removeItem = (id: string) => setSelectedIds((p) => p.filter((i) => i !== id));

  const typeIcons: Record<ItemType, typeof Users> = { character: Users, boss: Skull, creature: Bug };
  const typeLabels: Record<ItemType, { en: string; es: string }> = {
    character: { en: 'Characters', es: 'Personajes' },
    boss: { en: 'Bosses', es: 'Jefes' },
    creature: { en: 'Creatures', es: 'Criaturas' },
  };

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-1 sm:space-y-2">
        <div className="flex items-center gap-2 sm:gap-3">
          <Swords size={28} className="text-[#C6A15B] drop-shadow-[0_0_8px_rgba(198,161,91,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('compare.title', language)}</h1>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {t('compare.subtitle', language)}
        </p>
      </motion.div>

      {/* Selector grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {Array.from({ length: MAX_COMPARE }).map((_, idx) => {
          const item = selectedItems[idx];
          return (
            <motion.div key={idx} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
              className="rounded-2xl p-3 sm:p-4 min-h-[140px] flex flex-col items-center justify-center relative"
              style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
              {item ? (
                <>
                  <button onClick={() => removeItem(item.id)}
                    className="absolute top-2 right-2 p-1 rounded-full transition-colors"
                    style={{ backgroundColor: 'rgba(231,76,60,0.2)', color: '#e74c3c' }}>
                    <X size={12} />
                  </button>
                  <div className="absolute top-2 left-2">
                    <span className="px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase"
                      style={{ backgroundColor: item.type === 'boss' ? 'rgba(198,161,91,0.7)' : item.type === 'character' ? 'rgba(98,130,180,0.7)' : 'rgba(62,107,72,0.7)' }}>
                      {language === 'es' ? typeLabels[item.type].es : typeLabels[item.type].en}
                    </span>
                  </div>
                  <img src={item.image} alt={item.name} className="w-14 h-14 sm:w-16 sm:h-16 object-contain mb-1" />
                  <p className="text-xs font-semibold text-center truncate max-w-full" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{item.name}</p>
                  <p className="text-[9px] truncate max-w-full" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>{item.subtitle}</p>
                  <p className="text-[9px] font-bold mt-0.5" style={{ color: '#C6A15B' }}>⚡ {item.stats.total}</p>
                </>
              ) : (
                <button onClick={() => setShowSearch(true)}
                  className="flex flex-col items-center gap-2 transition-colors"
                  style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                  <Plus size={24} />
                  <span className="text-[10px]">{language === 'es' ? 'Agregar' : 'Add'}</span>
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Search dropdown */}
      <AnimatePresence>
        {showSearch && selectedIds.length < MAX_COMPARE && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="rounded-2xl p-4" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}` }}>
            <div className="flex gap-2 mb-3">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }} />
                <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus
                  placeholder={language === 'es' ? 'Buscar personaje, jefe o criatura...' : 'Search character, boss or creature...'}
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none"
                  style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`, color: isDark ? '#F0ECE4' : '#1A1510' }} />
              </div>
              <button onClick={() => { setShowSearch(false); setSearch(''); }}
                className="px-3 py-2 rounded-xl text-xs" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>✕</button>
            </div>
            {/* Type filter tabs */}
            <div className="flex gap-1 mb-2">
              {(['all', 'character', 'boss', 'creature'] as const).map((t) => (
                <button key={t} onClick={() => setTypeFilter(t)}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                  style={{ backgroundColor: typeFilter === t ? 'rgba(198,161,91,0.15)' : 'transparent', color: typeFilter === t ? '#C6A15B' : isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>
                  {t === 'all' ? (language === 'es' ? 'Todos' : 'All') : language === 'es' ? typeLabels[t].es : typeLabels[t].en}
                </button>
              ))}
            </div>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {searchResults.map((item) => {
                const Icon = typeIcons[item.type];
                return (
                  <button key={item.id} onClick={() => addItem(item.id)}
                    className="w-full flex items-center gap-3 p-2 rounded-xl transition-colors text-left"
                    style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.01)' }}>
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded-lg" style={{ background: `${item.color}15` }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{item.name}</p>
                      <div className="flex items-center gap-1 text-[9px]" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
                        <Icon size={10} /><span>{item.subtitle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold" style={{ color: '#C6A15B' }}>{item.stats.total}</span>
                  </button>
                );
              })}
              {search.trim() && searchResults.length === 0 && (
                <p className="text-xs text-center py-4" style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}>
                  {language === 'es' ? 'Sin resultados' : 'No results'}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison table */}
      {selectedItems.length >= 2 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-4 sm:p-6" style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
          <h2 className="text-sm sm:text-base font-semibold mb-4 flex items-center gap-2" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
            <Swords size={16} className="text-[#C6A15B]" />
            {t('compare.statsComparison', language)}
          </h2>

          {/* Visual bars — one stat row per stat, all items side by side */}
          <div className="space-y-3 mb-6">
            {(['hp', 'atk', 'def', 'spd'] as const).map((stat) => {
              const max = Math.max(...selectedItems.map((i) => i.stats[stat]));
              const labels = { hp: '❤️ HP', atk: '⚔️ ATK', def: '🛡️ DEF', spd: '⚡ SPD' };
              const colors = { hp: '#3E6B48', atk: '#8B3A3A', def: '#5B8A9E', spd: '#C6A15B' };
              return (
                <div key={stat}>
                  <p className="text-[10px] font-bold mb-1.5" style={{ color: isDark ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.4)' }}>{labels[stat]}</p>
                  <div className="flex gap-2">
                    {selectedItems.map((item) => (
                      <div key={item.id} className="flex-1 flex items-center gap-2">
                        <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${(item.stats[stat] / max) * 100}%` }}
                            transition={{ duration: 0.6 }} className="h-full rounded-full" style={{ backgroundColor: colors[stat] }} />
                        </div>
                        <span className="text-[10px] font-mono w-7 text-right" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{item.stats[stat]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
                  <th className="text-left py-2 font-medium" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                    {language === 'es' ? 'Estadística' : 'Stat'}
                  </th>
                  {selectedItems.map((item) => (
                    <th key={item.id} className="text-center py-2 font-semibold" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>{item.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(['hp', 'atk', 'def', 'spd'] as const).map((stat) => {
                  const labels = { hp: '❤️ HP', atk: '⚔️ ATK', def: '🛡️ DEF', spd: '⚡ SPD' };
                  const max = Math.max(...selectedItems.map((i) => i.stats[stat]));
                  return (
                    <tr key={stat} style={{ borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'}` }}>
                      <td className="py-2.5" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>{labels[stat]}</td>
                      {selectedItems.map((item) => (
                        <td key={item.id} className={`text-center py-2.5 font-medium ${item.stats[stat] === max ? 'font-bold' : ''}`}
                          style={{ color: item.stats[stat] === max ? '#C6A15B' : isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
                          {item.stats[stat]}
                        </td>
                      ))}
                    </tr>
                  );
                })}
                <tr>
                  <td className="py-2.5 font-bold" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>⚡ Total</td>
                  {selectedItems.map((item) => {
                    const maxTot = Math.max(...selectedItems.map((i) => i.stats.total));
                    return (
                      <td key={item.id} className={`text-center py-2.5 font-bold ${item.stats.total === maxTot ? '' : ''}`}
                        style={{ color: item.stats.total === maxTot ? '#C6A15B' : isDark ? '#F0ECE4' : '#1A1510' }}>
                        {item.stats.total}
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {selectedItems.length < 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="rounded-2xl p-8 sm:p-12 text-center"
          style={{ background: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.015)', border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}` }}>
          <Swords size={40} className="mx-auto mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <h2 className="text-base font-semibold mb-1" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            {t('compare.selectPrompt', language)}
          </h2>
          <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            {t('compare.selectDesc', language)}
          </p>
        </motion.div>
      )}
    </div>
  );
}
