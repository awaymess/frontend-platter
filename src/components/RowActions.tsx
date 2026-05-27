'use client';

import { useState, type ReactNode } from 'react';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import { Tooltip } from '@awaymess/ui';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { MoreVertical } from 'lucide-react';

type RowActionsProps = {
  children: ReactNode;
};

export default function RowActions({ children }: RowActionsProps) {
  const theme = useTheme();
  const compact = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  if (!children) return null;

  if (!compact) {
    return (
      <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexWrap: 'nowrap' }}>
        {children}
      </Box>
    );
  }

  return (
    <>
      <Tooltip title="จัดการ">
        <IconButton
          size="small"
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            width: 32,
            height: 32,
            border: '1px solid rgba(148,163,184,0.28)',
            background: 'rgba(255,255,255,0.72)',
            backdropFilter: 'blur(14px)',
            color: '#64748b',
            '&:hover': { background: 'rgba(148,163,184,0.12)' },
          }}
        >
          <MoreVertical size={16} />
        </IconButton>
      </Tooltip>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: '16px',
              mt: 0.75,
              p: 0.75,
              boxShadow: '0 16px 48px rgba(15,23,42,0.18)',
            },
          },
        }}
      >
        <Box
          onClick={() => setAnchorEl(null)}
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
            '& .MuiStack-root': {
              display: 'flex',
              flexDirection: 'row',
              gap: 0.75,
            },
          }}
        >
          {children}
        </Box>
      </Menu>
    </>
  );
}
