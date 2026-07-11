import { renderOgImage } from "@/lib/og";

export { alt, contentType, size } from "@/lib/og";

export default function Image() {
  return renderOgImage();
}
