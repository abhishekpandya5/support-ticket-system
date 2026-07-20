import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import type { ListTicketsParams } from '../../api/types';
import { useDebounce } from '../useDebounce';
import {
  buildTicketListSearchParams,
  hasActiveTicketListFilters,
  parseTicketListFilters,
  toListTicketsParams,
  type TicketListFilterValues,
} from '../../utils/ticketListFilters';

const SEARCH_DEBOUNCE_MS = 300;

export type UseTicketListFiltersResult = {
  filters: TicketListFilterValues;
  listParams: ListTicketsParams;
  hasActiveFilters: boolean;
  setSearch: (search: string) => void;
  setStatus: (status: TicketListFilterValues['status']) => void;
  setPriority: (priority: TicketListFilterValues['priority']) => void;
  setAssignedTo: (assignedTo: string) => void;
  clearFilters: () => void;
};

export function useTicketListFilters(): UseTicketListFiltersResult {
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseTicketListFilters(searchParams),
    [searchParams],
  );
  const [searchInput, setSearchInput] = useState(filters.search);
  const debouncedSearch = useDebounce(searchInput, SEARCH_DEBOUNCE_MS);

  const updateFilters = useCallback(
    (nextFilters: TicketListFilterValues) => {
      setSearchParams(buildTicketListSearchParams(nextFilters), {
        replace: true,
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  useEffect(() => {
    const trimmedSearch = debouncedSearch.trim();

    if (trimmedSearch === filters.search.trim()) {
      return;
    }

    updateFilters({
      ...filters,
      search: debouncedSearch,
    });
  }, [debouncedSearch, filters, updateFilters]);

  const setSearch = useCallback((search: string) => {
    setSearchInput(search);
  }, []);

  const setStatus = useCallback(
    (status: TicketListFilterValues['status']) => {
      updateFilters({
        ...filters,
        status,
      });
    },
    [filters, updateFilters],
  );

  const setPriority = useCallback(
    (priority: TicketListFilterValues['priority']) => {
      updateFilters({
        ...filters,
        priority,
      });
    },
    [filters, updateFilters],
  );

  const setAssignedTo = useCallback(
    (assignedTo: string) => {
      updateFilters({
        ...filters,
        assignedTo,
      });
    },
    [filters, updateFilters],
  );

  const clearFilters = useCallback(() => {
    setSearchInput('');
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  const listParams = useMemo(
    () => toListTicketsParams(filters),
    [filters],
  );

  return {
    filters: {
      ...filters,
      search: searchInput,
    },
    listParams,
    hasActiveFilters: hasActiveTicketListFilters(filters),
    setSearch,
    setStatus,
    setPriority,
    setAssignedTo,
    clearFilters,
  };
}
