import { existsSync, readFileSync } from "node:fs";

const candidateStatsFiles = [
  "docs/browser/stats.json",
  "docs/stats.json",
  "dist/browser/stats.json",
  "dist/stats.json",
];

const statsPath = candidateStatsFiles.find((path) => existsSync(path));

if (!statsPath) {
  console.error(
    "No Angular stats.json file found. Run a production build with --stats-json first.",
  );
  process.exit(1);
}

const stats = JSON.parse(readFileSync(statsPath, "utf8"));
const outputs = stats?.outputs ?? {};

if (Object.keys(outputs).length === 0) {
  console.error(`No outputs section found in ${statsPath}.`);
  process.exit(1);
}

const entryPoints = new Set([
  "src/main.ts",
  "angular:polyfills:angular:polyfills",
  "angular:styles/global:styles",
]);

const initialRoots = Object.entries(outputs)
  .filter(([, value]) => entryPoints.has(value?.entryPoint))
  .map(([name]) => name);

if (initialRoots.length === 0) {
  console.error(`No initial entry outputs found in ${statsPath}.`);
  process.exit(1);
}

const measuredAssets = [];
const queue = [...initialRoots];
const visited = new Set();

while (queue.length > 0) {
  const name = queue.shift();
  if (!name || visited.has(name)) {
    continue;
  }

  visited.add(name);
  const output = outputs[name];
  if (!output) {
    continue;
  }

  if (
    (name.endsWith(".js") || name.endsWith(".css")) &&
    typeof output.bytes === "number"
  ) {
    measuredAssets.push({ name, size: output.bytes });
  }

  const imports = Array.isArray(output.imports) ? output.imports : [];
  for (const imported of imports) {
    if (!imported?.path || imported.kind !== "import-statement") {
      continue;
    }
    queue.push(imported.path);
  }
}

if (measuredAssets.length === 0) {
  console.error(`No measurable initial JS/CSS assets found in ${statsPath}.`);
  process.exit(1);
}

measuredAssets.sort((a, b) => b.size - a.size);
const totalBytes = measuredAssets.reduce((sum, asset) => sum + asset.size, 0);
const largestAsset = measuredAssets[0];
const kb = (bytes) => (bytes / 1024).toFixed(2);

console.log(`Bundle stats source: ${statsPath}`);
console.log(`Initial JS/CSS total: ${kb(totalBytes)} KiB`);
console.log(
  `Largest initial asset: ${largestAsset.name} (${kb(largestAsset.size)} KiB)`,
);
console.log("Top 5 initial assets:");

for (const asset of measuredAssets.slice(0, 5)) {
  console.log(`- ${asset.name}: ${kb(asset.size)} KiB`);
}
