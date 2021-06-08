import express from 'express';
import { calculateBmi } from './bmi';
import { calculateExercises } from './exercise';
const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (isNaN(height) || isNaN(weight)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const bmi = calculateBmi(height, weight);

  return res.json({
    weight, height, bmi
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const dailyAny = req.body.daily_exercises;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
  const targetAny = req.body.target;

  if (!dailyAny || !targetAny) {
    return res.status(400).json({ error: 'parameters missing' });
  }

  if (!Array.isArray(dailyAny)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const daily = dailyAny.map(h => Number(h));
  const target = Number(targetAny);

  if (daily.some(h => isNaN(h)) || isNaN(target)) {
    return res.status(400).json({ error: 'malformatted parameters' });
  }

  const result = calculateExercises(daily, target);

  return res.json(result);
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
