export class Waste {
    id?: number;
    shortDecay?: number;
    mediumDecay?: number;
    air?: number;
    water?: number;
    point_id: number;
  
    constructor(point_id: number) {
      this.point_id = point_id;
    }
  }