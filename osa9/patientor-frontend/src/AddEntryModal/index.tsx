import React from 'react';
import { Modal, Segment } from 'semantic-ui-react';
import { Entry, EntryFormValues } from '../types';
import AddHealthCheckEntryForm from './AddHealthCheckEntryForm';
import AddOccupationalHealthcareEntryForm from './AddOccupationalHealthcareEntryForm';
import AddHospitalEntryForm from './AddHospitalEntryForm';

interface Props {
  type: Entry['type'];
  modalOpen: boolean;
  onClose: () => void;
  onSubmit: (values: EntryFormValues) => void;
  error?: string;
}

const AddEntryModal = ({ type, modalOpen, onClose, onSubmit, error }: Props) => (
  <Modal open={modalOpen} onClose={onClose} centered={false} closeIcon>
    <Modal.Header>{type}: Add a new entry</Modal.Header>
    <Modal.Content>
      {error && <Segment inverted color="red">{`Error: ${error}`}</Segment>}
      {type == 'HealthCheck' &&
        <AddHealthCheckEntryForm onSubmit={onSubmit} onCancel={onClose} />
      }
      {type == 'OccupationalHealthcare' &&
        <AddOccupationalHealthcareEntryForm onSubmit={onSubmit} onCancel={onClose} />
      }
      {type == 'Hospital' &&
        <AddHospitalEntryForm onSubmit={onSubmit} onCancel={onClose} />
      }
    </Modal.Content>
  </Modal>
);

export default AddEntryModal;
