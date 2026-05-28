import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import {
  formatMoney,
  formatMoneyCompact,
  formatMonthLabel,
  formatNumber,
  formatThaiDate,
  formatThaiDateTime,
  monthKey,
  shortId,
} from './format';

function FormatPreview() {
  const now = '2026-05-28T09:15:00.000Z';
  const amount = 452000;

  const rows = [
    ['formatNumber', formatNumber(amount)],
    ['formatMoney', formatMoney(amount)],
    ['formatMoneyCompact', formatMoneyCompact(amount)],
    ['formatThaiDate', formatThaiDate(now)],
    ['formatThaiDateTime', formatThaiDateTime(now)],
    ['formatMonthLabel', formatMonthLabel(now)],
    ['monthKey', monthKey(now)],
    ['shortId', shortId('ORDER-2026-00001234123')],
  ];

  return (
    <Paper sx={{ p: 3, maxWidth: 760, borderRadius: '14px' }}>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 700 }}>
        Format utility preview
      </Typography>
      <Stack spacing={1.25}>
        {rows.map(([name, value]) => (
          <Box
            key={name}
            sx={{
              display: 'grid',
              gridTemplateColumns: '220px 1fr',
              gap: 2,
              py: 1,
              borderBottom: '1px dashed rgba(100,100,100,0.2)',
            }}
          >
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
              {name}
            </Typography>
            <Typography variant="body2">{value}</Typography>
          </Box>
        ))}
      </Stack>
    </Paper>
  );
}

const meta = {
  component: FormatPreview,
  tags: ['ai-generated'],
} satisfies Meta<typeof FormatPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
