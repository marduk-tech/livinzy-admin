export interface MaterialsMeta {
  _id: string;
  name: string;
  costScore: number;
  benefit: string;
  drawback: string;
}

export interface MaterialVariations {
  _id: string;
  materialId: string;
  name: string;
  costScore: number;
  benefit: string;
  drawback: string;
}

export interface MaterialFinish {
  _id: string;
  materialId: string;
  name: string;
  costScore: number;
  benefit: string;
  drawback: string;
}
