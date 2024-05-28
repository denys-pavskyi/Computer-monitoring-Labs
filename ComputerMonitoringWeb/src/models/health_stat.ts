export class HealthStat {
  id?: number;
  medicalDemographic?: number;
  morbidity?: number;
  disability?: number;
  physicalDevelopment?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, medicalDemographic?: number, morbidity?: number, disability?: number, physicalDevelopment?: number) {
    this.date = date;
    this.point_id = point_id;
    this.medicalDemographic = medicalDemographic;
    this.morbidity = morbidity;
    this.disability = disability;
    this.physicalDevelopment = physicalDevelopment;
  }
}