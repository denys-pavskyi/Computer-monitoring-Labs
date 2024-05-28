export class EconomyStat {
  id?: number;
  gdp?: number;
  freightTraffic?: number;
  passengerTraffic?: number;
  exportGoods?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, gdp?: number, freightTraffic?: number, passengerTraffic?: number, exportGoods?: number) {
    this.date = date;
    this.point_id = point_id;
    this.gdp = gdp;
    this.freightTraffic = freightTraffic;
    this.passengerTraffic = passengerTraffic;
    this.exportGoods = exportGoods;
  }
}