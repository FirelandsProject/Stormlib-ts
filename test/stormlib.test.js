import { expect } from "chai";
import { file as tmpFile, dir as tmpDir } from "tmp-promise";
import fs from "fs/promises";
import path from "path";
import { StormLib } from "../dist/main.js";

describe("StormLib::Archive", () => {
  const testFileContent = "Hello, World!";
  const archivedFileName = "archived_test.txt";
  let testMpqPath;
  let tmpDirPath;

  beforeEach(async () => {
    tmpDirPath = await tmpDir({ unsafeCleanup: true });
    testMpqPath = path.join(tmpDirPath.path, "test.mpq");

    const archive = new StormLib(testMpqPath, { mode: "create" });
    const tempFile = await tmpFile();
    await fs.writeFile(tempFile.path, testFileContent);
    archive.addFile(tempFile.path, archivedFileName);
    archive.close();
  });

  afterEach(async () => {
    await tmpDirPath.cleanup();
  });

  describe("#constructor", () => {
    it("creates a new archive", async () => {
      const tempFile = await tmpFile({ postfix: ".mpq" });
      expect(
        () => new StormLib(tempFile.path, { mode: "create" })
      ).to.not.throw();
    });

    it("opens an existing archive", () => {
      expect(() => new StormLib(testMpqPath)).to.not.throw();
    });
  });

  describe("#addFile", () => {
    it("adds a file to the archive", async () => {
      const tempMpq = await tmpFile({ postfix: ".mpq" });
      const archive = new StormLib(tempMpq.path, { mode: "create" });

      const tempFile = await tmpFile();
      await fs.writeFile(tempFile.path, "New content");

      expect(archive.addFile(tempFile.path, "new_archived_file.txt")).to.be
        .true;
      archive.close();
    });
  });

  describe("#extractFile", () => {
    it("extracts a file from the archive", async () => {
      const archive = new StormLib(testMpqPath);
      const extractedFile = await tmpFile();

      expect(archive.extractFile(archivedFileName, extractedFile.path)).to.be
        .true;
      const content = await fs.readFile(extractedFile.path, "utf8");
      expect(content).to.equal(testFileContent);

      archive.close();
    });
  });

  describe("#close", () => {
    it("closes the archive without errors", () => {
      const archive = new StormLib(testMpqPath);
      expect(() => archive.close()).to.not.throw();
    });
  });

  describe("#listFiles", () => {
    it("lists files in the archive", () => {
      const archive = new StormLib(testMpqPath);
      const fileList = archive.listFiles();

      expect(fileList).to.be.an("array");
      expect(fileList).to.include(archivedFileName);

      archive.close();
    });
  });

  describe("#openFileEx and #closeFile after open", () => {
    it("opens a file inside the archive", () => {
      const archive = new StormLib(testMpqPath);
      expect(archive.openFileEx(archivedFileName)).to.be.true;
      expect(archive.closeFile()).to.be.true;
    });
  });

  describe("#readFile", () => {
    it("reads the file content inside the archive", () => {
      const archive = new StormLib(testMpqPath);
      expect(archive.openFileEx(archivedFileName)).to.be.true;
      expect(archive.readFile(testFileContent.length)).to.equal(
        testFileContent
      );
      expect(archive.closeFile()).to.be.true;
    });
  });
});
