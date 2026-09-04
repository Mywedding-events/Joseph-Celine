import { readdir } from "node:fs/promises";
import path from "node:path";

const uploadsDirectory = path.join(process.cwd(), "public", "uploads");

export async function getNumberedUploadImages(): Promise<string[]> {
  const entries = await readdir(uploadsDirectory, { withFileTypes: true });

  return entries
    .flatMap((entry) => {
      if (!entry.isFile()) return [];

      const match = entry.name.match(/^(\d+)\.[^.]+$/);
      if (!match) return [];

      return [
        {
          number: BigInt(match[1]),
          name: entry.name,
        },
      ];
    })
    .sort((left, right) => {
      if (left.number < right.number) return -1;
      if (left.number > right.number) return 1;
      return left.name.localeCompare(right.name);
    })
    .map(({ name }) => `/uploads/${encodeURIComponent(name)}`);
}
