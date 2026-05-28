'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';

export type BasicTableColumn<TData> = {
  header: string;
  key: keyof TData;
  align?: 'left' | 'center' | 'right';
};

interface BasicTableProps<TData extends Record<string, string | number>> {
  title: string;
  columns: BasicTableColumn<TData>[];
  rows: TData[];
}

export function BasicTable<TData extends Record<string, string | number>>({
  title,
  columns,
  rows,
}: BasicTableProps<TData>) {
  return (
    <Box sx={{ maxWidth: 920 }}>
      <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 700 }}>
        {title}
      </Typography>
      <TableContainer component={Paper} sx={{ borderRadius: '14px', boxShadow: 'none' }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1f2937' }} data-testid="table-header-row">
              {columns.map((column) => (
                <TableCell
                  key={String(column.key)}
                  align={column.align ?? 'left'}
                  sx={{ color: '#f9fafb', fontWeight: 700, letterSpacing: '0.01em' }}
                >
                  {column.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={`row-${index}`}>
                {columns.map((column) => (
                  <TableCell key={`${String(column.key)}-${index}`} align={column.align ?? 'left'}>
                    {String(row[column.key])}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
