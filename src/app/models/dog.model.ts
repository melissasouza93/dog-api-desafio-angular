export interface Dog {
  id: string;
  name: string;
  temperament?: string;
  life_span?: string;
  origin?: string;
  weight: { metric: string };
  height: { metric: string };
  reference_image_id?: string;
}
