import { EcgLine } from '@/components/animated-icons';
import { ComingSoon } from '@/components/coming-soon';
import { SafetyPanel } from '@/components/safety-panel';

export default function Crise() {
  return (
    <ComingSoon
      eyebrow="MODE CRISE"
      title="On est en crise ?"
      intro="Ce n’est pas le moment de savoir qui a raison. C’est le moment de se retrouver."
      icon={<EcgLine width={44} height={20} />}
      planned={[
        'Le grand bouton « ON Y VA »',
        'Protocole en 7 étapes : Stop · Respirer · Écouter · Reformuler · Besoin · Réparer · Sceller',
        '« On a besoin d’une pause » (20 min)',
      ]}>
      <SafetyPanel />
    </ComingSoon>
  );
}
