import React from 'react';
import FormSection from '@/components/form/FormSection';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import { faUser, faBox, faTruck, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

export default function FormLayoutDemo() {
  return (
    <div style={{ padding: 16 }}>
      <FormSection title="Solicitante" icon={faUser}>
        <Input label="Nombre o razón social" />
        <Input label="Contacto (persona)" />
        <Input label="Teléfono" />
        <Input label="Correo electrónico" />
        <Input label="Dirección de recogida" className="fs-row-span-2" />
      </FormSection>

      <FormSection title="Carga" icon={faBox}>
        <Input label="Tipo de mercancía" />
        <Input label="Peso (kg)" />
        <Input label="Dimensiones (L × A × H)" />
        <Input label="Cantidad de bultos" />
        <div className="fs-row-span-2">
          <label style={{ fontWeight: 600 }}>Características especiales</label>
          <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
            <label><input type="checkbox" /> Temperatura controlada</label>
            <label><input type="checkbox" /> Frágil</label>
            <label><input type="checkbox" /> Urgente</label>
            <label><input type="checkbox" /> Material voluminoso</label>
          </div>
        </div>
        <Textarea rows={3} label="Instrucciones adicionales" className="fs-row-span-2" />
      </FormSection>

      <FormSection title="Transporte" icon={faTruck}>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>Modalidad</label>
          <label style={{ marginRight: 12 }}><input type="radio" name="modalidad" /> Terrestre</label>
          <label style={{ marginRight: 12 }}><input type="radio" name="modalidad" /> Aérea</label>
          <label><input type="radio" name="modalidad" /> Marítima</label>
        </div>
        <Input label="Tipo de vehículo requerido" />
        <Input label="Seguro / Cobertura" />
        <Textarea rows={3} label="Instrucciones adicionales" />
      </FormSection>

      <FormSection title="Confirmación" icon={faCheckCircle}>
        <div className="fs-row-span-2">
          <label><input type="checkbox" /> Acepto los términos y condiciones</label>
        </div>
        <div className="fs-row-span-2 fs-actions">
          <Button variant="secondary">Cancelar</Button>
          <Button variant="primary">Enviar solicitud</Button>
        </div>
      </FormSection>
    </div>
  );
}
