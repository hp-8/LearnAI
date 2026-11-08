import { foundations } from "./foundations";
import { classical, dataScience } from "./classical";
import { ml } from "./ml";
import { deep, vision, nlp } from "./deep";
import { rl, robotics, applied, mlops } from "./systems";
import { genai, agents, future } from "./frontier";

export * from "./types";

/** Learning order; deps must point at earlier fields. */
export const FIELDS = [foundations, classical, dataScience, ml, deep, applied, rl, vision, nlp, mlops, robotics, genai, agents, future];

export const KIND = { C: "Concept", T: "Theorem", B: "Build", A: "Apply" } as const;
export const DIFF = { E: "Easy", M: "Medium", H: "Hard" } as const;

export const linkKind = (url: string) =>
  /youtube\.com/.test(url) ? "Video"
  : /coursera|ocw\.mit|oyc\.yale|kaggle\.com\/learn|huggingface\.co\/learn|cs188|karpathy\.ai|spinningup|madewithml|sqlbolt|bluedot|cs336|deeprlcourse|davidsilver|Tutorials/.test(url) ? "Course"
  : /mml-book|statlearning|aima|otexts|IR-book|slp3|incompleteideas|marl-book|fairmlbook|neuralnetworksand|d2l|natureofcode|Modern_Robotics|clauswilke|openintro|ThinkBayes|UnderstandingMachineLearning/.test(url) ? "Book"
  : /arxiv|nature\.com|papers\.nips/.test(url) ? "Paper"
  : "Article";
