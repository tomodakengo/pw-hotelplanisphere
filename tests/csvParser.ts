/**
 * Parses a CSV file and returns an array of tuples representing each line.
 * @param filePath - The path to the CSV file.
 * @returns An array of tuples, where each tuple contains the keywords and arguments from a line in the CSV file.
 */
import * as fs from "fs";

export function parseCSV(filePath: string): Array<[string, string]> {
  const fileContent = fs.readFileSync(filePath, "utf8");
  const lines = fileContent.split("\n");
  return lines.map((line) => {
    const [keywords, args] = line
      .trim()
      .split(",")
      .map((part) => part.trim());
    return [keywords, args];
  });
}
