export class EnergyStat {
    id?: number;
    water?: any;
    electricity?: any;
    gas?: any;
    thermalEnergy?: any;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }