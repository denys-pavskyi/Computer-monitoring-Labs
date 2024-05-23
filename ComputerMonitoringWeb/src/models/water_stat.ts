export class WaterStat {
    id?: number;
    epSecurity?: number;
    sanChem?: number;
    radiation?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }