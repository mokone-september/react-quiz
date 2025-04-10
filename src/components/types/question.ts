export type APIQuestion = {
    question: string;
    correct_answer: string;
    incorrect_answers: string[];
  };
  
  export type QuizQuestion = {
    question: string;
    options: string[];
    correct: string;
  };
  