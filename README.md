# Weather Forecast App

Una aplicación web **responsive** construida con **Angular** que permite a los usuarios obtener condiciones climáticas actuales y pronósticos de 5 días para múltiples ubicaciones (códigos postales de EE. UU.).

Este proyecto fue desarrollado como solución a un desafío técnico, enfocándose en una **arquitectura limpia**, **componentes reutilizables** y las **mejores prácticas de Angular**, incluyendo **Signals** y **despliegue automatizado con GitHub Actions**.

---

## Ver Demo en Vivo

👉 [Abrir aplicación en GitHub Pages](https://netsky2-tech.github.io/weather-forecast-app/)

---

## Características Principales

Este proyecto implementa todos los requisitos solicitados y añade mejoras adicionales:

- **Gestión de Ubicaciones:** Añadir y eliminar ubicaciones por código postal.  
- **Navegación de 3 Vistas:** Flujo de navegación entre un Dashboard, la vista de Pestañas y la vista de Pronóstico.  
- **Componente de Pestañas Genérico:** Componente 100% reutilizable y agnóstico al contenido, construido con `@Input`, `@Output` y `ng-template`.  
- **Estado Reactivo con Signals:** Estado global manejado con `signal` en un `LocationService` para reactividad instantánea.  
- **Servicio de Caché Genérico:** `CacheService` reutilizable que usa `localStorage` con un TTL configurable (2 h por defecto).  
- **UI Enriquecida:** Datos extendidos de la API (viento, humedad, UV, POP, etc.) para una mejor experiencia.  
- **Visualización sin Librerías:** Gráficos de rango de temperatura creados solo con clases de Bootstrap (`.progress`).  
- **UI con Bootstrap:** Interfaz 100% basada en Bootstrap, sin librerías externas.  
- **Accesibilidad (W3C AA):** Contraste de color y uso correcto de atributos ARIA.  
- **Diseño Responsivo:** Totalmente funcional en dispositivos móviles, incluyendo scroll horizontal para pestañas.

---

## Arquitectura y Decisiones de Diseño

- **Angular Standalone:** Proyecto estructurado con la arquitectura moderna de componentes Standalone.  
- **Pre-calentamiento de Caché:** Uso de `forkJoin` en la vista de pestañas para precargar datos de todas las ubicaciones, logrando transiciones instantáneas.  
- **CI/CD Automatizado:** Despliegue 100 % automatizado en GitHub Pages mediante GitHub Actions. Cada push a `main` dispara un build y deploy.

---

## 🛠️ Stack Tecnológico

| Categoría                 | Tecnología                            |
|---------------------------|---------------------------------------|
| **Framework**             | Angular 18+                           |
| **Lenguaje**              | TypeScript                            |
| **Estado**                | Angular Signals                       |
| **Programación Reactiva** | RxJS                                  |
| **Estilos**               | Bootstrap 5 + SCSS                    |
| **Despliegue**            | GitHub Pages + GitHub Actions (CI/CD) |

---

## Cómo Ejecutar Localmente

### 1️⃣ Clonar el repositorio

```bash
git clone https://github.com/netsky2-tech/weather-forecast-app.git
```

### 2️⃣ Entrar al directorio

```bash
cd weather-forecast-app
```

### 3️⃣ Instalar dependencias

```bash
npm install
```

### 4️⃣ Ejecutar la aplicacion

```bash
ng serve
```

### 5️⃣Luego abre en tu navegador

"<http://localhost:4200>"

### Autor

Proyecto desarrollador por **Octavio Morales Ruiz**.
