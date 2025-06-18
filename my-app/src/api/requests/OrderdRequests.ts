
import { Shipment } from '../../utils/types';
import { ENDPOINTS } from '../endpoints/OrderEndpoints';

export const fetchOrders = async (): Promise<Shipment[]> => {
  const response = await fetch(ENDPOINTS.shipments.list, {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Network response was not ok');
  return await response.json();
};

export const fetchOrderById = async (id: number): Promise<Shipment> => {
  const response = await fetch(ENDPOINTS.shipments.detail(id), {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Shipment not found');
  return await response.json();
};

export const createOrder = async (orderData: any): Promise<any> => {
  const response = await fetch(ENDPOINTS.shipments.list, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          title: orderData.title,
          status: orderData.status,
          city: orderData.city,
          delivery_type: orderData.deliveryType,
          quantity: orderData.quantity,
          delivery_date: orderData.deliveryDate,
          ship_date: orderData.shipDate,
          warehouse_id: orderData.warehouseId,
          created_by: orderData.createdBy,
      }),
  });
  if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create shipment: ${errorText}`);
  }
  return response.json();
}

export const updateOrder = async (id: number, order: Partial<Shipment>): Promise<Shipment> => {
  console.log('Updating order:', { id, order }); // Отладка
  const response = await fetch(ENDPOINTS.shipments.detail(id), {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(order),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error('Server response error:', response.status, errorText);
    throw new Error(`Failed to update order: ${response.status} - ${errorText}`);
  }
  return await response.json();
};

export const deleteOrders = async (orderIds: number[]): Promise<void> => {
  const response = await fetch(ENDPOINTS.shipments.detail(orderIds[0]), {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });
  if (!response.ok) throw new Error('Failed to delete order');
  await response.json();
};