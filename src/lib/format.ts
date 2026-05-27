type DateInput = string | number | Date | null | undefined;

const TH_LOCALE = 'th-TH';

export function formatNumber(
  value: number | string | null | undefined,
  options?: Intl.NumberFormatOptions
) {
  return Number(value ?? 0).toLocaleString(TH_LOCALE, options);
}

export function formatMoney(
  value: number | string | null | undefined,
  options?: Intl.NumberFormatOptions
) {
  return `฿${formatNumber(value, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    ...options,
  })}`;
}

export function formatMoneyCompact(value: number | string | null | undefined) {
  return `฿${formatNumber(value)}`;
}

export function formatThaiDate(value: DateInput) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(TH_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  });
}

export function formatThaiDateTime(value: DateInput) {
  if (!value) return '-';
  return new Date(value).toLocaleString(TH_LOCALE, {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatMonthLabel(value: DateInput) {
  if (!value) return '-';
  return new Date(value).toLocaleDateString(TH_LOCALE, {
    month: 'long',
    year: 'numeric',
  });
}

export function monthKey(value: DateInput) {
  if (!value) return '';
  const date = new Date(value);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

export function shortId(id?: string | null, visibleLength = 5) {
  if (!id) return '-';
  if (id === 'default') return 'default';
  return id.length > 12 ? `...${id.slice(-visibleLength)}` : id;
}
