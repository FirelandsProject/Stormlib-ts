import { StormLib } from "../dist/main.js";
import { resolve } from "path";

async function runTest() {
  try {
    // Test creating a new archive
    const storm = new StormLib(resolve(process.cwd(), "example/base-Win.MPQ"));
    const files = storm.listFiles("*Wow.exe");
    files.forEach((file) => {
      const nameParts = file.split("\\");
      const extracted = storm.extractFile(
        file,
        resolve(
          process.cwd(),
          "./example/extracted/" + nameParts[nameParts.length - 1]
        )
      );
      console.log(
        `File: ${nameParts[nameParts.length - 1]} ${extracted ? "extracted" : "not extracted"}`
      );
    });
  } catch (error) {
    console.error("Test failed:", error);
  }
}

runTest();
