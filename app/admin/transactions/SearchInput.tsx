'use client';

import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface SearchInputProps {
  initialSearch?: string;
}

export default function SearchInput({
  initialSearch = '',
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (searchTerm) {
        params.set('search', searchTerm);
      } else {
        params.delete('search');
      }

      params.set('page', '1');

      const nextUrl = `?${params.toString()}`;

      if (nextUrl !== window.location.search) {
        router.replace(nextUrl);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, router]);

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  return (
    <div className="flex items-center gap-2 rounded-lg border border-outline-variant bg-surface-container-low px-3 py-2">
      <Search className="h-4 w-4 text-on-surface-variant" />

      <input
        type="text"
        placeholder="Search by Order ID"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-64 bg-transparent text-sm text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none lg:w-96"
      />
    </div>
  );
}