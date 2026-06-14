import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Shield,
  Crosshair,
  RotateCcw,
  Anchor,
  Bomb,
  Music,
  Eye,
  Waves,
  Flame,
  Footprints,
  FlaskConical,
  Heart,
  Zap,
  Gem,
  Coins,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

// ─── Item data ───────────────────────────────────────────────────────────────

interface ItemData {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  descriptionEs: string;
  category: 'equipment' | 'tools' | 'containers';
  icon: React.ComponentType<{ size?: number; className?: string }>;
  rarity: 'common' | 'rare' | 'legendary';
  value?: string;
  image: string;
}

const ITEMS: ItemData[] = [
  // ── Equipment ────────────────────────────────────────────────────────────
  {
    id: 'master-sword',
    name: 'Master Sword',
    nameEs: 'Espada Maestra',
    description: "The Blade of Evil's Bane",
    descriptionEs: 'La Espada del Destierro del Mal',
    category: 'equipment',
    icon: Swords,
    rarity: 'legendary',
    image: '/items/master_sword.png',
  },
  {
    id: 'hylian-shield',
    name: 'Hylian Shield',
    nameEs: 'Escudo Hylian',
    description: 'Unbreakable defense',
    descriptionEs: 'Defensa inquebrantable',
    category: 'equipment',
    icon: Shield,
    rarity: 'legendary',
    image: '/items/hylian_shield.png',
  },
  {
    id: 'heros-bow',
    name: "Hero's Bow",
    nameEs: 'Arco del Héroe',
    description: 'Precision archery',
    descriptionEs: 'Arquería de precisión',
    category: 'equipment',
    icon: Crosshair,
    rarity: 'rare',
    image: '/items/heros_bow.png',
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    nameEs: 'Búmeran',
    description: 'Returns to sender',
    descriptionEs: 'Siempre regresa',
    category: 'equipment',
    icon: RotateCcw,
    rarity: 'common',
    image: '/items/boomerang.png',
  },
  {
    id: 'hookshot',
    name: 'Hookshot',
    nameEs: 'Gancho',
    description: 'Grappling device',
    descriptionEs: 'Dispositivo de agarre',
    category: 'equipment',
    icon: Anchor,
    rarity: 'rare',
    image: '/items/hookshot.png',
  },
  {
    id: 'bombs',
    name: 'Bombs',
    nameEs: 'Bombas',
    description: 'Explosive solutions',
    descriptionEs: 'Soluciones explosivas',
    category: 'equipment',
    icon: Bomb,
    rarity: 'common',
    image: '/items/bombs.png',
  },

  // ── Tools ─────────────────────────────────────────────────────────────────
  {
    id: 'ocarina',
    name: 'Ocarina of Time',
    nameEs: 'Ocarina del Tiempo',
    description: 'Manipulate time itself',
    descriptionEs: 'Manipula el tiempo mismo',
    category: 'tools',
    icon: Music,
    rarity: 'legendary',
    image: '/items/ocarina.png',
  },
  {
    id: 'lens-of-truth',
    name: 'Lens of Truth',
    nameEs: 'Lente de la Verdad',
    description: 'Reveal the invisible',
    descriptionEs: 'Revela lo invisible',
    category: 'tools',
    icon: Eye,
    rarity: 'rare',
    image: '/items/lens_of_truth.png',
  },
  {
    id: 'zora-tunic',
    name: 'Zora Tunic',
    nameEs: 'Túnica Zora',
    description: 'Breathe underwater',
    descriptionEs: 'Respira bajo el agua',
    category: 'tools',
    icon: Waves,
    rarity: 'rare',
    image: '/items/zora_tunic.png',
  },
  {
    id: 'goron-tunic',
    name: 'Goron Tunic',
    nameEs: 'Túnica Goron',
    description: 'Resist extreme heat',
    descriptionEs: 'Resiste calor extremo',
    category: 'tools',
    icon: Flame,
    rarity: 'rare',
    image: '/items/goron_tunic.png',
  },
  {
    id: 'iron-boots',
    name: 'Iron Boots',
    nameEs: 'Botas de Hierro',
    description: 'Sink to depths',
    descriptionEs: 'Húndete en las profundidades',
    category: 'tools',
    icon: Footprints,
    rarity: 'common',
    image: '/items/iron_boots.png',
  },
  {
    id: 'pegasus-boots',
    name: 'Pegasus Boots',
    nameEs: 'Botas Pegaso',
    description: 'Supernatural speed',
    descriptionEs: 'Velocidad sobrenatural',
    category: 'tools',
    icon: Footprints,
    rarity: 'rare',
    image: '/items/pegasus_boots.png',
  },

  // ── Containers ────────────────────────────────────────────────────────────
  {
    id: 'bottle',
    name: 'Bottle',
    nameEs: 'Botella',
    description: 'Hold potions and fairies',
    descriptionEs: 'Contiene pociones y hadas',
    category: 'containers',
    icon: FlaskConical,
    rarity: 'common',
    image: '/items/bottle.png',
  },
  {
    id: 'heart-container',
    name: 'Heart Container',
    nameEs: 'Contenedor de Corazón',
    description: 'Increase life force',
    descriptionEs: 'Aumenta la fuerza vital',
    category: 'containers',
    icon: Heart,
    rarity: 'legendary',
    image: '/items/heart_container.png',
  },
  {
    id: 'magic-jar',
    name: 'Magic Jar',
    nameEs: 'Jarra Mágica',
    description: 'Replenish magic power',
    descriptionEs: 'Repone poder mágico',
    category: 'containers',
    icon: Zap,
    rarity: 'rare',
    image: '/items/magic_jar.png',
  },
  {
    id: 'green-rupee',
    name: 'Green Rupee',
    nameEs: 'Rupia Verde',
    description: 'The currency of Hyrule — worth 1',
    descriptionEs: 'La moneda de Hyrule — valor 1',
    category: 'containers',
    icon: Gem,
    rarity: 'common',
    value: '1',
    image: '/items/green_rupee.png',
  },
  {
    id: 'blue-rupee',
    name: 'Blue Rupee',
    nameEs: 'Rupia Azul',
    description: 'The currency of Hyrule — worth 5',
    descriptionEs: 'La moneda de Hyrule — valor 5',
    category: 'containers',
    icon: Gem,
    rarity: 'common',
    value: '5',
    image: '/items/blue_rupee.png',
  },
  {
    id: 'red-rupee',
    name: 'Red Rupee',
    nameEs: 'Rupia Roja',
    description: 'The currency of Hyrule — worth 20',
    descriptionEs: 'La moneda de Hyrule — valor 20',
    category: 'containers',
    icon: Gem,
    rarity: 'rare',
    value: '20',
    image: '/items/red_rupee.png',
  },
  {
    id: 'silver-rupee',
    name: 'Silver Rupee',
    nameEs: 'Rupia Plateada',
    description: 'The currency of Hyrule — worth 100',
    descriptionEs: 'La moneda de Hyrule — valor 100',
    category: 'containers',
    icon: Coins,
    rarity: 'rare',
    value: '100',
    image: '/items/silver_rupee.png',
  },
  {
    id: 'gold-rupee',
    name: 'Gold Rupee',
    nameEs: 'Rupia Dorada',
    description: 'The currency of Hyrule — worth 300',
    descriptionEs: 'La moneda de Hyrule — valor 300',
    category: 'containers',
    icon: Coins,
    rarity: 'legendary',
    value: '300',
    image: '/items/gold_rupee.png',
  },
];

