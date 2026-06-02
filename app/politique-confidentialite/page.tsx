import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Politique de confidentialité' };

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 bg-white">
      <div className="container-xl max-w-3xl">
        <h1 className="section-title text-4xl mb-8">Politique de confidentialité</h1>
        <div className="font-inter text-[#212121]/70 space-y-6 text-sm leading-relaxed">
          <section>
            <h2 className="font-raleway font-bold text-navy text-base mb-2">Données collectées</h2>
            <p>Lors de votre inscription, nous collectons : prénom, nom, email, téléphone, nationalité, date de naissance (optionnel), motivations (optionnel).</p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-base mb-2">Utilisation des données</h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Envoi de la confirmation d'inscription</li>
              <li>Envoi des rappels automatiques (si consentement donné)</li>
              <li>Gestion de l'événement (liste des participants)</li>
              <li>Amélioration de nos services</li>
            </ul>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-base mb-2">Conservation des données</h2>
            <p>Vos données sont conservées pendant 3 ans après l'événement, puis supprimées automatiquement.</p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-base mb-2">Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants : accès, rectification, suppression, portabilité, opposition. Pour exercer ces droits : <a href="mailto:privacy@nexusjeunesses.org" className="text-brand-red">privacy@nexusjeunesses.org</a></p>
          </section>
          <section>
            <h2 className="font-raleway font-bold text-navy text-base mb-2">Cookies</h2>
            <p>Nous utilisons uniquement des cookies techniques nécessaires au bon fonctionnement du site et des cookies analytiques anonymisés (Google Analytics, désactivables). Pas de cookies publicitaires.</p>
          </section>
        </div>
      </div>
    </div>
  );
}
