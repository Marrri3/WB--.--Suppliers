import { Router, Request, Response, NextFunction } from 'express';
import { Middleware } from '../middleware/auth';
import pool from '../database';

const router = Router();

//получение списка всех поставок 
router.get('/shipments', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    //получение списка поставок
    let query = `
      SELECT s.id, s.title, s.status, s.city, s.type AS delivery_type, 
             s.deliveryDate AS delivery_date, s.quantity, w.name AS warehouse_name, w.address AS warehouse_address
      FROM Shipment s
      LEFT JOIN Warehouse w ON s.warehouseId = w.id
    `;
    const params: any[] = [];

    //проверка на степень доступа к системе 
    if (req.user && req.user.role !== 'admin') {
      query += ` WHERE s.createdBy = $1`;
      params.push(req.user.id);
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching shipments:', err);
    res.status(500).json({ error: 'Failed to fetch shipments' });
  }
});

//получение одной поставки 
router.get('/shipments/:id', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    //получение поставки по id 
    const result = await pool.query(
      `SELECT s.id, s.title, s.status, s.city, s.type AS delivery_type, 
              s.deliveryDate AS delivery_date, s.quantity, w.name AS warehouse_name, w.address AS warehouse_address
       FROM Shipment s
       LEFT JOIN Warehouse w ON s.warehouseId = w.id
       WHERE s.id = $1`,
      [id]
    );

    //проверка на существоване поставки
    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Shipment not found' });
      return;
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error fetching shipment:', err);
    res.status(500).json({ error: 'Failed to fetch shipment' });
  }
});

//создание новой поставки 
router.post('/shipments', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  const { title, status, city, delivery_type, quantity, delivery_date, ship_date, warehouse_id, created_by } = req.body;
  try {
      //сохранение даты создания поставки 
      const finalShipDate = ship_date || new Date().toISOString().split('T')[0];

      //значение id для формирования title
      const maxIdResult = await pool.query('SELECT COALESCE(MAX(id), 0) AS max_id FROM Shipment');
      const nextId = maxIdResult.rows[0].max_id + 1;
      const finalTitle = title || `Поставка №${nextId}`;

      //добавление новой поставки
      const newShipment = await pool.query(
          `INSERT INTO Shipment (title, status, city, type, quantity, deliveryDate, shipDate, warehouseId, createdBy)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
           RETURNING id, title, status, city, type AS delivery_type, deliveryDate, shipDate, warehouseId`,
          [finalTitle, status, city, delivery_type, quantity, delivery_date, finalShipDate, warehouse_id, created_by]
      );
      const shipment = newShipment.rows[0];

      //если есть warehouseId, достаём название и адрес склада
      if (warehouse_id) {
          const warehouse = await pool.query('SELECT name, address FROM Warehouse WHERE id = $1', [warehouse_id]);
          shipment.warehouse_name = warehouse.rows[0]?.name;
          shipment.warehouse_address = warehouse.rows[0]?.address;
      }
      res.status(201).json(shipment);
  } catch (err) {
      console.error('Error creating shipment:', err);
      res.status(500).json({ error: 'Failed to create shipment'});
  }
});

// Обновление поставки 
router.put('/shipments/:id', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const { title, status, city, delivery_type, quantity, delivery_date, warehouse_name } = req.body;
  let warehouseId: number | undefined;
  try {
    //Поиск warehouseId по названию 
    if (warehouse_name) {
      const warehouseResult = await pool.query(
        'SELECT id FROM Warehouse WHERE name = $1',
        [warehouse_name]
      );
      if (warehouseResult.rows.length === 0) {
        res.status(400).json({ error: 'Склад с таким именем не найден' }); 
      }
      warehouseId = warehouseResult.rows[0].id;
    }

    //обновление поставки 
    const updateResult = await pool.query(
      `UPDATE Shipment
       SET title = COALESCE($1, title), status = COALESCE($2, status), city = COALESCE($3, city), 
           type = COALESCE($4, type), quantity = COALESCE($5, quantity), 
           deliveryDate = COALESCE($6, deliveryDate), warehouseId = COALESCE($7, warehouseId)
       WHERE id = $8
       RETURNING id, title, status, city, type AS delivery_type, quantity, deliveryDate, warehouseId`,
      [title, status, city, delivery_type, quantity, delivery_date, warehouseId, id]
    );

    if (updateResult.rows.length === 0) {
      res.status(404).json({ error: 'Shipment not found' });
    }

    const updatedShipment = updateResult.rows[0];
    //если у обновлённой поставки есть warehouse_id, достаём её название и адрес
    if (updatedShipment.warehouse_id) {
      const warehouse = await pool.query(
        'SELECT name, address FROM Warehouse WHERE id = $1',
        [updatedShipment.warehouse_id]
      );
      updatedShipment.warehouse_name = warehouse.rows[0]?.name;
      updatedShipment.warehouse_address = warehouse.rows[0]?.address;
    }

    res.json(updatedShipment); 
  } catch (err) {
    console.error('Error updating shipment:', err);
    res.status(500).json({ error: 'Failed to update shipment'}); 
  }
});

//удаление поставки 
router.delete('/shipments/:id', Middleware, async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM Shipment WHERE id = $1', [id]);
    res.json({ message: 'Shipment deleted successfully' });
  } catch (err) {
    console.error('Error deleting shipment:', err);
    res.status(500).json({ error: 'Failed to delete shipment' });
  }
});

export default router;