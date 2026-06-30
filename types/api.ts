export interface ApiError {
  error: string;
  code?: string;
}

export interface MergeRequest {
  files: File[];
}

export interface ExtractRequest {
  file: File;
  pages: number[];
}

export interface RotateRequest {
  file: File;
  pages: RotatePage[];
}

export interface RotatePage {
  pageIndex: number;
  degrees: 90 | 180 | 270;
}

export interface NumberPagesRequest {
  file: File;
  startAt?: number;
  position?: PageNumberPosition;
  fontSize?: number;
}

export type PageNumberPosition =
  | "bottom-center"
  | "bottom-left"
  | "bottom-right"
  | "top-center"
  | "top-left"
  | "top-right";

export interface ProtectRequest {
  file: File;
  userPassword: string;
  ownerPassword?: string;
}

export interface UnlockRequest {
  file: File;
  password: string;
}

export interface VerifySignatureResult {
  hasDSS: boolean;
  signatures: SignatureInfo[];
  warning?: string;
}

export interface SignatureInfo {
  fieldName: string;
  subFilter?: string;
  reason?: string;
  location?: string;
  contactInfo?: string;
}

export interface VerifyMetadataResult {
  title?: string;
  author?: string;
  subject?: string;
  keywords?: string;
  creator?: string;
  producer?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount: number;
  pdfVersion?: string;
  fileSize: number;
  isEncrypted: boolean;
  isTagged: boolean;
}

export interface CompareMetadataField {
  label: string;
  a: string | null;
  b: string | null;
  match: boolean;
}

export interface CompareMetadataResult {
  fields: CompareMetadataField[];
  totalFields: number;
  matchingFields: number;
}

export interface IntegrityCheck {
  label: string;
  status: "ok" | "warn" | "fail";
  detail?: string;
}

export interface AnalyzeIntegrityResult {
  checks: IntegrityCheck[];
  score: number;
  pageCount: number;
  fileSize: number;
}
