import { unpack } from "7zip-min";
import * as tar from "tar";
import fs from "fs";
import path from "path";
import os from "os";

const platform = os.platform();
const arch = os.arch();
// get the last git tag name
const VERSION = await getLatestTag();
const TAR_NAME = `stormlib-ts-${platform}-${arch}.tar.gz`;
const BIN_URL = `https://github.com/FirelandsProject/Stormlib-ts/releases/download/${VERSION}/${TAR_NAME}`;
const STORMLIB_BIN_DIR = path.join(process.cwd(), "build", "Release");
const FILE_DIR = path.join(STORMLIB_BIN_DIR, TAR_NAME);

console.log("StormLib TS version:", VERSION);
const compilationPath = path.join(process.cwd(), "StormLib");

if (fs.existsSync(compilationPath)) {
  console.log("🪣 Deleting compilation directory...");
  fs.mkdirSync(compilationPath, { recursive: true });
}

if (!fs.existsSync(STORMLIB_BIN_DIR)) {
  console.log("📁 Creating build directory...");
  fs.mkdirSync(STORMLIB_BIN_DIR, { recursive: true });
}

downloadBinary(FILE_DIR).then(async (skip) => {
  if (skip) {
    console.log("⏸️ Skip download binary");
    const buildDir = path.join(process.cwd(), "build");
    fs.rmSync(buildDir, { recursive: true });
    return;
  }
  console.log("📚 Extracting Binaries...");
  unpack(FILE_DIR, STORMLIB_BIN_DIR, (err) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    const unpackFile = FILE_DIR.slice(0, -3);
    tar.extract({
      file: unpackFile,
      cwd: STORMLIB_BIN_DIR,
      sync: true,
    });
    fs.unlinkSync(FILE_DIR);
    fs.unlinkSync(unpackFile);
    console.log("✅ StormLib TS setup completed.");
  });
});

async function downloadBinary(dest = "") {
  console.log(`💾 Downloading Binaries from ${BIN_URL}`);
  try {
    const response = await fetch(BIN_URL);
    if (!response.ok) {
      return true;
    }
    const buffer = await response.arrayBuffer();
    const stream = fs.createWriteStream(dest);
    stream.write(Buffer.from(buffer));
    stream.end();
    console.log("🏁 Download completed. 🏁");

    return false;
  } catch (err) {
    return true;
  }
}

async function getLatestTag() {
  const apiUrl =
    "https://api.github.com/repos/FirelandsProject/Stormlib-ts/releases/latest";

  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.tag_name;
}
