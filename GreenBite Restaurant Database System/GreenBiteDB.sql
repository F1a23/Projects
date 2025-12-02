-- 1. Create Database

CREATE DATABASE GreenBiteDB;
USE GreenBiteDB;

-- 2. Create Tables
-- ================== STAFF TABLE ==================
CREATE TABLE Staff (
    Staff_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Gender ENUM('Male', 'Female') NOT NULL, -- خليته NOT NULL
    Age INT CHECK (Age > 15),                -- شرط بسيط للعمر
    Position ENUM('Chef', 'Waiter', 'Manager') NOT NULL,
    Salary DECIMAL(10,2) CHECK (Salary >=10),
    Contact_Number VARCHAR(20),
    Email VARCHAR(30) UNIQUE,
    Hire_Date DATE NOT NULL,
    Status ENUM('Active', 'Inactive') DEFAULT 'Active'
);

-- ================== CUSTOMER TABLE ==================
CREATE TABLE Customer (
    Customer_ID INT PRIMARY KEY AUTO_INCREMENT,
    Name VARCHAR(50) NOT NULL,
    Phone VARCHAR(20) UNIQUE,
    Email VARCHAR(30) UNIQUE,
    Gender ENUM('Male', 'Female') NOT NULL,
    Membership_Level ENUM('Regular', 'Silver', 'Gold') DEFAULT 'Regular'
);

-- ================== MENU_ITEM TABLE ==================
CREATE TABLE Menu_Item (
    Item_ID INT PRIMARY KEY AUTO_INCREMENT,
    Item_Name VARCHAR(20) NOT NULL,
    Category ENUM('Salad', 'Main Course', 'Smoothie', 'Dessert') NOT NULL,
    Calories INT CHECK (Calories >= 0),
    Price DECIMAL(8,2) CHECK (Price > 0),
    Description TEXT
);

