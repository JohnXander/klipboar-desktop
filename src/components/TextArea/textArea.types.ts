import { CopiedMetadata } from "../../../electron/main.types";

export interface HandleConvertToCharArrayProps {
  inputtedTextValue: string | null;
  textValueIsPasted: boolean;
  copiedMetadata: CopiedMetadata | undefined;
}

export interface CharValue {
  value: string;
  copiedAt: string | null;
  copiedFrom: string | null;
}

export interface HandleAddTextValueProps {
  cursorIndexBefore: number;
  inputtedTextValue: string | null;
  textValueIsPasted: boolean;
  copiedMetadata: CopiedMetadata | undefined;
  setTotalTextareaValue: React.Dispatch<React.SetStateAction<CharValue[]>>;
}

export interface HandleDeleteTextValueProps {
  cursorIndexBefore: number;
  end: number;
  isTextSelected: boolean;
  setTotalTextareaValue: React.Dispatch<React.SetStateAction<CharValue[]>>;
}

export interface HandleSelectedTextProps {
  event: React.ChangeEvent<HTMLTextAreaElement>;
  setCursorIndexBefore: React.Dispatch<React.SetStateAction<number>>;
  setCursorIndexAfter: React.Dispatch<React.SetStateAction<number>>;
}

export interface HandleTextareaChangeProps {
  event: React.ChangeEvent<HTMLTextAreaElement>;
  cursorIndexBefore: number;
  cursorIndexAfter: number;
  isTextSelected: boolean;
  setIsTextSelected: React.Dispatch<React.SetStateAction<boolean>>;
  setCursorIndexBefore: React.Dispatch<React.SetStateAction<number>>;
  setTotalTextareaValue: React.Dispatch<React.SetStateAction<CharValue[]>>;
  copiedMetadata: CopiedMetadata | undefined;
}
