import React from 'react';
import { ensureSafeUrl } from '@/shared/security/url';

type Props = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  allowRelative?: boolean;
};

const SafeImg: React.FC<Props> = ({ src, allowRelative = true, referrerPolicy = 'no-referrer', ...rest }) => {
  const safe = ensureSafeUrl(src, { allowRelative, allowHttpSameOrigin: true });
  if (!safe) return <img alt={rest.alt || ''} {...rest} />;
  return <img src={safe} referrerPolicy={referrerPolicy} {...rest} />;
};

export default SafeImg;

