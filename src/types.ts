export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  difficulty: "Fácil" | "Médio" | "Difícil";
  content?: {
    explanation: string;
    formulas: string[];
    example: string;
    videoUrl: string;
    pdfUrl: string;
  };
}

export interface Exercise {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  resolution: string;
}
