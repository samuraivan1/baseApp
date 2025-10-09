import { demoMessages } from './FormLayoutDemo.messages';
import FormSection from '@/shared/components/form/FormSection';
import Input from '@/shared/components/ui/Input';
import Textarea from '@/shared/components/ui/Textarea';
import Button from '@/shared/components/ui/Button';
import {
  faUser,
  faBox,
  faTruck,
  faCheckCircle,
} from '@fortawesome/free-solid-svg-icons';

export default function FormLayoutDemo() {
  return (
    <div style={{ padding: 16 }}>
      <FormSection title={demoMessages.requester} icon={faUser}>
        <Input label={demoMessages.nameOrBusiness} />
        <Input label={demoMessages.contactPerson} />
        <Input label={demoMessages.phone} />
        <Input label={demoMessages.email} />
        <Input label={demoMessages.pickupAddress} className="fs-row-span-2" />
      </FormSection>

      <FormSection title={demoMessages.cargo} icon={faBox}>
        <Input label={demoMessages.cargoType} />
        <Input label={demoMessages.weight} />
        <Input label={demoMessages.dimensions} />
        <Input label={demoMessages.packages} />
        <div className="fs-row-span-2">
          <label style={{ fontWeight: 600 }}>
            {demoMessages.specialFeatures}
          </label>
          <div style={{ display: 'flex', gap: 16, marginTop: 6 }}>
            <label>
              <input type="checkbox" /> Temperatura controlada
            </label>
            <label>
              <input type="checkbox" /> Frágil
            </label>
            <label>
              <input type="checkbox" /> Urgente
            </label>
            <label>
              <input type="checkbox" /> Material voluminoso
            </label>
          </div>
        </div>
        <Textarea
          rows={3}
          label={demoMessages.additionalInstructions}
          className="fs-row-span-2"
        />
      </FormSection>

      <FormSection title={demoMessages.transport} icon={faTruck}>
        <div>
          <label style={{ fontWeight: 600, display: 'block', marginBottom: 6 }}>
            {demoMessages.mode}
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="radio" name="modalidad" /> Terrestre
          </label>
          <label style={{ marginRight: 12 }}>
            <input type="radio" name="modalidad" /> Aérea
          </label>
          <label>
            <input type="radio" name="modalidad" /> Marítima
          </label>
        </div>
        <Input label={demoMessages.vehicleType} />
        <Input label={demoMessages.insurance} />
        <Textarea rows={3} label={demoMessages.additionalInstructions} />
      </FormSection>

      <FormSection title={demoMessages.confirmation} icon={faCheckCircle}>
        <div className="fs-row-span-2">
          <label>
            <input type="checkbox" /> {demoMessages.acceptTerms}
          </label>
        </div>
        <div className="fs-row-span-2 fs-actions">
          <Button variant="secondary">{demoMessages.cancel}</Button>
          <Button variant="primary">{demoMessages.submit}</Button>
        </div>
      </FormSection>
    </div>
  );
}
