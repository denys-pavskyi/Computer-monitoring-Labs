export class Waste {
  id?: number;
  paper?: number;
  plastic?: number;
  metal?: number;
  product?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, paper?: number, plastic?: number, metal?: number, product?: number) {
    this.date = date;
    this.point_id = point_id;
    this.paper = paper;
    this.plastic = plastic;
    this.metal = metal;
    this.product = product;
  }
}