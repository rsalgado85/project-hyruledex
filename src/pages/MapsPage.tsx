import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, X, ChevronLeft, ChevronRight, Gamepad2, Calendar, Maximize2 } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

/* ─── Map Data (newest → oldest) ─────────────────────── */

interface GameMap {
  id: number;
  game: string;
  gameEs: string;
  year: number;
  console: string;
  region: string;
  regionEs: string;
  images: string[];
  description: string;
  descriptionEs: string;
}

const MAPS: GameMap[] = [
  {
    id: 1,
    game: 'Tears of the Kingdom',
    gameEs: 'Tears of the Kingdom',
    year: 2023,
    console: 'Nintendo Switch',
    region: 'Hyrule (Sky, Surface & Depths)',
    regionEs: 'Hyrule (Cielo, Superficie y Subsuelo)',
    images: ['/maps/tears_of_the_kingdom.png', '/maps/tears_of_the_kingdom_v2.png'],
    description:
      'The most ambitious Hyrule ever created — three layers of exploration across the Sky Islands, the recovering Surface, and the sprawling Depths below.',
    descriptionEs:
      'El Hyrule más ambicioso jamás creado — tres capas de exploración entre las Islas Celestiales, la Superficie en recuperación y el vasto Subsuelo.',
  },
  {
    id: 2,
    game: 'Breath of the Wild',
    gameEs: 'Breath of the Wild',
    year: 2017,
    console: 'Nintendo Switch / Wii U',
    region: 'Hyrule (Post-Calamity)',
    regionEs: 'Hyrule (Post-Calamidad)',
    images: ['/maps/breath_of_the_wild.png', '/maps/breath_of_the_wild_v2.png'],
    description:
      'A vast open-world Hyrule recovering from the Great Calamity 100 years ago. From the Great Plateau to Hyrule Castle, every corner hides a secret.',
    descriptionEs:
      'Un vasto Hyrule de mundo abierto recuperándose de la Gran Calamidad hace 100 años. Desde la Gran Meseta hasta el Castillo de Hyrule, cada rincón esconde un secreto.',
  },
  {
    id: 3,
    game: 'Skyward Sword',
    gameEs: 'Skyward Sword',
    year: 2011,
    console: 'Wii / Switch',
    region: 'The Sky & The Surface',
    regionEs: 'El Cielo y la Superficie',
    images: ['/maps/skyward_sword.png'],
    description:
      'The earliest tale in the timeline — explore the floating island of Skyloft and the three untamed surface regions below.',
    descriptionEs:
      'La historia más temprana en la cronología — explora la isla flotante de Skyloft y las tres regiones salvajes de la superficie.',
  },
  {
    id: 4,
    game: 'Twilight Princess',
    gameEs: 'Twilight Princess',
    year: 2006,
    console: 'GameCube / Wii',
    region: 'Hyrule & Twilight Realm',
    regionEs: 'Hyrule y Reino del Crepúsculo',
    images: ['/maps/twilight_princess.png'],
    description:
      'A darker, more expansive Hyrule spanning from the pastoral Ordon Village to the snowy peaks of Snowpeak and the corrupted Twilight Realm beyond the mirror.',
    descriptionEs:
      'Un Hyrule más oscuro y extenso que abarca desde la pastoral Aldea Ordon hasta los picos nevados de Snowpeak y el corrupto Reino del Crepúsculo más allá del espejo.',
  },
  {
    id: 5,
    game: 'The Wind Waker',
    gameEs: 'The Wind Waker',
    year: 2002,
    console: 'GameCube',
    region: 'The Great Sea',
    regionEs: 'El Gran Mar',
    images: ['/maps/wind_waker.png', '/maps/wind_waker_v2.png'],
    description:
      'A flooded Hyrule — sail the Great Sea aboard the King of Red Lions, charting dozens of islands scattered across 49 quadrants of ocean.',
    descriptionEs:
      'Un Hyrule inundado — navega el Gran Mar a bordo del Rey de los Leones Rojos, cartografiando docenas de islas dispersas en 49 cuadrantes del océano.',
  },
  {
    id: 6,
    game: "Majora's Mask",
    gameEs: "Majora's Mask",
    year: 2000,
    console: 'Nintendo 64',
    region: 'Termina',
    regionEs: 'Termina',
    images: ['/maps/majoras_mask.png'],
    description:
      'A parallel world to Hyrule — Termina, centered around Clock Town and divided into four distinct regions: Woodfall, Snowhead, Great Bay, and Ikana Canyon.',
    descriptionEs:
      'Un mundo paralelo a Hyrule — Termina, centrada en Ciudad Reloj y dividida en cuatro regiones distintas: Cataratas Woods, Snowhead, Gran Bahía y Cañón Ikana.',
  },
  {
    id: 7,
    game: 'Ocarina of Time',
    gameEs: 'Ocarina of Time',
    year: 1998,
    console: 'Nintendo 64',
    region: 'Hyrule',
    regionEs: 'Hyrule',
    images: ['/maps/ocarina_of_time.png', '/maps/ocarina_of_time_v2.png'],
    description:
      'The legendary first 3D Hyrule — Hyrule Field surrounded by Death Mountain, Zora\'s Domain, Lake Hylia, Gerudo Valley, and the mystical Lost Woods.',
    descriptionEs:
      'El legendario primer Hyrule en 3D — La Llanura de Hyrule rodeada por la Montaña de la Muerte, el Dominio Zora, el Lago Hylia, el Valle Gerudo y el místico Bosque Perdido.',
  },
  {
    id: 8,
    game: 'A Link to the Past',
    gameEs: 'A Link to the Past',
    year: 1991,
    console: 'Super Nintendo',
    region: 'Hyrule (Light & Dark World)',
    regionEs: 'Hyrule (Mundo de Luz y Oscuridad)',
    images: ['/maps/a_link_to_the_past.png'],
    description:
      'The definitive 2D Hyrule — explore both the Light World and the dark mirror of the Dark World, connected through portals scattered across the land.',
    descriptionEs:
      'El Hyrule 2D definitivo — explora tanto el Mundo de la Luz como el oscuro reflejo del Mundo Oscuro, conectados a través de portales dispersos por la tierra.',
  },
  {
    id: 9,
    game: 'The Legend of Zelda',
    gameEs: 'The Legend of Zelda',
    year: 1986,
    console: 'NES',
    region: 'Hyrule (Original)',
    regionEs: 'Hyrule (Original)',
    images: ['/maps/legend_of_zelda.png', '/maps/legend_of_zelda_v2.png'],
    description:
      'Where it all began — the original 8-bit Hyrule, a 16×8 grid of forests, mountains, deserts, and graveyards hiding 9 labyrinthine dungeons.',
    descriptionEs:
      'Donde todo comenzó — el Hyrule original de 8 bits, una cuadrícula de 16×8 de bosques, montañas, desiertos y cementerios que esconden 9 mazmorras laberínticas.',
  },
];

