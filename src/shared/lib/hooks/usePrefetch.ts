import { useQueryClient } from '@tanstack/react-query';

export function usePrefetch<T>(queryKey: unknown[], queryFn: () => Promise<T>) {
  const queryClient = useQueryClient();

  const prefetch = () => {
    queryClient.prefetchQuery({ queryKey, queryFn });
  };

  return {
    onMouseEnter: prefetch,
    onFocus: prefetch,
  };
}
