# LXGW WenKai GB source evidence

Task: `wedding-v5-font`. Only this directory was written by the font source task.

Official family: **LXGW WenKai GB / 霞鹜文楷 GB**, Regular, version **1.522; March 17, 2026**. The font name table confirms the GB family rather than TC.

- Repository: https://github.com/lxgw/LxgwWenkaiGB
- Release: https://github.com/lxgw/LxgwWenkaiGB/releases/tag/v1.522
- Font: https://github.com/lxgw/LxgwWenkaiGB/releases/download/v1.522/LXGWWenKaiGB-Regular.ttf
- License: https://raw.githubusercontent.com/lxgw/LxgwWenkaiGB/v1.522/OFL.txt
- License type: SIL Open Font License 1.1; redistribute the included complete `OFL.txt` alongside the web font.
- Original TTF: `LXGWWenKaiGB-Regular.ttf` (25,819,540 bytes).
- SHA-256: `295568c131648062107543aa159c97dd49564be791136c2abf74cad83eba3f7f`.

`verification.json` records font name/version and actual cmap plus contour checks. All requested glyphs 汪、家、喆、朱、敏、囍 and & are present in both the original font and proof WOFF2. 喆 is U+5586 / u5586 and has six contours. 囍 is U+56CD / u56CD and has eleven contours.

The existing shared Python has fontTools 4.64.0 and Brotli; no packages were installed. This command was run successfully from the repository root:

```sh
python3 -m fontTools.subset \
  assets/font-sources/lxgw-wenkai-gb/LXGWWenKaiGB-Regular.ttf \
  --text='汪家喆 & 朱敏囍' \
  --flavor=woff2 \
  --output-file=assets/font-sources/lxgw-wenkai-gb/signature-proof.woff2 \
  --layout-features='*' \
  --no-recalc-timestamp \
  --recommended-glyphs
```

For production, pass the complete existing project glyph collection as the `--text=` argument (using Node `spawnSync` argv, without a shell), or save that collection as UTF-8 and use `--text-file=PATH`. Set the output path to the parent-owned `app/assets/letter-hand.woff2`, copy `OFL.txt` to the parent-owned font license path, and use the GB family in source declarations and future subsetting. The test subset here is only a signature proof and is not the full site subset.