// ─── Category metadata ──────────────────────────────────────────────────────

interface CategoryMeta {
  key: 'equipment' | 'tools' | 'containers';
  labelEn: string;
  labelEs: string;
  accentClass: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'equipment',
    labelEn: 'Equipment',
    labelEs: 'Equipamiento',
    accentClass: 'border-l-zelda-gold',
    badgeBg: 'rgba(198, 161, 91, 0.15)',
    badgeText: '#E8D8B0',
    iconBg: 'rgba(198, 161, 91, 0.1)',
    iconColor: '#C6A15B',
    borderColor: 'rgba(198, 161, 91, 0.2)',
  },
  {
    key: 'tools',
    labelEn: 'Tools',
    labelEs: 'Herramientas',
    accentClass: 'border-l-zelda-green',
    badgeBg: 'rgba(62, 107, 72, 0.15)',
    badgeText: '#6BAF7A',
    iconBg: 'rgba(62, 107, 72, 0.1)',
    iconColor: '#3E6B48',
    borderColor: 'rgba(62, 107, 72, 0.2)',
  },
  {
    key: 'containers',
    labelEn: 'Containers',
    labelEs: 'Contenedores',
    accentClass: 'border-l-info',
    badgeBg: 'rgba(91, 138, 158, 0.15)',
    badgeText: '#7DB8CB',
    iconBg: 'rgba(91, 138, 158, 0.1)',
    iconColor: '#5B8A9E',
    borderColor: 'rgba(91, 138, 158, 0.2)',
  },
];

// ─── Rarity config ──────────────────────────────────────────────────────────

