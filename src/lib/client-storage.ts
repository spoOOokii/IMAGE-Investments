"use client";

import { useEffect, useState } from "react";

const FAVORITES_KEY = "image-investments:favorites";
const COMPARE_KEY = "image-investments:compare";
const COMPARE_MAX = 3;

type Listener = () => void;

function createStore(key: string) {
  const listeners = new Set<Listener>();

  function read(): string[] {
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];
      return parsed.filter((item): item is string => typeof item === "string");
    } catch {
      return [];
    }
  }

  function write(next: string[]) {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // storage might be full / disabled — silently ignore
    }
    listeners.forEach((fn) => fn());
  }

  function subscribe(listener: Listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  return { read, write, subscribe };
}

const favoritesStore = createStore(FAVORITES_KEY);
const compareStore = createStore(COMPARE_KEY);

function useStore(store: ReturnType<typeof createStore>) {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    setItems(store.read());
    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === FAVORITES_KEY || event.key === COMPARE_KEY) {
        setItems(store.read());
      }
    };
    const unsubscribe = store.subscribe(() => setItems(store.read()));
    window.addEventListener("storage", handleStorage);
    return () => {
      unsubscribe();
      window.removeEventListener("storage", handleStorage);
    };
  }, [store]);

  return items;
}

export function useFavorites() {
  const items = useStore(favoritesStore);

  function toggle(slug: string) {
    const current = favoritesStore.read();
    const next = current.includes(slug)
      ? current.filter((item) => item !== slug)
      : [...current, slug];
    favoritesStore.write(next);
  }

  function has(slug: string) {
    return items.includes(slug);
  }

  function clear() {
    favoritesStore.write([]);
  }

  return { items, toggle, has, clear };
}

export function useCompare() {
  const items = useStore(compareStore);

  function toggle(slug: string) {
    const current = compareStore.read();
    if (current.includes(slug)) {
      compareStore.write(current.filter((item) => item !== slug));
      return;
    }
    if (current.length >= COMPARE_MAX) {
      // Replace the oldest entry to respect the max.
      compareStore.write([...current.slice(1), slug]);
      return;
    }
    compareStore.write([...current, slug]);
  }

  function has(slug: string) {
    return items.includes(slug);
  }

  function remove(slug: string) {
    compareStore.write(compareStore.read().filter((item) => item !== slug));
  }

  function clear() {
    compareStore.write([]);
  }

  return { items, toggle, has, remove, clear, max: COMPARE_MAX };
}
