import { t } from 'i18next';
import type { JobApplication } from '@/interfaces/JobApplication';
import type { updateActionType } from '@/types/updateActionType';
import { CreateJobApplicationForm } from './Actions/CreateJobApplicationForm';
import { EditJobApplicationForm } from './Actions/EditJobApplicationForm';
import { DuplicateJobApplicationForm } from './Actions/DuplicateJobApplicationForm';
import { DeleteJobApplicationForm } from './Actions/DeleteJobApplicationForm';
import { DeleteManyJobApplicationForm } from './Actions/DeleteManyJobApplicationForm';

interface JobApplicationFormProps {
  dialog: (isOpen: boolean) => void;
  refresh: () => void;
  refreshAll?: (action: updateActionType) => void;
  resetPagination?: () => void;
  action: string;
  jobApplication?: JobApplication;
  selectedJobApplications?: JobApplication[];
  resetSelection?: () => void;
}

export const JobApplicationForm = ({
  dialog,
  refresh,
  refreshAll,
  action,
  jobApplication,
  selectedJobApplications,
  resetSelection,
  resetPagination,
}: JobApplicationFormProps) => {
  switch (action) {
    case 'create':
      return (
        <CreateJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          refreshAll={refreshAll}
          resetPagination={resetPagination}
        />
      );

    case 'edit':
      if (!jobApplication) {
        return <ErrorMessage />;
      }
      return (
        <EditJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          refreshAll={refreshAll}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );

    case 'duplicate':
      if (!jobApplication) {
        return <ErrorMessage />;
      }
      return (
        <DuplicateJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          refreshAll={refreshAll}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );

    case 'delete':
      if (!jobApplication) {
        return <ErrorMessage />;
      }
      return (
        <DeleteJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          refreshAll={refreshAll}
          jobApplication={jobApplication}
          resetPagination={resetPagination}
        />
      );

    case 'deleteMany':
      return (
        <DeleteManyJobApplicationForm
          dialog={dialog}
          refresh={refresh}
          refreshAll={refreshAll}
          selectedJobApplications={selectedJobApplications}
          resetSelection={resetSelection}
          resetPagination={resetPagination}
        />
      );

    default:
      return (
        <div className='flex h-full w-full items-center justify-center'>
          <span className='text-muted-foreground'>{t('errors.jobApplication_missing')}</span>
        </div>
      );
  }
};

const ErrorMessage = () => (
  <div className='flex h-full w-full items-center justify-center'>
    <span className='text-destructive'>{t('errors.jobApplication_missing')}</span>
  </div>
);
