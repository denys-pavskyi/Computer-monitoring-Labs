export class EnergyStat {
  id?: number;
  water?: number;
  electricity?: number;
  gas?: number;
  thermalEnergy?: number;
  date: Date;
  point_id: number;

  constructor(date: Date, point_id: number, water?: number, electricity?: number, gas?: number, thermalEnergy?: number) {
    this.date = date;
    this.point_id = point_id;
    this.water = water;
    this.electricity = electricity;
    this.gas = gas;
    this.thermalEnergy = thermalEnergy;
  }
}