import aritmetica from "./areas/aritmetica/topics.json";
import algebra from "./areas/algebra/topics.json";
import geometriaPlana from "./areas/geometria-plana/topics.json";
import geometriaEspacial from "./areas/geometria-espacial/topics.json";
import funcoes from "./areas/funcoes/topics.json";
import trigonometria from "./areas/trigonometria/topics.json";
import probabilidadeEstatistica from "./areas/probabilidade-estatistica/topics.json";
import analiseCombinatoria from "./areas/analise-combinatoria/topics.json";
import geometriaAnalitica from "./areas/geometria-analitica/topics.json";
import matrizes from "./areas/matrizes/topics.json";
import logaritmos from "./areas/logaritmos/topics.json";
import calculo from "./areas/calculo/topics.json";
import enem from "./areas/enem/topics.json";

const allTopics = [
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

export default allTopics;