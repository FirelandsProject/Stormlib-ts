import { unpack } from "7zip-min";
import * as tar from "tar";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";

const platform = os.platform();
const arch = os.arch();
// get the last git tag name
const VERSION = execSync("git describe --tags --abbrev=0").toString().trim();
const TAR_NAME = `stormlib-ts-${platform}-${arch}.tar.gz`;
const BIN_URL = `https://github.com/FirelandsProject/Stormlib-ts/releases/download/${VERSION}/${TAR_NAME}`;
const STORMLIB_BIN_DIR = path.join(process.cwd(), "build", "Release");
const FILE_DIR = path.join(STORMLIB_BIN_DIR, TAR_NAME);

if (!fs.existsSync(STORMLIB_BIN_DIR)) {
  fs.mkdirSync(STORMLIB_BIN_DIR, { recursive: true });
}

downloadBinary(FILE_DIR).then(() => {
  console.log("Extracting Binaries...");
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
    console.log("StormLib compilation completed.");
  });
});

async function downloadBinary(dest = "") {
  console.log(`Downloading Binaries from ${BIN_URL}`);
  const response = await fetch(BIN_URL);
  const buffer = await response.arrayBuffer();
  const stream = fs.createWriteStream(dest);
  stream.write(Buffer.from(buffer));
  stream.end();
  return true;
}