const RARITY_STYLES: Record<string, { label: string; labelEs: string; color: string; bg: string }> = {
  legendary: {
    label: 'Legendary',
    labelEs: 'Legendario',
    color: '#E8D8B0',
    bg: 'rgba(198, 161, 91, 0.2)',
  },
  rare: {
    label: 'Rare',
    labelEs: 'Raro',
    color: '#C6A15B',
    bg: 'rgba(198, 161, 91, 0.1)',
  },
  common: {
    label: 'Common',
    labelEs: 'Común',
    color: '#8B8A7E',
    bg: 'rgba(139, 138, 126, 0.15)',
  },
};

// ─── Component ──────────────────────────────────────────────────────────────

export function ItemsPage() {
  const { language } = useAppStore();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        items: ITEMS.filter((item) => item.category === cat.key),
      })),
    [],
  );

  return (
    <div className="space-y-6 sm:space-y-8 lg:space-y-10">
      {/* ── Header ──────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-1 sm:space-y-2"
      >
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold gradient-text">
            {t('items.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          {t('items.subtitle', language)}
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

      {/* ── Category sections ───────────────────────────────────────────── */}
      {grouped.map((category, catIndex) => (
        <motion.section
          key={category.key}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 + catIndex * 0.12, duration: 0.5 }}
          className="space-y-3 sm:space-y-4"
        >
          {/* Category header */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div
              className="w-1 h-5 sm:h-6 rounded-full"
              style={{ backgroundColor: category.iconColor }}
            />
            <h2 className="text-base sm:text-lg font-semibold text-text-primary">
              {language === 'es' ? category.labelEs : category.labelEn}
            </h2>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-bold"
              style={{
                backgroundColor: category.badgeBg,
                color: category.badgeText,
              }}
            >
              {category.items.length}
            </span>
          </div>

          {/* Items grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {category.items.map((item, index) => {
              const Icon = item.icon;
              const rarity = RARITY_STYLES[item.rarity];
              const isRupee = item.id.includes('rupee');
              const rupeeColor =
                item.id === 'green-rupee'
                  ? '#6BA84A'
                  : item.id === 'blue-rupee'
                    ? '#3B7DD8'
                    : item.id === 'red-rupee'
                      ? '#8B3A3A'
                      : item.id === 'silver-rupee'
                        ? '#A0A0A0'
                        : item.id === 'gold-rupee'
                          ? '#E8D8B0'
                          : undefined;

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 0.2 + catIndex * 0.12 + index * 0.05,
                    duration: 0.4,
                  }}
                  className="glass-card-hover p-3 sm:p-4 group"
                  style={{ borderLeft: `2px solid ${category.borderColor}` }}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    <div
                      className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: category.iconBg,
                        color: isRupee ? rupeeColor : category.iconColor,
                      }}
                    >
                      <Icon size={isRupee ? 22 : 20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                          {language === 'es' ? item.nameEs : item.name}
                        </h3>
                        {/* Rupee value badge */}
                        {item.value && (
                          <span
                            className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded"
                            style={{
                              backgroundColor: 'rgba(198, 161, 91, 0.1)',
                              color: rupeeColor || '#C6A15B',
                            }}
                          >
                            {item.value}
                          </span>
                        )}
                      </div>

                      {/* Item Image */}
                      <div className="mt-2 mb-2 flex justify-center">
                        <div
                          className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${category.iconBg}, transparent)`,
                            border: `1px solid ${category.borderColor}`,
                          }}
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {language === 'es' ? item.descriptionEs : item.description}
                      </p>

                      {/* Rarity badge */}
                      <span
                        className="inline-block mt-2 px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider"
                        style={{
                          backgroundColor: rarity.bg,
                          color: rarity.color,
                        }}
                      >
                        {language === 'es' ? rarity.labelEs : rarity.label}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.section>
      ))}

      {/* ── Footer Triforce ornament ────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
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
              ease: 'easeInOut',
            }}
          >
            ▲
          </motion.span>
        ))}
      </motion.div>

      {/* ── Stats summary ───────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl p-4 sm:p-5 text-center"
        style={{
          background: 'rgba(198, 161, 91, 0.03)',
          border: '1px solid rgba(198, 161, 91, 0.06)',
          backdropFilter: 'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
        }}
      >
        <p className="text-xs sm:text-sm text-text-secondary">
          {language === 'es'
            ? `${ITEMS.length} objetos icónicos • 3 categorías • Leyendas de Hyrule`
            : `${ITEMS.length} iconic items • 3 categories • Legends of Hyrule`}
        </p>
      </motion.div>
    </div>
  );
}
