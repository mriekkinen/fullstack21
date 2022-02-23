import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Icon, SemanticICONS } from 'semantic-ui-react';
import { useStateValue, updatePatient } from '../state';
import { apiBaseUrl } from "../constants";
import { Entry, EntryFormValues, Gender, Patient } from '../types';
import EntryDetails from './EntryDetails';
import AddEntryModal from '../AddEntryModal';

const genderIconName = new Map<Gender, SemanticICONS>([
  [Gender.Male, "mars"],
  [Gender.Female, "venus"],
  [Gender.Other, "genderless"]
]);

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const [modalType, setModalType] = React.useState<Entry['type'] | undefined>();
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (type: Entry['type']): void => setModalType(type);

  const closeModal = (): void => {
    setModalType(undefined);
    setError(undefined);
  };

  const submitNewEntry = (type: Entry['type']) => async (values: EntryFormValues) => {
    try {
      const valuesWithType = { ...values, type };
      const { data: newEntry } = await axios.post<Entry>(
        `${apiBaseUrl}/patients/${id}/entries`,
        valuesWithType
      );

      const patient = patients[id];
      const updatedPatient = {
        ...patient,
        entries: [newEntry, ...patient.entries]
      };
      dispatch(updatePatient(updatedPatient));
      closeModal();
    } catch (e) {
      if (axios.isAxiosError(e) && e.response) {
        console.error(e.response.data);
        setError(e.response.data);
      } else {
        console.error('Unknown Error');
        setError('Unknown error');
      }
    }
  };

  const fetchFullPatientInfo = async () => {
    try {
      const { data: patient } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);
      dispatch(updatePatient(patient));
      return patient;
    } catch (e) {
      console.error(e);
    }
  };

  const patient = patients[id];
  if (!patient?.ssn) {
    void fetchFullPatientInfo();
    return null;  // postpone rendering
  }

  const genderIcon = <Icon name={genderIconName.get(patient.gender)} />;

  return (
    <div>
      <h2>{patient.name} {genderIcon}</h2>
      <div>ssn: {patient.ssn}</div>
      <div>occupation: {patient.occupation}</div>

      <h3>entries</h3>
      {patient.entries.map(entry =>
        <EntryDetails
          key={entry.id}
          entry={entry} />
      )}

      <AddEntryModal
        type='HealthCheck'
        modalOpen={modalType == 'HealthCheck'}
        onSubmit={submitNewEntry('HealthCheck')}
        error={error}
        onClose={closeModal}
      />
      <AddEntryModal
        type='OccupationalHealthcare'
        modalOpen={modalType == 'OccupationalHealthcare'}
        onSubmit={submitNewEntry('OccupationalHealthcare')}
        error={error}
        onClose={closeModal}
      />
      <AddEntryModal
        type='Hospital'
        modalOpen={modalType == 'Hospital'}
        onSubmit={submitNewEntry('Hospital')}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal('HealthCheck')}>
        Add Health Check Entry
      </Button>
      <Button onClick={() => openModal('OccupationalHealthcare')}>
        Add Occupational Healthcare Entry
      </Button>
      <Button onClick={() => openModal('Hospital')}>
        Add Hospital Entry
      </Button>
    </div>
  );
};

export default PatientInfoPage;
