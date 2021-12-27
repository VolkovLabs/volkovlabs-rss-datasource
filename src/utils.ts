/**
 * Set or added Item values
 */
export function setItem(items: any, key: string, value: string) {
  items[key] ? items[key].push(value) : (items[key] = [value]);
}
