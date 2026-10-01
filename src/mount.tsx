import './styles/course.css';
import type { ComponentType } from 'react';
import { createRoot } from 'react-dom/client';

export function mount(Page: ComponentType) {
  createRoot(document.getElementById('root')!).render(<Page />);
}
