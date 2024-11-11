import bindings from "bindings";

const {
  createArchive,
  openArchive,
  closeArchive,
  addFile,
  extractFile,
  listFiles,
  openFileEx,
  closeFile,
  readFile,
} = bindings("stormlib");

type StormLibOptions = {
  mode?: "create" | "open";
  flags?: number;
  maxFileCount?: number;
  priority?: number;
};

export class StormLib {
  handle: any; // To store the file pointer from c++
  handleEx: any; // To store the file pointer inside the archive from c++

  constructor(filename: string, options: StormLibOptions = {}) {
    if (!options.mode) {
      options.mode = "open";
    }
    if (options.mode === "create") {
      this.handle = createArchive(
        filename,
        options.flags || 0,
        options.maxFileCount || 1000
      );
    } else if (options.mode === "open") {
      this.handle = openArchive(
        filename,
        options.priority || 0,
        options.flags || 0
      );
    }
  }

  /**
   * This function closes the opened archive
   * @returns {Boolean} Returns true if the archive was closed, else return false
   */
  close(): Boolean {
    return closeArchive(this.handle);
  }

  /**
   *
   * @param localFilename Path in the host file system
   * @param archivedName Name in the archive
   * @param flags File flags
   * @returns {Boolean} Returns true if the file was successfully added, else return false
   */
  addFile(localFilename: string, archivedName: string, flags = 0): Boolean {
    return addFile(this.handle, localFilename, archivedName, flags);
  }

  /**
   *
   * @param archivedName Name in the archive
   * @param localFilename File system path
   * @returns {Boolean} Returns true if the file was successfully extracted, else return false
   */
  extractFile(archivedName: string, localFilename: string): Boolean {
    return extractFile(this.handle, archivedName, localFilename);
  }

  /**
   * This function returns the list of files in the archive
   * @param searchMask Search mask
   * @returns {string[]} Returns the list of files in the archive
   */
  listFiles(searchMask: string = "*"): string[] {
    return listFiles(this.handle, searchMask);
  }

  /**
   * this function opens a file inside the archive
   * @param archivedName Name in the archive
   * @param flags File flags
   * @returns {Boolean} Returns true if the file was successfully opened, else return false
   */
  openFileEx(archivedName: string, flags = 0) {
    this.handleEx = openFileEx(this.handle, archivedName, flags);
    if (this.handleEx) {
      return true;
    }
    return false;
  }

  /**
   * This function closes the opened file
   * @returns {Boolean} Returns true if the file was closed, else return false
   */
  closeFile(): boolean {
    return closeFile(this.handleEx);
  }

  /**
   * This function reads the file content inside the archive.
   * @param size buffer size
   * @returns {string} Returns the file content
   */
  readFile(size: number): string {
    return readFile(this.handleEx, size);
  }
}
