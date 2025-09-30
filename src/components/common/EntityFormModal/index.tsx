import {
  useForm,
  type FieldValues,
  type Path,
  type DeepPartial,
} from 'react-hook-form';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';

interface FieldConfig<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'email' | 'password';
  required?: boolean;
}

interface EntityFormModalProps<TFieldValues extends FieldValues> {
  title: string;
  open: boolean;
  onClose: () => void;
  onSubmit: (values: TFieldValues) => void;
  initialValues?: DeepPartial<TFieldValues>;
  fields: FieldConfig<TFieldValues>[];
}

export default function EntityFormModal<TFieldValues extends FieldValues>({
  title,
  open,
  onClose,
  onSubmit,
  initialValues,
  fields,
}: EntityFormModalProps<TFieldValues>) {
  const formOptions = (
    initialValues ? { defaultValues: initialValues } : {}
  ) as Parameters<typeof useForm<TFieldValues>>[0];
  const { register, handleSubmit } = useForm<TFieldValues>(formOptions);

  return (
    <Modal open={open} onClose={onClose}>
      <div className="p-4 w-[400px]">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {fields.map((field) => (
              <div key={field.name} className="flex flex-col">
                <label className="mb-1 font-medium">{field.label}</label>
                {field.type === 'textarea' ? (
                  <textarea
                    {...register(field.name, {
                      required: field.required,
                    })}
                    className="border rounded p-2"
                  />
                ) : (
                  <input
                    type={field.type || 'text'}
                    {...register(field.name, {
                      required: field.required,
                    })}
                    className="border rounded p-2"
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="secondary" onClick={onClose} type="button">
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
