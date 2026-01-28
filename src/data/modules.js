export const modules = [
  // --- SQL BEGINNER ---
  {
    id: 'sql-basics-1',
    type: 'sql',
    title: 'Introduction to SQL',
    description: 'Learn the fundamentals of SQL, databases, and writing your first SELECT queries.',
    difficulty: 'Beginner',
    prerequisite: null,
    content: [
      {
        type: 'text',
        title: 'What is SQL?',
        content: `SQL (Structured Query Language) is the standard language for relational database management systems. It's used to communicate with a database to perform tasks like retrieving, updating, and managing data.

Key concepts:
• **Database**: An organized collection of structured information.
• **Table**: A collection of related data held in a table format within a database.
• **Query**: A request for data or information from a database table or combination of tables.`
      },
      {
        type: 'code',
        title: 'The SELECT Statement',
        description: 'The SELECT statement is used to select data from a database.',
        code: `SELECT column1, column2 FROM table_name;
-- To select all columns:
SELECT * FROM table_name;`,
        explanation: 'SELECT specifies which columns you want. FROM specifies which table to get them from.'
      }
    ]
  },
  {
    id: 'sql-basics-2',
    type: 'sql',
    title: 'Filtering Data (WHERE)',
    description: 'Master the art of filtering specific records using the WHERE clause and operators.',
    difficulty: 'Beginner',
    prerequisite: 'sql-basics-1',
    content: [
      {
        type: 'text',
        title: 'Filtering Logic',
        content: `The WHERE clause is used to filter records. It extracts only those records that fulfill a specified condition.

Operators:
• = (Equal)
• <> or != (Not equal)
• > (Greater than)
• < (Less than)
• BETWEEN (Between a certain range)
• LIKE (Search for a pattern)
• IN (To specify multiple possible values)`
      },
      {
        type: 'example',
        title: 'Using AND, OR, NOT',
        input: `SELECT * FROM Customers 
WHERE Country='Germany' AND (City='Berlin' OR City='Munich');`,
        output: `Selects all customers from Germany who live in either Berlin OR Munich.`
      }
    ]
  },

  // --- SQL INTERMEDIATE ---
  {
    id: 'sql-agg-functions',
    type: 'sql',
    title: 'Aggregate Functions',
    description: 'Learn to summarize data using COUNT, SUM, AVG, MIN, and MAX.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'text',
        title: 'Summarizing Data',
        content: `Aggregate functions perform a calculation on a set of values and return a single value. They are often used with GROUP BY.

• **COUNT()**: Returns the number of rows.
• **SUM()**: Returns the total sum of a numeric column.
• **AVG()**: Returns the average value.
• **MIN()/MAX()**: Returns the smallest/largest value.`
      },
      {
        type: 'code',
        title: 'Calculating Averages',
        description: 'Find the average price of all products.',
        code: `SELECT AVG(Price) FROM Products;`,
        explanation: 'This calculates the mean value of the Price column for all records.'
      }
    ]
  },
  {
    id: 'sql-group-by',
    type: 'sql',
    title: 'Grouping & Sorting',
    description: 'Group rows that have the same values and filter groups with HAVING.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-agg-functions',
    content: [
      {
        type: 'text',
        title: 'The GROUP BY Statement',
        content: `GROUP BY groups rows that have the same values into summary rows, like "find the number of customers in each country".

The HAVING clause was added to SQL because the WHERE keyword could not be used with aggregate functions.`
      },
      {
        type: 'code',
        title: 'Grouping Example',
        description: 'Count customers per country',
        code: `SELECT Country, COUNT(CustomerID) 
FROM Customers 
GROUP BY Country
HAVING COUNT(CustomerID) > 5;`,
        explanation: 'Groups customers by Country, counts them, and only shows countries with more than 5 customers.'
      }
    ]
  },
  {
    id: 'sql-joins',
    type: 'sql',
    title: 'Joins & Relations',
    description: 'Combine rows from two or more tables based on a related column.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'text',
        title: 'Types of Joins',
        content: `• (INNER) JOIN: Returns records that have matching values in both tables.
• LEFT (OUTER) JOIN: Returns all records from the left table, and the matched records from the right table.
• RIGHT (OUTER) JOIN: Returns all records from the right table, and the matched records from the left table.`
      },
      {
        type: 'code',
        title: 'INNER JOIN Syntax',
        description: 'Linking Orders to Customers',
        code: `SELECT Orders.OrderID, Customers.CustomerName
FROM Orders
INNER JOIN Customers ON Orders.CustomerID = Customers.CustomerID;`,
        explanation: 'Selects OrderID and CustomerName only for orders that have a valid customer attached.'
      }
    ]
  },
  {
    id: 'sql-string-functions',
    type: 'sql',
    title: 'String Functions',
    description: 'Manipulate text data with CONCAT, SUBSTRING, TRIM, UPPER, and LOWER.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'text',
        title: 'Text Manipulation',
        content: `SQL provides robust functions to clean and format text data.
        
• **CONCAT(a, b)**: Joins two or more strings.
• **UPPER(str) / LOWER(str)**: Converts case.
• **TRIM(str)**: Removes leading/trailing spaces.
• **SUBSTRING(str, start, len)**: Extracts a portion of a string.`
      },
      {
        type: 'example',
        title: 'Formatting Names',
        input: `SELECT CONCAT(UPPER(LEFT(FirstName, 1)), LOWER(SUBSTRING(FirstName, 2))) as ProperName
FROM Employees;`,
        output: `Converts "JOHN" or "john" to "John" (Capitalizes first letter).`
      }
    ]
  },
  {
    id: 'sql-date-functions',
    type: 'sql',
    title: 'Date & Time Functions',
    description: 'Handle dates efficiently using DATE, EXTRACT, DATEDIFF, and NOW.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'text',
        title: 'Working with Dates',
        content: `Dates are stored in specific formats (usually YYYY-MM-DD).

• **NOW() / CURRENT_TIMESTAMP**: Current date and time.
• **EXTRACT(part FROM date)**: Get specific part (YEAR, MONTH).
• **DATEDIFF(date1, date2)**: Returns the number of days between two dates.`
      },
      {
        type: 'code',
        title: 'Sales by Year',
        description: 'Extracting year from a transaction date',
        code: `SELECT EXTRACT(YEAR FROM OrderDate) as OrderYear, SUM(Total)
FROM Orders
GROUP BY OrderYear;`,
        explanation: 'Groups total sales by the year the order was placed.'
      }
    ]
  },
  {
    id: 'sql-math-functions',
    type: 'sql',
    title: 'Math Functions',
    description: 'Perform calculations using ABS, ROUND, CEIL, FLOOR, and POWER.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'code',
        title: 'Rounding Financials',
        description: 'Rounding to 2 decimal places',
        code: `SELECT ProductName, ROUND(Price, 2) as RoundedPrice
FROM Products;`,
        explanation: 'Rounds the price to the nearest 2 decimal places (standard for currency).'
      }
    ]
  },
  {
    id: 'sql-nulls',
    type: 'sql',
    title: 'Handling NULL Values',
    description: 'Understand NULLs and how to handle them with IS NULL and COALESCE.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'text',
        title: 'The Concept of NULL',
        content: `NULL means a field with no value. It is different from zero or an empty string.
        
You cannot use = NULL. You must use IS NULL or IS NOT NULL.`
      },
      {
        type: 'code',
        title: 'COALESCE Function',
        description: 'Provide a backup value for NULLs',
        code: `SELECT ProductName, COALESCE(UnitsInStock, 0) 
FROM Products;`,
        explanation: 'If UnitsInStock is NULL, it will display 0 instead.'
      }
    ]
  },
  {
    id: 'sql-case',
    type: 'sql',
    title: 'Logic with CASE',
    description: 'Implement conditional logic (If-Then-Else) directly in your SQL queries.',
    difficulty: 'Intermediate',
    prerequisite: 'sql-basics-2',
    content: [
      {
        type: 'code',
        title: 'Categorizing Data',
        description: 'Create price categories',
        code: `SELECT ProductName, Price,
CASE
    WHEN Price < 10 THEN 'Budget'
    WHEN Price < 50 THEN 'Standard'
    ELSE 'Premium'
END as Category
FROM Products;`,
        explanation: 'Assigns a text label to each product based on its price range.'
      }
    ]
  },
  {
    id: 'sql-window-functions',
    type: 'sql',
    title: 'Window Functions',
    description: 'Perform advanced calculations across a set of table rows with OVER and PARTITION BY.',
    difficulty: 'Advanced',
    prerequisite: 'sql-group-by',
    content: [
      {
        type: 'text',
        title: 'What are Window Functions?',
        content: `Unlike GROUP BY which collapses rows, window functions calculate a value for each row based on a related set of rows.
        
Common functions: ROW_NUMBER(), RANK(), DENSE_RANK(), LEAD(), LAG().`
      },
      {
        type: 'code',
        title: 'Ranking Example',
        description: 'Rank employees by salary',
        code: `SELECT Name, Salary,
RANK() OVER (ORDER BY Salary DESC) as Rank
FROM Employees;`,
        explanation: 'Assigns a rank to each employee based on their salary (1 = highest).'
      }
    ]
  },

  // --- EXCEL BEGINNER ---
  {
    id: 'excel-basics-1',
    type: 'excel',
    title: 'Excel Fundamentals',
    description: 'Get started with cells, ranges, and basic arithmetic formulas.',
    difficulty: 'Beginner',
    prerequisite: null,
    content: [
      {
        type: 'text',
        title: 'The Grid System',
        content: `Excel organizes data in Rows (Numbers) and Columns (Letters). A cell is the intersection, e.g., A1.

• **Range**: A group of cells (A1:B10).
• **Formula Bar**: Where you type calculations starting with =.`
      },
      {
        type: 'code',
        title: 'Basic Arithmetic',
        description: 'Standard operators',
        code: `=A1 + B1  (Addition)
=A1 - B1  (Subtraction)
=A1 * B1  (Multiplication)
=A1 / B1  (Division)
=A1 ^ 2   (Power)`,
        explanation: 'Always start with an equals sign. You can reference other cells or type numbers directly.'
      }
    ]
  },
  {
    id: 'excel-functions',
    type: 'excel',
    title: 'Basic Functions',
    description: 'Master essential functions: SUM, AVERAGE, COUNT, MIN, MAX.',
    difficulty: 'Beginner',
    prerequisite: 'excel-basics-1',
    content: [
      {
        type: 'code',
        title: 'AutoSum Functions',
        description: 'Quick summary statistics',
        code: `=SUM(A1:A10)
=AVERAGE(A1:A10)
=COUNT(A1:A10)
=MAX(A1:A10)`,
        explanation: 'These functions take a range argument and return a single summary value.'
      }
    ]
  },

  // --- EXCEL INTERMEDIATE ---
  {
    id: 'excel-text-functions',
    type: 'excel',
    title: 'Text Functions',
    description: 'Clean and manipulate strings with LEFT, RIGHT, MID, TRIM, and LEN.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'text',
        title: 'Cleaning Data',
        content: `Text functions are vital for cleaning messy data imports.

• **TRIM()**: Removes extra spaces.
• **PROPER()**: Capitalizes first letter of each word.
• **LEN()**: Counts characters in a cell.`
      },
      {
        type: 'code',
        title: 'Extracting Text',
        description: 'Get first 3 chars of a SKU',
        code: `=LEFT(A2, 3)`,
        explanation: 'Returns the first 3 characters from the left side of cell A2.'
      }
    ]
  },
  {
    id: 'excel-date-time',
    type: 'excel',
    title: 'Date & Time Logic',
    description: 'Work with timelines using TODAY, NOW, DATE, and network days.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'text',
        title: 'Dynamic Dates',
        content: `• **TODAY()**: Returns current date (updates dynamically).
• **NOW()**: Returns date and time.
• **DAY(), MONTH(), YEAR()**: Extract parts of a date.`
      },
      {
        type: 'code',
        title: 'Calculating Age',
        description: 'Years between dates',
        code: `=YEARFRAC(A2, TODAY())`,
        explanation: 'Calculates the fraction of years between a birthdate in A2 and today.'
      }
    ]
  },
  {
    id: 'excel-math-trig',
    type: 'excel',
    title: 'Math & Rounding',
    description: 'Precise calculations with ROUND, RAND, and SUMPRODUCT.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'code',
        title: 'SUMPRODUCT',
        description: 'Multiply then add arrays',
        code: `=SUMPRODUCT(A1:A5, B1:B5)`,
        explanation: 'Multiplies A1*B1, A2*B2, etc., and adds the results. Great for weighted averages.'
      }
    ]
  },
  {
    id: 'excel-statistical',
    type: 'excel',
    title: 'Statistical Functions',
    description: 'Analyze distributions with MEDIAN, MODE, and conditional counting.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'text',
        title: 'Conditional Stats',
        content: `Analyze specific subsets of your data without filtering.

• **COUNTIF(range, criteria)**: Count items matching a rule.
• **SUMIF(range, criteria, [sum_range])**: Sum items matching a rule.`
      },
      {
        type: 'code',
        title: 'COUNTIF Example',
        description: 'Count sales over $100',
        code: `=COUNTIF(B2:B100, ">100")`,
        explanation: 'Counts how many cells in the range B2:B100 are greater than 100.'
      }
    ]
  },
  {
    id: 'excel-logical',
    type: 'excel',
    title: 'Logical Functions',
    description: 'Build complex decision logic with IF, AND, OR, and Nested IFs.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'code',
        title: 'Nested IFs',
        description: 'Multiple conditions',
        code: `=IF(A1>90, "A", IF(A1>80, "B", "C"))`,
        explanation: 'Checks if score > 90. If not, checks if > 80. Otherwise returns C.'
      },
      {
        type: 'code',
        title: 'AND Operator',
        description: 'Check multiple criteria',
        code: `=IF(AND(A1>0, B1>0), "Both Positive", "Check Data")`,
        explanation: 'Returns true only if BOTH A1 and B1 are greater than zero.'
      }
    ]
  },
  {
    id: 'excel-lookup-adv',
    type: 'excel',
    title: 'Advanced Lookups',
    description: 'Go beyond VLOOKUP with XLOOKUP and Index/Match.',
    difficulty: 'Advanced',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'text',
        title: 'Why XLOOKUP?',
        content: `XLOOKUP is the modern replacement for VLOOKUP. It defaults to exact match, can search in any direction, and handles errors gracefully.`
      },
      {
        type: 'code',
        title: 'XLOOKUP Syntax',
        description: 'Find value in one array, return from another',
        code: `=XLOOKUP(lookup_value, lookup_array, return_array)`,
        explanation: 'Much simpler than VLOOKUP. No column counting required.'
      }
    ]
  },
  {
    id: 'excel-errors',
    type: 'excel',
    title: 'Error Handling',
    description: 'Manage spreadsheet errors cleanly with IFERROR.',
    difficulty: 'Intermediate',
    prerequisite: 'excel-functions',
    content: [
      {
        type: 'text',
        title: 'Common Errors',
        content: `• #DIV/0! - Divide by zero
• #N/A - Value not found
• #VALUE! - Wrong data type
• #REF! - Invalid cell reference`
      },
      {
        type: 'code',
        title: 'IFERROR Wrapper',
        description: 'Catching errors',
        code: `=IFERROR(A1/B1, 0)`,
        explanation: 'If A1/B1 results in an error (like div/0), it returns 0 instead of the error code.'
      }
    ]
  },
  {
    id: 'excel-advanced',
    type: 'excel',
    title: 'Data Analysis Tools',
    description: 'Pivot Tables, Data Validation, and Conditional Formatting.',
    difficulty: 'Advanced',
    prerequisite: 'excel-lookup-adv',
    content: [
      {
        type: 'text',
        title: 'Pivot Tables',
        content: `Pivot Tables allow you to summarize huge datasets in seconds. You can drag and drop fields to Count, Sum, or Average data grouped by categories.`
      }
    ]
  }
];