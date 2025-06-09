# 📊 Ejercicios de MongoDB

[🏠 Volver a la Guía de Estudio](../../README_ES.md) | [📄 Importar Dataset](../datasets/MongoDB_Dataset_Import.js) | [✅ Soluciones](../soluciones/MongoDB_Soluciones.md)

Este documento contiene ejercicios para practicar con MongoDB, utilizando el dataset de e-commerce.

---

## 🔍 Antes de empezar

Asegúrate de haber importado el dataset de e-commerce utilizando el script proporcionado en la carpeta `datasets`.

```bash
# Navegar a la carpeta de datasets
cd ~/Documents/basesEstudio/ejercicios/datasets/

# Importar el dataset
mongosh < MongoDB_Dataset_Import.js
```

---

## 🧪 Ejercicios con MongoDB

### Nivel 1: Consultas Básicas

1. **Encontrar todos los productos de la categoría "Electrónica"**

   ```javascript
   // Tu solución aquí
   ```

2. **Listar todos los usuarios ordenados por fecha de registro (más reciente primero)**

   ```javascript
   // Tu solución aquí
   ```

3. **Buscar productos con stock menor a 50 unidades**

   ```javascript
   // Tu solución aquí
   ```

4. **Encontrar todos los pedidos con estado "Procesando"**

   ```javascript
   // Tu solución aquí
   ```

5. **Buscar productos con precio entre 50 y 200 euros**
   ```javascript
   // Tu solución aquí
   ```

### Nivel 2: Consultas Intermedias

6. **Encontrar los 3 productos mejor valorados (mayor promedio de calificación)**

   ```javascript
   // Tu solución aquí
   ```

7. **Listar usuarios que han realizado más de un pedido**

   ```javascript
   // Tu solución aquí
   ```

8. **Encontrar productos que contengan "Smart" en su nombre o descripción**

   ```javascript
   // Tu solución aquí
   ```

9. **Calcular el valor total del inventario (suma de precio × stock de todos los productos)**

   ```javascript
   // Tu solución aquí
   ```

10. **Listar productos agrupados por categoría con su precio promedio**
    ```javascript
    // Tu solución aquí
    ```

### Nivel 3: Agregaciones y Consultas Avanzadas

11. **Obtener el historial de compras de cada usuario con detalles de productos**

    ```javascript
    // Tu solución aquí
    ```

12. **Calcular las ventas totales por mes**

    ```javascript
    // Tu solución aquí
    ```

13. **Encontrar los productos más vendidos (por cantidad)**

    ```javascript
    // Tu solución aquí
    ```

14. **Analizar las preferencias de compra por región (ciudad)**

    ```javascript
    // Tu solución aquí
    ```

15. **Crear un informe de productos con reviews ordenadas por utilidad**
    ```javascript
    // Tu solución aquí
    ```

---

## 🚀 Retos Adicionales

1. **Crear un pipeline de agregación para generar recomendaciones de productos basadas en compras anteriores**
2. **Implementar un sistema de búsqueda de texto completo con puntuación de relevancia**
3. **Diseñar un sistema de caché para las consultas más frecuentes**
4. **Desarrollar una función de MongoDB para calcular métricas de negocio (ventas, conversiones, etc.)**

---

Este documento es parte de la guía de estudio de bases de datos NoSQL. Las soluciones a estos ejercicios las encontrarás en [MongoDB_Soluciones.md](../soluciones/MongoDB_Soluciones.md)
