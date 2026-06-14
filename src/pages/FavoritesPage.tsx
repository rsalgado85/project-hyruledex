import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Search, X, Users, Skull, Bug } from 'lucide-react';
import { useAppStore, type FavoriteEntry, type FavoriteType } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';
import { CHARACTERS, type CharacterData } from '@/pages/CharactersPage';
import { bosses, type Boss } from '@/pages/BossesPage';

/* ─── Creature types (lightweight API fetch) ────────── */

interface CreatureSummary {
  id: number;
  name: string;
  category: 'creatures' | 'monsters';
  image: string;
}

const API_BASE = 'https://api.hyrule-compendium.com/v3/compendium';

/* ─── Unified Favorite Item ─────────────────────────── */

type UnifiedFav =
  | { type: 'character'; data: CharacterData }
  | { type: 'boss'; data: Boss }
  | { type: 'creature'; data: CreatureSummary };

/* ─── Sub-components ──────────────────────────────────── */

function FavoriteCard({
  item,
  language,
  onRemove,
  onClick,
}: {
  item: UnifiedFav;
  language: 'en' | 'es';
  onRemove: () => void;
  onClick: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  let image: string;
  let name: string;
  let subtitle: string;
  let accentColor: string;
  let typeLabel: string;

  if (item.type === 'character') {
    const c = item.data;
    image = c.image;
    name = c.name;
    subtitle = language === 'es' ? c.roleEs : c.role;
    accentColor = RACE_COLORS[c.race] || '#C6A15B';
    typeLabel = language === 'es' ? 'Personaje' : 'Character';
  } else if (item.type === 'boss') {
    const b = item.data;
    image = b.image;
    name = b.name;
    subtitle = b.game;
    accentColor = b.accentColor;
    typeLabel = language === 'es' ? 'Jefe' : 'Boss';
  } else {
    const cr = item.data;
    image = `/creatures/${cr.name.replace(/\s+/g, '_')}.png`;
    name = cr.name.replace(/[_-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    subtitle = cr.category === 'monsters'
      ? (language === 'es' ? 'Monstruo' : 'Monster')
      : (language === 'es' ? 'Criatura' : 'Creature');
    accentColor = cr.category === 'monsters' ? '#8B3A3A' : '#3E6B48';
    typeLabel = language === 'es' ? 'Criatura' : 'Creature';
  }

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      onClick={onClick}
      className="rounded-2xl overflow-hidden cursor-pointer group relative"
      style={{
        background: isDark
          ? `linear-gradient(145deg, ${accentColor}10 0%, rgba(12,16,20,0.9) 100%)`
          : `linear-gradient(145deg, ${accentColor}08 0%, rgba(255,255,255,0.9) 100%)`,
        border: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(0,0,0,0.04)',
      }}
    >
      {/* Remove button */}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="absolute top-2 right-2 z-10 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ backgroundColor: 'rgba(231,76,60,0.2)', color: '#e74c3c' }}
        aria-label={language === 'es' ? 'Quitar de favoritos' : 'Remove from favorites'}
      >
        <X size={12} />
      </button>

      {/* Type badge */}
      <div className="absolute top-2 left-2 z-10">
        <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider text-white"
          style={{
            backgroundColor: item.type === 'boss' ? 'rgba(198,161,91,0.7)' :
              item.type === 'character' ? 'rgba(98,130,180,0.7)' : 'rgba(62,107,72,0.7)'
          }}
        >
          {typeLabel}
        </span>
      </div>

      {/* Image */}
      <div className="relative h-32 sm:h-36 overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accentColor}10, transparent)` }}
      >
        <img
          src={image}
          alt={name}
          className="w-full h-full object-contain p-3 group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-bold truncate" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
          {name}
        </h3>
        <p className="text-[10px] truncate" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
          {subtitle}
        </p>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─────────────────────────────────────── */

export function FavoritesPage() {
  const navigate = useNavigate();
  const { language, favorites, removeFavorite, toggleFavorite } = useAppStore();
  const isDark = useAppStore((s) => s.theme === 'dark');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | FavoriteType>('all');
  const [creatures, setCreatures] = useState<CreatureSummary[]>([]);
  const [creaturesLoading, setCreaturesLoading] = useState(true);

  // Fetch creature data for creature-type favorites
  useEffect(() => {
    let cancelled = false;
    async function fetchCreatures() {
      try {
        const [cRes, mRes] = await Promise.all([
          fetch(`${API_BASE}/category/creatures`),
          fetch(`${API_BASE}/category/monsters`),
        ]);
        const [cData, mData] = await Promise.all([cRes.json(), mRes.json()]);
        if (!cancelled) {
          const all: CreatureSummary[] = [...cData.data, ...mData.data].map((entry: any) => ({
            id: entry.id,
            name: entry.name,
            category: entry.category,
            image: entry.image,
          }));
          setCreatures(all);
          setCreaturesLoading(false);
        }
      } catch {
        if (!cancelled) setCreaturesLoading(false);
      }
    }
    // Only fetch if we have creature favorites
    if (favorites.some((f) => f.type === 'creature')) {
      fetchCreatures();
    } else {
      setCreaturesLoading(false);
    }
    return () => { cancelled = true; };
  }, [favorites]);

  // Build unified favorites list
  const unifiedFavorites = useMemo((): UnifiedFav[] => {
    return favorites
      .map((fav): UnifiedFav | null => {
        if (fav.type === 'character') {
          const c = CHARACTERS.find((ch) => ch.id === fav.id);
          return c ? { type: 'character', data: c } : null;
        }
        if (fav.type === 'boss') {
          const b = bosses.find((bo) => bo.id === fav.id);
          return b ? { type: 'boss', data: b } : null;
        }
        if (fav.type === 'creature') {
          const cr = creatures.find((ce) => ce.id === fav.id);
          return cr ? { type: 'creature', data: cr } : null;
        }
        return null;
      })
      .filter((item): item is UnifiedFav => item !== null);
  }, [favorites, creatures]);

  // Apply search + filter
  const filtered = useMemo(() => {
    return unifiedFavorites.filter((item) => {
      const matchesSearch = !search.trim() || (() => {
        const name = item.type === 'character' ? item.data.name
          : item.type === 'boss' ? item.data.name
          : item.data.name.replace(/[_-]/g, ' ');
        return name.toLowerCase().includes(search.toLowerCase());
      })();
      const matchesFilter = filter === 'all' || item.type === filter;
      return matchesSearch && matchesFilter;
    });
  }, [unifiedFavorites, search, filter]);

  const handleNavigate = (item: UnifiedFav) => {
    if (item.type === 'character') navigate('/characters');
    else if (item.type === 'boss') navigate('/bosses');
    else navigate('/creatures');
  };

  const handleRemove = (item: UnifiedFav) => {
    removeFavorite(item.type, item.type === 'character' ? item.data.id
      : item.type === 'boss' ? item.data.id
      : item.data.id);
  };

  const filterTabs: { key: typeof filter; labelEn: string; labelEs: string; icon: typeof Heart }[] = [
    { key: 'all', labelEn: 'All', labelEs: 'Todos', icon: Heart },
    { key: 'character', labelEn: 'Characters', labelEs: 'Personajes', icon: Users },
    { key: 'boss', labelEn: 'Bosses', labelEs: 'Jefes', icon: Skull },
    { key: 'creature', labelEn: 'Creatures', labelEs: 'Criaturas', icon: Bug },
  ];

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Heart size={28} className="text-[#e74c3c] drop-shadow-[0_0_8px_rgba(231,76,60,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('favorites.title', language)}
          </h1>
          <span className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
            style={{ backgroundColor: 'rgba(198,161,91,0.15)', color: '#C6A15B' }}
          >
            {favorites.length}
          </span>
        </div>
        <p className="text-xs sm:text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
          {t('favorites.subtitle', language)}
        </p>
      </motion.div>

      {/* Search + Filters */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-3"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={16}
            style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'es' ? 'Buscar en favoritos...' : 'Search favorites...'}
            className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm transition-all focus:outline-none"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.02)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#F0ECE4' : '#1A1510',
            }}
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1.5 flex-wrap">
          {filterTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1"
                style={{
                  backgroundColor: filter === tab.key
                    ? 'rgba(198,161,91,0.15)'
                    : isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
                  color: filter === tab.key
                    ? '#C6A15B'
                    : isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
                  border: `1px solid ${filter === tab.key
                    ? 'rgba(198,161,91,0.3)'
                    : isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
                }}
              >
                <Icon size={14} />
                <span>{language === 'es' ? tab.labelEs : tab.labelEn}</span>
              </button>
            );
          })}
          <span className="flex items-center text-[10px] px-2"
            style={{ color: isDark ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.25)' }}
          >
            {filtered.length}/{unifiedFavorites.length}
          </span>
        </div>
      </motion.div>

      {/* Content */}
      {favorites.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <Heart size={48} className="mx-auto mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <h2 className="text-base font-semibold mb-2" style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            {t('favorites.empty', language)}
          </h2>
          <p className="text-xs mb-4" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            {t('favorites.emptyDesc', language)}
          </p>
          <button
            onClick={() => navigate('/characters')}
            className="px-4 py-2 rounded-xl text-white text-xs font-semibold transition-colors hover:opacity-90"
            style={{ backgroundColor: '#C6A15B' }}
          >
            {t('favorites.explore', language)}
          </button>
        </motion.div>
      ) : creaturesLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-16"
        >
          <Heart size={40} className="mx-auto mb-3" style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }} />
          <p className="text-sm" style={{ color: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' }}>
            {language === 'es' ? 'Sin resultados para este filtro' : 'No results for this filter'}
          </p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4"
        >
          {filtered.map((item, idx) => (
            <FavoriteCard
              key={`${item.type}-${item.type === 'character' ? item.data.id : item.type === 'boss' ? item.data.id : item.data.id}`}
              item={item}
              language={language}
              onRemove={() => handleRemove(item)}
              onClick={() => handleNavigate(item)}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
