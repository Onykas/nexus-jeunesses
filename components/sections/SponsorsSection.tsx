import AnimatedSection from '@/components/ui/AnimatedSection';

const sponsors = {
  or: [
    { name: 'OCP Group', placeholder: 'OCP' },
    { name: 'Maroc Telecom', placeholder: 'MAROC TELECOM' },
    { name: 'CIH Bank', placeholder: 'CIH BANK' },
  ],
  argent: [
    { name: 'BMCE Bank', placeholder: 'BMCE BANK' },
    { name: 'Lydec', placeholder: 'LYDEC' },
    { name: 'Total Maroc', placeholder: 'TOTAL' },
    { name: 'Afriquia', placeholder: 'AFRIQUIA' },
  ],
  bronze: [
    { name: 'Inwi', placeholder: 'INWI' },
    { name: 'Label Vie', placeholder: 'LABEL VIE' },
    { name: 'Méditel', placeholder: 'MÉDITEL' },
    { name: 'Atlas Copco', placeholder: 'ATLAS' },
    { name: 'Renault Maroc', placeholder: 'RENAULT' },
  ],
};

export default function SponsorsSection() {
  return (
    <section className="py-16 bg-gray-50 border-t border-gray-100" aria-label="Partenaires et sponsors">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-12">
          <span className="font-raleway text-[#212121]/50 text-sm uppercase tracking-widest font-semibold">
            Partenaires officiels
          </span>
        </AnimatedSection>

        {/* Gold */}
        <AnimatedSection delay={0.1} className="mb-8">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
              ★ Partenaires Or
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8">
            {sponsors.or.map(({ name, placeholder }) => (
              <div
                key={name}
                className="h-14 px-6 bg-white border-2 border-yellow-200 rounded-xl flex items-center justify-center min-w-[140px] hover:border-yellow-400 hover:shadow-md transition-all duration-300"
                title={name}
                aria-label={name}
              >
                <span className="font-montserrat font-bold text-navy/60 text-sm tracking-wide">{placeholder}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Silver */}
        <AnimatedSection delay={0.2} className="mb-8">
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-gray-50 border border-gray-300 text-gray-600 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
              ◆ Partenaires Argent
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-6">
            {sponsors.argent.map(({ name, placeholder }) => (
              <div
                key={name}
                className="h-12 px-5 bg-white border border-gray-200 rounded-lg flex items-center justify-center min-w-[120px] hover:border-gray-400 hover:shadow-sm transition-all duration-300"
                title={name}
                aria-label={name}
              >
                <span className="font-montserrat font-semibold text-navy/50 text-xs tracking-wide">{placeholder}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        {/* Bronze */}
        <AnimatedSection delay={0.3}>
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest">
              ● Partenaires Bronze
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {sponsors.bronze.map(({ name, placeholder }) => (
              <div
                key={name}
                className="h-10 px-4 bg-white border border-gray-100 rounded-lg flex items-center justify-center min-w-[100px] hover:border-orange-200 transition-all duration-300"
                title={name}
                aria-label={name}
              >
                <span className="font-montserrat font-medium text-navy/40 text-xs tracking-wide">{placeholder}</span>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.4} className="text-center mt-10">
          <a
            href="mailto:partenariats@nexusjeunesses.org"
            className="font-raleway text-brand-red hover:text-red-700 font-semibold text-sm underline underline-offset-2 transition-colors"
          >
            Devenir partenaire →
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
