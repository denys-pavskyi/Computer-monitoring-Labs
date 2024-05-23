export class AirStat {
    id?: number;
    dust?: number;
    no2?: number;
    so2?: number;
    co2?: number;
    pb?: number;
    bens?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }