# Laboratorio: cobertura alta, mutation, pbt

Mutation testing + Property-Based Testing (PBT).
Stack: Node 22.12+ (LTS 22 o 24), Vitest, Stryker (mutation testing), fast-check (PBT).

## Preparación (antes de la sesión)

```bash
npm install
npm test               
npm run coverage      
npm run mutation        
```

Stryker tarda unos 10 segundos. El reporte HTML queda en `reports/mutation/mutation.html`.

## Estructura

| Carpeta | Contenido |
|---|---|
| `demo/` | Ejemplo corto que muestra el instructor (`costoEnvio`) |
| `src/pedido.js` | Módulo del ejercicio (`calcularTotal`) |
| `test/pedido.ia.test.js` | Suite "generada por IA" (100% cobertura, no verifica casi nada) |
| `test/estudiante.test.js` | Plantilla a completar por los estudiantes |

---

# PARTE 1: Demostración

**Paso 1. El problema de la cobertura** 
```bash
npm run demo:coverage         
```

**Paso 2. Mutation testing ** 
```bash
npm run demo:mutation:ia        
```

**Paso 3. Propiedades (7 min).** 
```bash
npm run demo:test:pbt
npm run demo:mutation:pbt       # ~86%
```

---

# PARTE 2: Ejercicio de estudiantes (equipos de 3 a 4)

## Contexto
`src/pedido.js` calcula el total de un pedido en colones. Reglas:
- Cliente `"frecuente"`: 5% de descuento.
- Subtotal de 100000 o más: 10% de descuento.
- Cupón `"PROMO10"`: 10% de descuento.
- Los descuentos se acumulan, con un máximo de 20%.
- Se aplica IVA de 13% y se redondea al colón.
- Subtotal negativo: `RangeError`.

Una IA generó `test/pedido.ia.test.js`. Pasa, y tiene 100% de cobertura.

## Fase A. Diagnóstico (10 min)
1. `npm run coverage` y anoten el resultado.
2. `npm run mutation` y anoten el mutation score.
3. Abran `reports/mutation/mutation.html`. Elijan 3 mutantes sobrevivientes y expliquen en una frase qué error real representaría cada uno.

## Fase B. Matar mutantes con ejemplos (15 min)
En `test/estudiante.test.js` (Parte B) escriban pruebas con **valores exactos calculados a mano** (no con la fórmula del código, porque eso repetiría la implementación). Meta: llegar a 85% o más.

## Fase C. Propiedades (20 min)
En la Parte C escriban propiedades con fast-check. Requisitos:
- Al menos una propiedad de **cota** (ej. "nunca supera el precio sin descuento").
- Al menos una propiedad **estricta** (ej. "el cliente frecuente paga *estrictamente* menos").
- Un generador que incluya valores **alrededor del umbral de 100000**.

Meta: superar 93%. Vuelvan a ejecutar `npm run mutation` después de cada propiedad.

## Fase D. Revisión en clase (10 min)
Cada equipo reporta: mutation score final, qué mutantes quedaron y por qué, y cuál propiedad fue la más valiosa. Comparar contra la solución de referencia.

---

