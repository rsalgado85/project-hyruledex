import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Swords,
  Shield,
  Users,
  Skull,
  Zap,
  Flame,
  Crown,
  X,
  MapPin,
  Gamepad2,
} from 'lucide-react';
import { KPICard } from '@/components/common/KPICard';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import { RACE_COLORS } from '@/constants';
import { useMemo, useState, useEffect } from 'react';
import { CHARACTERS, type CharacterData } from '@/pages/CharactersPage';
import { bosses, type Boss } from '@/pages/BossesPage';

/* ─── Race labels ────────────────────────────────── */

const RACE_LABELS: Record<string, { en: string; es: string }> = {
  hylian: { en: 'Hylian', es: 'Hyliano' },
  gerudo: { en: 'Gerudo', es: 'Gerudo' },
  sheikah: { en: 'Sheikah', es: 'Sheikah' },
  goron: { en: 'Goron', es: 'Goron' },
  zora: { en: 'Zora', es: 'Zora' },
  rito: { en: 'Rito', es: 'Rito' },
  spirit: { en: 'Spirit', es: 'Espíritu' },
  twili: { en: 'Twili', es: 'Twili' },
  zonai: { en: 'Zonai', es: 'Zonai' },
};

/* ─── Shuffle helpers ────────────────────────────────── */

function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/* ─── Stat Bar ───────────────────────────────────── */

function DetailStatBar({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max?: number;
  color: string;
}) {
  const pct = max ? (value / max) * 100 : value;
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs w-5">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, delay: 0.2 }}
          style={{ backgroundColor: color }}
        />
      </div>
      <span className="text-[9px] font-mono text-text-secondary/50 w-6 text-right">{value}</span>
    </div>
  );
}

/* ─── Character Detail Modal ─────────────────────── */

