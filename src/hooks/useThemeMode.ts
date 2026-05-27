import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleTheme as toggleThemeAction } from '@/store/slices/themeSlice';

export function useThemeMode() {
  const dispatch = useAppDispatch();
  const mode = useAppSelector((state) => state.theme.resolvedMode);

  const toggleTheme = () => {
    dispatch(toggleThemeAction());
  };

  return { mode, toggleTheme };
}
