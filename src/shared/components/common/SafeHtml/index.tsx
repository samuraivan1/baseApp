import React from 'react';
import { sanitizeHtml } from '@/shared/security/sanitize';

type Props = {
  html: string;
  className?: string;
  // Permite cambiar el contenedor si se requiere
  as?: keyof JSX.IntrinsicElements;
} & Omit<React.HTMLAttributes<HTMLElement>, 'dangerouslySetInnerHTML' | 'children'>;

const SafeHtml: React.FC<Props> = ({ html, className, as: Tag = 'div', ...rest }) => {
  const clean = React.useMemo(() => sanitizeHtml(html), [html]);
  // @ts-expect-error JSX runtime no permite tipar dinámicamente el Tag
  return <Tag className={className} {...rest} dangerouslySetInnerHTML={{ __html: clean }} />;
};

export default SafeHtml;

