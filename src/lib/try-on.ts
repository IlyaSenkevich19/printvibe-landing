export type ProductId = "tshirt" | "hoodie" | "mug" | "sticker";

const EVENT = "printvibe:try-on";

export function requestTryOn(product: ProductId) {
  window.dispatchEvent(new CustomEvent<ProductId>(EVENT, { detail: product }));
}

export function onTryOnRequest(handler: (product: ProductId) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<ProductId>).detail);
  window.addEventListener(EVENT, listener);
  return () => window.removeEventListener(EVENT, listener);
}
