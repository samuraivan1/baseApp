import { useMemo, type HTMLAttributes } from 'react';
import { sanitizeHtml } from '@/shared/security/sanitize';

type SafeHtmlProps = {
  html: string;
  as?: keyof HTMLElementTagNameMap;
} & Omit<HTMLAttributes<HTMLElement>, 'dangerouslySetInnerHTML' | 'children'>;

function SafeHtml({
  html,
  as,
  ...rest
}: SafeHtmlProps) {
  const Tag = (as ?? 'div') as keyof HTMLElementTagNameMap;
  const clean = useMemo(() => sanitizeHtml(html), [html]);
  return <Tag {...rest} dangerouslySetInnerHTML={{ __html: clean }} />;
}

export default SafeHtml;
