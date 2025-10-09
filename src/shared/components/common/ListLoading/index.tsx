import React from 'react';
import { commonDefaultMessages } from '@/i18n/commonMessages';
import Spinner from '@/shared/components/ui/Spinner/Spinner';

export type ListLoadingProps = {
  loading: boolean;
  message?: string;
  children: React.ReactNode;
  containerClassName?: string;
  showSpinner?: boolean;
  spinnerSize?: 'sm' | 'md' | 'lg';
  layout?: 'inline' | 'centered';
};

const ListLoading: React.FC<ListLoadingProps> = ({
  loading,
  message = commonDefaultMessages.loading,
  children,
  containerClassName = 'loading-container',
  showSpinner = true,
  spinnerSize = 'md',
  layout = 'centered',
}) => {
  if (loading) {
    const content = (
      <>
        {showSpinner && <Spinner size={spinnerSize} ariaLabel={message} />}
        {message && <p style={{ marginTop: showSpinner ? 8 : 0 }}>{message}</p>}
      </>
    );
    if (layout === 'inline') return <>{content}</>;
    return <div className={containerClassName}>{content}</div>;
  }
  return <>{children}</>;
};

export default ListLoading;
