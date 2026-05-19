import data from "@/content/process.json";

export type ProcessStep = {
  number: string;
  title: string;
  body: string;
};

export type ValueProp = { title: string; body: string };

export const process: ProcessStep[] = data.steps as ProcessStep[];
export const valueProps: ValueProp[] = data.valueProps as ValueProp[];
