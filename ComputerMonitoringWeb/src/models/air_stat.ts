export class AirStat {
  id?: number;
  dust?: number;
  no2?: number;
  so2?: number;
  co2?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, dust?: number, no2?: number, so2?: number, co2?: number) {
    this.date = date;
    this.point_id = point_id;
    this.dust = dust;
    this.no2 = no2;
    this.so2 = so2;
    this.co2 = co2;
  }
}