# Planika

This is a web-based application designed for collaborative financial planning and expense tracking. The core idea is to move beyond a simple list of expenses and provide a structured, visual, and interactive way for individuals or groups to plan and monitor a budget.

The application is built around a hierarchical budget structure, real-time collaboration, and temporal visualization of expenses.
Core Features

### 1. Interactive Tree View Budget

- The budget is organized in a hierarchical tree structure, where parent nodes represent broad categories (e.g., "Vacation," "Home Renovation") and child nodes represent specific line items (e.g., "Flights," "Hotel," "Paint," "Contractor").

- Users can click on any node to select it. Selecting a node automatically selects its entire branch, providing a clear visual indication of the selected category and its sub-items (e.g., highlighted in green).

- This view displays relevant totals for the selected branch, such as the allocated budget, projected costs, or actual spending.

### 2. Dynamic Filtering & Exploration

- The entire interface is interactive. Clicking on any value—be it a budget category, a total, a status, or a person's name—will filter the entire application view to show only the relevant data connected to that item. This allows for quick, ad-hoc analysis and drilling down into specific details.

### 3. Real-Time Collaboration

- Multiple users can work on the same budget plan simultaneously, with changes reflected in real-time for all participants using WebSockets (via [Socket.IO](https://socket.io/)).

- The budget owner can invite other participants by sending them an email invitation.

- To collaborate, invited users are required to authenticate using their Google account. This simplifies the login process and securely manages user identities.

### 4. Timeline Visualization

- A dedicated timeline view plots expenses over time, based on their scheduled or actual dates.

- This helps visualize cash flow, identify high-spending periods, and understand the temporal distribution of costs.

- The feature may also include the ability to view expenses by location if that data is available for an expense item.

### 5. Expense Status and Accountability Tracking

- Each expense item can be assigned a status to indicate its current state: Pending, Reserved (e.g., funds are set aside), or Paid.

- Each item can also be assigned a Payer/Responsible Person. This clarifies financial responsibility within a group, showing who is expected to pay for or who has already paid for a specific expense.