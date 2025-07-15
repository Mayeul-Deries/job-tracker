import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { axiosConfig } from '@/config/axiosConfig';
import { type JobApplication } from '@/interfaces/JobApplication';
import { StatusOffer } from '@/constants/statusOffer';
import type { Stats } from '@/interfaces/Stats';
import type { updateActionType } from '@/types/updateActionType';
import { Actions, type ActionType } from '@/constants/actions';
import { cn } from '@/lib/utils';

import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Navbar } from '@/components/customs/navbar/NavBar';
import { DataTable } from '../DataTable/DataTable';
import { getColumns } from '../DataTable/Columns';
import { JobApplicationForm } from '@/pages/Forms/JobApplicationForm';
import { Header } from './Header';
import { Overview } from './Overview';

export const JobApplicationsList = () => {
  const { t } = useTranslation();

  const [loading, setLoading] = useState<boolean>(false);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [action, setAction] = useState<ActionType>();
  const [selectedJobApplication, setSelectedJobApplication] = useState<JobApplication>();
  const [selectedJobApplications, setSelectedJobApplications] = useState<JobApplication[]>([]);

  const [allJobApplications, setAllJobApplications] = useState<JobApplication[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [statsLoading, setStatsLoading] = useState<boolean>(false);

  const resetSelectionRef = useRef<() => void>(() => {});
  const resetPaginationRef = useRef<() => void>(() => {});

  const hasAnyLink = jobApplications.some(app => !!app.link);
  const columns = getColumns(t, patchJobApplication, handleJobApplicationAction).filter(col =>
    'accessorKey' in col ? col.accessorKey !== 'link' || hasAnyLink : true
  );

  useEffect(() => {
    setStats(computeStats(allJobApplications));
  }, [allJobApplications]);

  function computeStats(applications: JobApplication[]): Stats {
    return {
      total: applications.length,
      inProgress: applications.filter(app => app.status !== StatusOffer.ACCEPTED && app.status !== StatusOffer.REJECTED)
        .length,
      sent: applications.filter(app => app.status === StatusOffer.SENT).length,
      followedUp: applications.filter(app => app.status === StatusOffer.FOLLOWED_UP).length,
      interviewScheduled: applications.filter(app => app.status === StatusOffer.INTERVIEW_SCHEDULED).length,
      accepted: applications.filter(app => app.status === StatusOffer.ACCEPTED).length,
      rejected: applications.filter(app => app.status === StatusOffer.REJECTED).length,
    };
  }

  useEffect(() => {
    fetchAllJobApplications();
  }, []);

  async function fetchAllJobApplications() {
    setStatsLoading(true);
    try {
      const response = await axiosConfig.get('jobApplications');
      setAllJobApplications(response.data.jobApplications);
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    } finally {
      setStatsLoading(false);
    }
  }

  function updateAllJobApplications({ type, payload }: updateActionType) {
    setAllJobApplications((prev: JobApplication[]) => {
      switch (type) {
        case Actions.CREATE:
        case Actions.DUPLICATE:
          return [...prev, payload];
        case Actions.EDIT:
          return prev.map(app => (app._id === payload._id ? payload : app));
        case Actions.DELETE:
          return prev.filter(app => app._id !== payload);
        case Actions.DELETE_MANY:
          console.log(payload);
          return prev.filter(app => !payload.includes(app._id));
        default:
          return prev;
      }
    });
  }

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
      setAllJobApplications(prev => prev.map(app => (app._id === id ? { ...app, [field]: value } : app)));

      toast.success(t(`toast.${response.data.translationKey}`));
    } catch (error: any) {
      toast.error(t(`toast.${error.response.data.translationKey}`));
    }
  }

  function handleJobApplicationAction(action: ActionType, data?: any) {
    setSelectedJobApplication(undefined);
    setSelectedJobApplications([]);
    switch (action) {
      case Actions.CREATE:
        setAction(Actions.CREATE);
        setOpenDialog(true);
        break;
      case Actions.EDIT:
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction(Actions.EDIT);
        setOpenDialog(true);
        break;
      case Actions.DUPLICATE:
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction(Actions.DUPLICATE);
        setOpenDialog(true);
        break;
      case Actions.DELETE:
        setSelectedJobApplication(jobApplications.find(jobApplication => jobApplication._id === data));
        setAction(Actions.DELETE);
        setOpenDialog(true);
        break;
      case Actions.DELETE_MANY:
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('Invalid data for deleteMany action');
        }
        setSelectedJobApplications(data);
        setAction(Actions.DELETE_MANY);
        setOpenDialog(true);
        break;

      default:
        break;
    }
  }

  return (
    <div>
      <Navbar />
      <div className='flex flex-col mx-auto max-w-screen-xl px-2 sm:px-6 md:px-8 pt-26 pb-4 lg:px-20 xl:px-2 sm:pb-6 lg:pb-10 max-w-[1920px] min-h-screen'>
        <div className='px-2 mb-4'>
          <Header handleJobApplicationAction={handleJobApplicationAction} />
        </div>
        <div className='px-2 mb-4'>
          <Overview stats={stats} loading={statsLoading} />
        </div>
        <div className='w-full overflow-hidden'>
          <DataTable
            columns={columns}
            data={jobApplications}
            loading={loading}
            fetchData={fetchJobApplications}
            dataCount={jobApplicationsCount}
            onAction={handleJobApplicationAction}
            onResetSelectionRef={resetFn => (resetSelectionRef.current = resetFn)}
            onPaginationResetRef={resetFn => (resetPaginationRef.current = resetFn)}
          />
          {action && openDialog && (
            <Dialog open={openDialog} onOpenChange={() => setOpenDialog(false)}>
              <DialogContent
                className={cn(
                  action === Actions.CREATE && 'sm:max-w-[625px]',
                  action === Actions.EDIT && 'sm:max-w-[625px]',
                  action === Actions.DUPLICATE && 'sm:max-w-[625px]',
                  action === Actions.DELETE && 'sm:max-w-[425px]',
                  action === Actions.DELETE_MANY && 'sm:max-w-[460px]',
                  'max-h-[90vh] overflow-hidden flex flex-col px-4'
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
                  refreshAll={updateAllJobApplications}
                  action={action}
                  jobApplication={selectedJobApplication}
                  selectedJobApplications={selectedJobApplications}
                  resetSelection={resetSelectionRef.current}
                  resetPagination={resetPaginationRef.current}
                />
              </DialogContent>
            </Dialog>
          )}
        </div>
      </div>
    </div>
  );
};
