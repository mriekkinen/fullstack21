import React from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Icon, SemanticICONS } from 'semantic-ui-react';
import { useStateValue, updatePatient } from '../state';
import { apiBaseUrl } from "../constants";
import { Entry, Gender, Patient } from '../types';
import EntryDetails from './EntryDetails';
import { EntryFormValues } from '../AddEntryModal/AddEntryForm';
import AddEntryModal from '../AddEntryModal';

const genderIconName = new Map<Gender, SemanticICONS>([
  [Gender.Male, "mars"],
  [Gender.Female, "venus"],
  [Gender.Other, "genderless"]
]);

const PatientInfoPage = () => {
  const { id } = useParams<{ id: string }>();
  const [{ patients }, dispatch] = useStateValue();

  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | undefined>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

  const submitNewEntry = async (values: EntryFormValues) => {
    try {
      const valuesWithType = { ...values, type: 'HealthCheck' };
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
          key={entry.date}
          entry={entry} />
      )}

      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
      />
      <Button onClick={() => openModal()}>Add New Entry</Button>
    </div>
  );
};

export default PatientInfoPage;
