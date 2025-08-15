export interface MenuItem {
  id: string;
  name: string;
  hasDropdown?: boolean;
  hasSubmenu?: boolean;
  weblink?: string;
  submenu?: MenuItem[];
}

export type ItemCollectionListApiResponse = {
  items: Array<{
    id: string;
    cmsLocaleId: string | null;
    lastPublished: string;
    lastUpdated: string;
    createdOn: string;
    isArchived: boolean;
    isDraft: boolean;
    fieldData: {
      weblink: string;
      region: string;
      state: string;
      name: string;
      slug: string;
    };
  }>;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
};

export type WorldItem = {
  id: string;
  cmsLocaleId: string | null;
  lastPublished: string;
  lastUpdated: string;
  createdOn: string;
  isArchived: boolean;
  isDraft: boolean;
  fieldData: {
    summary: string;
    name: string;
    duration: string;
    brief: string;
    "internal-reference": string;
    "location-s": string;
    slug: string;
    image: {
      fileId: string;
      url: string;
      alt: string | null;
    };
    "type-of-listing": string;
    "continent-2": string[];
    "meta-title": string;
    "meta-description": string;
  };
};
