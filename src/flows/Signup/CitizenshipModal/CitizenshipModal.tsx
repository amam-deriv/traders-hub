import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';

import { LabelPairedChevronDownMdRegularIcon } from '@deriv/quill-icons';
import { useResidenceList, useWebsiteStatus } from '@deriv-com/api-hooks';
import { Button, Checkbox, Dropdown, Text } from '@deriv-com/ui';

import { isCVMEnabled } from '@/helpers';

import { TSignupFormValues } from '../SignupWrapper/SignupWrapper';

type TCitizenshipModal = {
    onClickNext: VoidFunction;
};

export const CitizenshipModal = ({ onClickNext }: TCitizenshipModal) => {
    const { data: residenceList } = useResidenceList();
    const { data: websiteStatus } = useWebsiteStatus();
    const clientCountry = websiteStatus?.clients_country;
    const [isCheckBoxChecked, setIsCheckBoxChecked] = useState(false);
    const { values, setFieldValue } = useFormikContext<TSignupFormValues>();
    const isCheckboxVisible = isCVMEnabled(values.country);

    useEffect(() => {
        if (residenceList?.length && clientCountry && values.country === '') {
            setFieldValue('country', clientCountry);
        }
    }, [clientCountry, setFieldValue, residenceList, values.country]);

    return (
        <div className='bg-system-light-primary-background rounded-xl'>
            <div className='flex flex-col p-16 space-y-16 lg:space-y-24 lg:p-24'>
                <Text className='text-default lg:text-lg' weight='bold'>
                    Select your country and citizenship:
                </Text>
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage='Country of residence is where you currently live.'
                    label='Country of residence'
                    list={residenceList ?? []}
                    name='country'
                    onSelect={selectedItem => {
                        setFieldValue('country', selectedItem);
                    }}
                    value={values.country}
                    variant='comboBox'
                />
                <Dropdown
                    dropdownIcon={<LabelPairedChevronDownMdRegularIcon />}
                    errorMessage='Select your citizenship/nationality as it appears on your passport or other government-issued ID.'
                    label='Citizenship'
                    list={residenceList ?? []}
                    name='citizenship'
                    onSelect={selectedItem => {
                        setFieldValue('citizenship', selectedItem);
                    }}
                    value={values.citizenship}
                    variant='comboBox'
                />
                {isCheckboxVisible && (
                    <Checkbox
                        checked={isCheckBoxChecked}
                        label={
                            <Text size='sm'>
                                I hereby confirm that my request for opening an account with Deriv to trade OTC products
                                issued and offered exclusively outside Brazil was initiated by me. I fully understand
                                that Deriv is not regulated by CVM and by approaching Deriv I intend to set up a
                                relation with a foreign company.
                            </Text>
                        }
                        labelClassName='flex-1'
                        name='cvmCheckbox'
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            setIsCheckBoxChecked(event.target.checked)
                        }
                        wrapperClassName='w-auto'
                    />
                )}
                <Button
                    className='w-full lg:self-end lg:w-fit'
                    disabled={Boolean(
                        !values.country || !values.citizenship || (isCheckboxVisible && !isCheckBoxChecked)
                    )}
                    onClick={onClickNext}
                >
                    Next
                </Button>
            </div>
        </div>
    );
};
