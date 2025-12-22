/**
 * OpenAPI 3.1 -> 3.0.3 변환 스크립트
 * - const -> enum 변환
 * - OpenAPI 버전 변경
 */
const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "../docs/api/openapi-bundled.json");
const outputPath = path.join(__dirname, "../docs/api/openapi-3.0.json");

function convertSpec(obj) {
  if (typeof obj !== "object" || obj === null) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertSpec);
  }

  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    // const를 enum으로 변환
    if (key === "const") {
      result["enum"] = [value];
    } else {
      result[key] = convertSpec(value);
    }
  }
  return result;
}

// 파일 읽기
const spec = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// OpenAPI 버전 변경
spec.openapi = "3.0.3";

// 스펙 변환
const converted = convertSpec(spec);

// 파일 쓰기
fs.writeFileSync(outputPath, JSON.stringify(converted, null, 2), "utf8");

console.log("✅ OpenAPI 3.0.3 변환 완료:", outputPath);
