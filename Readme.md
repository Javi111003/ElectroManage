# ElectroManage 💡⚡

**ElectroManage** is a web application developed with Angular and .NET using FastEndpoints and EFCore. This project aims to manage and monitor the electrical consumption of the company's branches.

## Project Description 📋

**ElectroManage** is an advanced web-based solution designed to help companies efficiently manage and monitor their electrical consumption across multiple branches. The application provides a comprehensive dashboard for real-time monitoring, historical data analysis, and predictive insights.

## Key Features 🔑

- **Real-Time Monitoring**: View the real-time electrical consumption of each branch.
- **Daily Consumption Records**: Enter daily consumption records to track usage patterns.
- **Cost Calculation Formulas**: Define and apply cost calculation formulas based on consumption data.
- **Efficiency Comparison**: Compare the energy efficiency of different branches and identify best practices.
- **Predictive Analysis**: Utilize predictive algorithms to forecast future consumption and make informed decisions.

## Design Patterns and Principles 🏛️

- **Command**: Implements the command design pattern for encapsulating all information needed to perform an action.
- **CQRS**: Uses Command Query Responsibility Segregation to separate read and write operations.
- **Repository Pattern**: Abstracts the data layer, providing a flexible way to access and manipulate data.
- **UnitOfWork**: Manages database transactions, ensuring data consistency and integrity.

## Technology Stack 💻

- **Frontend**: Angular for a dynamic and responsive user experience.
- **Backend**: .NET with FastEndpoints for robust and efficient API management.
- **Database**: PostgreSQL for reliable and scalable data storage.
- **ORM**: EFCore for data management and persistence.

## Architecture 🗼⛏️

The project follows the principles of Clean Architecture, ensuring a separation of concerns and high maintainability. The layers include