/* ─── Theme-aware color helpers ──────────────────────── */

function useMapColors() {
  const { theme } = useAppStore();
  const isDark = theme === 'dark';

  return {
    isDark,
    cardBg: isDark
      ? 'linear-gradient(145deg, rgba(198,161,91,0.08) 0%, rgba(12,16,20,0.9) 50%, rgba(198,161,91,0.04) 100%)'
      : 'linear-gradient(145deg, rgba(198,161,91,0.06) 0%, rgba(255,255,255,0.95) 50%, rgba(198,161,91,0.03) 100%)',
    cardBorder: isDark ? '1px solid rgba(198,161,91,0.15)' : '1px solid rgba(180,140,60,0.2)',
    cardShadow: isDark ? 'none' : '0 2px 12px rgba(0,0,0,0.06)',
    badgeBg: isDark ? 'rgba(198,161,91,0.15)' : 'rgba(180,140,60,0.12)',
    badgeBorder: isDark ? '1px solid rgba(198,161,91,0.25)' : '1px solid rgba(180,140,60,0.3)',
    imageBg: isDark
      ? 'linear-gradient(135deg, rgba(198,161,91,0.1) 0%, rgba(198,161,91,0.03) 100%)'
      : 'linear-gradient(135deg, rgba(200,170,100,0.08) 0%, rgba(245,240,230,0.5) 100%)',
    imageBorder: isDark ? '1px solid rgba(198,161,91,0.15)' : '1px solid rgba(180,140,60,0.2)',
    textPrimary: isDark ? '#F0ECE4' : '#1A1510',
    textSecondary: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.45)',
    textMuted: isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.3)',
    headerIconBg: isDark ? 'rgba(198,161,91,0.12)' : 'rgba(180,140,60,0.08)',
    headerIconBorder: isDark ? '1px solid rgba(198,161,91,0.25)' : '1px solid rgba(180,140,60,0.2)',
    gold: '#C6A15B',
    goldLight: '#D4B56A',
    expandIndicator: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.25)',
  };
}

/* ─── Lightbox Modal ────────────────────────────────── */

interface LightboxProps {
  maps: GameMap[];
  mapIndex: number;
  imageIndex: number;
  language: 'en' | 'es';
  onClose: () => void;
  onNavigate: (mapIdx: number, imgIdx: number) => void;
}

