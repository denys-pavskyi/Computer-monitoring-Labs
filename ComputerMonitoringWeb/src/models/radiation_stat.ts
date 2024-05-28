export class RadiationStat {
  id?: number;
  shortDecay?: number;
  mediumDecay?: number;
  air?: number;
  water?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, shortDecay?: number, mediumDecay?: number, air?: number, water?: number) {
    this.date = date;
    this.point_id = point_id;
    this.shortDecay = shortDecay;
    this.mediumDecay = mediumDecay;
    this.air = air;
    this.water = water;
  }
}