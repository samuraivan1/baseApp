import React from 'react';
import { ensureSafeUrl } from '@/shared/security/url';

type Props = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  allowRelative?: boolean;
};

const SafeLink: React.FC<Props> = ({ href, target, rel, allowRelative = true, ...rest }) => {
  const safe = ensureSafeUrl(href, { allowRelative, allowHttpSameOrigin: true });
  const finalRel = target === '_blank' ? (rel ? `${rel} noopener noreferrer` : 'noopener noreferrer') : rel;
  // Si la URL no es segura, no navega
  if (!safe) return <span {...(rest as any)} />;
  return <a href={safe} target={target} rel={finalRel} {...rest} />;
};

export default SafeLink;

