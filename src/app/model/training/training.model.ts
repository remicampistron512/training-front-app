export class Training {
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  quantity: number;

  constructor(
    name: string,
    description: string,
    price: number,
    stock: number,
    quantity: number,
    id?: string
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.quantity = quantity;
  }
}
