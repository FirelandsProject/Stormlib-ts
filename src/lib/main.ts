import bindings from "bindings";

const {
  createArchive,
  openArchive,
  closeArchive,
  addFile,
  extractFile,
  listFiles,
} = bindings("stormlib");

type StormLibOptions = {
  create?: boolean;
  flags?: number;
  maxFileCount?: number;
  priority?: number;
};

export class StormLib {
  handle: any; // To store the file pointer from c++
  constructor(filename: string, options: StormLibOptions = {}) {
    if (options.create) {
      this.handle = createArchive(
        filename,
        options.flags || 0,
        options.maxFileCount || 1000
      );
    } else {
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
   * @returns {string[]} Returns the list of files in the archive
   */
  listFiles(): string[] {
    return listFiles(this.handle);
  }
}
