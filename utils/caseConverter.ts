/**
 * Supported case types for conversion.
 */
export type CaseType =
  | "camelCase"
  | "snakeCase"
  | "kebabCase"
  | "pascalCase"
  | "screamingSnakeCase"
  | "dotCase";

/**
 * Options for case conversion.
 *
 * @property {boolean} [preserveConsecutiveUppercase=false] - Whether to preserve consecutive uppercase letters as a group.
 * @property {string[]} [preserveSpecificKeys=[]] - Array of keys to exclude from case conversion.
 */
export interface ConvertCaseOptions {
  preserveConsecutiveUppercase?: boolean;
  preserveSpecificKeys?: string[];
}

const defaultConverters: Record<CaseType, (str: string) => string> = {
  camelCase: (str) => str.replace(/[-_.](\w)/g, (_, c) => c.toUpperCase()),
  snakeCase: (str) =>
    str
      .replace(/([A-Z])/g, "_$1")
      .toLowerCase()
      .replace(/^_/, "")
      .replace(/[-.]/, "_"),
  kebabCase: (str) =>
    str
      .replace(/([A-Z])/g, "-$1")
      .toLowerCase()
      .replace(/^-/, "")
      .replace(/[_.]/, "-"),
  pascalCase: (str) =>
    str
      .split(/[-_.]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(""),
  screamingSnakeCase: (str) =>
    str
      .replace(/([A-Z])/g, "_$1")
      .toUpperCase()
      .replace(/^_/, "")
      .replace(/[-.]/, "_"),
  dotCase: (str) =>
    str
      .replace(/([A-Z])/g, ".$1")
      .toLowerCase()
      .replace(/^\./, "")
      .replace(/[-_]/, "."),
};

const isObject = (val: unknown): val is Record<string, unknown> =>
  typeof val === "object" && val !== null && !Array.isArray(val);

/**
 * Class for performing case conversion on objects.
 */
class CaseConverter {
  private readonly options: Required<ConvertCaseOptions>;

  /**
   * Creates an instance of CaseConverter.
   *
   * @param toCaseType - The target case type for conversion.
   * @param options - Options for case conversion.
   */
  constructor(
    private toCaseType: CaseType,
    options: ConvertCaseOptions = {},
  ) {
    this.options = {
      preserveConsecutiveUppercase: false,
      preserveSpecificKeys: [],
      ...options,
    };
  }

  /**
   * Converts a single string to the target case.
   *
   * @private
   * @param str - The string to convert.
   * @returns The converted string.
   */
  private convert(str: string): string {
    if (this.options.preserveConsecutiveUppercase) {
      str = str
        .replace(/([A-Z]+)/g, (match) => `_${match.toLowerCase()}_`)
        .replace(/^_|_$/g, "");
    }
    return defaultConverters[this.toCaseType](str);
  }

  /**
   * Recursively converts the keys of an object to the target case.
   *
   * @private
   * @param obj - The object to convert.
   * @returns The converted object.
   */
  private convertObject(obj: Record<string, unknown>): Record<string, unknown> {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        this.options.preserveSpecificKeys.includes(key)
          ? key
          : this.convert(key),
        isObject(value) ? this.convertObject(value) : value,
      ]),
    );
  }

  /**
   * Executes the case conversion on the provided data.
   *
   * @param data - The object to convert.
   * @returns The converted object.
   * @throws {Error} If the input is not an object.
   */
  public execute(data: object): Record<string, unknown> {
    if (!isObject(data)) {
      throw new Error("Input must be an object");
    }

    return this.convertObject(data);
  }
}

/**
 * Converts the case of keys in an object.
 *
 * @param data - The object to convert.
 * @param toCaseType - The target case type for conversion.
 * @param options - Options for case conversion.
 * @returns The converted object.
 */
export function convertCase(
  data: object,
  toCaseType: CaseType,
  options: ConvertCaseOptions = {},
): Record<string, unknown> {
  const converter = new CaseConverter(toCaseType, options);
  return converter.execute(data);
}

/**
 * Benchmarks the performance of the convertCase function.
 *
 * @param data - The object to convert.
 * @param toCaseType - The target case type for conversion.
 * @param options - Options for case conversion.
 * @param iterations - The number of iterations to run.
 * @returns The average and total execution time.
 */
export function benchmark(
  data: object,
  toCaseType: CaseType,
  options: ConvertCaseOptions = {},
  iterations: number = 1000,
): { averageTime: number; totalTime: number } {
  const start = Date.now();
  for (let i = 0; i < iterations; i++) {
    convertCase(data, toCaseType, options);
  }
  const end = Date.now();
  const totalTime = end - start;
  return {
    averageTime: totalTime / iterations,
    totalTime,
  };
}