-- ================== ORDER TABLE ==================
CREATE TABLE Order_r (
    Order_ID INT PRIMARY KEY AUTO_INCREMENT,
    Customer_ID INT,
    Staff_ID INT,
    Order_Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    Payment_Method ENUM('Cash', 'Card') NOT NULL,
    Payment_Status ENUM('Paid', 'Unpaid') DEFAULT 'Unpaid',
    Order_Status ENUM('Pending', 'Preparing', 'Ready', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    Notes TEXT,
    CONSTRAINT fk_order_customer FOREIGN KEY (Customer_ID) REFERENCES Customer(Customer_ID)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_order_staff FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
        ON DELETE SET NULL ON UPDATE CASCADE
);

-- ==================  ORDER_ITEM TABLE ==================

-- يحل العلاقة Many-to-Many بين Order_r و Menu_Item
CREATE TABLE Order_Item (
	OrderItem_ID INT,
    Order_ID INT,
    Item_ID INT,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    PRIMARY KEY (Order_ID, Item_ID),  -- Composite PK (Order + Item)
    CONSTRAINT fk_orderitem_order FOREIGN KEY (Order_ID) REFERENCES Order_r(Order_ID)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_orderitem_item FOREIGN KEY (Item_ID) REFERENCES Menu_Item(Item_ID)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ================== BILL TABLE ==================
CREATE TABLE Bill (
    Bill_ID INT PRIMARY KEY AUTO_INCREMENT,
    Order_ID INT,
    Bill_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    Total_Amount DECIMAL(10,2) CHECK (Total_Amount >= 0),
    CONSTRAINT uq_bill_order UNIQUE (Order_ID), -- عشان يكون لكل Order فاتورة واحدة فقط
    CONSTRAINT fk_bill_order FOREIGN KEY (Order_ID) REFERENCES Order_r (Order_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-- ================== TABLE_INFO TABLE ==================
CREATE TABLE Table_info (
    Table_ID INT PRIMARY KEY AUTO_INCREMENT,
    Number_of_Guests INT CHECK (Number_of_Guests > 0),
    Staff_ID INT,
    Serving_Time DATETIME,
    Order_ID INT,
    CONSTRAINT fk_dinein_staff FOREIGN KEY (Staff_ID) REFERENCES Staff(Staff_ID)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_dinein_order FOREIGN KEY (Order_ID) REFERENCES Order_r(Order_ID)
        ON DELETE CASCADE ON UPDATE CASCADE
);

-------------------------------------------------
--  DATA INSERTS
-------------------------------------------------

-- Insert into Staff 
INSERT INTO Staff (Name, Gender, Age, Position, Salary, Contact_Number, Email, Hire_Date, Status) VALUES
('Ahmed Al-Balushi', 'Male', 32, 'Chef', 850.00, '91234567', 'ahmed.b@resto.com', '2020-05-12', 'Active'),
('Fatma Al-Harthy', 'Female', 27, 'Waiter', 450.00, '92876543', 'fatma.h@resto.com', '2021-03-15', 'Active'),
('Salim Al-Maskari', 'Male', 41, 'Manager', 1200.00, '92112233', 'salim.m@resto.com', '2018-07-01', 'Active'),
('Huda Al-Kindi', 'Female', 30, 'Chef', 820.00, '93654321', 'huda.k@resto.com', '2022-02-20', 'Active'),
('Rashid Al-Hinai', 'Male', 25, 'Waiter', 420.00, '93456789', 'rashid.h@resto.com', '2023-01-10', 'Active'),
('Maryam Al-Shibli', 'Female', 29, 'Waiter', 430.00, '92233445', 'maryam.s@resto.com', '2021-09-18', 'Active'),
('Talib Al-Busaidi', 'Male', 38, 'Chef', 880.00, '91998877', 'talib.b@resto.com', '2019-06-07', 'Active'),
('Aisha Al-Lawati', 'Female', 26, 'Waiter', 410.00, '93887766', 'aisha.l@resto.com', '2022-12-11', 'Active'),
('Khalid Al-Rashdi', 'Male', 33, 'Chef', 870.00, '93778899', 'khalid.r@resto.com', '2020-09-14', 'Active'),
('Sara Al-Siyabi', 'Female', 35, 'Manager', 1150.00, '93556677', 'sara.s@resto.com', '2019-03-03', 'Active'),
('Ali Al-Mahrouqi', 'Male', 28, 'Waiter', 440.00, '93990011', 'ali.m@resto.com', '2021-07-19', 'Active'),
('Layla Al-Habsi', 'Female', 31, 'Chef', 890.00, '92775533', 'layla.h@resto.com', '2020-11-05', 'Active'),
('Hassan Al-Shanfari', 'Male', 36, 'Manager', 1220.00, '93332244', 'hassan.s@resto.com', '2017-10-10', 'Active'),
('Maha Al-Mamari', 'Female', 23, 'Waiter', 400.00, '92998800', 'maha.m@resto.com', '2023-04-22', 'Active'),
('Yousef Al-Bahrani', 'Male', 29, 'Waiter', 430.00, '93992211', 'yousef.b@resto.com', '2022-06-17', 'Active'),
('Reem Al-Mahdi', 'Female', 33, 'Chef', 860.00, '93445522', 'reem.m@resto.com', '2021-02-02', 'Active'),
('Salma Al-Khalili', 'Female', 40, 'Manager', 1180.00, '93669988', 'salma.k@resto.com', '2019-09-12', 'Active'),
('Nasser Al-Amri', 'Male', 27, 'Waiter', 420.00, '93882233', 'nasser.a@resto.com', '2023-03-01', 'Active'),
('Zahra Al-Saadi', 'Female', 34, 'Chef', 900.00, '93774455', 'zahra.s@resto.com', '2020-08-25', 'Active'),
('Ibrahim Al-Araimi', 'Male', 39, 'Chef', 910.00, '93223344', 'ibrahim.a@resto.com', '2018-05-15', 'Active');

-- Insert into Customer
INSERT INTO Customer (Name, Phone, Email, Gender, Membership_Level) VALUES
('Hassan Said', '91111111', 'hassan.s@example.com', 'Male', 'Gold'),
('Aisha Al-Habsi', '92222222', 'aisha.h@example.com', 'Female', 'Regular'),
('Ahmed Nasser', '93333333', 'ahmed.n@example.com', 'Male', 'Silver'),
('Maryam Saif', '94444444', 'maryam.s@example.com', 'Female', 'Gold'),
('Yousef Ali', '95555555', 'yousef.a@example.com', 'Male', 'Regular'),
('Fatma Rashid', '96666666', 'fatma.r@example.com', 'Female', 'Silver'),
('Salim Khalid', '97777777', 'salim.k@example.com', 'Male', 'Gold'),
('Mona Talib', '98888888', 'mona.t@example.com', 'Female', 'Regular'),
('Ali Hamad', '99999999', 'ali.h@example.com', 'Male', 'Silver'),
('Sara Fahad', '91010101', 'sara.f@example.com', 'Female', 'Gold'),
('Layla Khalil', '92020202', 'layla.k@example.com', 'Female', 'Regular'),
('Khalid Salim', '93030303', 'khalid.s@example.com', 'Male', 'Silver'),
('Fatma Zayed', '94040404', 'fatma.z@example.com', 'Female', 'Gold'),
('Nasser Saeed', '95050505', 'nasser.s@example.com', 'Male', 'Regular'),
('Amina Juma', '96060606', 'amina.j@example.com', 'Female', 'Gold'),
('Mohammed Said', '97070707', 'mohammed.s@example.com', 'Male', 'Silver'),
('Reem Ahmed', '98080808', 'reem.a@example.com', 'Female', 'Regular'),
('Rashid Khalifa', '99090909', 'rashid.k@example.com', 'Male', 'Silver'),
('Huda Salim', '90101010', 'huda.s@example.com', 'Female', 'Gold'),
('Talal Ali', '91212121', 'talal.a@example.com', 'Male', 'Regular');

-- Insert into Menu_Item 
INSERT INTO Menu_Item (Item_Name, Category, Calories, Price, Description) VALUES
('Greek Salad', 'Salad', 250, 2.80, 'Fresh lettuce, feta, olives'),
('Fruit Smoothie', 'Smoothie', 180, 3.20, 'Mixed tropical fruits'),
('Veggie Burger', 'Main Course', 450, 4.80, 'Plant-based burger with fries'),
('Mango Lassi', 'Smoothie', 200, 2.50, 'Mango yogurt drink'),
('Falafel Wrap', 'Main Course', 420, 3.60, 'Falafel with tahini sauce'),
('Pasta Primavera', 'Main Course', 480, 4.50, 'Vegetables and olive oil pasta'),
('Caesar Salad', 'Salad', 310, 3.00, 'Crisp romaine with dressing'),
('Avocado Toast', 'Main Course', 370, 2.90, 'Avocado and tomato toast'),
('Strawberry Milkshake', 'Smoothie', 250, 3.40, 'Fresh strawberries and milk'),
('Chocolate Cake', 'Dessert', 520, 4.20, 'Rich chocolate slice'),
('Fruit Salad', 'Dessert', 220, 2.70, 'Seasonal fruit mix'),
('Lemon Mint Juice', 'Smoothie', 150, 2.30, 'Refreshing lemon mint blend'),
('Mushroom Soup', 'Main Course', 290, 3.80, 'Creamy mushroom base'),
('Pancakes', 'Dessert', 410, 3.90, 'Served with maple syrup'),
('Grilled Veg Sandwich', 'Main Course', 330, 3.50, 'Grilled veggies and cheese'),
('Banana Smoothie', 'Smoothie', 200, 2.60, 'Banana and milk blend'),
('Oat Bowl', 'Dessert', 340, 2.90, 'Healthy oats with honey'),
('Quinoa Salad', 'Salad', 260, 3.30, 'Quinoa with mixed veggies'),
('Fruit Tart', 'Dessert', 400, 4.00, 'Custard tart topped with fruits'),
('Veg Lasagna', 'Main Course', 490, 4.90, 'Layers of veggies and cheese');

-- Insert into Order_r
INSERT INTO Order_r (Customer_ID, Staff_ID, Payment_Method, Payment_Status, Order_Status, Notes) VALUES
(1, 2, 'Card', 'Paid', 'Delivered', 'No onions please'),
(2, 5, 'Cash', 'Paid', 'Delivered', 'Extra napkins'),
(3, 6, 'Card', 'Paid', 'Delivered', 'Add extra sauce'),
(4, 8, 'Card', 'Paid', 'Ready', 'Deliver to table 4'),
(5, 11, 'Cash', 'Paid', 'Delivered', 'No ice in drink'),
(6, 12, 'Card', 'Paid', 'Pending', 'Less spicy please'),
(7, 15, 'Card', 'Paid', 'Delivered', 'Cold Water'),
(8, 18, 'Cash', 'Paid', 'Delivered', 'Add extra cheese'),
(9, 14, 'Card', 'Paid', 'Delivered', 'Deliver fast please'),
(10, 9, 'Cash', 'Paid', 'Preparing', 'Include dessert'),
(11, 16, 'Card', 'Paid', 'Delivered', 'For birthday'),
(12, 17, 'Cash', 'Paid', 'Delivered', 'No garlic'),
(13, 13, 'Card', 'Paid', 'Delivered', 'Family table'),
(14, 19, 'Cash', 'Paid', 'Delivered', 'More napkins'),
(15, 10, 'Card', 'Paid', 'Delivered', 'Extra sauce'),
(16, 7, 'Card', 'Paid', 'Delivered', 'Add smoothie'),
(17, 3, 'Cash', 'Paid', 'Delivered', 'Fast service please'),
(18, 1, 'Card', 'Paid', 'Delivered', 'NO Onions'),
(19, 4, 'Cash', 'Paid', 'Delivered', 'No salt'),
(20, 20, 'Card', 'Paid', 'Delivered', 'For two guests');

-- Insert into Order_Item 

INSERT INTO Order_Item (Order_ID, Item_ID, Quantity) VALUES
(1, 1, 1), (1, 3, 1),
(2, 2, 1), (2, 5, 2),
(3, 3, 1), (3, 10, 1),
(4, 4, 2), (4, 7, 1),
(5, 5, 1), (5, 11, 1),
(6, 6, 1), (6, 12, 1),
(7, 7, 1), (7, 9, 1),
(8, 8, 2), (8, 14, 1),
(9, 9, 1), (9, 10, 1),
(10, 10, 1), (10, 19, 1),
(11, 11, 2), (11, 1, 1),
(12, 12, 1), (12, 4, 1),
(13, 13, 1), (13, 15, 1),
(14, 14, 1), (14, 18, 1),
(15, 15, 1), (15, 20, 1),
(16, 16, 2), (16, 2, 1),
(17, 17, 1), (17, 6, 1),
(18, 18, 1), (18, 11, 1),
(19, 19, 1), (19, 3, 1),
(20, 20, 2), (20, 5, 1);

-- Insert into Bill
INSERT INTO Bill (Order_ID, Bill_date, Total_Amount) VALUES
(1,  '2025-01-05 13:05:00', 8.90),
(2,  '2025-01-20 14:10:00', 6.20),

(3,  '2025-02-03 12:30:00', 7.30),
(4,  '2025-02-18 15:45:00', 9.00),

(5,  '2025-03-07 11:20:00', 5.80),
(6,  '2025-03-25 16:10:00', 10.20),

(7,  '2025-04-02 13:40:00', 8.00),
(8,  '2025-04-19 19:05:00', 9.10),

(9,  '2025-05-06 12:15:00', 7.70),
(10, '2025-05-28 17:30:00', 6.80),

(11, '2025-06-04 13:25:00', 9.40),
(12, '2025-06-21 18:50:00', 8.60),

(13, '2025-07-03 12:55:00', 10.10),
(14, '2025-07-18 20:10:00', 7.50),

(15, '2025-08-09 11:45:00', 8.20),
(16, '2025-08-27 16:35:00', 6.90),

(17, '2025-09-05 14:00:00', 7.80),
(18, '2025-09-22 19:20:00', 9.30),

(19, '2025-10-01 13:15:00', 8.70),
(20, '2025-10-19 18:40:00', 9.50);


-- Insert into Table_info
INSERT INTO Table_info (Number_of_Guests, Staff_ID, Serving_Time, Order_ID) VALUES
(2, 2,  '2025-01-05 13:00:00', 1),
(4, 5,  '2025-01-20 14:00:00', 2),

(3, 6,  '2025-02-03 12:20:00', 3),
(2, 8,  '2025-02-18 15:30:00', 4),

(5, 11, '2025-03-07 11:10:00', 5),
(2, 12, '2025-03-25 16:00:00', 6),

(4, 15, '2025-04-02 13:30:00', 7),
(3, 18, '2025-04-19 18:50:00', 8),

(2, 14, '2025-05-06 12:00:00', 9),
(3, 9,  '2025-05-28 17:10:00', 10),

(4, 16, '2025-06-04 13:10:00', 11),
(2, 17, '2025-06-21 18:40:00', 12),

(3, 13, '2025-07-03 12:40:00', 13),
(4, 19, '2025-07-18 19:50:00', 14),

(2, 10, '2025-08-09 11:30:00', 15),
(3, 7,  '2025-08-27 16:20:00', 16),

(2, 3,  '2025-09-05 13:50:00', 17),
(2, 1,  '2025-09-22 19:10:00', 18),

(4, 4,  '2025-10-01 13:05:00', 19),
(2, 20, '2025-10-19 18:30:00', 20);


/* Q1: Get all active staff who are Chefs */
SELECT *
FROM Staff
WHERE Status = 'Active' AND Position = 'Chef';


/* Q2: Get all menu items that are Main Course and cost more than 4 OMR */
SELECT * FROM Menu_Item
WHERE Category = 'Main Course' AND Price > 4.00;


/* Q3: Get all customers who are Gold OR Silver members */
SELECT *FROM Customer
WHERE Membership_Level = 'Gold'OR Membership_Level = 'Silver';


/* Q4: Get all bills where the total amount is between 10 and 30 OMR */
SELECT *FROM Bill
WHERE Total_Amount BETWEEN 10 AND 30;


/* Q5: Get staff who have positions in this list ('Chef', 'Manager') */
SELECT * FROM Staff
WHERE Position IN ('Chef', 'Manager');


/* Q6: Update a staff member's status to Inactive (Ahmed Al-Balushi) */
UPDATE Staff SET Status = 'Inactive'
WHERE Name = 'Ahmed Al-Balushi';


/* Q7: Update menu item 'Veggie Burger' (new price and description) */
UPDATE Menu_Item
SET Price = 4.100,
    Description = 'Fresh vegetarian addition to our November special menu'
WHERE Item_Name = 'Veggie Burger';


/* Q8: Show orders with customer and staff names (INNER JOIN) */
SELECT 
    O.Order_ID,
    C.Name AS Customer_Name,
    S.Name AS Staff_Name,
    O.Payment_Method,
    O.Payment_Status,
    O.Order_Status
FROM Order_r O
INNER JOIN Customer C ON O.Customer_ID = C.Customer_ID
INNER JOIN Staff S ON O.Staff_ID = S.Staff_ID
ORDER BY O.Order_ID;


/* Q9: Show all orders with customer and staff names (LEFT JOIN: keep all orders even if customer/staff is missing) */
SELECT 
    O.Order_ID,
    C.Name AS Customer_Name,
    S.Name AS Staff_Name,
    O.Payment_Method,
    O.Payment_Status,
    O.Order_Status
FROM Order_r O
LEFT JOIN Customer C ON O.Customer_ID = C.Customer_ID
LEFT JOIN Staff S ON O.Staff_ID = S.Staff_ID
ORDER BY O.Order_ID;


/* Q10: Show all customers, even those who have no orders (LEFT JOIN) */
SELECT 
    C.Customer_ID,
    C.Name AS Customer_Name,
    O.Order_ID
FROM Customer C
LEFT JOIN Order_r O ON C.Customer_ID = O.Customer_ID
ORDER BY C.Customer_ID, O.Order_ID;


/* Q11: Count total number of Waiters */
SELECT 
    COUNT(*) AS Total_Waiters
FROM Staff
WHERE Position = 'Waiter';


/* Q12: Average salary by position */
SELECT 
    Position,
    ROUND(AVG(Salary), 2) AS Avg_Salary
FROM Staff
GROUP BY Position;


/* Q13: Count of orders by payment method */
SELECT 
    Payment_Method,
    COUNT(*) AS Orders_Count
FROM Order_r
GROUP BY Payment_Method;


/* Q14: Day with the highest total bill amount (total sales per day, top 1) */
SELECT 
    DATE(Bill_date) AS Day,
    SUM(Total_Amount) AS Total_Sales
FROM Bill
GROUP BY DATE(Bill_date)
ORDER BY Total_Sales DESC
LIMIT 1;


/* Q15:/* Calculate the number and percentage of employees in each job position */
SELECT 
    Position,
    COUNT(*) AS Total_Employees,
    CONCAT(
        ROUND( (COUNT(*) / (SELECT COUNT(*) FROM Staff)) * 100, 1 ),
        '%'
    ) AS Percentage
FROM Staff
GROUP BY Position
ORDER BY Total_Employees DESC;


-- Update orders 2, 4, 6 to be handled by waiter with Staff_ID = 2
UPDATE Order_r
SET Staff_ID = 2
WHERE Order_ID IN (2, 4, 6);

-- Update orders 5, 7 to be handled by waiter with Staff_ID = 5
UPDATE Order_r
SET Staff_ID = 5
WHERE Order_ID IN (5, 7);

SELECT 
    s.Staff_ID,
    s.Name AS Waiter_Name,
    COUNT(o.Order_ID) AS Total_Orders
FROM Staff s
LEFT JOIN Order_r o ON s.Staff_ID = o.Staff_ID
WHERE s.Position = 'Waiter'
GROUP BY s.Staff_ID, s.Name
ORDER BY Total_Orders DESC;


/* Q16 : Count each menu item and sum the total quantity ordered*/
SELECT m.Item_ID,m.Item_Name, SUM(oi.Quantity) AS Total_Quantity
FROM Order_Item oi
JOIN Menu_Item m ON oi.Item_ID = m.Item_ID
GROUP BY oi.Item_ID, m.Item_Name
ORDER BY Total_Quantity DESC;  



/* Q17: Number of GOLD membership customers with their info 
   (includes total count using a window function) */
SELECT 
    Customer_ID,
    Name,
    Phone,
    Email,
    Gender,
    Membership_Level,
    COUNT(*) OVER () AS Total_Gold_Customers
FROM Customer
WHERE Membership_Level = 'Gold';


/* Q18: MAX and MIN total amount in bills(info) */
SELECT 
    b.Bill_ID,
    b.Total_Amount,
    b.Bill_Date,
    c.Name AS Customer_Name,
    s.Name AS Staff_Name,
    o.Payment_Method
FROM Bill b
JOIN Order_r o ON b.Order_ID = o.Order_ID
LEFT JOIN Customer c ON o.Customer_ID = c.Customer_ID
LEFT JOIN Staff s ON o.Staff_ID = s.Staff_ID
WHERE b.Total_Amount = (SELECT MAX(Total_Amount) FROM Bill)
   OR b.Total_Amount = (SELECT MIN(Total_Amount) FROM Bill);


/* Q19: Orders count per staff, only staff with more than 3 orders (using HAVING) */
SELECT 
    S.Staff_ID,
    S.Name AS Staff_Name,
    COUNT(O.Order_ID) AS Orders_Count
FROM Staff S
JOIN Order_r O ON S.Staff_ID = O.Staff_ID
GROUP BY S.Staff_ID, S.Name
HAVING COUNT(O.Order_ID) > 3
ORDER BY Orders_Count DESC;


/* Q20: Menu items sorted by price (ascending) */
SELECT 
    Item_ID,
    Item_Name,
    Category,
    Price
FROM Menu_Item
ORDER BY Price ASC;



/* Update a customer's membership level to Gold */
UPDATE Customer
SET Membership_Level = 'Gold'
WHERE Name = 'Ahmed Nasser';


/* Create a view that shows the total sales for each month */
CREATE VIEW MonthlySales AS
SELECT 
    DATE_FORMAT(Bill_date, '%Y-%m') AS Month,
    SUM(Total_Amount) AS Total
FROM Bill
GROUP BY DATE_FORMAT(Bill_date, '%Y-%m');

/* Display the monthly sales summary */
SELECT * FROM MonthlySales;

/* Compare membership levels by showing the count and percentage of customers in each level */
SELECT 
    Membership_Level,
    COUNT(*) AS Total_Customers,
    CONCAT(ROUND((COUNT(*) / (SELECT COUNT(*) FROM Customer)) * 100, 0), '%') AS Percentage
FROM Customer
GROUP BY Membership_Level
ORDER BY Total_Customers DESC;

/* Compare customers by gender, showing count and percentage for Male and Female */
SELECT 
    Gender,
    COUNT(*) AS Total_Customers,
    CONCAT(ROUND((COUNT(*) / (SELECT COUNT(*) FROM Customer)) * 100, 1), '%') AS Percentage
FROM Customer
GROUP BY Gender
ORDER BY Total_Customers DESC;


/* Show staff name, years of experience, and promotion percentage (Experience only) */
SELECT 
    Name AS Staff_Name,
    TIMESTAMPDIFF(YEAR, Hire_Date, CURDATE()) AS Years_Experience,

    CASE 
        WHEN Position = 'Manager' 
            THEN 'Already a Manager'
        WHEN TIMESTAMPDIFF(YEAR, Hire_Date, CURDATE()) >= 5
            THEN '80%'
        ELSE 
            '40%'
    END AS Promotion_Percentage

FROM Staff
ORDER BY Years_Experience DESC;


/* Calculate how many orders were paid using each payment method,
   and show the percentage of each method out of all orders */
SELECT 
    Payment_Method,
    COUNT(*) AS Total,
    CONCAT(ROUND(COUNT(*) * 100 / (SELECT COUNT(*) FROM Order_r), 1), '%') AS Percentage
FROM Order_r
GROUP BY Payment_Method;

/* Find the top 5 customers who spent the most money by summing all bill amounts
   linked to their orders, then sorting them from highest to lowest spending */
SELECT 
    C.Name,
    SUM(B.Total_Amount) AS Total_Spending
FROM Customer C
JOIN Order_r O ON C.Customer_ID = O.Customer_ID
JOIN Bill B ON O.Order_ID = B.Order_ID
GROUP BY C.Customer_ID
ORDER BY Total_Spending DESC
LIMIT 5;



/* Analyze the relationship between the number of guests at a table 
   and the average number of items ordered. 
   - First, calculate total items ordered per table.
   - Then, group by number of guests to find the average items ordered. */
SELECT 
    Number_of_Guests,
    ROUND(AVG(Total_Items)) AS Avg_Items_Ordered
FROM (
    SELECT 
        T.Table_ID,
        T.Number_of_Guests,
        SUM(OI.Quantity) AS Total_Items
    FROM Table_info T
    JOIN Order_Item OI 
        ON T.Order_ID = OI.Order_ID
    GROUP BY T.Table_ID, T.Number_of_Guests
) AS Sub
GROUP BY Number_of_Guests
ORDER BY Number_of_Guests;


/* Show each staff member along with their position and the total number of orders they handled.
   Using LEFT JOIN ensures all staff appear even if they have zero orders. */
SELECT 
    S.Name,
    S.Position,
    COUNT(O.Order_ID) AS Total_Orders
FROM Staff S
LEFT JOIN Order_r O ON S.Staff_ID = O.Staff_ID
GROUP BY S.Staff_ID
ORDER BY Total_Orders ASC;
