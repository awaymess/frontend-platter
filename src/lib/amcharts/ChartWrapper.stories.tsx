import { useId } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ChartWrapper } from './ChartWrapper';
import { amchartsConfig } from './config';

const sampleData = [
  { day: 'Mon', value: 21 },
  { day: 'Tue', value: 33 },
  { day: 'Wed', value: 17 },
  { day: 'Thu', value: 42 },
  { day: 'Fri', value: 38 },
];

function createColumnChart(rootUnknown: unknown, am5Unknown: unknown, am5xyUnknown: unknown) {
  const root = rootUnknown as import('@amcharts/amcharts5').Root;
  const am5 = am5Unknown as typeof import('@amcharts/amcharts5');
  const am5xy = am5xyUnknown as typeof import('@amcharts/amcharts5/xy');

  const chart = root.container.children.push(
    am5xy.XYChart.new(root, {
      panX: false,
      panY: false,
      wheelX: 'none',
      wheelY: 'none',
    })
  );

  const xAxis = chart.xAxes.push(
    am5xy.CategoryAxis.new(root, {
      categoryField: 'day',
      renderer: am5xy.AxisRendererX.new(root, {}),
    })
  );
  xAxis.data.setAll(sampleData);

  const yAxis = chart.yAxes.push(
    am5xy.ValueAxis.new(root, {
      renderer: am5xy.AxisRendererY.new(root, {}),
    })
  );

  const series = chart.series.push(
    am5xy.ColumnSeries.new(root, {
      xAxis,
      yAxis,
      valueYField: 'value',
      categoryXField: 'day',
      tooltip: am5.Tooltip.new(root, { labelText: '{categoryX}: {valueY}' }),
    })
  );

  series.columns.template.setAll({
    cornerRadiusTL: 8,
    cornerRadiusTR: 8,
    strokeOpacity: 0,
    fill: am5.color(0x3b82f6),
  });

  series.data.setAll(sampleData);
  chart.appear(400, 80);
}

function ChartPreview({ height }: { height: number }) {
  const uniqueId = useId().replace(/:/g, '-');
  return (
    <ChartWrapper
      id={`storybook-amchart-${uniqueId}`}
      height={height}
      createChart={createColumnChart}
    />
  );
}

function PalettePreview() {
  return (
    <Stack spacing={2}>
      {Object.entries(amchartsConfig.themes).map(([mode, theme]) => (
        <Box key={mode}>
          <Typography variant="subtitle2" sx={{ mb: 1, textTransform: 'capitalize' }}>
            {mode} palette
          </Typography>
          <Stack direction="row" spacing={1}>
            {theme.colors.map((color) => (
              <Box
                key={`${mode}-${color}`}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '8px',
                  backgroundColor: color,
                  border: '1px solid rgba(0,0,0,0.08)',
                }}
                title={color}
              />
            ))}
          </Stack>
        </Box>
      ))}
    </Stack>
  );
}

const meta = {
  component: ChartPreview,
  tags: ['ai-generated'],
  args: {
    height: 320,
  },
} satisfies Meta<typeof ChartPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ColumnChart: Story = {};

export const ChartPalette: Story = {
  render: () => <PalettePreview />,
};
