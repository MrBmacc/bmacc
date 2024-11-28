import { createFileRoute } from '@tanstack/react-router';
import { CreateProfile } from '../components/CreateProfile';

export const Route = createFileRoute('/create')({
  component: CreateProfile,
});