# GitHub Copilot Instructions for ReciclApp

## Project Overview
ReciclApp is a web application for the Recicla+ project by Nature Power Foundation. It's built with Next.js for the frontend and FastAPI for the backend.

## Code Style and Formatting

### Python
- **All Python code must be formatted with ruff**
- Follow PEP 8 style guidelines
- Use type hints where applicable
- Keep functions focused and well-documented

### JavaScript/React
- Follow the existing ESLint configuration (Standard style)
- Use functional components with hooks
- Keep components modular and reusable
- Follow Next.js best practices for:
  - File-based routing in the `pages/` directory
  - Use `next/link` for navigation
  - Use `next/image` for optimized images
  - Use `next/head` for managing document head
  - Optimize for performance with proper code splitting

### React Components
- **Prefer Material UI (MUI) components wherever possible**
- Use MUI's theming system for consistent styling
- Import from `@mui/material` for components
- Import from `@mui/icons-material` for icons
- Follow Material Design principles
- Use MUI's Grid, Box, and other layout components for responsive design

## Git Workflow
- **New branches should always be created from `develop` as the base branch**
- `develop` is the main development branch
- Use descriptive branch names (e.g., `feature/add-user-auth`, `fix/map-rendering`)
- Keep commits focused and atomic

## Project Structure
- `pages/` - Next.js page components
- `components/` - Reusable React components
- `fast_api/` - Python FastAPI backend
- `hooks/` - Custom React hooks
- `context/` - React context providers
- `utils/` - Utility functions
- `config/` - Configuration files

## Best Practices
- Write clean, readable code with meaningful variable names
- Add comments for complex logic
- Keep functions small and focused
- Handle errors appropriately
- Use existing utilities and components before creating new ones
- Test code changes thoroughly
- Follow the principle of least privilege for permissions
