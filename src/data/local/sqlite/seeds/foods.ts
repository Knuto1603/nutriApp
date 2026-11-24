export const FOODS_SEED = `
INSERT OR IGNORE INTO foods (id, name, category, portion_g, calories, protein_g, carbs_g, fat_g, fiber_g) VALUES
-- Cereales y granos
(1,  'Arroz blanco cocido',       'Cereales',   100, 130, 2.7, 28.2, 0.3, 0.4),
(2,  'Arroz integral cocido',     'Cereales',   100, 111, 2.6, 23.0, 0.9, 1.8),
(3,  'Quinua cocida',             'Cereales',   100, 120, 4.4, 21.3, 1.9, 2.8),
(4,  'Avena cocida',              'Cereales',   100,  71, 2.5, 12.0, 1.5, 1.7),
(5,  'Pan blanco',                'Cereales',    50, 133, 4.0, 25.0, 1.5, 1.0),
(6,  'Pan integral',              'Cereales',    50, 113, 4.5, 21.0, 1.5, 2.5),
(7,  'Fideos cocidos',            'Cereales',   100, 131, 5.0, 25.0, 1.1, 1.8),
(8,  'Maíz desgranado cocido',   'Cereales',   100,  96, 3.4, 21.0, 1.5, 2.4),

-- Proteínas animales
(9,  'Pechuga de pollo a la plancha', 'Proteínas', 100, 165, 31.0,  0.0, 3.6, 0.0),
(10, 'Pollo entero cocido',           'Proteínas', 100, 215, 29.0,  0.0, 10.9, 0.0),
(11, 'Huevo entero cocido',           'Proteínas',  50,  78,  6.3,  0.6, 5.3, 0.0),
(12, 'Clara de huevo',                'Proteínas',  50,  26,  5.4,  0.4, 0.1, 0.0),
(13, 'Atún en agua (lata)',           'Proteínas', 100, 116, 25.5,  0.0, 1.0, 0.0),
(14, 'Sardina en lata',               'Proteínas', 100, 208, 24.6,  0.0, 11.5, 0.0),
(15, 'Carne de res magra cocida',     'Proteínas', 100, 250, 32.0,  0.0, 13.0, 0.0),
(16, 'Hígado de pollo cocido',        'Proteínas', 100, 167, 24.4,  0.9, 6.9, 0.0),
(17, 'Cuy cocido',                    'Proteínas', 100, 190, 20.3,  0.0, 11.6, 0.0),

-- Legumbres (menestras)
(18, 'Lentejas cocidas',          'Legumbres',  100, 116, 9.0, 20.0, 0.4, 7.9),
(19, 'Frijoles negros cocidos',   'Legumbres',  100, 132, 8.9, 23.7, 0.5, 8.7),
(20, 'Garbanzos cocidos',         'Legumbres',  100, 164, 8.9, 27.4, 2.6, 7.6),
(21, 'Pallares cocidos',          'Legumbres',  100, 115, 7.8, 20.9, 0.4, 5.4),
(22, 'Arvejas cocidas',           'Legumbres',  100,  84, 5.4, 15.6, 0.4, 5.5),

-- Verduras
(23, 'Zanahoria cruda',           'Verduras',   100,  41, 0.9,  9.6, 0.2, 2.8),
(24, 'Tomate fresco',             'Verduras',   100,  18, 0.9,  3.9, 0.2, 1.2),
(25, 'Espinaca cocida',           'Verduras',   100,  23, 3.0,  3.6, 0.3, 2.4),
(26, 'Brócoli cocido',            'Verduras',   100,  35, 2.4,  7.2, 0.4, 3.3),
(27, 'Cebolla cruda',             'Verduras',   100,  40, 1.1,  9.3, 0.1, 1.7),
(28, 'Lechuga',                   'Verduras',   100,  15, 1.4,  2.9, 0.2, 1.3),
(29, 'Pepino fresco',             'Verduras',   100,  16, 0.7,  3.6, 0.1, 0.5),
(30, 'Ají amarillo',              'Verduras',    20,   6, 0.3,  1.4, 0.1, 0.2),
(31, 'Papa sancochada',           'Verduras',   150, 116, 2.5, 27.0, 0.1, 2.4),

-- Frutas
(32, 'Plátano de seda',           'Frutas',     100,  89, 1.1, 22.8, 0.3, 2.6),
(33, 'Manzana con cáscara',       'Frutas',     150,  78, 0.4, 20.7, 0.2, 3.6),
(34, 'Naranja',                   'Frutas',     150,  62, 1.2, 15.4, 0.2, 3.1),
(35, 'Papaya',                    'Frutas',     200,  74, 1.1, 19.1, 0.3, 2.9),
(36, 'Mango',                     'Frutas',     200,  99, 1.4, 24.7, 0.6, 2.6),
(37, 'Maracuyá',                  'Frutas',     100,  97, 2.2, 23.4, 0.7, 10.4),
(38, 'Piña',                      'Frutas',     200,  82, 0.9, 21.6, 0.2, 2.3),
(39, 'Uva',                       'Frutas',     100,  67, 0.6, 17.2, 0.4, 0.9),
(40, 'Pera',                      'Frutas',     150,  86, 0.5, 23.2, 0.2, 4.6),

-- Lácteos
(41, 'Leche entera',              'Lácteos',    250,  61, 3.2,  4.8, 3.3, 0.0),
(42, 'Leche descremada',          'Lácteos',    250,  34, 3.4,  5.0, 0.1, 0.0),
(43, 'Yogurt natural',            'Lácteos',    200,  61, 3.5,  4.7, 3.3, 0.0),
(44, 'Yogurt griego',             'Lácteos',    200,  97, 9.0,  3.6, 5.0, 0.0),
(45, 'Queso fresco',              'Lácteos',     50,  98, 6.5,  1.5, 7.5, 0.0),

-- Grasas saludables
(46, 'Palta (aguacate)',          'Grasas',     100, 160, 2.0,  8.5, 14.7, 6.7),
(47, 'Aceite de oliva',           'Grasas',      10,  88, 0.0,  0.0, 10.0, 0.0),
(48, 'Almendras',                 'Grasas',      30, 173, 6.3,  6.1, 15.0, 3.5),
(49, 'Maní tostado sin sal',      'Grasas',      30, 176, 7.1,  5.7, 14.9, 2.3),

-- Ultraprocesados (referencia educativa)
(50, 'Gaseosa regular (330 ml)',  'Ultraprocesados', 330, 139, 0.0, 35.2, 0.0, 0.0),
(51, 'Papas fritas (bolsa 50g)',  'Ultraprocesados',  50, 267, 3.4, 28.6, 16.0, 2.4),
(52, 'Hot dog (salchicha)',       'Ultraprocesados',  50, 151, 5.4,  1.5, 13.8, 0.0),
(53, 'Galletas soda (6 und)',     'Ultraprocesados',  30, 130, 2.5, 20.0,  4.5, 0.5),
(54, 'Hamburguesa fast food',     'Ultraprocesados', 200, 540, 26.0, 41.0, 29.0, 2.0);
`