function CharacterDetailModal({
  character,
  language,
  onClose,
}: {
  character: CharacterData;
  language: 'en' | 'es';
  onClose: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const raceColor = RACE_COLORS[character.race] || '#C6A15B';
  const raceLabel = RACE_LABELS[character.race]?.[language] || character.race;
  const description = language === 'es' ? character.descriptionEs : character.description;
  const maxStat = Math.max(character.hp, character.atk, character.def, character.spd) + 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          backgroundColor: isDark ? '#141A1F' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(198,161,91,0.2)' : 'rgba(180,140,60,0.25)'}`,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div
          className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${raceColor}15, transparent)`,
          }}
        >
          <img
            src={character.image}
            alt={character.name}
            className="w-full h-full object-contain p-4"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(to top, ${isDark ? '#141A1F' : '#ffffff'}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h2 className="text-xl font-black" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
              {character.name}
            </h2>
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${raceColor}15`,
                color: raceColor,
                border: `1px solid ${raceColor}30`,
              }}
            >
              {raceLabel}
            </span>
          </div>

          {/* Meta: Role + Weapon + Game */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <Crown size={12} className="text-[#C6A15B]/60" />
              <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {language === 'es' ? character.roleEs : character.role}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Swords size={12} className="text-[#8B3A3A]/60" />
              <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {language === 'es' ? character.weaponEs : character.weapon}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Gamepad2 size={12} className="text-[#5B8A9E]/60" />
              <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {language === 'es' ? character.gameEs : character.game}
              </span>
            </div>
          </div>

          {/* Stat Bars */}
          <div
            className="space-y-2 p-3 rounded-xl"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
            }}
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
            >
              {language === 'es' ? 'Estadísticas' : 'Stats'}
            </h4>
            <DetailStatBar label="❤️" value={character.hp} max={maxStat} color="#3E6B48" />
            <DetailStatBar label="⚔️" value={character.atk} max={maxStat} color="#8B3A3A" />
            <DetailStatBar label="🛡️" value={character.def} max={maxStat} color="#5B8A9E" />
            <DetailStatBar label="⚡" value={character.spd} max={maxStat} color="#C6A15B" />
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}
          >
            {description}
          </p>

          {/* View all link */}
          <button
            onClick={() => {
              onClose();
              // navigate handled by parent via window or we pass it
              window.location.href = '/characters';
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              backgroundColor: 'rgba(198,161,91,0.08)',
              color: '#C6A15B',
              border: '1px solid rgba(198,161,91,0.2)',
            }}
          >
            {language === 'es' ? 'Ver todos los personajes →' : 'View All Characters →'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Boss Detail Modal ──────────────────────────── */

function BossDetailModal({
  boss,
  language,
  onClose,
}: {
  boss: Boss;
  language: 'en' | 'es';
  onClose: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const maxStat = Math.max(boss.hp, boss.atk, boss.def, boss.spd) + 5;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl"
        style={{
          backgroundColor: isDark ? '#141A1F' : '#ffffff',
          border: `1px solid ${boss.accentColor}22`,
          boxShadow: '0 25px 60px rgba(0,0,0,0.5)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: 'rgba(255,255,255,0.7)' }}
        >
          <X size={18} />
        </button>

        {/* Image */}
        <div
          className="relative w-full h-56 sm:h-64 overflow-hidden rounded-t-2xl"
          style={{
            background: `linear-gradient(135deg, ${boss.accentColor}15, transparent)`,
          }}
        >
          <img
            src={boss.image}
            alt={boss.name}
            className="w-full h-full object-contain p-4"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-16"
            style={{ background: `linear-gradient(to top, ${isDark ? '#141A1F' : '#ffffff'}, transparent)` }}
          />
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h2 className="text-xl font-black" style={{ color: isDark ? '#F0ECE4' : '#1A1510' }}>
                {boss.name}
              </h2>
              <p className="text-xs" style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}>
                {boss.titleKey}
              </p>
            </div>
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{
                backgroundColor: `${boss.accentColor}15`,
                color: boss.accentColor,
                border: `1px solid ${boss.accentColor}30`,
              }}
            >
              {boss.typeKey}
            </span>
          </div>

          {/* Dungeon + Game */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs">
              <MapPin size={12} className="text-text-secondary/40" />
              <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {boss.dungeon}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <Gamepad2 size={12} className="text-text-secondary/40" />
              <span style={{ color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
                {boss.game}
              </span>
            </div>
          </div>

          {/* Stat Bars */}
          <div
            className="space-y-2 p-3 rounded-xl"
            style={{
              backgroundColor: isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)',
              border: `1px solid ${isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)'}`,
            }}
          >
            <h4
              className="text-[10px] font-bold uppercase tracking-widest mb-2"
              style={{ color: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.35)' }}
            >
              {language === 'es' ? 'Estadísticas' : 'Stats'}
            </h4>
            <DetailStatBar label="❤️" value={boss.hp} max={maxStat} color="#3E6B48" />
            <DetailStatBar label="⚔️" value={boss.atk} max={maxStat} color="#8B3A3A" />
            <DetailStatBar label="🛡️" value={boss.def} max={maxStat} color="#5B8A9E" />
            <DetailStatBar label="⚡" value={boss.spd} max={maxStat} color="#C6A15B" />
          </div>

          {/* Difficulty */}
          <div className="flex items-center justify-between pt-1 border-t border-dark-border">
            <span className="text-[10px] uppercase tracking-wider text-text-secondary/50">
              {language === 'es' ? 'Dificultad' : 'Difficulty'}
            </span>
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="w-2.5 h-2.5 rounded-sm transition-all"
                  style={{
                    backgroundColor: i < boss.difficulty ? boss.accentColor : 'rgba(255,255,255,0.1)',
                    boxShadow: i < boss.difficulty ? `0 0 6px ${boss.accentColor}44` : 'none',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <p
            className="text-sm leading-relaxed"
            style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.65)' }}
          >
            {boss.description}
          </p>

          {/* View all link */}
          <button
            onClick={() => {
              onClose();
              window.location.href = '/bosses';
            }}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all"
            style={{
              backgroundColor: `${boss.accentColor}12`,
              color: boss.accentColor,
              border: `1px solid ${boss.accentColor}22`,
            }}
          >
            {language === 'es' ? 'Ver todos los jefes →' : 'View All Bosses →'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Featured Card ──────────────────────────────── */

function FeaturedCard({
  character,
  language,
  onClick,
}: {
  character: CharacterData;
  language: 'en' | 'es';
  onClick: () => void;
}) {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';
  const raceColor = RACE_COLORS[character.race] || '#C6A15B';
  const description = language === 'es' ? character.descriptionEs : character.description;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.01 }}
      onClick={onClick}
      className="rounded-[32px] p-6 h-full overflow-hidden relative cursor-pointer"
      style={{
        background: isDark
          ? `linear-gradient(145deg, ${raceColor}15 0%, rgba(12,16,20,0.95) 50%, ${raceColor}08 100%)`
          : `linear-gradient(145deg, ${raceColor}10 0%, rgba(255,255,255,0.95) 50%, ${raceColor}05 100%)`,
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: `1px solid ${raceColor}22`,
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 rounded-[32px] pointer-events-none"
        style={{ boxShadow: `inset 0 0 80px ${raceColor}10` }}
      />

      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6">
        {/* Image */}
        <div className="w-32 h-32 sm:w-40 sm:h-40 flex-shrink-0 rounded-2xl overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${raceColor}20, transparent)`, border: `1px solid ${raceColor}30` }}>
          <img src={character.image} alt={character.name} className="w-full h-full object-contain p-2" />
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
            <span className="text-xs font-semibold tracking-widest uppercase text-text-secondary">
              {t('dashboard.featuredPokemon', language)}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
              style={{ backgroundColor: `${raceColor}22`, color: raceColor, border: `1px solid ${raceColor}35` }}>
              {character.race}
            </span>
          </div>
          <h2 className="text-2xl font-black text-text-primary">{character.name}</h2>
          <p className="text-xs text-text-secondary/60 mt-1 line-clamp-2">{description}</p>

          {/* Stat bars */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: '❤️', value: character.hp, color: '#3E6B48' },
              { label: '⚔️', value: character.atk, color: '#8B3A3A' },
              { label: '🛡️', value: character.def, color: '#5B8A9E' },
              { label: '⚡', value: character.spd, color: '#C6A15B' },
            ].map((stat) => (
              <div key={stat.label} className="flex items-center gap-2">
                <span className="text-sm w-6">{stat.label}</span>
                <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.value}%` }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                    style={{ backgroundColor: stat.color }}
                  />
                </div>
                <span className="text-xs font-mono text-text-secondary w-8 text-right">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Boss Card (mini) ────────────────────────────────── */

function BossMiniCard({
  boss,
  language,
  onClick,
}: {
  boss: Boss;
  language: 'en' | 'es';
  onClick: () => void;
}) {
  const maxDifficulty = 5;
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className="rounded-2xl p-4 cursor-pointer"
      style={{
        background: `linear-gradient(135deg, ${boss.accentColor}12, transparent)`,
        border: `1px solid ${boss.accentColor}22`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
          style={{ background: `${boss.accentColor}18`, border: `1px solid ${boss.accentColor}30` }}>
          <img src={boss.image} alt={boss.name} className="w-full h-full object-contain p-1" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-sm font-bold text-text-primary truncate">{boss.name}</h4>
          <p className="text-[10px] text-text-secondary/60 truncate">{boss.game}</p>
        </div>
        <div className="flex gap-0.5">
          {Array.from({ length: maxDifficulty }).map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-sm ${i < boss.difficulty ? '' : 'opacity-20'}`}
              style={{ backgroundColor: i < boss.difficulty ? boss.accentColor : '#666' }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Dashboard ──────────────────────────────────── */

export function DashboardPage() {
  const navigate = useNavigate();
  const { language } = useAppStore();

  // Pick 3 random characters + 3 random bosses (stable for session)
  const [featured, setFeatured] = useState<{ chars: CharacterData[]; bosses: Boss[] }>({ chars: [], bosses: [] });

  // Modal state
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterData | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);

  useEffect(() => {
    setFeatured({
      chars: pickRandom(CHARACTERS, 3),
      bosses: pickRandom(bosses, 3),
    });
  }, []);

  const featuredChar = featured.chars[0];
  const showcaseChars = featured.chars.slice(1);
  const showcaseBosses = featured.bosses;

  if (!featuredChar) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-[#C6A15B] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpiCards = [
    {
      label: t('dashboard.totalPokemon', language),
      value: 12,
      icon: Users,
      subtitle: t('dashboard.subtitleKanto', language),
    },
    {
      label: t('dashboard.totalTypes', language),
      value: 8,
      icon: Shield,
      subtitle: t('dashboard.subtitleTypes', language),
    },
    {
      label: t('dashboard.totalAbilities', language),
      value: 12,
      icon: Skull,
      subtitle: t('dashboard.subtitleAbilities', language),
    },
    {
      label: t('dashboard.fastest', language),
      value: 'Revali',
      icon: Zap,
      subtitle: `${t('rankings.topSpeed', language)}: 95`,
      onClick: () => {
        const found = CHARACTERS.find((c) => c.name === 'Revali');
        if (found) setSelectedCharacter(found);
      },
      imageUrl: '/characters/revali.png',
    },
    {
      label: t('dashboard.strongest', language),
      value: 'Ganondorf',
      icon: Swords,
      subtitle: `${t('rankings.topAttack', language)}: 95`,
      onClick: () => {
        const found = CHARACTERS.find((c) => c.name === 'Ganondorf');
        if (found) setSelectedCharacter(found);
      },
      imageUrl: '/characters/ganondorf.png',
    },
    {
      label: t('dashboard.toughest', language),
      value: 'Daruk',
      icon: Shield,
      subtitle: `${t('rankings.topDefense', language)}: 95`,
      onClick: () => {
        const found = CHARACTERS.find((c) => c.name === 'Daruk');
        if (found) setSelectedCharacter(found);
      },
      imageUrl: '/characters/daruk.png',
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <h1 className="text-2xl sm:text-3xl font-bold gradient-text">{t('dashboard.title', language)}</h1>
        <p className="text-xs sm:text-sm text-text-secondary">
          {t('dashboard.subtitle', language)}
        </p>
      </motion.div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <FeaturedCard
            character={featuredChar}
            language={language}
            onClick={() => setSelectedCharacter(featuredChar)}
          />
        </div>
        <div className="lg:col-span-1 space-y-3">
          {showcaseChars.map((c) => (
            <motion.div
              key={c.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setSelectedCharacter(c)}
              className="rounded-2xl p-4 cursor-pointer"
              style={{
                background: `linear-gradient(135deg, ${RACE_COLORS[c.race] || '#C6A15B'}10, transparent)`,
                border: `1px solid ${RACE_COLORS[c.race] || '#C6A15B'}18`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
                  style={{ background: `${RACE_COLORS[c.race] || '#C6A15B'}18` }}>
                  <img src={c.image} alt={c.name} className="w-full h-full object-contain p-1" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-text-primary">{c.name}</h4>
                  <p className="text-[10px] text-text-secondary/60">{language === 'es' ? c.descriptionEs : c.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {kpiCards.map((kpi, index) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <KPICard {...kpi} />
          </motion.div>
        ))}
      </div>

      {/* Bosses Showcase */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl sm:rounded-[32px] p-4 sm:p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-[#8B3A3A]" />
            <h2 className="text-base sm:text-lg font-semibold">{t('nav.bosses', language)}</h2>
          </div>
          <button onClick={() => navigate('/bosses')} className="text-xs text-[#C6A15B] font-medium">
            {t('dashboard.viewAll', language)} →
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {showcaseBosses.map((boss) => (
            <BossMiniCard
              key={boss.id}
              boss={boss}
              language={language}
              onClick={() => setSelectedBoss(boss)}
            />
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="rounded-2xl sm:rounded-[32px] p-4 sm:p-6"
        style={{
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">{t('dashboard.quickActions', language)}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: t('dashboard.viewStats', language), desc: t('dashboard.viewStatsDesc', language), path: '/characters' },
            { label: t('dashboard.compare', language), desc: t('dashboard.compareDesc', language), path: '/compare' },
            { label: t('dashboard.rankings', language), desc: t('dashboard.rankingsDesc', language), path: '/items' },
            { label: t('dashboard.insights', language), desc: t('dashboard.insightsDesc', language), path: '/lore' },
          ].map((btn) => (
            <motion.button
              key={btn.path}
              onClick={() => navigate(btn.path)}
              className="rounded-xl sm:rounded-2xl p-3 sm:p-4 text-left transition-all duration-200 hover:translate-y-[-4px]"
              style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.04)' }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-xs sm:text-sm font-medium text-text-primary">{btn.label}</span>
              <p className="text-[10px] sm:text-xs text-text-secondary mt-1">{btn.desc}</p>
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* ─── Detail Modals ─── */}
      <AnimatePresence>
        {selectedCharacter && (
          <CharacterDetailModal
            character={selectedCharacter}
            language={language}
            onClose={() => setSelectedCharacter(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedBoss && (
          <BossDetailModal
            boss={selectedBoss}
            language={language}
            onClose={() => setSelectedBoss(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
