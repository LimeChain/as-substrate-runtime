cd ../runtime && npm run asbuild && cd ../sandbox && cargo test -- --nocapture --test test_block_builder_inherent_extrinsics && cd ..
