// src/pages/Contacto/ContactForm.tsx
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { contactSchema } from './validation';
import { ContactFormValues } from './types';
import { useContactForm } from './hooks/useContactForm';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import './ContactForm.scss';
import Button from '@/components/ui/Button';
import messages from './ContactForm.messages';
import { useApiError } from '@/hooks/useApiError';

const ContactForm: React.FC = () => {
  const { createContacto, isSubmitting } = useContactForm();
  const { handleError } = useApiError();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      nombre: '',
      email: '',
      mensaje: '',
      fecha_contacto: '',
    },
    mode: 'onTouched',
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await createContacto(values);
      // mostrar toast o feedback exitoso
      alert('Envío realizado. Gracias!');
      reset();
    } catch (err) {
      const ui = handleError(err, { form: 'contacto' });
      alert(`${ui.title}: ${ui.message}`);
    }
  };

  return (
    <div className="contact-form">
      <h2>{messages.title}</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <Input
          label={messages.fields.nombre.label}
          placeholder={messages.fields.nombre.placeholder}
          {...register('nombre')}
          error={errors.nombre?.message as string | undefined}
        />

        <Input
          label={messages.fields.email.label}
          placeholder={messages.fields.email.placeholder}
          type="email"
          {...register('email')}
          error={errors.email?.message as string | undefined}
        />

        <Textarea
          label={messages.fields.mensaje.label}
          placeholder={messages.fields.mensaje.placeholder}
          {...register('mensaje')}
          error={errors.mensaje?.message as string | undefined}
        />

        <Input
          label={messages.fields.fecha_contacto.label}
          type="date"
          {...register('fecha_contacto')}
          error={errors.fecha_contacto?.message as string | undefined}
        />

        <div className="contact-form__actions">
          <Button type="submit" variant="primary" disabled={isSubmitting} isLoading={isSubmitting}>
            {isSubmitting ? 'Enviando...' : 'Enviar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ContactForm;
