import init, { convert_x3f_to_dng } from "./wasm/x3f_wasm.js";

const engineReady = init();

self.onmessage = async (event) => {
  const message = event.data;
  try {
    await engineReady;
    if (message.kind === "warm") {
      self.postMessage({ kind: "warm-ok" });
      return;
    }
    if (message.kind !== "convert") return;

    const converted = convert_x3f_to_dng(message.bytes, true, Boolean(message.denoise));
    const output = converted.slice();
    self.postMessage({ kind: "result", dng: output.buffer }, [output.buffer]);
  } catch (error) {
    self.postMessage({
      kind: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
};
