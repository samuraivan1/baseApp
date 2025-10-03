import type { Meta, StoryObj } from '@storybook/react-vite';
import Button from './index';
import { faTrash, faPlus, faEdit } from '@fortawesome/free-solid-svg-icons';

const meta: Meta<typeof Button> = {
  title: 'UI/Button',
  component: Button,
  parameters: { layout: 'centered' },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Danger: Story = { args: { variant: 'danger' } };
export const Outline: Story = { args: { variant: 'outline' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Subtle: Story = { args: { variant: 'subtle' } };
export const Link: Story = { args: { variant: 'link', children: 'Acción' } };
export const LinkDanger: Story = { args: { variant: 'link', tone: 'danger', children: 'Eliminar' } };

export const WithIcon: Story = {
  args: { variant: 'primary', icon: faPlus, children: 'Agregar' },
};
export const EditLink: Story = {
  args: { variant: 'link', icon: faEdit, children: 'Editar' },
};
export const DeleteDanger: Story = {
  args: { variant: 'danger', icon: faTrash, children: 'Eliminar' },
};
