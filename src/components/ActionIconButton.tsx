'use client';

import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@awaymess/ui';
import type { ReactNode } from 'react';

type ActionTone = 'primary' | 'success' | 'warning' | 'error' | 'default';

const TONE_COLOR: Record<ActionTone, string> = {
  primary: '#007AFF',
  success: '#16a34a',
  warning: '#f59e0b',
  error: '#ef4444',
  default: '#64748b',
};

type ActionIconButtonProps = {
  title: string;
  children: ReactNode;
  onClick: () => void;
  tone?: ActionTone;
  disabled?: boolean;
};

export default function ActionIconButton({
  title,
  children,
  onClick,
  tone = 'primary',
  disabled = false,
}: ActionIconButtonProps) {
  return (
    <Tooltip title={title}>
      <span>
        <IconButton
          size="small"
          onClick={onClick}
          disabled={disabled}
          sx={{
            width: 34,
            height: 34,
            border: '1px solid rgba(148,163,184,0.28)',
            color: TONE_COLOR[tone],
            // background: "rgba(255,255,255,0.72)",
            '&:hover': {
              background: 'rgba(148,163,184,0.12)',
            },
          }}
        >
          {children}
        </IconButton>
      </span>
    </Tooltip>
  );
}
