import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Calendar, Check, HelpCircle, Hourglass } from 'lucide-react';
import type { Stats } from '@/interfaces/Stats';
import { useTranslation } from 'react-i18next';
import { Skeleton } from '@/components/ui/skeleton';
import { TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Tooltip } from '@radix-ui/react-tooltip';

interface OverviewProps {
  stats: Stats | null;
  loading: boolean;
}

export const Overview = ({ stats, loading }: OverviewProps) => {
  const { t } = useTranslation();

  return (
    <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 pt-4'>
      <Card className='shadow-none'>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>{t('pages.home.overview.stats.labels.total.title')}</p>
                <div className='text-2xl font-bold text-gray-900'>{stats?.total}</div>
                <p className='text-xs text-gray-500'>{t('pages.home.overview.stats.labels.total.description')}</p>
              </div>
              <Briefcase className='w-5 h-5 text-gray-400' />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className='shadow-none'>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div>
                <div className='flex items-center gap-2'>
                  <p className='text-sm font-medium text-gray-600'>
                    {t('pages.home.overview.stats.labels.in_progress.title')}
                  </p>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild className='pt-1'>
                        <HelpCircle className='w-4 h-4 text-gray-400' />
                      </TooltipTrigger>
                      <TooltipContent side='right'>
                        <p>{t('pages.home.overview.stats.labels.in_progress.tooltip')}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                <div className='text-2xl font-bold text-blue-600'>
                  {loading ? <Skeleton className='h-6 w-16' /> : stats?.inProgress}
                </div>
                <p className='text-xs text-gray-500'>{t('pages.home.overview.stats.labels.in_progress.description')}</p>
              </div>
              <Hourglass className='w-5 h-5 text-gray-400' />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className='shadow-none'>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {t('pages.home.overview.stats.labels.accepted.title')}
                </p>
                <div className='text-2xl font-bold text-green-600'>
                  {loading ? <Skeleton className='h-6 w-16' /> : stats?.accepted}
                </div>
                <p className='text-xs text-gray-500'>{t('pages.home.overview.stats.labels.accepted.description')}</p>
              </div>
              <Check className='w-5 h-5 text-gray-400' />
            </div>
          )}
        </CardContent>
      </Card>
      <Card className='shadow-none'>
        <CardContent>
          {loading ? (
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-6 w-16' />
              <Skeleton className='h-4 w-20' />
            </div>
          ) : (
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm font-medium text-gray-600'>
                  {t('pages.home.overview.stats.labels.interview_scheduled.title')}
                </p>
                <div className='text-2xl font-bold text-purple-600'>
                  {loading ? <Skeleton className='h-6 w-16' /> : stats?.interviewScheduled}
                </div>
                <p className='text-xs text-gray-500'>
                  {t('pages.home.overview.stats.labels.interview_scheduled.description')}
                </p>
              </div>
              <Calendar className='w-5 h-5 text-gray-400' />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
