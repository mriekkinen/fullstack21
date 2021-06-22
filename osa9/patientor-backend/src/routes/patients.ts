import express from 'express';
import patientService from '../services/patientService';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  const patients = patientService.getNonSensitiveEntries();

  res.json(patients);
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

router.get('/:id', (req, res) => {
  const patient = patientService.getEntry(req.params.id);

  if (!patient) {
    return res.status(404).end();
  }

  res.json(patient);
});

router.post('/:id/entries', (req, res) => {
  const patient = patientService.getEntry(req.params.id);

  if (!patient) {
    return res.status(404).end();
  }

  try {
    const newEntry = toNewEntry(req.body);
    const savedEntry = patientService.addMedicalEntry(patient, newEntry);

    res.json(savedEntry);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

export default router;
