'use client';

import { useEffect, useRef, useCallback } from 'react';
import Box from '@mui/material/Box';
import { Skeleton } from '@mui/material';
import { useTheme } from '@/hooks/useTheme';
import { amchartsConfig } from './config';

type ChartType = 'xy' | 'pie' | 'radar';

interface ChartWrapperProps {
  id: string;
  type?: ChartType;
  height?: number | string;
  createChart: (
    root: unknown,
    am5: unknown,
    am5xy: unknown,
    am5percent: unknown,
    theme: 'light' | 'dark'
  ) => void;
  className?: string;
}

export function ChartWrapper({
  id,
  type = 'xy',
  height = 400,
  createChart,
  className,
}: ChartWrapperProps) {
  const chartRef = useRef<unknown>(null);
  const { resolvedMode } = useTheme();

  const initChart = useCallback(async () => {
    // Dynamic import - no SSR
    const am5 = await import('@amcharts/amcharts5');
    const am5xy = await import('@amcharts/amcharts5/xy');
    const am5percent = await import('@amcharts/amcharts5/percent');
    const am5themes_Animated = await import('@amcharts/amcharts5/themes/Animated');

    // Dispose previous chart
    if (chartRef.current) {
      (chartRef.current as { dispose: () => void }).dispose();
    }

    // Create root
    const root = am5.Root.new(id);

    // Set theme
    root.setThemes([am5themes_Animated.default.new(root)]);

    // Store reference
    chartRef.current = root;

    // Call user's chart creation function
    createChart(root, am5, am5xy, am5percent, resolvedMode);
  }, [id, createChart, resolvedMode]);

  useEffect(() => {
    initChart();

    return () => {
      if (chartRef.current) {
        (chartRef.current as { dispose: () => void }).dispose();
      }
    };
  }, [initChart]);

  return (
    <Box
      id={id}
      className={className}
      sx={{
        width: '100%',
        height,
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
      }}
    />
  );
}
