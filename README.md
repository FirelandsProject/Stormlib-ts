# 🔥 Firelands core Stormlib implementation

This is a Node.js package that provides bindings for the [StormLib C++ library](https://github.com/ladislav-zezula/StormLib), allowing you to work with MPQ (Mo'PaQ) archives in your Node.js projects for World of Warcraft and other Blizzard games.

## 📖 Table of Contents

- [🔥 Firelands core Stormlib implementation](#-firelands-core-stormlib-implementation)
  - [📖 Table of Contents](#-table-of-contents)
  - [🚀 Installation](#-installation)
  - [➿ Usage](#-usage)
  - [🧰 API](#-api)
    - [`StormLib` class](#stormlib-class)
      - [Constructor: `new StormLib(filename, options)`](#constructor-new-stormlibfilename-options)
      - [Methods](#methods)
  - [⚛️ Development](#️-development)
  - [🧮 Testing](#-testing)
  - [🤝 Contributing](#-contributing)
  - [📜 License](#-license)
  - [🙏 Acknowledgements](#-acknowledgements)

## 🚀 Installation

```bash
npm install @firelands/stormlib-ts
```

## ➿ Usage

Here's a basic example of how to use stormlib-ts:

```javascript
import { StormLib } from '@firelands/stormlib-ts';

// Create a new MPQ archive
const storm = new StormLib('new_archive.mpq', { create: true });

// Add a file to the archive
storm.addFile('local_file.txt', 'archived_file.txt');

// Extract a file from the archive
storm.extractFile('archived_file.txt', 'extracted_file.txt');

// List files in the archive
const files = storm.listFiles();
console.log('Files in the archive:', files);

// Don't forget to close the archive when you're done
storm.close();
```

## 🧰 API

### `StormLib` class

#### Constructor: `new StormLib(filename, options)`

- `filename`: Path to the MPQ archive
- `options`:
    - `create`: Boolean, set to `true` to create a new archive
    - `flags`: Optional flags for creating/opening the archive
    - `maxFileCount`: Maximum number of files (only used when creating a new archive)

#### Methods

- `addFile(localFilename, archivedName, flags)`: Add a file to the archive
- `extractFile(archivedName, localFilename)`: Extract a file from the archive
- `listFiles()`: List all files in the archive
- `close()`: Close the archive

## ⚛️ Development

To set up the project for development:

1. Clone the repository:
   ```
   git clone https://github.com/FirelandsProject/Stormlib-ts.git
   cd Stormlib-ts
   ```

2. Install dependencies:
   ```
   pnpm i
   ```

## 🧮 Testing

To run the tests:

```
npm test
```

The tests use Mocha as the test runner and Chai for assertions.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/my-feature`)
3. Commit your changes (`git commit -m 'feat: some changes in the feature'`)
4. Push to the branch (`git push origin feat/my-feature`)
5. Open a Pull Request

## 📜 License

This project is licensed under the `AGPL-3.0-only` License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [StormLib](https://github.com/ladislav-zezula/StormLib) by Ladislav Zezula
- All contributors who have helped with code, bug reports, and suggestions