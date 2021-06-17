import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getNonSensitiveEntries();

  res.json(patients);
});

router.get('/:id', (req, res) => {
  const patient = patientService.getEntry(req.params.id);

  if (!patient) {
    return res.status(404).end();
  }

  res.json(patient);
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);
    const savedPatient = patientService.addEntry(newPatient);
  
    res.json(savedPatient);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
