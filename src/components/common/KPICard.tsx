import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { EraBadge } from '@/components/common/EraBadge';

interface KPICardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  onClick?: () => void;
  imageUrl?: string;
  pokemonId?: number;
}

export function KPICard({ label, value, icon: Icon, subtitle, trend, trendValue, onClick, imageUrl, pokemonId }: KPICardProps) {
  return (
    <motion.button
      onClick={onClick}
      className="kpi-card text-left w-full cursor-pointer group relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      aria-label={`${label}: ${value}`}
    >
      {/* Era badge - positioned top-right */}
      {pokemonId && (
        <div className="absolute top-2 right-2 z-10">
          <EraBadge pokemonId={pokemonId} size="sm" />
        </div>
      )}
      <div className="flex items-center justify-between">
        <span className="kpi-label">{label}</span>
        <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(198, 161, 91, 0.1)', color: '#E8D8B0' }}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={String(value)}
            className="w-8 h-8 object-contain"
            loading="lazy"
          />
        )}
        <span className="kpi-value">{value}</span>
      </div>
      {subtitle && (
        <span className="text-xs text-text-secondary">{subtitle}</span>
      )}
      {trend && (
        <div className="flex items-center gap-1 mt-1">
          <span
            className={`text-xs font-medium ${
              trend === 'up' ? 'text-success' : trend === 'down' ? 'text-danger' : 'text-text-secondary'
            }`}
          >
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
          </span>
        </div>
      )}
    </motion.button>
  );
}
