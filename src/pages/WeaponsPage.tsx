import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Swords,
  Sword,
  Shield,
  Crosshair,
  Flame,
  Zap,
  Anchor,
  Gavel,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

// ─── Weapon data ─────────────────────────────────────────────────────────────

type WeaponCategory = 'Sword' | 'Bow' | 'Other';

interface WeaponData {
  id: string;
  name: string;
  nameEs: string;
  atk: number;
  type: string;
  typeEs: string;
  description: string;
  descriptionEs: string;
  category: WeaponCategory;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  image: string;
}

const WEAPONS: WeaponData[] = [
  // ── Swords (6) ──────────────────────────────────────────────────────────
  {
    id: 'master-sword',
    name: 'Master Sword',
    nameEs: 'Espada Maestra',
    atk: 60,
    type: 'Sacred Light',
    typeEs: 'Luz Sagrada',
    description: "The Blade of Evil's Bane, forged by the Goddess Hylia",
    descriptionEs: 'La Espada del Destierro del Mal, forjada por la Diosa Hylia',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/master_sword.png',
  },
  {
    id: 'biggoron-sword',
    name: "Biggoron's Sword",
    nameEs: 'Espada de Biggoron',
    atk: 50,
    type: 'Heavy Blade',
    typeEs: 'Hoja Pesada',
    description: "Giant's Knife forged by Biggoron",
    descriptionEs: 'Cuchillo Gigante forjado por Biggoron',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/biggoron_sword.png',
  },
  {
    id: 'fierce-deity-sword',
    name: 'Fierce Deity Sword',
    nameEs: 'Espada de la Deidad Feroz',
    atk: 70,
    type: 'Dark Power',
    typeEs: 'Poder Oscuro',
    description: 'Double-helix blade of the Fierce Deity',
    descriptionEs: 'Hoja de doble hélice de la Deidad Feroz',
    category: 'Sword',
    icon: Flame,
    image: '/weapons/fierce_deity_sword.png',
  },
  {
    id: 'goddess-sword',
    name: 'Goddess Sword',
    nameEs: 'Espada de la Diosa',
    atk: 30,
    type: 'Divine Steel',
    typeEs: 'Acero Divino',
    description: 'The sword that became the Master Sword',
    descriptionEs: 'La espada que se convirtió en la Espada Maestra',
    category: 'Sword',
    icon: Sword,
    image: '/weapons/goddess_sword.png',
  },
  {
    id: 'four-sword',
    name: 'Four Sword',
    nameEs: 'Cuatro Espadas',
    atk: 40,
    type: 'Wind Element',
    typeEs: 'Elemento Viento',
    description: 'Splits the wielder into four',
    descriptionEs: 'Divide al portador en cuatro',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/four_sword.png',
  },
  {
    id: 'royal-claymore',
    name: 'Royal Claymore',
    nameEs: 'Mandoble Real',
    atk: 52,
    type: 'Heavy Weapon',
    typeEs: 'Arma Pesada',
    description: 'Two-handed royal guard sword',
    descriptionEs: 'Espada de guardia real a dos manos',
    category: 'Sword',
    icon: Swords,
    image: '/weapons/royal_claymore.png',
  },

  // ── Bows (4) ─────────────────────────────────────────────────────────────
  {
    id: 'heros-bow',
    name: "Hero's Bow",
    nameEs: 'Arco del Héroe',
    atk: 30,
    type: 'Precision',
    typeEs: 'Precisión',
    description: 'Standard bow of the Hero',
    descriptionEs: 'Arco estándar del Héroe',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/heros_bow.png',
  },
  {
    id: 'great-eagle-bow',
    name: 'Great Eagle Bow',
    nameEs: 'Gran Arco del Águila',
    atk: 45,
    type: 'Rapid Fire',
    typeEs: 'Fuego Rápido',
    description: "Revali's champion bow, fires 3 arrows",
    descriptionEs: 'Arco del campeón Revali, dispara 3 flechas',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/great_eagle_bow.png',
  },
  {
    id: 'twilight-bow',
    name: 'Twilight Bow',
    nameEs: 'Arco del Crepúsculo',
    atk: 30,
    type: 'Light Arrows',
    typeEs: 'Flechas de Luz',
    description: 'Fires arrows of pure light',
    descriptionEs: 'Dispara flechas de luz pura',
    category: 'Bow',
    icon: Crosshair,
    image: '/weapons/twilight_bow.png',
  },
  {
    id: 'bow-of-light',
    name: 'Bow of Light',
    nameEs: 'Arco de Luz',
    atk: 100,
    type: 'Divine Light',
    typeEs: 'Luz Divina',
    description: "Zelda's gift in the final battle",
    descriptionEs: 'El regalo de Zelda en la batalla final',
    category: 'Bow',
    icon: Zap,
    image: '/weapons/bow_of_light.png',
  },

  // ── Other (4) ────────────────────────────────────────────────────────────
  {
    id: 'megaton-hammer',
    name: 'Megaton Hammer',
    nameEs: 'Martillo Megatón',
    atk: 50,
    type: 'Earth-shattering',
    typeEs: 'Rompe-tierras',
    description: 'Goron weapon, breaks boulders',
    descriptionEs: 'Arma Goron, rompe rocas',
    category: 'Other',
    icon: Gavel,
    image: '/weapons/megaton_hammer.png',
  },
  {
    id: 'ball-and-chain',
    name: 'Ball and Chain',
    nameEs: 'Bola y Cadena',
    atk: 45,
    type: 'Devastating',
    typeEs: 'Devastador',
    description: 'Twilight Princess heavy weapon',
    descriptionEs: 'Arma pesada de Twilight Princess',
    category: 'Other',
    icon: Shield,
    image: '/weapons/ball_and_chain.png',
  },
  {
    id: 'hookshot',
    name: 'Hookshot',
    nameEs: 'Gancho',
    atk: 10,
    type: 'Utility',
    typeEs: 'Utilidad',
    description: 'Grappling device, stuns enemies',
    descriptionEs: 'Dispositivo de agarre, aturde enemigos',
    category: 'Other',
    icon: Anchor,
    image: '/weapons/hookshot.png',
  },
  {
    id: 'boomerang',
    name: 'Boomerang',
    nameEs: 'Búmeran',
    atk: 10,
    type: 'Stun',
    typeEs: 'Aturdimiento',
    description: 'Returns to sender, stuns targets',
    descriptionEs: 'Siempre regresa, aturde objetivos',
    category: 'Other',
    icon: Zap,
    image: '/weapons/boomerang.png',
  },
];