function Lightbox({ maps, mapIndex, imageIndex, language, onClose, onNavigate }: LightboxProps) {
  const currentMap = maps[mapIndex];
  const currentImage = currentMap.images[imageIndex];
  const gameName = language === 'es' ? currentMap.gameEs : currentMap.game;
  const region = language === 'es' ? currentMap.regionEs : currentMap.region;

  const hasPrev = imageIndex > 0 || mapIndex > 0;
  const hasNext = imageIndex < currentMap.images.length - 1 || mapIndex < maps.length - 1;

  const goNext = useCallback(() => {
    if (imageIndex < currentMap.images.length - 1) {
      onNavigate(mapIndex, imageIndex + 1);
    } else if (mapIndex < maps.length - 1) {
      onNavigate(mapIndex + 1, 0);
    }
  }, [imageIndex, mapIndex, currentMap.images.length, maps.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (imageIndex > 0) {
      onNavigate(mapIndex, imageIndex - 1);
    } else if (mapIndex > 0) {
      const prevMap = maps[mapIndex - 1];
      onNavigate(mapIndex - 1, prevMap.images.length - 1);
    }
  }, [imageIndex, mapIndex, maps, onNavigate]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose, goNext, goPrev]);

  // Total variants for current game
  const variantLabel = currentMap.images.length > 1
    ? `${imageIndex + 1} / ${currentMap.images.length}`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-white/10"
        style={{ color: 'rgba(255,255,255,0.7)' }}
        aria-label="Close"
      >
        <X size={24} />
      </button>

      {/* Prev button */}
      {hasPrev && (
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className="absolute left-2 sm:left-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/15 hover:scale-110"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          aria-label="Previous map"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      {/* Next button */}
      {hasNext && (
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className="absolute right-2 sm:right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:bg-white/15 hover:scale-110"
          style={{ color: 'rgba(255,255,255,0.7)' }}
          aria-label="Next map"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {/* Image */}
      <motion.div
        key={`${mapIndex}-${imageIndex}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        className="max-w-[90vw] max-h-[85vh] flex flex-col items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={currentImage}
          alt={gameName}
          className="max-w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl"
          style={{ border: '1px solid rgba(198,161,91,0.2)' }}
        />
        {/* Info overlay */}
        <div className="text-center">
          <h3 className="text-white font-bold text-sm sm:text-base">{gameName}</h3>
          <p className="text-white/50 text-xs sm:text-sm">
            {currentMap.year} · {region}
            {variantLabel && <span className="ml-3 text-white/30">{variantLabel}</span>}
          </p>
        </div>
        {/* Variant dots */}
        {currentMap.images.length > 1 && (
          <div className="flex gap-1.5">
            {currentMap.images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); onNavigate(mapIndex, i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === imageIndex ? 'bg-[#C6A15B] scale-125' : 'bg-white/20 hover:bg-white/40'
                }`}
                aria-label={`Variant ${i + 1}`}
              />
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ─── Map Card ──────────────────────────────────────── */

function MapCard({
  gameMap,
  language,
  onImageClick,
}: {
  gameMap: GameMap;
  language: 'en' | 'es';
  onImageClick: (imgIdx: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [hoveredVariant, setHoveredVariant] = useState(0);
  const colors = useMapColors();

  const description = language === 'es' ? gameMap.descriptionEs : gameMap.description;
  const region = language === 'es' ? gameMap.regionEs : gameMap.region;
  const gameName = language === 'es' ? gameMap.gameEs : gameMap.game;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[380px] rounded-2xl overflow-hidden cursor-pointer group"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Card background */}
      <div
        className="p-4 sm:p-5 flex flex-col gap-3 h-full rounded-2xl"
        style={{
          background: colors.cardBg,
          border: colors.cardBorder,
          boxShadow: colors.cardShadow,
        }}
      >
        {/* Game year badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{
              backgroundColor: colors.badgeBg,
              color: colors.gold,
              border: colors.badgeBorder,
            }}
          >
            {gameMap.year}
          </span>
          <div className="flex items-center gap-1 text-[10px]" style={{ color: colors.textMuted }}>
            <Calendar size={10} />
            <span>{gameMap.console}</span>
          </div>
        </div>

        {/* Map Image with expand button */}
        <motion.div
          className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden group/img"
          style={{
            background: colors.imageBg,
            border: colors.imageBorder,
          }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={gameMap.images[hoveredVariant] || gameMap.images[0]}
            alt={gameMap.game}
            className="w-full h-full object-cover transition-opacity duration-300"
            loading="lazy"
          />
          {/* Dark overlay gradient — always dark since it's over the image */}
          <div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 40%)' }}
          />
          {/* Maximize button */}
          <button
            onClick={(e) => { e.stopPropagation(); onImageClick(hoveredVariant); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-all hover:scale-110"
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: 'rgba(255,255,255,0.8)' }}
            aria-label="View full map"
          >
            <Maximize2 size={14} />
          </button>
          {/* Game name overlay — always white over dark gradient */}
          <div className="absolute bottom-0 left-0 right-0 p-3 pointer-events-none">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">{gameName}</h3>
            <div className="flex items-center gap-1 text-[10px] text-white/70 mt-0.5">
              <Gamepad2 size={10} />
              <span>{region}</span>
            </div>
          </div>
        </motion.div>

        {/* Variant dots — show if multiple images */}
        {gameMap.images.length > 1 && (
          <div className="flex items-center justify-center gap-1">
            {gameMap.images.map((img, i) => (
              <button
                key={i}
                onMouseEnter={() => setHoveredVariant(i)}
                onClick={(e) => { e.stopPropagation(); onImageClick(i); }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === hoveredVariant ? 'bg-[#C6A15B] scale-125' : ''
                }`}
                style={{
                  backgroundColor: i === hoveredVariant ? '#C6A15B' : colors.isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.12)',
                }}
                aria-label={`Variant ${i + 1}`}
              />
            ))}
            {gameMap.images.length > 1 && (
              <span className="text-[9px] ml-1" style={{ color: colors.textMuted }}>
                {language === 'es' ? 'variantes' : 'variants'}
              </span>
            )}
          </div>
        )}

        {/* Expandable description */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : '2.5rem', opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="text-xs leading-relaxed" style={{ color: colors.isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.5)' }}>
            {description}
          </p>
        </motion.div>

        {/* Expand indicator */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-center text-[10px] transition-colors hover:opacity-80"
          style={{ color: colors.expandIndicator }}
        >
          {expanded ? '▲ ' + (language === 'es' ? 'Colapsar' : 'Collapse') : '▼ ' + (language === 'es' ? 'Más info' : 'More info')}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Game Map Section ─────────────────────────────── */

function GameMapSection({
  gameMap,
  language,
  onImageClick,
}: {
  gameMap: GameMap;
  language: 'en' | 'es';
  onImageClick: (imgIdx: number) => void;
}) {
  const colors = useMapColors();
  const gameName = language === 'es' ? gameMap.gameEs : gameMap.game;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="space-y-3"
    >
      {/* Game header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: colors.headerIconBg, border: colors.headerIconBorder }}
        >
          <Gamepad2 size={18} className="text-[#C6A15B]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold" style={{ color: colors.textPrimary }}>
            {gameName}
          </h3>
          <p className="text-[10px]" style={{ color: colors.textMuted }}>
            {gameMap.year} · {gameMap.console}
          </p>
        </div>
      </div>

      {/* Card centered */}
      <div className="flex justify-center">
        <MapCard gameMap={gameMap} language={language} onImageClick={onImageClick} />
      </div>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────── */

export function MapsPage() {
  const { language } = useAppStore();
  const colors = useMapColors();

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ mapIndex: number; imageIndex: number } | null>(null);

  const openLightbox = useCallback((mapIdx: number, imgIdx: number) => {
    setLightbox({ mapIndex: mapIdx, imageIndex: imgIdx });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const navigateLightbox = useCallback((mapIdx: number, imgIdx: number) => {
    setLightbox({ mapIndex: mapIdx, imageIndex: imgIdx });
  }, []);

  return (
    <div className="space-y-8 sm:space-y-10 lg:space-y-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <Map size={28} className="text-[#C6A15B] drop-shadow-[0_0_8px_rgba(198,161,91,0.3)]" />
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('maps.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm max-w-2xl" style={{ color: colors.isDark ? 'rgba(255,255,255,0.55)' : 'rgba(0,0,0,0.5)' }}>
          {t('maps.subtitle', language)}
        </p>
      </motion.div>

      {/* Maps gallery — grouped by game (newest → oldest) */}
      <div className="space-y-10">
        {MAPS.map((gameMap) => (
          <GameMapSection
            key={gameMap.id}
            gameMap={gameMap}
            language={language}
            onImageClick={(imgIdx) => openLightbox(gameMap.id - 1, imgIdx)}
          />
        ))}
      </div>

      {/* Lightbox modal */}
      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox
            maps={MAPS}
            mapIndex={lightbox.mapIndex}
            imageIndex={lightbox.imageIndex}
            language={language}
            onClose={closeLightbox}
            onNavigate={navigateLightbox}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
