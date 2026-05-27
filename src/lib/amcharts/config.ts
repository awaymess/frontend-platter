// amCharts 5 configuration
// License key should be set here if you have one

export const amchartsConfig = {
  // Set your license key here
  // license: 'YOUR_LICENSE_KEY',
  themes: {
    light: {
      colors: [
        '#3B82F6',
        '#8B5CF6',
        '#22C55E',
        '#F59E0B',
        '#EF4444',
        '#06B6D4',
        '#EC4899',
        '#F97316',
      ],
      background: '#FFFFFF',
      text: '#0F172A',
      grid: '#E2E8F0',
    },
    dark: {
      colors: [
        '#60A5FA',
        '#A78BFA',
        '#4ADE80',
        '#FBBF24',
        '#F87171',
        '#22D3EE',
        '#F472B6',
        '#FB923C',
      ],
      background: '#0F172A',
      text: '#F8FAFC',
      grid: '#334155',
    },
  },
} as const;
