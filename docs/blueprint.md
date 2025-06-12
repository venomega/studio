# **App Name**: Cosmic Balance

## Core Features:

- Cosmic Visuals: Landscape view with a cosmic background, mimicking a view of Earth from the Moon.
- Dynamic Input Display: Numeric display that turns green for income and red for expenses.
- Automatic Income/Expense toggle: Entry is saved to an income (green) if the '-' key has not been used. Entry is saved as an expense (red) after using '-' key. Entry details: Amount, Date, and User Description.
- Transaction details popup: The amount entered is validated by a Javascript Regular expression for correct format, before being persisted. After entry is validated, a dialog box for transaction description appears on Enter keypress, then the transaction is added to a scrollable history upon saving the user description.
- Data filter options: Drop-down menu to filter registered information to be listed by: Monthly expenses, Annual balance and full list of entries

## Style Guidelines:

- Primary color: Deep space blue (#343A40) for the main interface elements.
- Background color: Soft, desaturated cosmic black (#212529) to simulate a cosmic view.
- Accent color: Electric purple (#BE4DFF) to highlight interactive elements.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look.
- The main layout should have the list of income/expenses displayed at the bottom, and the input number in the middle, simulating a calculator display. All UI elements are positioned using flexbox or grid for responsiveness.
- Subtle transitions when switching between income and expense modes.