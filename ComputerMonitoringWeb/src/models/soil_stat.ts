export class SoilStat {
  id?: number;
  humus?: number;
  p2o5?: number;
  k20?: number;
  salinity?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, humus?: number, p2o5?: number, k20?: number, salinity?: number) {
    this.date = date;
    this.point_id = point_id;
    this.humus = humus;
    this.p2o5 = p2o5;
    this.k20 = k20;
    this.salinity = salinity;
  }
}