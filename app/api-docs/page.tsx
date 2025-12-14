import { readFile } from "fs/promises";
import ApiDocsClient from "./ApiDocsClient";

export default async function Page() {
  const spec = await readFile(process.cwd() + "/docs/api/openapi.yaml", "utf8");
  return <ApiDocsClient spec={spec} />;
}
