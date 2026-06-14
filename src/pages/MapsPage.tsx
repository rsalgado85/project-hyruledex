import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Map, ChevronLeft, ChevronRight, Gamepad2, Calendar } from 'lucide-react';
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
  image: string;
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
    image: '/maps/tears_of_the_kingdom.png',
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
    image: '/maps/breath_of_the_wild.png',
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
    image: '/maps/skyward_sword.png',
    description:
      'The earliest tale in the timeline — explore the floating island of Skyloft and the three untamed surface regions below: Faron Woods, Eldin Volcano, and Lanayru Desert.',
    descriptionEs:
      'La historia más temprana en la cronología — explora la isla flotante de Skyloft y las tres regiones salvajes de la superficie: Bosque de Farone, Volcán Eldin y Desierto de Lanayru.',
  },
  {
    id: 4,
    game: 'Twilight Princess',
    gameEs: 'Twilight Princess',
    year: 2006,
    console: 'GameCube / Wii',
    region: 'Hyrule & Twilight Realm',
    regionEs: 'Hyrule y Reino del Crepúsculo',
    image: '/maps/twilight_princess.png',
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
    image: '/maps/wind_waker.png',
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
    image: '/maps/majoras_mask.png',
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
    image: '/maps/ocarina_of_time.png',
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
    image: '/maps/a_link_to_the_past.png',
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
    image: '/maps/legend_of_zelda.png',
    description:
      'Where it all began — the original 8-bit Hyrule, a 16×8 grid of forests, mountains, deserts, and graveyards hiding 9 labyrinthine dungeons.',
    descriptionEs:
      'Donde todo comenzó — el Hyrule original de 8 bits, una cuadrícula de 16×8 de bosques, montañas, desiertos y cementerios que esconden 9 mazmorras laberínticas.',
  },
];

/* ─── Sub-components ──────────────────────────────────── */

function MapCard({ gameMap, language }: { gameMap: GameMap; language: 'en' | 'es' }) {
  const [expanded, setExpanded] = useState(false);

  const description = language === 'es' ? gameMap.descriptionEs : gameMap.description;
  const region = language === 'es' ? gameMap.regionEs : gameMap.region;
  const gameName = language === 'es' ? gameMap.gameEs : gameMap.game;

  return (
    <motion.div
      className="relative flex-shrink-0 w-[280px] sm:w-[340px] lg:w-[380px] rounded-2xl overflow-hidden cursor-pointer group"
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={() => setExpanded(!expanded)}
    >
      {/* Card background */}
      <div
        className="glass-card-hover p-4 sm:p-5 flex flex-col gap-3 h-full"
        style={{
          background: 'linear-gradient(145deg, rgba(198,161,91,0.08) 0%, rgba(12,16,20,0.9) 50%, rgba(198,161,91,0.04) 100%)',
          border: '1px solid rgba(198,161,91,0.15)',
        }}
      >
        {/* Game year badge */}
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
            style={{ backgroundColor: 'rgba(198,161,91,0.15)', color: '#C6A15B', border: '1px solid rgba(198,161,91,0.25)' }}
          >
            {gameMap.year}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-text-secondary/50">
            <Calendar size={10} />
            <span>{gameMap.console}</span>
          </div>
        </div>

        {/* Map Image */}
        <motion.div
          className="relative w-full h-44 sm:h-52 rounded-xl overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(198,161,91,0.1) 0%, rgba(198,161,91,0.03) 100%)',
            border: '1px solid rgba(198,161,91,0.15)',
          }}
          whileHover={{ scale: 1.03 }}
          transition={{ duration: 0.3 }}
        >
          <img
            src={gameMap.image}
            alt={gameMap.game}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-xl"
            style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)' }}
          />
          {/* Game name overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <h3 className="text-sm font-bold text-white drop-shadow-lg">{gameName}</h3>
            <div className="flex items-center gap-1 text-[10px] text-white/70 mt-0.5">
              <Gamepad2 size={10} />
              <span>{region}</span>
            </div>
          </div>
        </motion.div>

        {/* Expandable description */}
        <motion.div
          initial={false}
          animate={{ height: expanded ? 'auto' : '2.5rem', opacity: 1 }}
          transition={{ duration: 0.35, ease: 'easeInOut' }}
          className="overflow-hidden"
        >
          <p className="text-xs text-text-secondary/60 leading-relaxed">
            {description}
          </p>
        </motion.div>

        {/* Expand indicator */}
        <div className="text-center text-[10px] text-text-secondary/40">
          {expanded ? '▲ ' + (language === 'es' ? 'Colapsar' : 'Collapse') : '▼ ' + (language === 'es' ? 'Más info' : 'More info')}
        </div>
      </div>
    </motion.div>
  );
}

function GameMapCarousel({ gameMap, language }: { gameMap: GameMap; language: 'en' | 'es' }) {
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
          style={{ backgroundColor: 'rgba(198,161,91,0.12)', border: '1px solid rgba(198,161,91,0.25)' }}
        >
          <Gamepad2 size={18} className="text-[#C6A15B]" />
        </div>
        <div>
          <h3 className="text-base sm:text-lg font-bold text-text-primary">{gameName}</h3>
          <p className="text-[10px] text-text-secondary/50">
            {gameMap.year} · {gameMap.console}
          </p>
        </div>
      </div>

      {/* Horizontal scroll with single card centered */}
      <div className="flex justify-center">
        <MapCard gameMap={gameMap} language={language} />
      </div>
    </motion.div>
  );
}

/* ─── Main Component ──────────────────────────────────── */

export function MapsPage() {
  const { language } = useAppStore();

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
        <p className="text-xs sm:text-sm text-text-secondary max-w-2xl">
          {t('maps.subtitle', language)}
        </p>
      </motion.div>

      {/* Maps gallery — grouped by game (newest → oldest) */}
      <div className="space-y-10">
        {MAPS.map((gameMap) => (
          <GameMapCarousel key={gameMap.id} gameMap={gameMap} language={language} />
        ))}
      </div>
    </div>
  );
}
