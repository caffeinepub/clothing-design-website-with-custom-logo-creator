export type GarmentType = 'tshirt' | 'hoodie' | 'cap';

export interface DesignElement {
  id: string;
  type: 'logo' | 'text' | 'shape';
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  content: string;
}

export interface DesignerState {
  garmentType: GarmentType;
  baseColor: string;
  elements: DesignElement[];
  selectedElementId: string | null;
}
