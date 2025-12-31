import { execSync } from "child_process";
import { existsSync } from "node:fs";

describe("cli", () => {
  beforeAll(() => {
    // Ensure project is built before running CLI - Only build if dist/lib folder doesn't exist
    if (!existsSync("dist")) {
      execSync("npm run build", { stdio: "inherit" });
    }
    execSync("npm link", { stdio: "inherit" });
  });
  it("should run when no files are found", () => {
    const result = execSync("npm run typed-scss-modules src").toString();

    expect(result).toContain("No files found.");
  });

  describe("examples", () => {
    it("should run the basic example without errors", () => {
      //  npm exec typed-scss-modules "examples/default-export/**/*.scss" -- --exportType default --nameFormat kebab --banner
      const result = execSync(
        `typed-scss-modules "examples/basic/**/*.scss" --includePaths examples/basic/core --aliases.~alias variables --banner '// example banner'`
      ).toString();

      expect(result).toContain("Found 4 files. Generating type definitions...");
    });

    it("should run the default-export example without errors", () => {
      const result = execSync(
        `typed-scss-modules "examples/default-export/**/*.scss" --exportType default --nameFormat kebab --banner '// example banner'`
      ).toString();

      expect(result).toContain("Found 1 file. Generating type definitions...");
    });
  });
});
