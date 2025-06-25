import { useRef, useState } from 'react';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { axiosConfig } from '@/config/axiosConfig';
import { type JobApplication } from '@/interfaces/JobApplication';
import { cn } from '@/lib/utils';

import { getColumns } from './Columns';
import { DataTable } from './DataTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { JobApplicationForm } from '../../Forms/jobApplicationForm';
import { Navbar } from '@/components/customs/navbar/NavBar';

export const JobApplicationsList = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [action, setAction] = useState('');
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication>();
  const [selectedJobApplications, setSelectedJobApplications] = useState<JobApplication[]>([]);

  const resetSelectionRef = useRef<() => void>(() => {});

  async function fetchJobApplications(page: number = 0, size: number = 10) {
    setLoading(true);
    try {
      const response = await axiosConfig.get('jobApplications?page=' + page + '&size=' + size);
      setJobApplications(response.data.jobApplications);
      setJobApplicationsCount(response.data.count);
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
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
      toast.success(t(`toast.${response.data.translationKey}`));
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
    }
  }

  function handleJobApplicationAction(action: string, data?: any) {
    setSelectedJobApplication(undefined);
    setSelectedJobApplications([]);
    switch (action) {
      case 'create':
        setAction('create');
        setOpenDialog(true);
        break;
      case 'edit':
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction('edit');
        setOpenDialog(true);
        break;
      case 'delete':
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction('delete');
        setOpenDialog(true);
        break;
      case 'deleteMany':
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid data for deleteMany action');
        }
        setSelectedJobApplications(data);
        setAction('deleteMany');
        setOpenDialog(true);
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex flex-col mx-auto px-2 sm:px-6 md:px-8 lg:px-20 pt-26 pb-4 sm:pb-6 lg:pb-10 max-w-[1920px] min-h-screen'>
        <div className='px-2 mb-4'>
          <Button variant='outline' size='default' onClick={() => handleJobApplicationAction('create')}>
            <Plus />
            {t('pages.home.button.add_job_application')}
          </Button>
        </div>
        <div className='w-full overflow-hidden'>
          <DataTable
            columns={getColumns(t, patchJobApplication, handleJobApplicationAction)}
            data={jobApplications}
            loading={loading}
            fetchData={fetchJobApplications}
            dataCount={jobApplicationsCount}
            onAction={handleJobApplicationAction}
            onResetSelectionRef={resetFn => (resetSelectionRef.current = resetFn)}
          />
          {openDialog && (
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
              <DialogContent
                className={cn(
                  action === 'create' && 'sm:max-w-[625px]',
                  action === 'edit' && 'sm:max-w-[625px]',
                  action === 'delete' && 'sm:max-w-[425px]',
                  action === 'deleteMany' && 'sm:max-w-[460px]'
                )}
              >
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
                  selectedJobApplications={selectedJobApplications}
                  resetSelection={resetSelectionRef.current}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};
