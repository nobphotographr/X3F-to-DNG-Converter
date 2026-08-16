# X3F to DNG Converter

Sigma Merrill／QuattroのX3Fを、サーバーへ送信せずブラウザ内でLinear DNGへ変換するWebアプリです。

Public beta: <https://xpreview.iruagaru.com/x3f-to-dng/>

## Features

- 変換はWebAssemblyを使って端末内で完結
- Linear DNG + lossless compression
- 任意のノイズ低減
- DP1/2/3 Merrill、SD1 Merrill、dp0/1/2/3 Quattro、sd Quattro/Hを対象
- スマートフォンの共有シート／通常ダウンロードに対応

X3Iには対応していません。元のX3Fは必ず保持してください。

## Development

```bash
npm install
./scripts/build-wasm.sh
npm run dev
```

静的サイトを書き出す場合:

```bash
npm run build
```

`out/` を `/x3f-to-dng/` 配下へ配置します。

## Engine

変換エンジンには [x3fuse-core](https://github.com/sagwaco/x3fuse-core) を使用しています。Web版に必要なメモリ上のDNG出力を追加し、正確な参照元を `vendor/x3fuse-core/` に同梱しています。

参照コミット: `4435690328429a25ec9436ff750c01ce8fe95dba`

ライセンスの詳細は [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) と `vendor/x3fuse-core/LICENSE` を参照してください。

## Legacy desktop prototype

以前のPython製X3F→TIFFプロトタイプは `legacy/` に保存しています。現在公開しているWeb版とは別実装です。

## License

このリポジトリ固有のコードはMIT Licenseです。`vendor/` 以下の第三者コードには各ディレクトリ内のライセンスが適用されます。
