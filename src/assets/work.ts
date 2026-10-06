import hoodie from "./work-hoodie.jpg";
import hoodie480 from "./work-hoodie-480.webp";
import hoodie640 from "./work-hoodie-640.webp";
import hoodie816 from "./work-hoodie.webp";
import mug from "./work-mug.jpg";
import mug480 from "./work-mug-480.webp";
import mug640 from "./work-mug-640.webp";
import mug816 from "./work-mug.webp";
import stickers from "./work-stickers.jpg";
import stickers480 from "./work-stickers-480.webp";
import stickers640 from "./work-stickers-640.webp";
import stickers816 from "./work-stickers.webp";
import tshirt from "./work-tshirt.jpg";
import tshirt480 from "./work-tshirt-480.webp";
import tshirt640 from "./work-tshirt-640.webp";
import tshirt816 from "./work-tshirt.webp";

export type WorkImage = {
  src: string;
  srcSet: string;
  width: number;
  height: number;
};

function image(src: string, w480: string, w640: string, w816: string): WorkImage {
  return {
    src,
    srcSet: `${w480} 480w, ${w640} 640w, ${w816} 816w`,
    width: 816,
    height: 816,
  };
}

export const workImages = {
  tshirt: image(tshirt, tshirt480, tshirt640, tshirt816),
  hoodie: image(hoodie, hoodie480, hoodie640, hoodie816),
  mug: image(mug, mug480, mug640, mug816),
  stickers: image(stickers, stickers480, stickers640, stickers816),
};
