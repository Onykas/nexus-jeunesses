import AnimatedSection from '@/components/ui/AnimatedSection';
import CountUp from '@/components/ui/CountUp';
import { Users, Globe, Heart, Trophy } from 'lucide-react';

const stats = [
  { icon: Users, value: 2145, suffix: '+', label: 'Inscriptions confirmées', color: 'text-brand-red', bg: 'bg-brand-red/10' },
  { icon: Globe, value: 45, suffix: '', label: 'Nationalités représentées', color: 'text-brand-orange', bg: 'bg-brand-orange/10' },
  { icon: Heart, value: 114, suffix: '+', label: 'Volontaires mobilisés', color: 'text-brand-green', bg: 'bg-brand-green/10' },
  { icon: Trophy, value: 12, suffix: '', label: 'Finalistes Eloquentia', color: 'text-navy', bg: 'bg-navy/10' },
];

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100" aria-label="Statistiques NEXUS">
      <div className="container-xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, suffix, label, color, bg }, i) => (
            <AnimatedSection key={label} delay={i * 0.1} className="text-center">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${bg} ${color} mb-3 mx-auto`}>
                <Icon size={22} />
              </div>
              <div className={`font-montserrat font-black text-3xl sm:text-4xl ${color} mb-1`}>
                <CountUp end={value} suffix={suffix} />
              </div>
              <p className="font-raleway text-[#212121]/60 text-sm leading-tight">{label}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
