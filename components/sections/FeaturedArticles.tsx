import AnimatedSection from '@/components/ui/AnimatedSection';

export default function FeaturedArticles() {
  return (
    <section className="py-20 bg-white" aria-label="Articles récents NEXUS Média">
      <div className="container-xl">
        <AnimatedSection className="text-center mb-12">
          <span className="font-raleway text-brand-red font-semibold text-sm uppercase tracking-widest mb-3 block">
            NEXUS MÉDIA
          </span>
          <h2 className="section-title text-4xl">À la une</h2>
        </AnimatedSection>

        <AnimatedSection>
          <div className="max-w-md mx-auto border border-gray-200 rounded-2xl p-10 text-center bg-gray-50">
            <p className="font-inter text-[#212121]/55 text-base">
              Le premier article sera publié prochainement.
            </p>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
