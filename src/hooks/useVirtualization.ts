import React, { useState, useEffect, useMemo, useCallback } from 'react';

interface VirtualizationOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
  data: any[];
}

interface VirtualizationResult {
  virtualItems: Array<{
    index: number;
    start: number;
    size: number;
    data: any;
  }>;
  totalSize: number;
  scrollToIndex: (index: number) => void;
  scrollElement: React.RefObject<HTMLDivElement>;
}

export const useVirtualization = ({
  itemHeight,
  containerHeight,
  overscan = 5,
  data
}: VirtualizationOptions): VirtualizationResult => {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElement = React.useRef<HTMLDivElement>(null);

  const totalSize = data.length * itemHeight;
  
  const visibleRange = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight),
      data.length - 1
    );
    
    return {
      start: Math.max(0, startIndex - overscan),
      end: Math.min(data.length - 1, endIndex + overscan)
    };
  }, [scrollTop, itemHeight, containerHeight, data.length, overscan]);

  const virtualItems = useMemo(() => {
    const items = [];
    for (let i = visibleRange.start; i <= visibleRange.end; i++) {
      items.push({
        index: i,
        start: i * itemHeight,
        size: itemHeight,
        data: data[i]
      });
    }
    return items;
  }, [visibleRange, itemHeight, data]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const scrollToIndex = useCallback((index: number) => {
    if (scrollElement.current) {
      scrollElement.current.scrollTop = index * itemHeight;
    }
  }, [itemHeight]);

  useEffect(() => {
    const element = scrollElement.current;
    if (!element) return;

    element.addEventListener('scroll', handleScroll as any);
    return () => element.removeEventListener('scroll', handleScroll as any);
  }, [handleScroll]);

  return {
    virtualItems,
    totalSize,
    scrollToIndex,
    scrollElement
  };
};