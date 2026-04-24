import { 
  PageObjectResponse, 
  BlockObjectResponse,
  RichTextItemResponse
} from "@notionhq/client/build/src/api-endpoints";

export type NotionBlock = BlockObjectResponse & {
  [key: string]: unknown; // To support various block types
};

export interface NotionPage extends PageObjectResponse {
  properties: Record<string, any>;
}

export type NotionRichText = RichTextItemResponse;

export interface NotionProperty {
  type: string;
  [key: string]: unknown;
}

export interface NotionTitleProperty extends NotionProperty {
  type: 'title';
  title: Array<{ plain_text: string }>;
}

export interface NotionRichTextProperty extends NotionProperty {
  type: 'rich_text';
  rich_text: Array<{ plain_text: string }>;
}

export interface NotionDateProperty extends NotionProperty {
  type: 'date';
  date: { start: string; end: string | null; time_zone: string | null } | null;
}

export interface NotionMultiSelectProperty extends NotionProperty {
  type: 'multi_select';
  multi_select: Array<{ id: string; name: string; color: string }>;
}

export interface NotionSelectProperty extends NotionProperty {
  type: 'select';
  select: { id: string; name: string; color: string } | null;
}

export interface NotionDateValue {
    start: string;
    end: string | null;
    time_zone: string | null;
}

export interface NotionCheckboxProperty extends NotionProperty {
  type: 'checkbox';
  checkbox: boolean;
}

export interface NotionFilesProperty extends NotionProperty {
  type: 'files';
  files: Array<
    | { type: 'external'; external: { url: string }; name: string }
    | { type: 'file'; file: { url: string; expiry_time: string }; name: string }
  >;
}
