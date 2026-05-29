'use client';

import { IntlErrorCode, useTranslations as useNextIntlTranslations } from 'next-intl';

type Translator = ReturnType<typeof useNextIntlTranslations>;

const isMissingMessageError = (error: unknown): error is { code: string } => {
  if (typeof error !== 'object' || error === null || !('code' in error)) {
    return false;
  }

  return (error as { code?: string }).code === IntlErrorCode.MISSING_MESSAGE;
};

function withMissingMessageFallback<TTranslator extends Translator>(
  translator: TTranslator
): TTranslator {
  const hasKey = (key: string) => {
    try {
      return translator.has(key as never);
    } catch {
      return false;
    }
  };

  const safeTranslator = ((key: string, ...args: unknown[]) => {
    if (!hasKey(key)) {
      return key;
    }

    try {
      return (translator as (targetKey: string, ...targetArgs: unknown[]) => string)(key, ...args);
    } catch (error) {
      if (isMissingMessageError(error)) {
        return key;
      }

      throw error;
    }
  }) as TTranslator;

  safeTranslator.rich = ((key: string, ...args: unknown[]) => {
    if (!hasKey(key)) {
      return key;
    }

    try {
      return translator.rich(key as never, ...(args as never[]));
    } catch (error) {
      if (isMissingMessageError(error)) {
        return key;
      }

      throw error;
    }
  }) as TTranslator['rich'];

  safeTranslator.markup = ((key: string, ...args: unknown[]) => {
    if (!hasKey(key)) {
      return key;
    }

    try {
      return translator.markup(key as never, ...(args as never[]));
    } catch (error) {
      if (isMissingMessageError(error)) {
        return key;
      }

      throw error;
    }
  }) as TTranslator['markup'];

  safeTranslator.raw = ((key: string) => {
    if (!hasKey(key)) {
      return key;
    }

    try {
      return translator.raw(key as never);
    } catch (error) {
      if (isMissingMessageError(error)) {
        return key;
      }

      throw error;
    }
  }) as TTranslator['raw'];

  safeTranslator.has = ((key: string) => {
    return hasKey(key);
  }) as TTranslator['has'];

  return safeTranslator;
}

export const useTranslations: typeof useNextIntlTranslations = ((namespace?: unknown) => {
  const translator = useNextIntlTranslations(namespace as never);
  return withMissingMessageFallback(translator);
}) as typeof useNextIntlTranslations;
