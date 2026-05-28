import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { expect } from 'storybook/test';
import { callApi, type BaseResponse } from './api';

interface ApiPreviewProps {
  endpoint: string;
}

function ApiPreview({ endpoint }: ApiPreviewProps) {
  const [result, setResult] = useState<BaseResponse<Record<string, unknown>> | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'done'>('idle');

  useEffect(() => {
    let active = true;

    async function run() {
      setStatus('loading');
      const response = await callApi<Record<string, unknown>>('GET', endpoint, undefined, {
        showError: false,
        showSuccess: false,
      });
      if (!active) return;
      setResult(response);
      setStatus('done');
    }

    run();
    return () => {
      active = false;
    };
  }, [endpoint]);

  return (
    <Paper sx={{ p: 3, maxWidth: 700, borderRadius: '14px' }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
        API Storybook Preview
      </Typography>
      <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
        Endpoint: <code>{endpoint}</code>
      </Typography>
      <Box data-testid="api-status">Status: {status}</Box>
      <Box data-testid="api-success">Success: {String(result?.success ?? false)}</Box>
      <Box data-testid="api-message">Message: {result?.message ?? '-'}</Box>
      <Box sx={{ mt: 1, fontFamily: 'monospace', fontSize: 13, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(result?.data ?? null, null, 2)}
      </Box>
    </Paper>
  );
}

const meta = {
  component: ApiPreview,
  tags: ['ai-generated'],
  args: {
    endpoint: '/storybook/health',
  },
} satisfies Meta<typeof ApiPreview>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HealthCheck: Story = {
  play: async ({ canvas }) => {
    await expect(await canvas.findByText(/Health check success/i)).toBeVisible();
    await expect(canvas.getByTestId('api-success')).toHaveTextContent('Success: true');
  },
};

export const FailureResponse: Story = {
  args: {
    endpoint: '/storybook/failure',
  },
};
