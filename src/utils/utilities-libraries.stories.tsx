import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { cn } from './cn';
import { formatCurrency, formatDate, formatDateTime, formatNumber } from './format';

function UtilitiesAndLibrariesPreview() {
  const utilityRows = [
    ['cn', cn('px-2 py-1', 'bg-blue-500', 'bg-blue-600')],
    ['formatDate', formatDate('2026-05-28')],
    ['formatDateTime', formatDateTime('2026-05-28T09:30:00.000Z')],
    ['formatNumber', formatNumber(1234567)],
    ['formatCurrency', formatCurrency(1234567)],
    ['cookie helpers', 'use getCookie / setCookie / deleteCookie from src/utils/cookie.ts'],
  ];

  const libraries = [
    ['@mui/material', 'UI component system'],
    ['@tanstack/react-table', 'Advanced table behavior'],
    ['@amcharts/amcharts5', 'Chart rendering'],
    ['zod', 'Schema validation'],
    ['react-hook-form', 'Forms and validation handling'],
    ['next-intl', 'Internationalization'],
    ['@reduxjs/toolkit', 'State management'],
  ];

  return (
    <Stack spacing={2}>
      <Paper sx={{ p: 3, borderRadius: '14px' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Utilities
        </Typography>
        <Stack spacing={1}>
          {utilityRows.map(([name, value]) => (
            <Box key={name} sx={{ display: 'grid', gridTemplateColumns: '190px 1fr', gap: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography variant="body2">{value}</Typography>
            </Box>
          ))}
        </Stack>
      </Paper>

      <Paper sx={{ p: 3, borderRadius: '14px' }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
          Libraries used in this scaffold
        </Typography>
        <Stack spacing={1}>
          {libraries.map(([name, purpose]) => (
            <Box key={name} sx={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 2 }}>
              <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                {name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {purpose}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

const meta = {
  component: UtilitiesAndLibrariesPreview,
  tags: ['ai-generated'],
} satisfies Meta<typeof UtilitiesAndLibrariesPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