// ─── Category metadata ──────────────────────────────────────────────────────

interface CategoryMeta {
  key: WeaponCategory;
  labelEn: string;
  labelEs: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  iconBg: string;
  iconColor: string;
  borderColor: string;
  gradientStart: string;
  gradientEnd: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    key: 'Sword',
    labelEn: 'Swords',
    labelEs: 'Espadas',
    accentColor: '#C6A15B',
    badgeBg: 'rgba(198, 161, 91, 0.15)',
    badgeText: '#E8D8B0',
    iconBg: 'rgba(198, 161, 91, 0.1)',
    iconColor: '#C6A15B',
    borderColor: 'rgba(198, 161, 91, 0.25)',
    gradientStart: '#E8D8B0',
    gradientEnd: '#C6A15B',
  },
  {
    key: 'Bow',
    labelEn: 'Bows',
    labelEs: 'Arcos',
    accentColor: '#3E6B48',
    badgeBg: 'rgba(62, 107, 72, 0.15)',
    badgeText: '#6BAF7A',
    iconBg: 'rgba(62, 107, 72, 0.1)',
    iconColor: '#3E6B48',
    borderColor: 'rgba(62, 107, 72, 0.25)',
    gradientStart: '#6BAF7A',
    gradientEnd: '#3E6B48',
  },
  {
    key: 'Other',
    labelEn: 'Other',
    labelEs: 'Otros',
    accentColor: '#5B8A9E',
    badgeBg: 'rgba(91, 138, 158, 0.15)',
    badgeText: '#7DB8CB',
    iconBg: 'rgba(91, 138, 158, 0.1)',
    iconColor: '#5B8A9E',
    borderColor: 'rgba(91, 138, 158, 0.25)',
    gradientStart: '#7DB8CB',
    gradientEnd: '#5B8A9E',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export function WeaponsPage() {
  const { language } = useAppStore();

  const grouped = useMemo(
    () =>
      CATEGORIES.map((cat) => ({
        ...cat,
        weapons: WEAPONS.filter((w) => w.category === cat.key),
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
            {t('weapons.title', language)}
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-text-secondary">
          {t('weapons.subtitle', language)}
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
              style={{ backgroundColor: category.accentColor }}
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
              {category.weapons.length}
            </span>
          </div>

          {/* Weapons grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {category.weapons.map((weapon, index) => {
              const Icon = weapon.icon;
              const atkPercent = Math.min((weapon.atk / 100) * 100, 100);

              return (
                <motion.div
                  key={weapon.id}
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
                        color: category.iconColor,
                      }}
                    >
                      <Icon size={20} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      {/* Name + type badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <h3 className="text-xs sm:text-sm font-semibold text-text-primary truncate">
                          {language === 'es' ? weapon.nameEs : weapon.name}
                        </h3>
                        <span
                          className="shrink-0 text-[8px] sm:text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded"
                          style={{
                            backgroundColor: category.badgeBg,
                            color: category.badgeText,
                          }}
                        >
                          {language === 'es' ? weapon.typeEs : weapon.type}
                        </span>
                      </div>

                      {/* Weapon Image */}
                      <div className="mt-2 mb-2 flex justify-center">
                        <div
                          className="relative w-full h-24 sm:h-28 rounded-lg overflow-hidden"
                          style={{
                            background: `linear-gradient(135deg, ${category.iconBg}, transparent)`,
                            border: `1px solid ${category.borderColor}`,
                          }}
                        >
                          <img
                            src={weapon.image}
                            alt={weapon.name}
                            className="w-full h-full object-contain p-2"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-[10px] sm:text-xs text-text-secondary mt-0.5 line-clamp-2">
                        {language === 'es'
                          ? weapon.descriptionEs
                          : weapon.description}
                      </p>

                      {/* ATK stat */}
                      <div className="mt-3 space-y-1">
                        <div className="flex items-center justify-between text-[10px] sm:text-xs">
                          <span
                            className="font-semibold"
                            style={{ color: category.accentColor }}
                          >
                            {t('weapons.attack', language)}
                          </span>
                          <span className="font-bold text-text-primary">
                            {weapon.atk}
                          </span>
                        </div>

                        {/* Damage progress bar */}
                        <div
                          className="h-1.5 sm:h-2 rounded-full overflow-hidden"
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <motion.div
                            className="h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${atkPercent}%` }}
                            transition={{
                              delay:
                                0.4 + catIndex * 0.12 + index * 0.05,
                              duration: 0.8,
                              ease: 'easeOut',
                            }}
                            style={{
                              background: `linear-gradient(90deg, ${category.gradientStart}, ${category.gradientEnd})`,
                              boxShadow: `0 0 6px ${category.accentColor}40`,
                            }}
                          />
                        </div>
                      </div>
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
            ? `${WEAPONS.length} armas legendarias · 3 categorías · Forjadas en Hyrule`
            : `${WEAPONS.length} legendary weapons · 3 categories · Forged in Hyrule`}
        </p>
      </motion.div>
    </div>
  );
}
