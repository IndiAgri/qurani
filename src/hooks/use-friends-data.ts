"use client";

import * as React from "react";
import { MOCK_FRIENDS } from "@/data/mock-setoran-data";

interface UseSearchUsersOptions {
  userId?: string;
  query?: string;
  limit?: number;
}

export function useSearchUsers({ query = "", limit = 5 }: UseSearchUsersOptions = {}) {
  const [isLoading, setIsLoading] = React.useState(false);

  const users = React.useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return MOCK_FRIENDS.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.username?.toLowerCase().includes(q) ||
        u.nickname?.toLowerCase().includes(q)
    ).slice(0, limit);
  }, [query, limit]);

  return { users, isLoading };
}
