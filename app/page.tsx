"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";

type ToolStatus = "warming" | "idle" | "ready" | "converting" | "done" | "error";
type WorkerMessage =
  | { kind: "warm-ok" }
  | { kind: "result"; dng: ArrayBuffer }
  | { kind: "error"; message: string };

const maxFileBytes = 200 * 1024 * 1024;
const largeFileBytes = 100 * 1024 * 1024;
const sourceUrl = "https://github.com/sagwaco/x3fuse-core/tree/4435690328429a25ec9436ff750c01ce8fe95dba";
const extensionOf = (name: string) => name.split(".").pop()?.toLowerCase() ?? "";
const baseNameOf = (name: string) => name.replace(/\.[^/.]+$/, "");
const formatBytes = (bytes: number) => bytes < 1024 * 1024
  ? `${(bytes / 1024).toFixed(1)} KB`
  : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

const friendlyError = (message: string) => {
  if (/memory|out of bounds|unreachable|allocation/i.test(message)) {
    return "ブラウザのメモリが不足した可能性があります。ほかのタブを閉じるか、PCのブラウザでお試しください。";
  }
  if (/x3i|unsupported|not supported|No decoder|unknown/i.test(message)) {
    return "このX3F、カメラ、または撮影モードにはまだ対応していません。X3Iファイルは変換できません。";
  }
  return `変換できませんでした。元のX3Fは変更されていません。(${message})`;
};

