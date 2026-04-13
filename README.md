# Simple Bank UI

[![CI/CD Pipeline](https://github.com/mateor32/lab1/actions/workflows/build.yml/badge.svg)](https://github.com/mateor32/lab1/actions/workflows/build.yml)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=bugs)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=mateor32_lab1&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=mateor32_lab1)

Aplicacion full stack para gestion bancaria basica: creacion de clientes, consulta de clientes y registro de transferencias entre cuentas.

## Tabla de contenido

- [Resumen](#resumen)
- [Arquitectura](#arquitectura)
- [Stack tecnologico](#stack-tecnologico)
- [Estructura del repositorio](#estructura-del-repositorio)
- [Prerequisitos](#prerequisitos)
- [Configuracion](#configuracion)
- [Ejecucion local](#ejecucion-local)
- [Pruebas](#pruebas)
- [API disponible](#api-disponible)
- [Contenedorizacion](#contenedorizacion)
- [Buenas practicas y seguridad](#buenas-practicas-y-seguridad)

## Resumen

Este proyecto incluye:

- Frontend en React + Vite para gestionar clientes y transferencias.
- Backend en Spring Boot con endpoints REST.
- Persistencia con PostgreSQL (configurada por propiedades de Spring).
- Pruebas unitarias e integracion basica en frontend y backend.

## Arquitectura

Flujo principal de la solucion:

1. El frontend consume la API REST del backend.
2. El backend aplica la logica de negocio y persiste datos en PostgreSQL.
3. El dashboard muestra metricas de negocio (clientes, transacciones y balance total).

## Stack tecnologico

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, Axios.
- Backend: Java 17, Spring Boot 3.5, Spring Web, Spring Data JPA.
- Base de datos: PostgreSQL.
- Build y pruebas: Maven, Vitest.
- Contenedores: Docker (imagen del backend).

## Estructura del repositorio

```text
.
|-- backend/
|   `-- lab12026/          # API Spring Boot
|-- frontend/              # Aplicacion React
|-- Dockerfile             # Build y runtime del backend
`-- README.md
```

## Prerequisitos

Instalar en tu entorno:

- Java 17
- Maven 3.9+ (opcional si usas mvnw)
- Node.js 18+
- npm 9+
- Docker (opcional, para ejecucion en contenedor)

## Configuracion

### Frontend

El frontend usa la variable `VITE_API_BASE_URL`.

- Valor por defecto: `http://localhost:8080`
- Archivo de referencia: `frontend/src/config/apiConfig.ts`

Puedes crear un archivo `frontend/.env` con:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Backend

La aplicacion usa `application.properties` para datasource y puerto.

- Puerto por defecto: `8080`
- Archivo: `backend/lab12026/src/main/resources/application.properties`

## Ejecucion local

### 1) Levantar backend

Desde `backend/lab12026`:

```bash
./mvnw spring-boot:run
```

En Windows PowerShell:

```powershell
.\mvnw.cmd spring-boot:run
```

### 2) Levantar frontend

Desde `frontend`:

```bash
npm install
npm run dev
```

Acceso local:

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8080`

## Pruebas

### Backend

Desde `backend/lab12026`:

```bash
./mvnw clean test
```

En Windows PowerShell:

```powershell
.\mvnw.cmd clean test
```

### Frontend

Desde `frontend`:

```bash
npm run test
```

## API disponible

Base URL: `http://localhost:8080`

### Customers

- `GET /api/customers` obtiene todos los clientes.
- `GET /api/customers/{id}` obtiene un cliente por id.
- `POST /api/customers` crea un cliente.

Ejemplo `POST /api/customers`:

```json
{
  "firstName": "Ana",
  "lastName": "Lopez",
  "accountNumber": "100200300",
  "balance": 1500.0
}
```

### Transactions

- `GET /api/transactions` obtiene todas las transacciones.
- `GET /api/transactions/{accountNumber}` obtiene transacciones por cuenta.
- `POST /api/transactions` realiza una transferencia.

Ejemplo `POST /api/transactions`:

```json
{
  "senderAccountNumber": "100200300",
  "receiverAccountNumber": "400500600",
  "amount": 250.0
}
```

## Contenedorizacion

El `Dockerfile` del repositorio construye y ejecuta el backend.

Construir imagen:

```bash
docker build -t simple-bank-backend .
```

Ejecutar contenedor:

```bash
docker run --rm -p 8080:8080 simple-bank-backend
```

## Buenas practicas y seguridad

- No subas credenciales reales al repositorio.
- Migra secretos a variables de entorno o a un gestor de secretos.
- Usa diferentes configuraciones por ambiente (dev, qa, prod).
- Manten dependencias y plugins actualizados.
