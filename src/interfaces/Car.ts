export interface Car {
  make: string;
  model: string;
  generation: string;
  slug: string;
  imagePath: string[];
  parameters: { name: string; value: string }[];
}
