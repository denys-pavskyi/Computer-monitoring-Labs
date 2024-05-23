export class WaterStat {
    id?: number;
    epSecurity: number = 0;
    sanChem: number = 0;
    radiation: number = 0;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }