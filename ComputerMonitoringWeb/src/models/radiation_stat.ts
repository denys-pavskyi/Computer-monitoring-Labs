export class RadiationStat {
    id?: number;
    shortDecay?: any;
    mediumDecay?: any;
    air?: number;
    water?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }