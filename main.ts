import { parseArgs } from "jsr:@std/cli/parse-args";
import { red } from "jsr:@std/fmt/colors";

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["path"],
  });

  if (!flags.path) {
    console.log(red("Please provide a path"));
    Deno.exit(1);
  }

  console.log(flags.path);

  const module = await import(flags.path, {
    with: { type: "json" },
  });

  console.log(module);
}
