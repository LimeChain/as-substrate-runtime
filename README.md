# as-runtime-playground
This is a playground for AS research

## Build AS WASM

1. Go to `as-runtime`
2. execute `npm run asbuild`
New `wasm-code.json` will be generated

## Build Rust Project
1. Go to `rust-runtime`
2. Copy the `code` from the `wasm-code.json` file
3. Paste the `code` into `src/main` -> `wasm_code` variable
4. Execute `cargo run`
