// Converts a number to a roman numeral: 3 -> "III", 14 -> "XIV".
// Used by the field-guide theme's "PLATE III" captions.

const NUMERALS: [number, string][] = [
  [1000, 'M'],
  [900, 'CM'],
  [500, 'D'],
  [400, 'CD'],
  [100, 'C'],
  [90, 'XC'],
  [50, 'L'],
  [40, 'XL'],
  [10, 'X'],
  [9, 'IX'],
  [5, 'V'],
  [4, 'IV'],
  [1, 'I'],
];

export function toRoman(value: number): string {
  if (value <= 0) return String(value);
  let remaining = value;
  let result = '';
  for (const [amount, symbol] of NUMERALS) {
    while (remaining >= amount) {
      result += symbol;
      remaining -= amount;
    }
  }
  return result;
}
