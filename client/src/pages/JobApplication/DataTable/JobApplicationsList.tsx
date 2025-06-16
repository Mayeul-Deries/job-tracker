import { useState } from 'react';
import { Plus } from 'lucide-react';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import { axiosConfig } from '@/config/axiosConfig';
import { type JobApplication } from '@/interfaces/JobApplication';

import { getColumns } from './columns';
import { DataTable } from './dataTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JobApplicationForm } from '../jobApplicationForm';

export const JobApplicationsList = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [action, setAction] = useState('');
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication>();

  async function fetchJobApplications(page: number = 0, size: number = 10) {
    setLoading(true);
    try {
      const response = await axiosConfig.get('jobApplications?page=' + page + '&size=' + size);
      setJobApplications(response.data.jobApplications);
      setJobApplicationsCount(response.data.count);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
      setLoading(false);
    }
  }

  async function patchJobApplication(id: string, field: string, value: any) {
    try {
      const response = await axiosConfig.patch(`jobApplications/${id}`, {
        [field]: value,
      });

      setJobApplications(prev => prev.map(app => (app._id === id ? { ...app, [field]: value } : app)));
      toast.success(response.data.message);
    } catch (error: any) {
      toast.error(error.response.data.error);
    } finally {
    }
  }

  function handleJobApplicationAction(action: string, data: any) {
    setSelectedJobApplication(undefined);
    switch (action) {
      case 'edit':
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction('edit');
        setOpenDialog(true);
        break;
      default:
        break;
    }
  }

  return (
    <div className='flex flex-col mx-auto px-2 sm:px-6 md:px-8 lg:px-20 py-4 sm:py-6 lg:py-10 max-w-[1920px] min-h-screen'>
      <div className='px-2 mb-4'>
        <Link to='/create-application'>
          <Button variant='outline' size='default'>
            <Plus />
            {t('pages.home.button.add_job_application')}
          </Button>
        </Link>
      </div>
      <div className='w-full overflow-hidden'>
        <DataTable
          columns={getColumns(patchJobApplication, handleJobApplicationAction)}
          data={jobApplications}
          loading={loading}
          fetchData={fetchJobApplications}
          dataCount={jobApplicationsCount}
        />
        {openDialog && (
          <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
            <DialogContent className='sm:max-w-[625px]'>
              <DialogHeader className='flex flex-col items-center gap-2 text-center'>
                <DialogTitle className='text-xl font-bold '>
                  {t(`pages.dataTable.columns.actions.${action}`)}
                </DialogTitle>
                <DialogDescription className='sr-only'></DialogDescription>
              </DialogHeader>
              <JobApplicationForm
                dialog={setOpenDialog}
                refresh={fetchJobApplications}
                action={action}
                jobApplication={selectedJobApplication}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
};
