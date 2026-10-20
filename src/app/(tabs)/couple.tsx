import { CoupleRings } from '@/components/animated-icons';
import { ComingSoon } from '@/components/coming-soon';

export default function Couple() {
  return (
    <ComingSoon
      eyebrow="COUPLE"
      title="Le calibre du couple"
      intro="Comme une belle montre, votre relation a une réserve de marche. Elle se remplit avec ce que vous vivez pour de vrai, et se remonte ensemble."
      icon={<CoupleRings size={40} />}
      planned={[
        'La réserve de marche (cadran) et le carnet du couple',
        'Vos deux balanciers : en phase ou décalés ce soir ?',
        'Orage dans l’air : prévenir avant la crise',
        'Le défi de la semaine, avec compte à rebours',
        'L’attention secrète, sous sceau de cire',
      ]}
    />
  );
}
