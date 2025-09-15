// src/pages/Contacto/hooks/useContactForm.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createContacto } from '@/services/contactService';
import { ContactFormValues } from '@/pages/Contacto/types';
import errorService, { normalizeError } from '@/services/errorService';

export function useContactForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: ContactFormValues) => createContacto(payload),
    onSuccess: (data) => {
      // invalidar lista de contactos si la tienes
      queryClient.invalidateQueries({ queryKey: ['contactos'] });
      // podrías también hacer queryClient.setQueryData(...) para añadir al cache
    },
    onError: (err) => {
      const norm = normalizeError(err, { source: 'useContactForm' });
      errorService.logError(norm);
    },
  });

  return {
    createContacto: mutation.mutateAsync,
    isSubmitting: mutation.isPending,
    error: mutation.error,
    reset: mutation.reset,
  };
}
