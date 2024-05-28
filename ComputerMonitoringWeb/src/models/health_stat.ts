export class HealthStat {
    id?: number;
    medicalDemographic?: number;
    morbidity?: number;
    disability?: number;
    physicalDevelopment?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }