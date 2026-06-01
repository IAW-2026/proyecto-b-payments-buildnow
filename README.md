# Proyecto-B-BuildNow-Payments

## Deploy de producción

https://proyecto-b-payments-buildnow.vercel.app

---

## Usuarios de prueba

El único usuario de prueba de la app es el que tiene rol admin, ya que es el único que puede acceder a las transacciones.

### Admin

Email:
```txt
admin+clerk_test@iaw.com
```

Contraseña:
```txt
iawuser#
```

---

## Cuentas de MercadoPago (prueba)

| Rol | Usuario | Contraseña |
|-----|---------|------------|
| Buyer | TESTUSER3626848309699685956 | 9pvHbE5YyX |
| Seller | TESTUSER8688049084997130375 | 0PJrIRaOqT |

---

## Instrucciones de uso / evaluación

Iniciar sesión con la cuenta admin y desde ahí se pueden ver las transacciones junto con sus filtros.

Para probar los endpoints se recomienda usar Postman o curl.

### 1. Crear una orden

```http
POST https://proyecto-b-payments-buildnow.vercel.app/api/payments
```

Body:
```json
{
  "orderId": "ORD1",
  "totalAmount": 10,
  "items": [
    {
      "title": "coca",
      "quantity": 1,
      "unit_price": 10
    }
  ]
}
```

> ⚠️ El `orderId` debe ser único, no puede repetirse.

### 2. Ver el estado de una orden

```http
GET https://proyecto-b-payments-buildnow.vercel.app/api/payments?orderId=ORD1
```

### 3. Reclamar un payout (seller o delivery)

```http
POST https://proyecto-b-payments-buildnow.vercel.app/api/payments/payouts?recipientType=seller
```

Body:
```json
{
  "orderId": "ORD1",
  "recipientType": "seller"
}
```

> ⚠️ El `recipientType` va tanto en el query param como en el body.

### 4. Ver earnings

```http
GET https://proyecto-b-payments-buildnow.vercel.app/api/payments/earnings?recipientType=DELIVERY
```

> El `recipientType` puede ser `SELLER` o `DELIVERY`.

---

## Descripción del proyecto

Plataforma interna con acceso exclusivo para administradores.

Incluye integración con MercadoPago para la gestión de pagos y un sistema interno de transacciones, earnings y payouts que registra y organiza todos los movimientos financieros de la plataforma.

---

## Notas

- La validación de firma HMAC está temporalmente comentada en `/api/mercadopago/webhook` para facilitar las pruebas con cuentas de prueba de MercadoPago, ya que estas no envían el header `x-signature`. **Descomentar antes de pasar a producción real.**