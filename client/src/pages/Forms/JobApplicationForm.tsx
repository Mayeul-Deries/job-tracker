import type { JobApplication } from '@/interfaces/JobApplication';
import { CreateJobApplicationForm } from './Actions/CreateJobApplicationForm';
import { EditJobApplicationForm } from './Actions/EditJobApplicationForm';
import { DuplicateJobApplicationForm } from './Actions/DuplicateJobApplicationForm';
import { DeleteJobApplicationForm } from './Actions/DeleteJobApplicationForm';
import { DeleteManyJobApplicationForm } from './Actions/DeleteManyJobApplicationForm';

interface JobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  resetPagination?: () => void;
  action: string;
  jobApplication?: JobApplication;
  selectedJobApplications?: JobApplication[];
  resetSelection?: () => void;
}

export const JobApplicationForm = ({
  dialog,
  refresh,
  action,
  jobApplication,
  selectedJobApplications,
  resetSelection,
  resetPagination,
}: JobApplicationFormProps) => {
  switch (action) {
    case 'create':
      return <CreateJobApplicationForm dialog={dialog} refresh={refresh} resetPagination={resetPagination} />;
    case 'edit':
      return (
        <EditJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );
    case 'duplicate':
      return (
        <DuplicateJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );
    case 'delete':
      return (
        <DeleteJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );
    case 'deleteMany':
      return (
        <DeleteManyJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          selectedJobApplications={selectedJobApplications}
          resetSelection={resetSelection}
          resetPagination={resetPagination}
        />
      );
    default:
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <span className='text-muted-foreground'>Forbbiden action</span>
        </div>
      );
  }
};
