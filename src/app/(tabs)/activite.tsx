import { SunMountain } from '@/components/animated-icons';
import { ComingSoon } from '@/components/coming-soon';

export default function Activite() {
  return (
    <ComingSoon
      eyebrow="ACTIVITÉ"
      title="Vivre quelque chose ensemble"
      intro="Des activités choisies pour ce que vous êtes vraiment, d’après vos questionnaires de compatibilité."
      icon={<SunMountain size={40} />}
      planned={[
        'Questionnaires : se connaître, connaître l’autre, vos compatibilités',
        'Le Quiz Signature Émotionnelle',
        'Profils de couple : Nature & adrénaline, Cocon & geek, Culture & gourmandise…',
        'Activités proposées selon votre profil, réservation et débrief à deux',
      ]}
    />
  );
}
