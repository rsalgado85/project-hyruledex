/**
 * Top Abilities Card - Shows the abilities for the featured character
 * 
 * Displays the abilities of the featured character from the Zelda API.
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCharacter } from '@/hooks/useCharacters';
import { capitalize } from '@/utils/pokemonUtils';
import { RACE_COLORS } from '@/constants';
import { Swords, Shield, Sparkles } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { t } from '@/constants/translations';

interface TopAbilitiesCardProps {
  pokemonId?: number;
}

export function TopAbilitiesCard({ pokemonId }: TopAbilitiesCardProps) {
  const navigate = useNavigate();
  const { language } = useAppStore();
  const targetId = pokemonId || 6;

  // Fetch character data from the Zelda API
  const { data: character, isLoading } = useCharacter(targetId);

  // Extract abilities from the character data
  const abilities = useMemo(() => {
    if (!character?.abilities || character.abilities.length === 0) return [];
    return character.abilities.map((a: any) => ({
      name: a.ability?.name || 'unknown',
      isHidden: a.is_hidden || false,
    }));
  }, [character]);

  const typeColor = RACE_COLORS[character?.types?.[0]?.type?.name || 'normal'] || '#6c5ce7';
  const dominantType = character?.types?.[0]?.type?.name || 'normal';

  return (
    <motion.div
      className="rounded-[32px] p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      style={{
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(25px)',
        WebkitBackdropFilter: 'blur(25px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${typeColor}22` }}
          >
            <Sparkles size={18} style={{ color: typeColor }} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-text-primary">{t('dashboard.topMoves', language)}</h3>
            </div>
            <p className="text-[10px] text-text-secondary">
              {character ? capitalize(character.name) : t('dashboard.bestAttacks', language)}
            </p>
          </div>
        </div>
        <motion.button
          onClick={() => navigate('/characters')}
          className="text-[11px] font-semibold px-3 py-1.5 rounded-full"
          style={{
            backgroundColor: `${typeColor}22`,
            color: typeColor,
            border: `1px solid ${typeColor}33`,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {t('dashboard.viewAll', language)}
        </motion.button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-2xl animate-pulse"
              style={{
                backgroundColor: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div className="w-8 h-8 rounded-xl bg-white/5 flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-white/5" />
                <div className="h-2 w-16 rounded bg-white/5" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Abilities List - Real abilities from Zelda API */}
      {!isLoading && (
        <div className="space-y-2.5">
          {abilities.length > 0 ? (
            abilities.map((ability: any, i: number) => (
              <motion.div
                key={ability.name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-2xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.04)',
                }}
                whileHover={{
                  backgroundColor: 'rgba(255,255,255,0.06)',
                  x: 4,
                  transition: { duration: 0.2 },
                }}
              >
                {/* Ability icon */}
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${typeColor}18` }}
                >
                  {i === 0 ? (
                    <Swords size={14} style={{ color: typeColor }} />
                  ) : (
                    <Shield size={14} style={{ color: typeColor }} />
                  )}
                </div>

                {/* Ability info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-text-primary truncate">
                      {ability.name.split('-').map(capitalize).join(' ')}
                    </span>
                    {ability.isHidden && (
                      <span
                        className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: `${typeColor}22`,
                          color: typeColor,
                        }}
                      >
                        Hidden
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-[10px] text-text-secondary flex items-center gap-1">
                      <Sparkles size={10} />
                      {ability.isHidden ? 'Secret Ability' : 'Standard Ability'}
                    </span>
                  </div>
                </div>

                {/* Slot badge */}
                <div className="text-center flex-shrink-0">
                  <div
                    className="text-lg font-black"
                    style={{ color: typeColor }}
                  >
                    {i + 1}
                  </div>
                  <div className="text-[8px] text-text-secondary uppercase tracking-wider">Slot</div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-6">
              <p className="text-xs text-text-secondary">No abilities data available</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
