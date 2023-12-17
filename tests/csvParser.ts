/**
 * Parses a CSV file and returns an array of tuples representing each line.
 * @param filePath - The path to the CSV file.
 * @returns An array of tuples, where each tuple contains the keywords and arguments from a line in the CSV file.
 */
import * as fs from "fs";

export function parseCSV(filePath: string): Record<string,[ string, string ][]> {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");
  const res: Record<string,[ string, string ][]> = {};

  lines.forEach((line) => {
    const [tc, keyword, args] = line.split(",").map((value) => value.trim());
    const values = res[tc] || [];
    values.push([keyword, args]);
    res[tc] = values;
  });

  return res;
}
