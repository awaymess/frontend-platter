'use client';

import { Dialog, type DialogProps } from '@awaymess/ui';

export default function AppDialog(props: DialogProps) {
  const { slotProps, ...rest } = props;
  const paperSlot = typeof slotProps?.paper === 'object' ? slotProps.paper : {};
  const paperSx = 'sx' in paperSlot ? paperSlot.sx : undefined;

  return (
    <Dialog
      slotProps={{
        ...slotProps,
        paper: {
          ...paperSlot,
          sx: {
            m: { xs: 1.5, sm: 4 },
            width: { xs: 'calc(100% - 24px)', sm: undefined },
            maxHeight: { xs: 'calc(100dvh - 24px)', sm: 'calc(100dvh - 64px)' },
            overflow: 'hidden',
            ...(paperSx ?? {}),
          },
        },
      }}
      {...rest}
    />
  );
}
