import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Mentions légales' };

export default function MentionsLegalesPage() {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container-xl max-w-3xl">
        <h1 className="section-title text-4xl mb-8">Mentions légales</h1>
        <div className="prose prose-sm max-w-none font-inter text-[#212121]/70 space-y-6">
          <section>
            <h2 className="font-raleway font-bold text-navy text-lg mb-2">Éditeur du site</h2>
            <p>NEXUS JEUNESSES est une initiative de <strong>UESCOM</strong> (Union des Étudiants et Stagiaires Congolais au Maroc), association loi 1901 enregistrée au Maroc.</p>
            <p>Email : <a href="mailto:contact@nexusjeunesses.org" className="text-brand-red">contact@nexusjeunesses.org</a></p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-lg mb-2">Hébergement</h2>
            <p>Ce site est hébergé par <strong>Vercel Inc.</strong>, 340 Pine Street, Suite 701, San Francisco, CA 94104, USA.</p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-lg mb-2">Propriété intellectuelle</h2>
            <p>L'ensemble des contenus présents sur ce site (textes, images, logos, vidéos) sont protégés par le droit d'auteur et restent la propriété exclusive de NEXUS JEUNESSES / UESCOM, sauf mention contraire.</p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-lg mb-2">Protection des données (RGPD)</h2>
            <p>Les données collectées via les formulaires d'inscription sont utilisées exclusivement dans le cadre de la gestion des inscriptions à NEXUS SPECTACLE. Vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Contactez-nous à <a href="mailto:privacy@nexusjeunesses.org" className="text-brand-red">privacy@nexusjeunesses.org</a>.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
