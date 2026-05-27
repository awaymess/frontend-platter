'use client';

import { useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
  SortingState,
} from '@tanstack/react-table';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Stack,
  Card,
} from '@awaymess/ui';
import type { SxProps, Theme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { useThemeMode } from '@/hooks/useThemeMode';
import RowActions from './RowActions';

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  title?: string;
  subtitle?: string;
  searchPlaceholder?: string;
  actions?: React.ReactNode;
  pageSize?: number;
}

function getColumnKey<T>(column: ColumnDef<T>) {
  const target = column as { id?: unknown; accessorKey?: unknown };
  if (typeof target.id === 'string') return target.id;
  if (typeof target.accessorKey === 'string') return target.accessorKey;
  return '';
}

function isDateColumnKey(key: string) {
  const normalized = key.toLowerCase();
  return (
    normalized.includes('date') ||
    normalized.includes('time') ||
    normalized.endsWith('at') ||
    normalized === 'createdat' ||
    normalized === 'updatedat'
  );
}

function getDefaultTimeSorting<T>(columns: ColumnDef<T>[]): SortingState {
  const keys = columns.map(getColumnKey).filter(Boolean);
  const preferredKey =
    keys.find((key) => key.toLowerCase() === 'createdat') ||
    keys.find((key) => key.toLowerCase() === 'updatedat') ||
    keys.find(isDateColumnKey);

  return preferredKey ? [{ id: preferredKey, desc: true }] : [];
}

