import { pathToFileURL } from "node:url";
import { validateVoltarisV2Pack } from "../../src/cyborgclaw/genome/index.js";

async function main() {
  const result = await validateVoltarisV2Pack();
  if (process.argv.includes("--print-expected")) {
    console.log(JSON.stringify(result.digests, null, 2));
    process.exit(result.ok ? 0 : 1);
  }
  if (!result.ok) {
    for (const error of result.errors) {
      console.error(error);
    }
    process.exit(1);
  }
  console.log("Voltaris V2 pack valid.");
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  void main();
}
