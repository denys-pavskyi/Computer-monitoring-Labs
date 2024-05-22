export class Point {
  id?: number;
  title: string;
  cord1: number;
  cord2: number;

  constructor(title: string, cord1: number, cord2: number, id?: number) {
    this.id = id;
    this.title = title;
    this.cord1 = cord1;
    this.cord2 = cord2;
  }
}