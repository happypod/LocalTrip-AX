"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface WishlistItem {
  href: string;
  title: string;
  summary?: string;
  priceText?: string;
  imageUrl?: string;
  badge?: string;
}

interface WishlistContextType {
  wishlist: WishlistItem[];
  addItem: (item: WishlistItem) => void;
  removeItem: (href: string) => void;
  toggleItem: (item: WishlistItem) => void;
  isInWishlist: (href: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

const STORAGE_KEY = "localtrip_wishlist";

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage on client side mount
  useEffect(() => {
    try {
      const storedData = localStorage.getItem(STORAGE_KEY);
      if (storedData) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setWishlist(JSON.parse(storedData));
      }
    } catch (error) {
      console.error("Failed to load wishlist from storage:", error);
    }
    setIsInitialized(true);
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist to storage:", error);
    }
  }, [wishlist, isInitialized]);

  const addItem = (item: WishlistItem) => {
    setWishlist((prev) => {
      if (prev.some((i) => i.href === item.href)) return prev;
      return [...prev, item];
    });
  };

  const removeItem = (href: string) => {
    setWishlist((prev) => prev.filter((item) => item.href !== href));
  };

  const isInWishlist = (href: string) => {
    return wishlist.some((item) => item.href === href);
  };

  const toggleItem = (item: WishlistItem) => {
    if (isInWishlist(item.href)) {
      removeItem(item.href);
    } else {
      addItem(item);
    }
  };

  const clearWishlist = () => {
    setWishlist([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addItem,
        removeItem,
        toggleItem,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