export default function DataTable<T>({
  data,
  columns,
  title,
  subtitle,
  searchPlaceholder = 'ค้นหา...',
  actions,
  pageSize = 15,
}: DataTableProps<T>) {
  const { mode } = useThemeMode();
  const [sorting, setSorting] = useState<SortingState>(() => getDefaultTimeSorting(columns));
  const [globalFilter, setGlobalFilter] = useState('');
  const stickyBackground = mode === 'dark' ? 'rgb(25, 25, 33)' : 'rgb(250, 251, 255)';
  const stickyHeaderBackground = mode === 'dark' ? 'rgb(31, 31, 42)' : 'rgb(245, 247, 252)';

  function stickyColumnSx(columnId: string, isHeader = false): SxProps<Theme> {
    if (columnId === 'select' || columnId === 'checkbox') {
      return {
        position: 'sticky',
        left: 0,
        zIndex: isHeader ? 8 : 5,
        width: 56,
        minWidth: 56,
        maxWidth: 56,
        background: isHeader ? stickyHeaderBackground : stickyBackground,
      };
    }

    if (columnId === 'actions') {
      return {
        position: 'sticky',
        right: 0,
        zIndex: isHeader ? 8 : 5,
        width: { xs: 54, md: 'fit-content' },
        minWidth: { xs: 54, md: 'fit-content' },
        maxWidth: { xs: 54, md: 'fit-content' },
        flexWrap: 'nowrap',
        whiteSpace: 'nowrap',
        background: isHeader ? stickyHeaderBackground : stickyBackground,
        textAlign: 'center',
        '& > *': {
          width: 'fit-content',
          maxWidth: 'fit-content',
          display: 'inline-flex',
          flexWrap: 'nowrap',
          whiteSpace: 'nowrap',
          textAlign: 'center',
        },
      };
    }

    return {};
  }

  function dateColumnSx(columnId: string) {
    const normalized = columnId.toLowerCase();
    const isDateLike =
      normalized.includes('date') ||
      normalized.includes('time') ||
      normalized.endsWith('at') ||
      normalized === 'createdat' ||
      normalized === 'updatedat';

    if (!isDateLike) return {};

    return {
      whiteSpace: 'nowrap' as const,
      minWidth: 132,
    };
  }

  // TanStack Table returns stateful helpers that React Compiler intentionally skips.
  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });
  const pageCount = table.getPageCount();

  return (
    <Card>
      {/* Header */}
      {(title || actions) && (
        <Box
          sx={{
            p: { xs: 1, sm: 1, md: 1.5 },
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            gap: { xs: 1.5, md: 2.25 },
            borderBottom: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          }}
        >
          <Box
            sx={{
              flex: { xs: '1 1 100%', md: '0 0 240px', lg: '0 0 320px' },
              minWidth: 0,
            }}
          >
            {title && (
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.25,
                  letterSpacing: 0,
                  fontSize: { xs: 24, md: 20 },
                }}
              >
                {title}
              </Typography>
            )}
            {subtitle && (
              <Typography
                variant="body2"
                sx={{
                  mt: 0.4,
                  opacity: 0.6,
                  display: 'block',
                  fontSize: { xs: 15, md: 13 },
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: { xs: 'flex-start', md: 'flex-end' },
              flex: { xs: '1 1 100%', md: '1 1 320px', lg: '1 1 420px' },
              minWidth: 0,
            }}
          >
            <TextField
              size="small"
              placeholder={searchPlaceholder}
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: <Search size={16} style={{ marginRight: 8, opacity: 0.5 }} />,
                },
              }}
              sx={{
                width: '100%',
                maxWidth: { xs: '100%', md: 520, xl: 640 },
                '& .MuiOutlinedInput-root': {
                  borderRadius: '18px',
                  minHeight: { xs: 46, md: 42 },
                },
              }}
            />
          </Box>
          {actions && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
                gap: 1,
                flex: { xs: '1 1 100%', md: '0 1 auto' },
                width: { xs: '100%', md: 'auto' },
                minWidth: 0,
                '& .MuiButton-root': {
                  minHeight: { xs: 42, md: 42, lg: 38 },
                  borderRadius: '18px',
                  textTransform: 'none',
                  fontWeight: 750,
                  whiteSpace: 'nowrap',
                },
                '& > .MuiButton-root': {
                  flex: { xs: '1 1 150px', sm: '0 0 auto' },
                },
                '& > .MuiStack-root': {
                  flexWrap: 'wrap',
                  gap: 1,
                  width: { xs: '100%', md: 'auto' },
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                },
                '& > .MuiBox-root': {
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 1,
                  width: { xs: '100%', md: 'auto' },
                  justifyContent: { xs: 'flex-start', md: 'flex-end' },
                },
                '& > .MuiStack-root .MuiButton-root, & > .MuiBox-root .MuiButton-root': {
                  flex: { xs: '1 1 150px', sm: '0 0 auto' },
                },
              }}
            >
              {actions}
            </Box>
          )}
        </Box>
      )}

      {/* Table */}
      <TableContainer
        sx={{
          maxHeight: { xs: 'calc(100dvh - 250px)', md: 'calc(100vh - 280px)' },
          overflow: 'auto',
        }}
      >
        <Table stickyHeader size="small" sx={{ minWidth: { xs: 720, md: 900 } }}>
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableCell
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    sx={{
                      cursor: header.column.getCanSort() ? 'pointer' : 'default',
                      fontWeight: 700,
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 0.5,
                      userSelect: 'none',
                      whiteSpace: 'nowrap',
                      background: mode === 'dark' ? 'rgba(30,30,40,0.6)' : 'rgba(245,245,250,0.8)',
                      ...dateColumnSx(header.column.id),
                      ...stickyColumnSx(header.column.id, true),
                    }}
                  >
                    <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        <ArrowUpDown size={14} style={{ opacity: 0.4 }} />
                      )}
                    </Stack>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                hover
                sx={{
                  '&:last-child td': { border: 0 },
                  transition: 'background 0.15s',
                }}
              >
                {row.getVisibleCells().map((cell) => {
                  const cellContent = flexRender(cell.column.columnDef.cell, cell.getContext());
                  return (
                    <TableCell
                      key={cell.id}
                      sx={{
                        py: 1.5,
                        fontSize: 13,
                        verticalAlign: 'middle',
                        ...dateColumnSx(cell.column.id),
                        ...stickyColumnSx(cell.column.id),
                      }}
                    >
                      {cell.column.id === 'actions' ? (
                        <RowActions>{cellContent}</RowActions>
                      ) : (
                        cellContent
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  sx={{ textAlign: 'center', py: 6, opacity: 0.5 }}
                >
                  ไม่พบข้อมูล
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box
        sx={{
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderTop: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'}`,
          flexWrap: 'wrap',
          gap: 1,
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.6, px: 1 }}>
          ทั้งหมด {table.getFilteredRowModel().rows.length} รายการ
        </Typography>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <IconButton
            size="small"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronsLeft size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <ChevronLeft size={16} />
          </IconButton>
          <Typography variant="caption" sx={{ px: 1.5, fontWeight: 600 }}>
            {pageCount === 0
              ? '0 / 0'
              : `${table.getState().pagination.pageIndex + 1} / ${pageCount}`}
          </Typography>
          <IconButton
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <ChevronRight size={16} />
          </IconButton>
          <IconButton
            size="small"
            onClick={() => table.setPageIndex(Math.max(pageCount - 1, 0))}
            disabled={!table.getCanNextPage()}
          >
            <ChevronsRight size={16} />
          </IconButton>
        </Stack>
      </Box>
    </Card>
  );
}
