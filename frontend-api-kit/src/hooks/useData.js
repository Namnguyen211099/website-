/**
 * Custom Hook: useData(fn, deps)
 * - Tải dữ liệu API một cách thống nhất
 * - Quản lý loading / error / data
 *
 * Sử dụng:
 *   const { data, loading, error, refetch } = useData(() => getAllServices({ cat }), [cat]);
 */
import { useEffect, useState, useCallback } from 'react';

export default function useData(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const r = await fetcher();
      setData(r);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, deps); // eslint-disable-line

  useEffect(() => { load(); }, [load]);

  return { data, loading, error, refetch: load };
}
