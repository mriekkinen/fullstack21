import { calculateBmi } from './bmi'

interface BmiValues {
  height: number;
  weight: number;
}

const parseArguments = (args: string[]): BmiValues => {
  if (args.length !== 4) {
    throw new Error('invalid number of arguments: expected 2 (height and weight)');
  }

  const height = Number(args[2]);
  const weight = Number(args[3]);

  if (isNaN(height) || isNaN(weight)) {
    throw new Error('invalid argument: height and weight should be numbers');
  }

  return {
    height, weight
  }
}

try {
  const { height, weight } = parseArguments(process.argv);
  const result = calculateBmi(height, weight);

  console.log(result);
} catch (error) {
  console.log(error.message);
}
