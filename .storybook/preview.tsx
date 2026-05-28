import type { Preview } from '@storybook/nextjs-vite';
import MockDate from 'mockdate';
import { initialize, mswLoader } from 'msw-storybook-addon';
import { ReduxProvider } from '../src/providers/ReduxProvider';
import { mswHandlers } from './msw-handlers';
import '../src/styles/globals.css';

initialize({ onUnhandledRequest: 'bypass' });

const preview: Preview = {
  decorators: [
    (Story) => (
      <ReduxProvider>
        <Story />
      </ReduxProvider>
    ),
  ],
  loaders: [mswLoader],
  parameters: {
    msw: { handlers: mswHandlers },
    nextjs: {
      appDirectory: true,
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
  async beforeEach() {
    localStorage.setItem('theme-mode', 'light');
    MockDate.set('2026-05-28T09:00:00.000Z');
  },
};

export default preview;
