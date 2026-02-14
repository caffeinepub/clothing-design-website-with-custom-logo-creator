export interface GarmentTemplate {
  type: string;
  path: string;
  width: number;
  height: number;
}

const templates: Record<string, GarmentTemplate> = {
  tshirt: {
    type: 'tshirt',
    path: '/assets/generated/garment-tshirt.dim_2000x2000.png',
    width: 2000,
    height: 2000,
  },
  hoodie: {
    type: 'hoodie',
    path: '/assets/generated/garment-hoodie.dim_2000x2000.png',
    width: 2000,
    height: 2000,
  },
  cap: {
    type: 'cap',
    path: '/assets/generated/garment-cap.dim_2000x2000.png',
    width: 2000,
    height: 2000,
  },
};

export function getGarmentTemplate(type: string): GarmentTemplate {
  return templates[type] || templates.tshirt;
}
