export interface SimpleProduct {
  id: string;
  data: {
    name: string;
    price: number;
    salePrice?: number;
    image?: string;
    quantity?: number;
  };
}

type RemoveID<T> = {
  [Property in keyof T as Exclude<Property, "id">]: T[Property];
};

export type SimpleProductRemoveId = RemoveID<SimpleProduct>;

export interface CartProducts {
  id: string;
  data: {
    name: string;
    price: number;
    quantity: number;
  };
}
export interface CartProductsTotal {
  id: string;
  name: string;
  price: number;
  quantity: number;
  cartItems: number;
}
export interface CartProductsTotalIndexed {
  [index: string]: {
    id: string;
    name: string;
    price: number;
    quantity: number;
    cartItems: number;
  };
}
export interface ServerTimeStampProperties {
  seconds: number;
  nanoseconds: number;
}
