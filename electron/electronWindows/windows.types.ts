import { CopiedMetadata } from "../main.types";

export type CreateWindowProps = (
  VITE_DEV_SERVER_URL: string | undefined,
  RENDERER_DIST: string,
  VITE_PUBLIC: string,
  copiedMetadata: CopiedMetadata
) => void;
