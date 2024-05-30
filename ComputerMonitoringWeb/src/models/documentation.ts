export class Documentation {
    id?: number; // Optional because it is auto-incremented
    action: string;
    document: string;
    classes: string;
    price: number;
    selected?: boolean; // Optional property for UI selection
  
    constructor(action: string, document: string, classes: string, price: number, selected?: boolean, id?: number) {
      this.id = id;
      this.action = action;
      this.document = document;
      this.classes = classes;
      this.price = price;
      this.selected = selected || false; // Default to false
    }
  }