const downloadBlob = (blob: Blob, name: string) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1500);
};

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<ToolStatus>("warming");
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [denoise, setDenoise] = useState(false);
  const [output, setOutput] = useState<{ blob: Blob; name: string; seconds: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const startedAtRef = useRef(0);
  const fileNameRef = useRef("converted.x3f");

  useEffect(() => {
    const worker = new Worker("/x3f-to-dng/x3f-worker.js", { type: "module" });
    workerRef.current = worker;
    worker.onmessage = (event: MessageEvent<WorkerMessage>) => {
      const message = event.data;
      if (message.kind === "warm-ok") {
        setStatus((current) => current === "warming" ? "idle" : current);
      } else if (message.kind === "result") {
        const blob = new Blob([message.dng], { type: "image/x-adobe-dng" });
        setOutput({
          blob,
          name: `${baseNameOf(fileNameRef.current)}.dng`,
          seconds: Math.max(0.1, (performance.now() - startedAtRef.current) / 1000),
        });
        setStatus("done");
      } else {
        setError(friendlyError(message.message));
        setStatus("error");
      }
    };
    worker.onerror = () => {
      setError("変換処理が停止しました。ページを再読み込みして、もう一度お試しください。");
      setStatus("error");
    };
    worker.postMessage({ kind: "warm" });
    return () => worker.terminate();
  }, []);

  const selectFile = (selected: File) => {
    setError(null);
    setWarning(null);
    setOutput(null);
    if (extensionOf(selected.name) !== "x3f") {
      setFile(null);
      setStatus("error");
      setError("拡張子が .x3f のファイルを選んでください。");
      return;
    }
    if (selected.size > maxFileBytes) {
      setFile(null);
      setStatus("error");
      setError("現在は1ファイル200MBまで対応しています。");
      return;
    }
    setFile(selected);
    fileNameRef.current = selected.name;
    setStatus("ready");
    if (selected.size > largeFileBytes) {
      setWarning("大きなX3Fは多くのメモリを使用します。PCで、ほかのタブを閉じてからの変換をおすすめします。");
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.files?.[0];
    if (selected) selectFile(selected);
    event.target.value = "";
  };

  const convert = async () => {
    if (!file || !workerRef.current || status === "converting") return;
    setError(null);
    setOutput(null);
    setStatus("converting");
    startedAtRef.current = performance.now();
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      workerRef.current.postMessage({ kind: "convert", bytes, denoise }, [bytes.buffer]);
    } catch (conversionError) {
      setError(friendlyError(conversionError instanceof Error ? conversionError.message : String(conversionError)));
      setStatus("error");
    }
  };

  const reset = () => {
    setFile(null);
    setOutput(null);
    setError(null);
    setWarning(null);
    setStatus("idle");
  };

  const save = async () => {
    if (!output) return;
    const sharedFile = new File([output.blob], output.name, { type: output.blob.type });
    const canShare = typeof navigator.share === "function" &&
      (typeof navigator.canShare !== "function" || navigator.canShare({ files: [sharedFile] }));
    if (canShare) {
      try {
        await navigator.share({ files: [sharedFile], title: output.name });
        return;
      } catch (shareError) {
        if (shareError instanceof Error && shareError.name === "AbortError") return;
      }
    }
    downloadBlob(output.blob, output.name);
  };

  const statusLabel = status === "warming" ? "Loading engine" :
    status === "converting" ? "Developing layers" :
    status === "done" ? "DNG ready" :
    status === "error" ? "Check message" : "Local processing";

  return (
    <main className="site-shell">
      <nav className="top-nav">
        <a className="wordmark" href="../">iruagaru / photo tool</a>
        <span className="top-nav-links">
          <a href="../raw-to-dng/">RAW DNG ↗</a>
          <a href="../convert/">Convert ↗</a>
          <a href="../frame/">Frame ↗</a>
        </span>
      </nav>

      <header className="hero">
        <div className="hero-title">
          <p className="eyebrow">X3F to DNG / public beta</p>
          <h1>Foveon,<br />set free.</h1>
          <div className="layer-mark" aria-hidden="true"><i /><i /><i /></div>
        </div>
        <p className="hero-copy">Sigma Merrill／QuattroのX3Fを、ブラウザの中だけでLinear DNGへ。写真はサーバーへ送信されません。</p>
      </header>

      <section className="tool-grid" aria-labelledby="converter-title">
        <aside className="tool-aside">
          <div className="status-row">
            <span className={`status-dot status-${status}`} aria-hidden="true" />
            <span>{statusLabel}</span>
          </div>
          <dl className="spec-list">
            <div><dt>Input</dt><dd>X3F</dd></div>
            <div><dt>Output</dt><dd>Linear DNG</dd></div>
            <div><dt>Upload</dt><dd>None</dd></div>
            <div><dt>Limit</dt><dd>200 MB</dd></div>
          </dl>
          <p className="aside-note">変換後も元のX3Fは残してください。DNGは現像・閲覧ソフトごとに見え方が異なる場合があります。</p>
        </aside>

        <div className="converter-panel">
          <div className="panel-heading">
            <div><p className="step-label">01 / SOURCE</p><h2 id="converter-title">X3Fを選ぶ</h2></div>
            {file && <button className="text-button" type="button" onClick={reset}>選び直す</button>}
          </div>

          {!file ? (
            <label
              className={`drop-zone ${isDragging ? "is-dragging" : ""}`}
              onDragOver={(event: DragEvent<HTMLLabelElement>) => { event.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={(event: DragEvent<HTMLLabelElement>) => {
                event.preventDefault(); setIsDragging(false);
                const selected = event.dataTransfer.files?.[0];
                if (selected) selectFile(selected);
              }}
            >
              <input type="file" accept=".x3f" onChange={handleInput} />
              <span className="drop-plus">+</span>
              <strong>X3Fを選択</strong>
              <span>または、ここへドロップ</span>
            </label>
          ) : (
            <div className="selected-file">
              <div><span className="file-type">X3F</span><strong>{file.name}</strong></div>
              <span>{formatBytes(file.size)}</span>
            </div>
          )}

          {warning && <p className="message warning-message">{warning}</p>}
          {error && <p className="message error-message">{error}</p>}

          <div className="options-row">
            <div><p className="step-label">02 / DEVELOP</p><h3>変換設定</h3></div>
            <label className="toggle-option">
              <span><strong>ノイズ低減</strong><small>処理時間が大幅に長くなります</small></span>
              <input type="checkbox" checked={denoise} onChange={(event) => setDenoise(event.target.checked)} disabled={status === "converting"} />
            </label>
          </div>

          {output ? (
            <div className="output-panel">
              <div><span className="success-mark">✓</span><p><strong>{output.name}</strong><span>{formatBytes(output.blob.size)} / {output.seconds.toFixed(1)}秒</span></p></div>
              <button className="primary-button" type="button" onClick={save}>DNGを保存</button>
            </div>
          ) : (
            <button className="primary-button convert-button" type="button" onClick={convert} disabled={!file || status === "converting" || status === "warming"}>
              {status === "warming" ? "エンジンを準備中…" : status === "converting" ? "変換しています…" : "Linear DNGへ変換"}
            </button>
          )}
          {status === "converting" && <div className="progress-line" aria-label="変換中"><span /></div>}
        </div>
      </section>

      <section className="support-section">
        <div><p className="step-label">COMPATIBILITY</p><h2>対応しているX3F</h2></div>
        <div className="support-copy">
          <p>DP1／DP2／DP3 Merrill、SD1 Merrill、dp0／dp1／dp2／dp3 Quattro、sd Quattro／HのX3Fを対象にしています。</p>
          <p>X3Iには対応していません。Public betaのため、変換後のDNGを確認してから運用してください。</p>
        </div>
      </section>

      <section className="privacy-section">
        <p className="step-label">LOCAL BY DESIGN</p>
        <div><h2>ブラウザだけで処理。</h2><p>選んだX3Fの読み込み、現像、DNG生成は、すべてブラウザ内で実行します。ファイルがサーバーへ送信・保存されることはありません。ページを閉じれば作業データも残りません。</p></div>
      </section>

      <footer>
        <p>Built with <a href={sourceUrl} target="_blank" rel="noreferrer">x3fuse-core ↗</a> / Apache-2.0</p>
        <p>Free tool by <a href="https://nobu.works/" target="_blank" rel="noreferrer">nobu.works ↗</a></p>
      </footer>
    </main>
  );
}
