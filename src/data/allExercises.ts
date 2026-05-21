import aritmetica from "./areas/aritmetica/exercises.json";
import algebra from "./areas/algebra/exercises.json";
import geometriaPlana from "./areas/geometria-plana/exercises.json";
import geometriaEspacial from "./areas/geometria-espacial/exercises.json";
import funcoes from "./areas/funcoes/exercises.json";
import trigonometria from "./areas/trigonometria/exercises.json";
import probabilidadeEstatistica from "./areas/probabilidade-estatistica/exercises.json";
import analiseCombinatoria from "./areas/analise-combinatoria/exercises.json";
import geometriaAnalitica from "./areas/geometria-analitica/exercises.json";
import matrizes from "./areas/matrizes/exercises.json";
import logaritmos from "./areas/logaritmos/exercises.json";
import calculo from "./areas/calculo/exercises.json";
import enem from "./areas/enem/exercises.json";

// Note os colchetes [ ] indicando que agora é um Array unificado
const allExercises = [
  ...aritmetica,
  ...algebra,
  ...enem,
  ...geometriaPlana,
  ...geometriaEspacial,
  ...funcoes,
  ...trigonometria,
  ...probabilidadeEstatistica,
  ...analiseCombinatoria,
  ...geometriaAnalitica,
  ...matrizes,
  ...logaritmos,
  ...calculo,
];

export default allExercises;