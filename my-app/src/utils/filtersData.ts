//город
export const filterCity = [
    { id: 1, label: 'Москва' },
    { id: 2, label: 'Псков' },
    { id: 3, label: 'Тверь' },
    { id: 4, label: 'Абакан' },
    { id: 5, label: 'Нижний Новгород' },
    { id: 6, label: 'Кострома' },
    { id: 7, label: 'Ярославль' },
  ];
  
  //тип доставки
  export const filterDelivery = [
    { id: 1, label: 'Короб' },
    { id: 2, label: 'Монопаллета' },
  ];
  
  //название склада
  export const filterWarehouse = [
    { id: 1, label: 'Склад' },
    { id: 2, label: 'СЦ Абакан' },
    { id: 3, label: 'Черная грязь' },
    { id: 4, label: 'Внуково' },
    { id: 5, label: 'Белая дача' },
    { id: 6, label: 'Электросталь' },
    { id: 7, label: 'Вёшки' },
  ];
  
  //статус доставки
  export const filterStatus = [
    { id: 1, label: 'В пути' },
    { id: 2, label: 'Задерживается' },
  ];

  //критерии фильтрации
  export const filterOptions = [
    { id: 1, label: 'По номеру' },
    { id: 2, label: 'По городу' },
    { id: 3, label: 'По типу поставки' },
    { id: 4, label: 'По статусу' },
  ];