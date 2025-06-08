import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { t } from 'i18next';
import { Link } from 'react-router-dom';
import { axiosConfig } from '@/config/axiosConfig';
import { type JobApplication } from '@/interfaces/JobApplication';

import { columns } from './columns';
import { DataTable } from './dataTable';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const JobApplicationsList = () => {
  useEffect(() => {
    fetchJobApplications();
  }, []);
  const [loading, setLoading] = useState<boolean>(false);
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [jobApplicationsCount, setJobApplicationsCount] = useState<number>(0);

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

  return (
    <div className='container mx-auto px-20 py-10 max-w-[1920px]'>
      <Link to='/create-application'>
        <Button variant='outline' size='sm'>
          <Plus />
          {t('pages.home.button.add_job_application')}
        </Button>
      </Link>
      <DataTable columns={columns} data={jobApplications} />
    </div>
  );
};
