'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Crown,
  Skull,
  Eye,
  Mountain,
  Droplets,
  Wind,
  Zap,
  Sparkles,
  Moon,
  Star,
  ShoppingBag,
  Search,
  Filter,
  X,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';

/* ─── Character Data ─────────────────────────────────── */

interface CharacterData {
  id: number;
  name: string;
  race: string;
  description: string;
  descriptionEs: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

const CHARACTERS: CharacterData[] = [
  {
    id: 1,
    name: 'Link',
    race: 'hylian',
    description: 'The Hero of Hyrule, wielder of the Master Sword. Embodiment of Courage.',
    descriptionEs: 'El Héroe de Hyrule, portador de la Espada Maestra. Encarnación del Valor.',
    icon: Swords,
  },
  {
    id: 2,
    name: 'Princess Zelda',
    race: 'hylian',
    description: 'Princess of Hyrule, bearer of the Triforce of Wisdom. Leader and scholar.',
    descriptionEs: 'Princesa de Hyrule, portadora de la Trifuerza de la Sabiduría. Líder y erudita.',
    icon: Crown,
  },
  {
    id: 3,
    name: 'Ganondorf',
    race: 'gerudo',
    description: 'The King of Evil, bearer of the Triforce of Power. Gerudo warlord.',
    descriptionEs: 'El Rey del Mal, portador de la Trifuerza del Poder. Señor de la guerra Gerudo.',
    icon: Skull,
  },
  {
    id: 4,
    name: 'Impa',
    race: 'sheikah',
    description: 'Loyal guardian of Princess Zelda and leader of the Sheikah clan.',
    descriptionEs: 'Guardiana leal de la Princesa Zelda y líder del clan Sheikah.',
    icon: Eye,
  },
  {
    id: 5,
    name: 'Daruk',
    race: 'goron',
    description: 'Champion of the Gorons and pilot of the Divine Beast Vah Rudania.',
    descriptionEs: 'Campeón de los Goron y piloto de la Bestia Divina Vah Rudania.',
    icon: Mountain,
  },
  {
    id: 6,
    name: 'Mipha',
    race: 'zora',
    description: 'Champion of the Zoras and pilot of the Divine Beast Vah Ruta. Gifted healer.',
    descriptionEs: 'Campeona de los Zora y piloto de la Bestia Divina Vah Ruta. Sanadora talentosa.',
    icon: Droplets,
  },
  {
    id: 7,
    name: 'Revali',
    race: 'rito',
    description: 'Champion of the Rito and pilot of the Divine Beast Vah Medoh. Master archer.',
    descriptionEs: 'Campeón de los Rito y piloto de la Bestia Divina Vah Medoh. Arquero maestro.',
    icon: Wind,
  },
  {
    id: 8,
    name: 'Urbosa',
    race: 'gerudo',
    description: 'Champion of the Gerudo and pilot of the Divine Beast Vah Naboris.',
    descriptionEs: 'Campeona de los Gerudo y piloto de la Bestia Divina Vah Naboris.',
    icon: Zap,
  },
  {
    id: 9,
    name: 'Fi',
    race: 'spirit',
    description: 'The spirit of the Master Sword, created by the goddess Hylia.',
    descriptionEs: 'El espíritu de la Espada Maestra, creado por la diosa Hylia.',
    icon: Sparkles,
  },
  {
    id: 10,
    name: 'Midna',
    race: 'twili',
    description: 'The Twilight Princess, ruler of the Twilight Realm.',
    descriptionEs: 'La Princesa del Crepúsculo, gobernante del Reino del Crepúsculo.',
    icon: Moon,
  },
  {
    id: 11,
    name: 'Tingle',
    race: 'hylian',
    description: 'The fairy-obsessed map maker. Dreams of becoming a fairy.',
    descriptionEs: 'El cartógrafo obsesionado con las hadas. Sueña con convertirse en hada.',
    icon: Star,
  },
  {
    id: 12,
    name: 'Beedle',
    race: 'hylian',
    description: 'The traveling merchant who roams Hyrule selling goods.',
    descriptionEs: 'El comerciante viajero que recorre Hyrule vendiendo mercancías.',
    icon: ShoppingBag,
  },
];

/* ─── Race labels ─────────────────────────────────────── */

const RACE_LABELS: Record<string, { en: string; es: string }> = {
  hylian: { en: 'Hylian', es: 'Hyliano' },
  gerudo: { en: 'Gerudo', es: 'Gerudo' },
  sheikah: { en: 'Sheikah', es: 'Sheikah' },
  goron: { en: 'Goron', es: 'Goron' },
  zora: { en: 'Zora', es: 'Zora' },
  rito: { en: 'Rito', es: 'Rito' },
  spirit: { en: 'Spirit', es: 'Espíritu' },
  twili: { en: 'Twili', es: 'Twili' },
};

/* ─── Sub-components ──────────────────────────────────── */

function CharacterCard({
  character,
  index,
  language,
}: {
  character: CharacterData;
  index: number;
  language: 'en' | 'es';
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  const raceColor = RACE_COLORS[character.race] || '#C6A15B';
  const raceLabel = RACE_LABELS[character.race]
    ? RACE_LABELS[character.race][language]
    : character.race;
  const Icon = character.icon;
  const description =
    language === 'es' ? character.descriptionEs : character.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: (index % 6) * 0.08,
        duration: 0.5,
        ease: 'easeOut',
      }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="relative rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        background: isDark
          ? `linear-gradient(145deg, ${raceColor}0D 0%, rgba(12, 16, 20, 0.95) 50%, ${raceColor}08 100%)`
          : `linear-gradient(145deg, ${raceColor}10 0%, rgba(255, 255, 255, 0.95) 50%, ${raceColor}05 100%)`,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${raceColor}22`,
      }}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: `inset 0 0 60px ${raceColor}15, 0 0 40px ${raceColor}10`,
        }}
      />

      {/* Decorative corner accent */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-15"
        style={{
          background: `radial-gradient(circle, ${raceColor}, transparent)`,
        }}
      />

      <div className="relative p-5 sm:p-6">
        {/* Header row: icon + race badge */}
        <div className="flex items-center justify-between mb-4">
          {/* Icon circle */}
          <motion.div
            className="w-11 h-11 rounded-xl flex items-center justify-center"
            style={{
              backgroundColor: `${raceColor}18`,
              border: `1px solid ${raceColor}30`,
            }}
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <Icon size={22} className="flex-shrink-0" />
          </motion.div>

          {/* Race badge */}
          <motion.span
            className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: `${raceColor}20`,
              color: raceColor,
              border: `1px solid ${raceColor}35`,
            }}
          >
            {raceLabel}
          </motion.span>
        </div>

        {/* Name */}
        <h3
          className="text-lg font-black tracking-tight mb-2"
          style={{
            color: isDark ? '#F0ECE4' : '#1A1510',
          }}
        >
          {character.name}
        </h3>

        {/* Description */}
        <p
          className="text-xs leading-relaxed line-clamp-3"
          style={{
            color: isDark ? 'rgba(240, 236, 228, 0.55)' : 'rgba(26, 21, 16, 0.55)',
          }}
        >
          {description}
        </p>

        {/* Bottom bar with id */}
        <div
          className="mt-4 pt-3 flex items-center justify-between border-t"
          style={{ borderColor: `${raceColor}15` }}
        >
          <span
            className="text-[10px] font-mono tracking-wider"
            style={{ color: `${raceColor}99` }}
          >
            #{String(character.id).padStart(2, '0')}
          </span>

          {/* Animated arrow indicator on hover */}
          <motion.span
            className="text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ color: raceColor }}
          >
            {language === 'es' ? 'Ver detalles' : 'View details'} →
          </motion.span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Page ───────────────────────────────────────── */

export function CharactersPage() {
  const { language, theme } = useAppStore();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');

  const filteredCharacters = useMemo(() => {
    if (!search.trim()) return CHARACTERS;
    const query = search.toLowerCase();
    return CHARACTERS.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.race.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query) ||
        c.descriptionEs.toLowerCase().includes(query)
    );
  }, [search]);

  // Race count summary
  const raceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    CHARACTERS.forEach((c) => {
      counts[c.race] = (counts[c.race] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="space-y-5 sm:space-y-7">
      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Triforce decorative element */}
          <svg
            width="28"
            height="24"
            viewBox="0 0 28 24"
            className="flex-shrink-0"
            aria-hidden="true"
          >
            <motion.polygon
              points="14,0 0,24 28,24"
              fill="none"
              stroke="#C6A15B"
              strokeWidth="1.5"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 1, ease: 'easeInOut' }}
            />
            <motion.polygon
              points="14,5 6,20 22,20"
              fill="none"
              stroke="#C6A15B"
              strokeWidth="1"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.4 }}
              transition={{ delay: 0.6, duration: 0.8, ease: 'easeInOut' }}
            />
          </svg>

          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{
                background: 'linear-gradient(135deg, #C6A15B, #E8D8B0, #C6A15B)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {t('characters.title', language)}
            </h1>
            <p
              className="text-xs sm:text-sm mt-0.5"
              style={{
                color: isDark ? 'rgba(240, 236, 228, 0.5)' : 'rgba(26, 21, 16, 0.5)',
              }}
            >
              {t('characters.subtitle', language)}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Search & Race Pills ── */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-4"
      >
        {/* Search bar */}
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-secondary"
            size={15}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              language === 'es'
                ? 'Buscar personajes...'
                : 'Search characters...'
            }
            className="w-full rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm transition-colors focus:outline-none"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
              color: isDark ? '#F0ECE4' : '#1A1510',
            }}
            aria-label={language === 'es' ? 'Buscar personajes' : 'Search characters'}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/5 transition-colors"
              aria-label={t('common.clear', language)}
            >
              <X size={14} className="text-text-secondary" />
            </button>
          )}
        </div>

        {/* Race filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-text-secondary flex items-center gap-1 mr-1">
            <Filter size={11} />
            {language === 'es' ? 'Razas' : 'Races'}
          </span>
          {Object.entries(raceCounts)
            .sort(([, a], [, b]) => b - a)
            .map(([race, count]) => {
              const color = RACE_COLORS[race] || '#C6A15B';
              const label = RACE_LABELS[race]?.[language] || race;
              return (
                <motion.span
                  key={race}
                  className="px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider cursor-default"
                  style={{
                    backgroundColor: `${color}18`,
                    color: color,
                    border: `1px solid ${color}30`,
                  }}
                  whileHover={{ scale: 1.08 }}
                >
                  {label} · {count}
                </motion.span>
              );
            })}
        </div>
      </motion.div>

      {/* ── Character Grid ── */}
      <AnimatePresence mode="wait">
        {filteredCharacters.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card p-10 sm:p-14 text-center rounded-2xl"
          >
            <Search
              size={36}
              className="mx-auto mb-4"
              style={{ color: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            />
            <p
              className="text-sm font-medium"
              style={{ color: isDark ? 'rgba(240,236,228,0.5)' : 'rgba(26,21,16,0.5)' }}
            >
              {t('common.noResults', language)}
            </p>
            <button
              onClick={() => setSearch('')}
              className="mt-3 px-4 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: '#C6A15B18',
                color: '#C6A15B',
                border: '1px solid #C6A15B30',
              }}
            >
              {t('common.clear', language)}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            {filteredCharacters.map((character, index) => (
              <CharacterCard
                key={character.id}
                character={character}
                index={index}
                language={language}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Triforce footer accent ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="flex justify-center pt-2 pb-4"
      >
        <div className="flex items-center gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: '#C6A15B' }}
              animate={{
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
