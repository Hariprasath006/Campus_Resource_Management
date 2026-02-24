

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



🎓 Campus Resource Management System (Campus RMS)
🚀 Project Overview

Campus RMS is a full-stack web application designed to manage campus resources, users, and booking workflows with a multi-level approval system.

The system simulates a real institutional resource management platform.

✨ Key Features

✅ Role-Based Access Control
✅ User Management (CRUD)
✅ Resource Management (CRUD)
✅ Resource Booking System
✅ Multi-Level Approval Workflow
✅ Slot Conflict Prevention
✅ Booking Status Tracking

👥 User Roles
🎓 Student

View available resources

Book resources

Track booking status

👨‍🏫 Staff / Faculty

Review student requests

Approve / Reject bookings

View personal bookings

👨‍💼 Admin

Full system control

Manage users

Manage resources

Final booking authority

🔄 Booking Workflow
Student Booking → PENDING

Staff Decision:
→ APPROVED_BY_STAFF
→ REJECTED_BY_STAFF

Admin Final Decision:
→ APPROVED
→ REJECTED


✔ Ensures workflow integrity
✔ Prevents silent deletion

🛠 Tech Stack
Frontend

React

Vite

Axios

Backend

Spring Boot

Spring MVC

Spring Data JPA

Hibernate

PostgreSQL (Supabase)
