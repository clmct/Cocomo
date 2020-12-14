import {
  modeCoefficients,
  Organic,
  Semidetach,
  Embedded,
  costDrivers
} from "cocomo";
import { createModuleResolutionCache } from "typescript";
import { costDriversCocomo2, costDriversCocomo2Advance, ratingFactor, ratingFactorCocomo2, ratingFactorCocomo2Advance } from "./interface";

// Базовые уравнения COCOMO:

// Трудоемкость = ab(KLoC)bb [человеко-месяцев]
// Срок разработки или длительность = cb(Трудоемкость)db [месяцев]
// Число разработчиков = Трудоемкость/ Срок разработки [человек]

/** Трудоемкость = ab(KLoC)bb [человеко-месяцев] */
export const personMonths = ({ ab, bb }: modeCoefficients, KLoC: number) =>
  ab * KLoC ** bb;

/** Срок разработки или длительность = cb(Трудоемкость)db [месяцев] */
export const months = (coefficients: modeCoefficients, KLoC: number) =>
  coefficients.cb * personMonths(coefficients, KLoC) ** coefficients.db;

/** Число разработчиков = Трудоемкость/ Срок разработки [человек] */
export const persons = (team: modeCoefficients, KLoC: number) =>
  !KLoC ? 0 : personMonths(team, KLoC) / months(team, KLoC);

/** Принимает тип команды, количество тысяч строк кода и возвращает объект
 *  с рассчитаными трудоёмкостью, сроком разработки в месяцах
 *  и рекоммендуемое число разработчиков */
export const calculateBasicCocomo = (
  team: "organic" | "semidetach" | "embedded",
  KLoC: number
) => {
  const coefficients = getMode(team);
  return {
    personMonths: personMonths(coefficients, KLoC),
    months: months(coefficients, KLoC),
    persons: persons(coefficients, KLoC)
  };
};

/** Возвращает коэффициенты одного из трёх базовых типов команд */
const getMode = (team: "organic" | "semidetach" | "embedded") => {
  if (team === "organic") return Organic;
  if (team === "semidetach") return Semidetach;
  if (team === "embedded") return Embedded;
  throw new Error(
    `Переданный режим '${team}' не соответсвует одному из трёх базовых типов!`
  );
};

/** E = ai * (KLoC ^ bi) * РФТ
 *  E – трудоемкость разработки ПО в человеко-месяцах,
 *  KLoC – оценочный размер программы в тысячах строках исходного кода,
 *  РФТ – регулирующий фактор, рассчитанный ранее.
 */
export const calculateIntermediateCocomo = (
  team: "organic" | "semidetach" | "embedded",
  KLoC: number,
  drivers: ratingFactor
) => {
  const { ai, bi } = getMode(team);
  const values = Object.entries(drivers).map(
    ([key, value]) => costDrivers[key][value - 1]
  );

  const RFT: number = values.reduce(Multiply, 1);

  return ai * KLoC ** bi * RFT;
};

const Multiply = (total: number, value: number) => total * value;


// Cocomo2

export const calculateCocomo2 = (
  KLoC: number,
  drivers: ratingFactorCocomo2
) => {

  const values = Object.entries(drivers).map(
    ([key, value]) => costDriversCocomo2[key][value-1]
  );

  console.log(drivers)
  console.log(values)
  
  const RFT: number = values.slice(0, 7).reduce(Multiply, 1);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const SF: number = values.slice(7).reduce(reducer);
  console.log(SF)

  const SIZE = KLoC

  const A = 2.94
  const E = 0.91 + (0.01 * SF)
  const EAF = RFT

  const PM = EAF*A*(Math.pow(SIZE,E))
  // console.log(Math.pow(SIZE,E))
  // console.log(SIZE)
  // console.log(E)
  return PM
};

export const calculateCocomo2Advance = (
  KLoC: number,
  drivers: ratingFactorCocomo2Advance
) => {

  const values1 = Object.entries(drivers).map(
    ([key, value]) => costDriversCocomo2Advance[key][value-1]
  );
  console.log(drivers)
  console.log(values1)

  const RFT: number = values1.slice(0, 17).reduce(Multiply, 1);

  const reducer = (accumulator, currentValue) => accumulator + currentValue;
  const SF: number = values1.slice(17).reduce(reducer);
  console.log(SF)

  const SIZE = KLoC

  const A = 2.45
  const E = 0.91 + (0.01 * SF)
  const EAF = RFT

  const PM = EAF*A*(Math.pow(SIZE,E))

  return PM
};