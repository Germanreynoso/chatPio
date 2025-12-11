export type VersionStatus = 'draft' | 'published' | 'archived';

export interface VersionMetadata {
  id: string;
  versionNumber: number;
  createdAt: string;
  createdBy: string; // user email or ID
  area: string;
  formats: string[];
  languages: string[];
  topic: string;
  status: VersionStatus;
  publishedAt?: string;
  archivedAt?: string;
  wordCount?: number;
  audience?: string;
  isRefinement: boolean;
  parentVersionId?: string; // for refinements
}

export interface VersionContent {
  format: string;
  title: string;
  content: string;
  audioUrl?: string;
  audioBase64?: string;
  mimeType?: string;
}

export interface ContentVersion {
  metadata: VersionMetadata;
  content: VersionContent[];
  formData?: {
    tema: string;
    mensaje: string;
    contexto: string;
    audiencia: string;
    wordCount?: number;
  };
}

export interface VersionHistory {
  contentId: string; // unique ID for the content piece
  versions: ContentVersion[];
  lastModified: string;
}

export interface VersionSearchFilters {
  keyword?: string;
  dateFrom?: string;
  dateTo?: string;
  area?: string;
  user?: string;
  format?: string;
  status?: VersionStatus;
}

export interface VersionComparison {
  version1: ContentVersion;
  version2: ContentVersion;
  differences: {
    added: string[];
    removed: string[];
    modified: string[];
  };
}