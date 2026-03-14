# TinyNote

TinyNote is a lightweight Markdown note app built with Tauri 2, React, TypeScript, and Rust. It keeps notes as plain `.md` files on disk, uses a native macOS-style desktop shell, and focuses on fast local editing rather than cloud sync.

## Features

- Plain-text Markdown notes stored in a normal folder
- Split workflow for source editing and preview mode
- Local workspace switching through the app
- Native desktop packaging with Tauri
- Automatic welcome note and untitled note generation
- Custom TinyNote app icon and macOS bundle output

## Tech Stack

- Frontend: React 18, Vite, TypeScript, Tailwind CSS
- Editor: MDXEditor with CodeMirror-backed source mode
- Desktop shell: Tauri 2
- Backend: Rust

## Project Structure

```text
src/                  React UI, editor, state, shared frontend utilities
src/components/       Layout, note list, editor, buttons, dialogs
src/store/            Jotai atoms and app state
src/lib/              Tauri invoke wrappers and editor helpers
src-tauri/src/        Rust commands for filesystem-backed note operations
src-tauri/icons/      Tauri app icons used for packaging
public/               Static assets, including the source logo
```

## How It Stores Data

- Default notes directory: `~/TinyNote`
- Custom workspace path: saved in `settings.json` under the OS config directory
- macOS config example: `~/Library/Application Support/TinyNote/settings.json`

All notes are regular Markdown files. If the default workspace is empty, TinyNote creates a welcome note automatically.

## Development

Requirements:

- Node.js
- Yarn 1.x
- Rust stable toolchain
- Xcode Command Line Tools on macOS

Install dependencies:

```bash
yarn install
```

Run the web frontend only:

```bash
yarn dev
```

Run the desktop app in development:

```bash
yarn tauri dev
```

Create a production frontend build:

```bash
yarn build
```

Check the Rust backend:

```bash
cargo check --manifest-path src-tauri/Cargo.toml
```

## Packaging

Build a desktop release bundle:

```bash
yarn tauri build
```

macOS artifacts are generated under:

```text
src-tauri/target/release/bundle/macos/
src-tauri/target/release/bundle/dmg/
```

The current project has been verified to build `.app` and `.dmg` on macOS. For Windows and Linux, the recommended approach is platform-specific CI or native runners rather than relying on local cross-compilation.

## Notes and Limitations

- Preview mode is intentionally read-only.
- Image upload inside the editor is currently not configured.
- macOS release bundles are local builds only unless you add Developer ID signing and notarization.

## License

No license file is currently included in this repository.
