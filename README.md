# 🛒 Mi Tienda Pro - E-commerce Full-Stack

¡Bienvenido a **Mi Tienda Pro**! Este es un proyecto de comercio electrónico completo que integra un catálogo de productos dinámico, gestión de carrito de compras y una pasarela de pagos real con Stripe.

## 🚀 Funcionalidades Principales

- **Catálogo Dinámico**: Visualización de productos obtenidos desde una base de datos MongoDB.
- **Buscador y Filtros**: Filtrado de productos por nombre y por categorías (Electrónica, Muebles, Audio, etc.).
- **Carrito de Compras**: Gestión de estado global para agregar, eliminar y calcular el total de productos.
- **Pasarela de Pagos**: Integración completa con **Stripe API** para procesar pagos con tarjeta de forma segura.
- **Flujo de Éxito**: Página de confirmación que vacía automáticamente el carrito tras una compra exitosa mediante hooks de React.

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React.js, Tailwind CSS, React Router.
- **Backend**: Node.js, Express.js.
- **Base de Datos**: MongoDB.
- **Pagos**: Stripe API.
- **Gestión de Versiones**: Git y GitHub (siguiendo mejores prácticas de seguridad).

## 🔐 Seguridad y Mejores Prácticas

En este proyecto se implementaron estándares profesionales de seguridad:
- **Variables de Entorno**: Uso de archivos `.env` para proteger claves privadas de API (Secret Keys).
- **Protección de Datos**: Configuración de `.gitignore` para evitar la exposición de credenciales en repositorios públicos.
- **Arquitectura Limpia**: Elevación de estado (State Lifting) en React para una comunicación fluida entre componentes.

## 📦 Instalación y Configuración

1. **Clonar el repositorio**:
   ```bash
   git clone [https://github.com/KevinGianmarco/mi-tienda-pro.git](https://github.com/KevinGianmarco/mi-tienda-pro.git)