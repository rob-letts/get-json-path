import { parseArgs } from "jsr:@std/cli/parse-args";
import { red } from "jsr:@std/fmt/colors";
import { select } from "npm:@inquirer/prompts";

type JSONObject = Record<string, string | Record<string, string>>;
type Choice = { name: string; value: string };

if (import.meta.main) {
  const flags = parseArgs(Deno.args, {
    string: ["path"],
  });

  if (!flags.path) {
    console.log(red("Please provide a path to a JSON file"));
    Deno.exit(1);
  }

  const module = await import(flags.path, {
    with: { type: "json" },
  });

  let currentObj = module.default;
  let result = "";

  while (true) {
    const keys = getKeys(currentObj);

    const shouldContinueEarly = keys.length === 1;
    if (shouldContinueEarly) {
      const [{ value: newKey }] = keys
      result = appendToResult(result, newKey);

      if (typeof currentObj[newKey] === "string") {
        console.log(`Result: ${result}\nnewKey: ${currentObj[newKey]}`);
        break;
      }

      currentObj = currentObj[newKey];
      continue;
    }

    const newKey = await select({
      message: "Select a key:",
      choices: keys,
    });

    result = appendToResult(result, newKey);

    const shouldBreak = typeof currentObj[newKey] === "string";
    if (shouldBreak) {
      console.log(`Result: ${result}\nValue: ${currentObj[newKey]}`);
      break;
    }

    currentObj = currentObj[newKey];
  }

  Deno.exit(0);
}

function appendToResult(result: string, key: string): string {
  return result ? `${result}.${key}` : key;
}

function getKeys(obj: JSONObject): Choice[] {
  return Object.keys(obj).map((key) => {
    return {
      name: key,
      value: key,
    };
  });
}