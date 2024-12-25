export function groupBy<T>(
    array: T[],
    keyOrFn: keyof T | ((item: T) => string)
  ): { [key: string]: T[] } {
    return array.reduce((result, currentItem) => {
      const groupKey = typeof keyOrFn === 'function'
        ? keyOrFn(currentItem)
        : String(currentItem[keyOrFn]);
      (result[groupKey] = result[groupKey] || []).push(currentItem);
      return result;
    }, {} as { [key: string]: T[] });
  }
