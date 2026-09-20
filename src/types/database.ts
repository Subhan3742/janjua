export type InquiryStatus = "new" | "contacted" | "completed" | "cancelled";

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  service: string;
  preferred_date: string | null;
  message: string | null;
  status: InquiryStatus;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  image_url: string;
  storage_path: string | null;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
};

export type Service = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  category: string;
  icon: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

export type Promotion = {
  id: string;
  title: string;
  description: string | null;
  discount: number;
  cta_label: string;
  is_active: boolean;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

export type SiteSettings = {
  id: number;
  business_name: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  location: string;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  updated_at: string;
};

/** Minimal typed surface for the tables this project touches. */
export type Database = {
  public: {
    Tables: {
      inquiries: {
        Row: Inquiry;
        Insert: Omit<Inquiry, "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: InquiryStatus;
        };
        Update: Partial<Omit<Inquiry, "id">>;
        Relationships: [];
      };
      gallery: {
        Row: GalleryImage;
        Insert: Omit<GalleryImage, "id" | "created_at" | "sort_order" | "is_featured"> & {
          id?: string;
          created_at?: string;
          sort_order?: number;
          is_featured?: boolean;
        };
        Update: Partial<Omit<GalleryImage, "id">>;
        Relationships: [];
      };
      services: {
        Row: Service;
        Insert: Omit<Service, "id" | "created_at" | "sort_order" | "is_active"> & {
          id?: string;
          created_at?: string;
          sort_order?: number;
          is_active?: boolean;
        };
        Update: Partial<Omit<Service, "id">>;
        Relationships: [];
      };
      promotions: {
        Row: Promotion;
        Insert: Omit<Promotion, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<Promotion, "id">>;
        Relationships: [];
      };
      site_settings: {
        Row: SiteSettings;
        Insert: Partial<SiteSettings> & { id?: number };
        Update: Partial<SiteSettings>;
        Relationships: [];
      };
    };
    Views: { [_ in never]: never };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      inquiry_status: InquiryStatus;
    };
    CompositeTypes: { [_ in never]: never };
  };
};
