// PLANTILLA DEL ESTUDIANTE. Complete las Partes B y C.
// Use `npm run mutation` para medir su avance.
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { calcularTotal } from "../src/pedido.js";

// ---------- Parte B: ejemplos con valores exactos ----------
describe("Parte B: ejemplos exactos", () => {

  it("sin descuentos: subtotal 50000 -> total exacto", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "normal" });
    expect(total).toBe(56500);
  });

  it("justo en el umbral de 100000", () => {
    const total = calcularTotal({ subtotal: 100000, cliente: "normal" });
    expect(total).toBe(101700);
  });

  it("cliente frecuente: total exacto", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "frecuente" });
    expect(total).toBe(53675);
  });

  it("cupón PROMO10: total exacto", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "normal", cupon: "PROMO10" });
    expect(total).toBe(50850);
  });

  it("descuentos acumulados que activan el tope de 20%", () => {
    const total = calcularTotal({ subtotal: 200000, cliente: "frecuente", cupon: "PROMO10" });
    expect(total).toBe(180800);
  });

  it("permite un subtotal de cero", () => {
    const total = calcularTotal({ subtotal: 0, cliente: "normal" });
    expect(total).toBe(0);
  });

  it("un cupón inválido no aplica descuentos", () => {
    const total = calcularTotal({ subtotal: 50000, cliente: "normal", cupon: "INVALIDO" });
    expect(total).toBe(56500);
  });

  it("valida el tipo y mensaje de error para subtotales negativos", () => {
  const calcular = () => calcularTotal({ subtotal: -1, cliente: "normal" });
  expect(calcular).toThrow(RangeError);
  expect(calcular).toThrow(/^subtotal negativo$/);
});

});

// ---------- Parte C: propiedades (fast-check) ----------
// Pista de generadores:
//   const subtotalArb = fc.oneof(
//     fc.constantFrom(0, 99999, 100000, 100001),
//     fc.integer({ min: 0, max: 5_000_000 })
//   );
// ---------- Parte C: propiedades (fast-check) ----------

const subtotalArb = fc.oneof(
  fc.constantFrom(0, 99999, 100000, 100001),
  fc.integer({ min: 0, max: 5000000 })
);

describe("Parte C: propiedades", () => {

  it("el total nunca es negativo ni supera subtotal + IVA", () => {
    fc.assert(fc.property(subtotalArb, (subtotal) => {
      const total = calcularTotal({ subtotal, cliente: "normal" });

      expect(total).toBeGreaterThanOrEqual(0);
      expect(total).toBeLessThanOrEqual(Math.round(subtotal * 1.13));
    }));
  });

  it("el descuento máximo es 20%", () => {
    fc.assert(fc.property(subtotalArb, (subtotal) => {
      const total = calcularTotal({ subtotal, cliente: "frecuente", cupon: "PROMO10" });

      expect(total).toBeGreaterThanOrEqual(Math.round(subtotal * 0.904));
    }));
  });

  it("el cupón nunca aumenta el total", () => {
    fc.assert(fc.property(subtotalArb, (subtotal) => {
      const sinCupon = calcularTotal({ subtotal, cliente: "normal" });
      const conCupon = calcularTotal({ subtotal, cliente: "normal", cupon: "PROMO10" });

      expect(conCupon).toBeLessThanOrEqual(sinCupon);
    }));
  });

  it("el cliente frecuente paga estrictamente menos que el normal", () => {
    fc.assert(fc.property(fc.integer({ min: 100, max: 5000000 }), (subtotal) => {
      const normal = calcularTotal({ subtotal, cliente: "normal" });
      const frecuente = calcularTotal({ subtotal, cliente: "frecuente" });

      expect(frecuente).toBeLessThan(normal);
    }));
  });

  it("un subtotal negativo siempre lanza RangeError", () => {
    fc.assert(fc.property(fc.integer({ min: -5000000, max: -1 }), (subtotal) => {
      expect(() => calcularTotal({ subtotal, cliente: "normal" })).toThrow(RangeError);
    }));
  });

});