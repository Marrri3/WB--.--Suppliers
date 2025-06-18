//поставки
export interface Shipment {
    id: number;
    title: string;
    status: string;
    delivery_type: string;
    city: string;
    delivery_date: string;
    quantity: number;
    warehouse_name?: string;
    warehouse_address?: string;
    warehouse_id?: number;
  }

//пользователь
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

//новая поставка
export  interface NewOrder {
  deliveryDate: string;
  shipDate: string;
  quantity: number;
  city: string;
  deliveryType: string;
  warehouseId: number;
  status: string;
  title?: string;
  createdBy?: number;
}


