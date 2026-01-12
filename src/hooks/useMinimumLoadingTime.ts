import { useState } from "react";

/**
 * Hook to ensure loading states are visible for a minimum duration
 * to prevent flickering on fast operations.
 *
 * Following Vercel design guidelines:
 * - Add 150-300ms delay before showing loading
 * - Ensure 300-500ms minimum visibility once shown
 */
export function useMinimumLoadingTime(minimumMs = 300) {
  const [isLoading, setIsLoading] = useState(false);

  const withMinimumLoading = async <T,>(fn: () => Promise<T>): Promise<T> => {
    setIsLoading(true);
    const start = Date.now();

    try {
      const result = await fn();
      const elapsed = Date.now() - start;

      // Ensure loading state is visible for minimum duration
      if (elapsed < minimumMs) {
        await new Promise((resolve) => setTimeout(resolve, minimumMs - elapsed));
      }

      return result;
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, withMinimumLoading };
}
