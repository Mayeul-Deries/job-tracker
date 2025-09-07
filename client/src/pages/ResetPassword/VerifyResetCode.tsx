import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { axiosConfig } from '@/config/axiosConfig';
import { ArrowLeft } from 'lucide-react';
import { Regex } from '@/constants/regex';

import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Button } from '@/components/ui/button';

export const VerifyResetCode = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password', { replace: true });
    }
  }, [email, navigate]);

  if (!email) {
    return null;
  }

  const verifyCode = async (code: string) => {
    try {
      setLoading(true);
      const response = await axiosConfig.post('/auth/verify-reset-code', {
        email,
        code,
      });

      toast.success(t(`toast.${response.data.translationKey}`));
      navigate('/reset-password', {
        state: {
          token: response.data.token,
          email,
        },
      });
    } catch (error: any) {
      if (error.response?.data?.translationKey === 'auth.error.verify_reset_code.too_many_attempts') {
        toast.error(t(`toast.${error.response.data.translationKey}`));
        navigate('/forgot-password', { replace: true });
      } else {
        toast.error(t(`toast.${error.response.data.translationKey}`));
        setValue('');
        setTimeout(() => {
          otpRef.current?.focus();
        }, 50);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='grid min-h-svh lg:grid-cols-1'>
      <div className='absolute top-6 left-4 sm:left-8 right-4 sm:right-8'>
        <Button variant='link' className='cursor-pointer' onClick={() => navigate(-1)}>
          <ArrowLeft /> {t('pages.verify_reset_code.button.back')}
        </Button>
      </div>
      <div className='flex flex-col p-6 md:p-10'>
        <div className='flex flex-1 items-center justify-center'>
          <div className='w-full max-w-xs sm:max-w-sm'>
            <div className='flex flex-col gap-6'>
              <div className='flex flex-col items-center gap-2 text-center'>
                <h1 className='text-2xl font-bold'>{t('pages.verify_reset_code.title')}</h1>
                <p className='text-sm text-muted-foreground'>{t('pages.verify_reset_code.description')}</p>
              </div>

              <div className='flex flex-col items-center gap-4'>
                <InputOTP
                  ref={otpRef}
                  maxLength={6}
                  value={value}
                  onChange={value => {
                    setValue(value);
                    if (value.length === 6) {
                      verifyCode(value);
                    }
                  }}
                  disabled={loading}
                  pattern={Regex.OTP_ONLY_DIGITS.source}
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, i) => (
                      <InputOTPSlot key={i} index={i} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
