export class SoilStat {
    id?: number;
    humus?: number;
    p2o5?: number;
    k20?: number;
    salinity?: number;
    chemPoll?: number;
    pH?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }