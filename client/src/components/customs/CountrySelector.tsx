import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, ChevronsUpDown, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import * as flags from 'country-flag-icons/react/3x2';
import countriesData from '@/data/countries.json';

interface CountrySelectorProps {
  formKey: string;
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

type FlagComponents = typeof import('country-flag-icons/react/3x2');

const getFlagComponent = (countryCode: string): React.FC | null => {
  if (!countryCode || countryCode.length !== 2) return null;
  const code = countryCode.toUpperCase() as keyof FlagComponents;
  return (flags[code] as React.FC) || null;
};

export const CountrySelector = ({ formKey, value, onChange, disabled }: CountrySelectorProps) => {
  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const currentLanguage = i18n.language?.startsWith('fr') ? 'fr' : 'en';

  const countries = useMemo(() => {
    return countriesData
      .map(country => {
        const FlagComponent = getFlagComponent(country.code);
        return {
          code: country.code,
          name: currentLanguage === 'fr' ? country.name_fr : country.name_en,
          FlagComponent,
        };
      })
      .filter(country => country.FlagComponent !== undefined && country.FlagComponent !== null);
  }, [currentLanguage]);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;

    const normalizedQuery = searchQuery
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

    return countries.filter(country => {
      const normalizedName = country.name
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      return normalizedName.includes(normalizedQuery) || country.code.toLowerCase().includes(normalizedQuery);
    });
  }, [countries, searchQuery]);

  const selectedCountry = countries.find(country => country.code === value);

  const SelectedFlag = selectedCountry?.FlagComponent;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role='combobox'
          aria-expanded={open}
          disabled={disabled}
          className={cn('w-[60px] justify-between px-2', !value && 'text-muted-foreground shadow-xs cursor-pointer')}
        >
          {SelectedFlag ? <SelectedFlag /> : <Globe className='h-4 w-4' />}
          <ChevronsUpDown className='ml-1 h-4 w-4 shrink-0 opacity-50' />
        </Button>
      </PopoverTrigger>

      <PopoverContent className='w-[200px] p-0' align='start'>
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={t(`pages.${formKey}.form.placeholder.country.placeholder`)}
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>{t(`pages.${formKey}.form.placeholder.country.noResults`)}</CommandEmpty>
            <CommandGroup>
              {filteredCountries.map(({ code, name, FlagComponent }) => (
                <CommandItem
                  key={code}
                  value={code}
                  onSelect={currentValue => {
                    onChange(currentValue === value ? '' : currentValue);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                  className='flex cursor-pointer items-center justify-between'
                >
                  <div className='flex items-center'>
                    {/* @ts-ignore */}
                    {FlagComponent && <FlagComponent className='mr-2 h-4 w-6 rounded-sm object-cover' />}
                    <span>{name}</span>
                  </div>
                  <Check className={cn('ml-2 h-4 w-4 shrink-0', value === code ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
