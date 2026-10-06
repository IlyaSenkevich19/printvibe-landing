const SIZE = 1200;
const BAND = 120;

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

function loadImage(url: string): Promise<HTMLImageElement> {
  const img = new Image();
  img.src = url;
  return img.decode().then(() => img);
}

/**
 * Rasterises the mockup SVG with a caption band. SVG rendered as an <img> cannot load
 * blob: URLs, so the design is inlined as a data URL first.
 */
export async function renderMockupPng(svg: SVGSVGElement, design: Blob, caption: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const dataUrl = await blobToDataUrl(design);
  clone.querySelectorAll("image").forEach((img) => img.setAttribute("href", dataUrl));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  clone.setAttribute("width", String(SIZE));
  clone.setAttribute("height", String(SIZE));

  const svgUrl = URL.createObjectURL(
    new Blob([new XMLSerializer().serializeToString(clone)], { type: "image/svg+xml" }),
  );

  try {
    const image = await loadImage(svgUrl);
    const canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE + BAND;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D is unavailable");

    ctx.fillStyle = "#fbfaf6";
    ctx.fillRect(0, 0, SIZE, SIZE);
    ctx.drawImage(image, 0, 0, SIZE, SIZE);

    ctx.fillStyle = "#1c1726";
    ctx.fillRect(0, SIZE, SIZE, BAND);
    ctx.fillStyle = "#f4f0e8";
    ctx.font = "700 40px Onest, system-ui, sans-serif";
    ctx.textBaseline = "middle";
    ctx.fillText(caption, 48, SIZE + BAND / 2 - 14);
    ctx.globalAlpha = 0.6;
    ctx.font = "500 24px Onest, system-ui, sans-serif";
    ctx.fillText("PrintVibe · примерная визуализация", 48, SIZE + BAND / 2 + 28);
    ctx.globalAlpha = 1;

    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("toBlob failed"))), "image/png"),
    );
  } finally {
    URL.revokeObjectURL(svgUrl);
  }
}
