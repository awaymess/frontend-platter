import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect } from 'storybook/test';
import { BasicTable } from './basic-table';

const salesRows = [
  { date: '2026-05-21', orders: 32, revenue: 14800 },
  { date: '2026-05-22', orders: 41, revenue: 17350 },
  { date: '2026-05-23', orders: 36, revenue: 16220 },
];

function SalesTableStory({ title, rows }: { title: string; rows: typeof salesRows }) {
  return (
    <BasicTable
      title={title}
      columns={[
        { header: 'Date', key: 'date' },
        { header: 'Orders', key: 'orders', align: 'right' },
        { header: 'Revenue (THB)', key: 'revenue', align: 'right' },
      ]}
      rows={rows}
    />
  );
}

const meta = {
  component: SalesTableStory,
  tags: ['ai-generated'],
  args: {
    title: 'Weekly sales table',
    rows: salesRows,
  },
} satisfies Meta<typeof SalesTableStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactPreview: Story = {
  args: {
    title: 'Compact order snapshot',
    rows: salesRows.slice(0, 2),
  },
};

export const CssCheck: Story = {
  play: async ({ canvas }) => {
    const headerRow = canvas.getByTestId('table-header-row');
    await expect(getComputedStyle(headerRow).backgroundColor).toBe('rgb(31, 41, 55)');
  },
};
