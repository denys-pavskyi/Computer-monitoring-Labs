export class WaterStat {
  id?: number;
  epSecurity?: number;
  sanChem?: number;
  radiation?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, epSecurity?: number, sanChem?: number, radiation?: number) {
    this.date = date;
    this.point_id = point_id;
    this.epSecurity = epSecurity;
    this.sanChem = sanChem;
    this.radiation = radiation;
  }
}