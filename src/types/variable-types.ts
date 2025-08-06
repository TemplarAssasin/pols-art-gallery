// Contains Different Object Structure

export type FormState = {
  title: string;
  date: string;
  description: string;
  file: File | null;
  fileName: string;
};

export type CardInfo = {
  id?: number | any;
  title?: string;
  date?: string;
  image_url?: string | any;
  onClick?: () => void;
  showDelete?: boolean;
};

export type GalleryItem = {
    id: number;
    title: string;
    description: string;
    date: string;
    image_url: string;
}

export type PopCardInfo = {
    id?: number;
    title?: string;
    description?: string;
    date?: string;
    image_url?: string | any;
}