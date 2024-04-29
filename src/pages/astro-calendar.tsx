import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/i18n'; // Import the i18n instance directly
import { useSetupConnection } from '@/hooks/useSetupConnection';
import { useLoadIntialValues } from '@/hooks/useLoadIntialValues';
import RSSFeed from '@/components/RSSFeed';

export default function AstroCalendar() {
    useSetupConnection();
    useLoadIntialValues();
    
    const { t } = useTranslation();
    // eslint-disable-next-line no-unused-vars
    const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

    useEffect(() => {
        const storedLanguage = localStorage.getItem('language');
        if (storedLanguage) {
            setSelectedLanguage(storedLanguage);
            i18n.changeLanguage(storedLanguage); // Change language using i18n instance
        }
    }, []);

    return (
        <section className="daily-horp d-inline-block w-100">
            <div className="container">
                <br />
                <br />
                <br />
                <br />
                <div className="comon-heading text-center">
                    <h2 className="comon-heading mt-2 mb-3">
                        {t('calendarTitle')}
                    </h2>
                    <h1 className="text-green sub-heading mt-2 mb-3">
                        {t('calendarYear', { year: 2024 })}
                    </h1>
                </div>

                <RSSFeed />
            </div>
        </section>
    );
}
