export class EconomyStat {
    id?: number;
    gdp?: number;
    freightTraffic?: number;
    passengerTraffic?: number;
    exportGoods?: number;
    importGoods?: number;
    wages?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }