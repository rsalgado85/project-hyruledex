/**
 * LorePage - The Complete Zelda Timeline
 *
 * Displays the official Zelda timeline split across 3 branches after
 * Ocarina of Time. Features interactive accordion sections, color-coded
 * branches, and glassmorphism panels matching the dark Triforce aesthetic.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';
import {
  BookOpen,
  Clock,
  Sparkles,
  Crown,
  Sword,
  Shield,
  Star,
  Gem,
  Moon,
  Sun,
  ChevronDown,
  GitBranch,
  Zap,
  Cloud,
  Compass,
  Anchor,
  TrainTrack,
  Eye,
  Wind,
  Flame,
  Skull,
  Heart,
  Castle,
  Mountain,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────

interface TimelineEntry {
  id: string;
  eraKey: string;
  gameName: string;
  gameNameEs: string;
  description: string;
  descriptionEs: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  year?: string;
}

interface TimelineBranch {
  id: 'unified' | 'child' | 'adult' | 'downfall';
  labelKey: string;
  descKey: string;
  color: string;
  colorRgba: string;
  glowColor: string;
  borderColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  entries: TimelineEntry[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const UNIFIED_TIMELINE: TimelineEntry[] = [
  {
    id: 'sky-era',
    eraKey: 'lore.era.sky',
    gameName: 'Skyward Sword',
    gameNameEs: 'Skyward Sword',
    description: 'The beginning of all timelines. Goddess Hylia sends Skyloft into the heavens to protect humanity from the demon Demise. Link forges the Master Sword and establishes the eternal cycle of reincarnation.',
    descriptionEs: 'El comienzo de todas las líneas temporales. La Diosa Hylia eleva Skyloft a los cielos para proteger a la humanidad del demonio Demise. Link forja la Espada Maestra y establece el ciclo eterno de reencarnación.',
    icon: Cloud,
    year: 'Era of the Goddess Hylia',
  },
  {
    id: 'chaos-era',
    eraKey: 'lore.era.chaos',
    gameName: 'The Sacred Realm',
    gameNameEs: 'El Reino Sagrado',
    description: 'The Sacred Realm is sealed by the ancient sages, and the Triforce is hidden away to prevent its misuse. The kingdom of Hyrule is established.',
    descriptionEs: 'El Reino Sagrado es sellado por los antiguos sabios, y la Trifuerza es ocultada para prevenir su mal uso. El reino de Hyrule es establecido.',
    icon: Shield,
  },
  {
    id: 'hero-time-era',
    eraKey: 'lore.era.hero',
    gameName: 'Ocarina of Time',
    gameNameEs: 'Ocarina of Time',
    description: 'The Hero of Time draws the Master Sword from its pedestal and travels through time. After defeating Ganondorf, the timeline splits into three distinct branches depending on the outcome.',
    descriptionEs: 'El Héroe del Tiempo extrae la Espada Maestra de su pedestal y viaja a través del tiempo. Al derrotar a Ganondorf, la línea temporal se divide en tres ramas distintas según el desenlace.',
    icon: Clock,
    year: 'The Timeline Splits',
  },
];

const CHILD_TIMELINE: TimelineEntry[] = [
  {
    id: 'majoras-mask',
    eraKey: 'lore.era.majora',
    gameName: "Majora's Mask",
    gameNameEs: "Majora's Mask",
    description: 'Link, returned to his childhood, searches for Navi in the Lost Woods and falls into a parallel world called Termina. The Skull Kid, possessed by Majora\'s Mask, pulls the moon toward the earth. Link must relive three days to save Termina.',
    descriptionEs: 'Link, devuelto a su niñez, busca a Navi en el Bosque Perdido y cae en un mundo paralelo llamado Términa. El Skull Kid, poseído por la Máscara de Majora, atrae la luna hacia la tierra. Link debe revivir tres días para salvar Términa.',
    icon: Moon,
  },
  {
    id: 'twilight-princess',
    eraKey: 'lore.era.twilight',
    gameName: 'Twilight Princess',
    gameNameEs: 'Twilight Princess',
    description: 'Centuries later, Hyrule is invaded by the Twilight Realm. Link transforms into a wolf and is aided by Midna, the Twilight Princess. Together they confront Zant and Ganondorf to restore light to both worlds.',
    descriptionEs: 'Siglos después, Hyrule es invadida por el Reino del Crepúsculo. Link se transforma en lobo y es ayudado por Midna, la Princesa del Crepúsculo. Juntos enfrentan a Zant y Ganondorf para restaurar la luz en ambos mundos.',
    icon: Eye,
  },
  {
    id: 'four-swords',
    eraKey: 'lore.era.fours',
    gameName: 'Four Swords Adventures',
    gameNameEs: 'Four Swords Adventures',
    description: 'The wind mage Vaati escapes and kidnaps Princess Zelda. Link draws the Four Sword, splitting into four copies to defeat Vaati and seal Ganon once more.',
    descriptionEs: 'El mago del viento Vaati escapa y secuestra a la Princesa Zelda. Link desenfunda la Cuatro Espadas, dividiéndose en cuatro copias para derrotar a Vaati y sellar a Ganon una vez más.',
    icon: Wind,
  },
];

const ADULT_TIMELINE: TimelineEntry[] = [
  {
    id: 'wind-waker',
    eraKey: 'lore.era.flood',
    gameName: 'The Wind Waker',
    gameNameEs: 'The Wind Waker',
    description: 'Without a hero to stop him, Ganon returns and the Goddesses flood Hyrule. Centuries later, a young Link sails the Great Sea with the King of Red Lions, seeking to restore the legendary land beneath the waves.',
    descriptionEs: 'Sin un héroe que lo detenga, Ganon regresa y las Diosas inundan Hyrule. Siglos después, un joven Link navega el Gran Mar con el Rey de los Leones Rojos, buscando restaurar la tierra legendaria bajo las olas.',
    icon: Anchor,
  },
  {
    id: 'phantom-hourglass',
    eraKey: 'lore.era.phantom',
    gameName: 'Phantom Hourglass',
    gameNameEs: 'Phantom Hourglass',
    description: 'Link and Tetra set sail to find new lands. They encounter the ghost ship, and Link enters the World of the Ocean King. With the help of Captain Linebeck, he solves puzzles across the sea to rescue Tetra.',
    descriptionEs: 'Link y Tetra zarpan en busca de nuevas tierras. Encuentran el barco fantasma, y Link entra al Mundo del Rey del Océano. Con la ayuda del Capitán Linebeck, resuelve acertijos a través del mar para rescatar a Tetra.',
    icon: Compass,
  },
  {
    id: 'spirit-tracks',
    eraKey: 'lore.era.spirit',
    gameName: 'Spirit Tracks',
    gameNameEs: 'Spirit Tracks',
    description: 'In a new land founded by Tetra, Link works as an engineer driving trains across New Hyrule. The demon Malladus threatens the land, and Link teams up with the spirit of Zelda to restore the Spirit Tracks and save the kingdom.',
    descriptionEs: 'En una nueva tierra fundada por Tetra, Link trabaja como ingeniero conduciendo trenes a través del Nuevo Hyrule. El demonio Malladus amenaza la tierra, y Link se une al espíritu de Zelda para restaurar las Vías Espirituales y salvar el reino.',
    icon: TrainTrack,
  },
];

const DOWNFALL_TIMELINE: TimelineEntry[] = [
  {
    id: 'link-to-the-past',
    eraKey: 'lore.era.alttp',
    gameName: 'A Link to the Past',
    gameNameEs: 'A Link to the Past',
    description: 'The Hero of Time is defeated by Ganon. The Sacred Realm becomes the Dark World. Generations later, a new Link awakens the Seven Sages, wields the Master Sword, and confronts Ganon in the heart of the Dark World.',
    descriptionEs: 'El Héroe del Tiempo es derrotado por Ganon. El Reino Sagrado se convierte en el Mundo Oscuro. Generaciones después, un nuevo Link despierta a los Siete Sabios, empuña la Espada Maestra y enfrenta a Ganon en el corazón del Mundo Oscuro.',
    icon: Crown,
  },
  {
    id: 'links-awakening',
    eraKey: 'lore.era.awakening',
    gameName: "Link's Awakening",
    gameNameEs: "Link's Awakening",
    description: 'After defeating Ganon, Link is shipwrecked on Koholint Island. He must gather the eight instruments of the Sirens to awaken the Wind Fish and escape the dream. The island and all its inhabitants are revealed to be a dream that vanishes upon awakening.',
    descriptionEs: 'Tras derrotar a Ganon, Link naufraga en la Isla Koholint. Debe reunir los ocho instrumentos de las Sirenas para despertar al Pez del Viento y escapar del sueño. La isla y todos sus habitantes se revelan como un sueño que desaparece al despertar.',
    icon: Wind,
  },
  {
    id: 'oracle-games',
    eraKey: 'lore.era.oracle',
    gameName: 'Oracle of Ages & Seasons',
    gameNameEs: 'Oracle of Ages & Seasons',
    description: 'Link is sent by the Triforce to foreign lands: Holodrum, where the seasons are disrupted by General Onox, and Labrynna, where time is twisted by the sorceress Veran. Twinrova plots to revive Ganon through the Flame of Despair.',
    descriptionEs: 'Link es enviado por la Trifuerza a tierras extranjeras: Holodrum, donde las estaciones son alteradas por el General Onox, y Labrynna, donde el tiempo es distorsionado por la hechicera Veran. Twinrova conspira para revivir a Ganon mediante la Llama de la Desesperación.',
    icon: Sun,
  },
  {
    id: 'zelda-nes',
    eraKey: 'lore.era.nes',
    gameName: 'The Legend of Zelda',
    gameNameEs: 'The Legend of Zelda',
    description: 'The original quest. Ganon has stolen the Triforce of Power and captured Princess Zelda. She splits the Triforce of Wisdom into eight pieces. A young hero named Link must gather them across a devastated Hyrule and defeat Ganon in Death Mountain.',
    descriptionEs: 'La búsqueda original. Ganon ha robado la Trifuerza del Poder y capturado a la Princesa Zelda. Ella divide la Trifuerza de la Sabiduría en ocho fragmentos. Un joven héroe llamado Link debe reunirlos a través de un Hyrule devastado y derrotar a Ganon en la Montaña de la Muerte.',
    icon: Castle,
  },
  {
    id: 'adventure-of-link',
    eraKey: 'lore.era.aol',
    gameName: 'The Adventure of Link',
    gameNameEs: 'The Adventure of Link',
    description: 'Link must awaken the sleeping Princess Zelda, cursed by a wizard\'s spell. This side-scrolling RPG adventure spans a vast Hyrule, with Link learning magic, gaining experience, and confronting his own shadow — Dark Link.',
    descriptionEs: 'Link debe despertar a la Princesa Zelda durmiente, maldecida por un hechizo de mago. Esta aventura RPG de desplazamiento lateral abarca un vasto Hyrule, donde Link aprende magia, gana experiencia y enfrenta a su propia sombra — Dark Link.',
    icon: Shield,
  },
  {
    id: 'link-between-worlds',
    eraKey: 'lore.era.lbw',
    gameName: 'A Link Between Worlds',
    gameNameEs: 'A Link Between Worlds',
    description: 'A new villain, Yuga, captures the Seven Sages and merges with Ganon. Link gains the ability to become a painting on walls, traveling between Hyrule and its dark counterpart, Lorule. With the help of Ravio, he must save both worlds.',
    descriptionEs: 'Un nuevo villano, Yuga, captura a los Siete Sabios y se fusiona con Ganon. Link obtiene la habilidad de convertirse en pintura en las paredes, viajando entre Hyrule y su contraparte oscura, Lorule. Con la ayuda de Ravio, debe salvar ambos mundos.',
    icon: Zap,
  },
  {
    id: 'tri-force-heroes',
    eraKey: 'lore.era.triforceheroes',
    gameName: 'Tri Force Heroes',
    gameNameEs: 'Tri Force Heroes',
    description: 'Three Links must work together in the kingdom of Hytopia to save Princess Styla from a cursed jumpsuit. They venture into the Drablands, stacking on each other and solving cooperative puzzles.',
    descriptionEs: 'Tres Links deben trabajar juntos en el reino de Hytopia para salvar a la Princesa Styla de un atuendo maldito. Se aventuran en las Tierras Sombrías, apilándose unos sobre otros y resolviendo acertijos cooperativos.',
    icon: Star,
  },
  {
    id: 'breath-of-the-wild',
    eraKey: 'lore.era.botw',
    gameName: 'Breath of the Wild',
    gameNameEs: 'Breath of the Wild',
    description: 'Over 10,000 years later, Calamity Ganon returns. The Champions and the Divine Beasts are corrupted. Link awakens from a 100-year slumber to reclaim the Master Sword, free the Divine Beasts, and defeat Calamity Ganon in a ruined Hyrule.',
    descriptionEs: 'Más de 10,000 años después, la Gran Calamidad Ganon regresa. Los Campeones y las Bestias Divinas son corrompidos. Link despierta de un letargo de 100 años para reclamar la Espada Maestra, liberar las Bestias Divinas y derrotar a la Gran Calamidad en un Hyrule en ruinas.',
    icon: Mountain,
  },
  {
    id: 'tears-of-the-kingdom',
    eraKey: 'lore.era.totk',
    gameName: 'Tears of the Kingdom',
    gameNameEs: 'Tears of the Kingdom',
    description: 'The Upheaval reveals ancient Zonai ruins in the sky and the Depths below. Ganondorf, sealed beneath Hyrule Castle for millennia by Rauru, breaks free. Link must recover his strength, explore the skies and depths, and wield the power of the Zonai to defeat the Demon King.',
    descriptionEs: 'El Cataclismo revela antiguas ruinas Zonai en el cielo y las Profundidades bajo tierra. Ganondorf, sellado bajo el Castillo de Hyrule por milenios por Rauru, se libera. Link debe recuperar su fuerza, explorar los cielos y las profundidades, y empuñar el poder de los Zonai para derrotar al Rey Demonio.',
    icon: Skull,
  },
];

// ─── Branch definitions ──────────────────────────────────────────────────────

const BRANCHES: TimelineBranch[] = [
  {
    id: 'unified',
    labelKey: 'lore.unifiedTimeline',
    descKey: 'lore.unifiedDesc',
    color: '#C6A15B',
    colorRgba: 'rgba(198, 161, 91, 0.08)',
    glowColor: 'rgba(198, 161, 91, 0.5)',
    borderColor: 'rgba(198, 161, 91, 0.3)',
    badgeBg: 'rgba(198, 161, 91, 0.15)',
    badgeText: '#E8D8B0',
    iconBg: 'rgba(198, 161, 91, 0.12)',
    entries: UNIFIED_TIMELINE,
  },
  {
    id: 'child',
    labelKey: 'lore.childTimeline',
    descKey: 'lore.childDesc',
    color: '#3E6B48',
    colorRgba: 'rgba(62, 107, 72, 0.08)',
    glowColor: 'rgba(62, 107, 72, 0.5)',
    borderColor: 'rgba(62, 107, 72, 0.3)',
    badgeBg: 'rgba(62, 107, 72, 0.15)',
    badgeText: '#6BAF7A',
    iconBg: 'rgba(62, 107, 72, 0.12)',
    entries: CHILD_TIMELINE,
  },
  {
    id: 'adult',
    labelKey: 'lore.adultTimeline',
    descKey: 'lore.adultDesc',
    color: '#5B8A9E',
    colorRgba: 'rgba(91, 138, 158, 0.08)',
    glowColor: 'rgba(91, 138, 158, 0.5)',
    borderColor: 'rgba(91, 138, 158, 0.3)',
    badgeBg: 'rgba(91, 138, 158, 0.15)',
    badgeText: '#7DB8CB',
    iconBg: 'rgba(91, 138, 158, 0.12)',
    entries: ADULT_TIMELINE,
  },
  {
    id: 'downfall',
    labelKey: 'lore.downfallTimeline',
    descKey: 'lore.downfallDesc',
    color: '#8B3A3A',
    colorRgba: 'rgba(139, 58, 58, 0.08)',
    glowColor: 'rgba(139, 58, 58, 0.5)',
    borderColor: 'rgba(139, 58, 58, 0.3)',
    badgeBg: 'rgba(139, 58, 58, 0.15)',
    badgeText: '#D47777',
    iconBg: 'rgba(139, 58, 58, 0.12)',
    entries: DOWNFALL_TIMELINE,
  },
];

// ─── Component ───────────────────────────────────────────────────────────────

export function LorePage() {
  const { theme, language } = useAppStore();
  const isDark = theme === 'dark';
  const [expandedBranch, setExpandedBranch] = useState<string>('unified');
  const [expandedEntries, setExpandedEntries] = useState<Set<string>>(
    new Set(['sky-era']),
  );

  const toggleBranch = (branchId: string) => {
    setExpandedBranch(expandedBranch === branchId ? '' : branchId);
  };

  const toggleEntry = (entryId: string) => {
    setExpandedEntries((prev) => {
      const next = new Set(prev);
      if (next.has(entryId)) {
        next.delete(entryId);
      } else {
        next.add(entryId);
      }
      return next;
    });
  };

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <BookOpen
            size={28}
            className="text-zelda-gold hidden sm:block"
          />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('lore.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          {t('lore.subtitle', language)}
        </p>
      </motion.div>

      {/* ── Decorative Triforce divider ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="h-px w-full"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(198, 161, 91, 0.4), rgba(62, 107, 72, 0.3), rgba(198, 161, 91, 0.4), transparent)',
        }}
      />

      {/* ── Branch split diagram ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card p-4 sm:p-6 text-center space-y-4"
      >
        <div className="flex items-center justify-center gap-2">
          <GitBranch size={20} style={{ color: '#C6A15B' }} />
          <h2 className="text-base sm:text-lg font-semibold" style={{ color: '#C6A15B' }}>
            {t('lore.branchPoint', language)}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary max-w-xl mx-auto leading-relaxed">
          {t('lore.branchDesc', language)}
        </p>

        {/* Three-branch Triforce diagram */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 pt-2">
          {/* Unified (top) */}
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center"
              style={{
                background: `radial-gradient(circle, rgba(198,161,91,0.2), transparent)`,
                border: '2px solid rgba(198,161,91,0.4)',
              }}
            >
              <Crown size={32} style={{ color: '#C6A15B' }} />
            </div>
            <span className="text-[10px] sm:text-xs font-semibold" style={{ color: '#C6A15B' }}>
              {t('lore.unified', language)}
            </span>
          </div>

          <span className="text-text-secondary hidden sm:block">→</span>
          <span className="text-text-secondary sm:hidden">↓</span>

          {/* Three branches */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            {[
              { label: t('lore.child', language), color: '#3E6B48' },
              { label: t('lore.adult', language), color: '#5B8A9E' },
              { label: t('lore.downfall', language), color: '#8B3A3A' },
            ].map((b) => (
              <div key={b.label} className="flex flex-col items-center gap-1.5">
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${b.color}22, transparent)`,
                    border: `2px solid ${b.color}55`,
                  }}
                >
                  <GitBranch size={20} style={{ color: b.color }} />
                </div>
                <span
                  className="text-[9px] sm:text-[10px] font-semibold text-center leading-tight max-w-[80px]"
                  style={{ color: b.color }}
                >
                  {b.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* ── Timeline branches ───────────────────────────────────────────── */}
      <div className="space-y-4 sm:space-y-6">
        {BRANCHES.map((branch, branchIndex) => {
          const isExpanded = expandedBranch === branch.id;

          return (
            <motion.section
              key={branch.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + branchIndex * 0.1, duration: 0.5 }}
            >
              {/* Branch header — clickable accordion */}
              <motion.button
                onClick={() => toggleBranch(branch.id)}
                className="w-full glass-card p-4 sm:p-5 flex items-center gap-3 sm:gap-4 text-left group"
                style={{
                  borderLeft: `3px solid ${branch.color}`,
                  borderColor: isExpanded
                    ? branch.color
                    : isDark
                      ? 'rgba(255,255,255,0.06)'
                      : 'rgba(0,0,0,0.06)',
                }}
                whileHover={{ scale: 1.005 }}
              >
                {/* Branch indicator */}
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor: branch.iconBg,
                    color: branch.color,
                  }}
                >
                  <GitBranch size={22} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-bold" style={{ color: branch.color }}>
                      {t(branch.labelKey as any, language)}
                    </h2>
                    <span
                      className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold"
                      style={{
                        backgroundColor: branch.badgeBg,
                        color: branch.badgeText,
                      }}
                    >
                      {branch.entries.length} {language === 'es' ? 'juegos' : 'games'}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 line-clamp-1">
                    {t(branch.descKey as any, language)}
                  </p>
                </div>

                {/* Chevron */}
                <motion.div
                  animate={{ rotate: isExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex-shrink-0 text-text-secondary"
                >
                  <ChevronDown size={20} />
                </motion.div>
              </motion.button>

              {/* Branch entries */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-2">
                      {branch.entries.map((entry, entryIndex) => {
                        const Icon = entry.icon;
                        const isEntryExpanded = expandedEntries.has(entry.id);

                        return (
                          <motion.div
                            key={entry.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: entryIndex * 0.04,
                              duration: 0.3,
                            }}
                            className="ml-3 sm:ml-6 relative"
                          >
                            {/* Connecting line */}
                            {entryIndex < branch.entries.length - 1 && (
                              <div
                                className="absolute left-[17px] sm:left-[19px] top-10 bottom-0 w-0.5"
                                style={{
                                  backgroundColor: `${branch.color}33`,
                                }}
                              />
                            )}

                            {/* Entry card */}
                            <div
                              className="glass-card-hover p-3 sm:p-4 cursor-pointer group"
                              style={{
                                borderLeft: `2px solid ${isEntryExpanded ? branch.color : 'transparent'}`,
                                backgroundColor: isEntryExpanded
                                  ? branch.colorRgba
                                  : isDark
                                    ? 'rgba(255,255,255,0.02)'
                                    : 'rgba(255,255,255,0.7)',
                              }}
                              onClick={() => toggleEntry(entry.id)}
                            >
                              <div className="flex items-start gap-3 sm:gap-4">
                                {/* Timeline dot */}
                                <div
                                  className="flex-shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center"
                                  style={{
                                    backgroundColor: branch.iconBg,
                                    color: branch.color,
                                    border: `2px solid ${branch.color}44`,
                                  }}
                                >
                                  <Icon size={16} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3 className="text-xs sm:text-sm font-semibold text-text-primary">
                                      {language === 'es'
                                        ? entry.gameNameEs
                                        : entry.gameName}
                                    </h3>
                                    <span
                                      className="text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded"
                                      style={{
                                        backgroundColor: branch.badgeBg,
                                        color: branch.badgeText,
                                      }}
                                    >
                                      {t(entry.eraKey as any, language)}
                                    </span>
                                  </div>

                                  {/* Entry year / subtitle */}
                                  {entry.year && (
                                    <p
                                      className="text-[10px] sm:text-xs mt-0.5"
                                      style={{ color: branch.color }}
                                    >
                                      {entry.year}
                                    </p>
                                  )}

                                  {/* Expanded description */}
                                  <AnimatePresence>
                                    {isEntryExpanded && (
                                      <motion.p
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="text-[10px] sm:text-xs text-text-secondary mt-2 leading-relaxed overflow-hidden"
                                      >
                                        {language === 'es'
                                          ? entry.descriptionEs
                                          : entry.description}
                                      </motion.p>
                                    )}
                                  </AnimatePresence>
                                </div>

                                {/* Expand indicator */}
                                <motion.div
                                  animate={{ rotate: isEntryExpanded ? 180 : 0 }}
                                  transition={{ duration: 0.3 }}
                                  className="flex-shrink-0 mt-1"
                                  style={{ color: branch.color, opacity: 0.5 }}
                                >
                                  <ChevronDown size={14} />
                                </motion.div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.section>
          );
        })}
      </div>

      {/* ── Footer Triforce ornament ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
        className="flex items-center justify-center gap-4 sm:gap-6 py-4"
      >
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            className="text-xl sm:text-2xl select-none"
            style={{ color: 'rgba(198, 161, 91, 0.3)' }}
            animate={{
              opacity: [0.2, 0.5, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 0.6,
            }}
          >
            ▲
          </motion.span>
        ))}
      </motion.div>

      {/* ── Bottom lore reference ───────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-center text-[10px] sm:text-xs"
        style={{ color: isDark ? 'rgba(255,255,255,0.20)' : 'rgba(0,0,0,0.20)' }}
      >
        {language === 'es'
          ? 'Basado en la cronología oficial de Hyrule Historia. The Legend of Zelda es una marca registrada de Nintendo.'
          : 'Based on the official Hyrule Historia timeline. The Legend of Zelda is a trademark of Nintendo.'}
      </motion.p>
    </div>
  );
}
