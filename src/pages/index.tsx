import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/i18n';

export default function Home() {
  const { t } = useTranslation();
  // eslint-disable-next-line no-unused-vars
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');

  useEffect(() => {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
          i18n.changeLanguage(storedLanguage);
      }
  }, []);

  return (
    <div>
      <section className="daily-horp d-inline-block w-100">
        <div className="container">
          {" "}
          <br />
          <br />
          <br />
          <br />
          <br />
          <h1>
            <b><u>Dwarfium</u></b>
          </h1>
          <br />
          <p>
          {t('indexDescription')}.
          </p>
          <br />
          <b>{t('indexFeature')}:</b>
          <ul>
            <li> {t('indexFeature1')} </li>
            <li> {t('indexFeature2')} </li>
            <li> {t('indexFeature3')} </li>
            <li> {t('indexFeature4')} </li>
            <li> {t('indexFeature5')} </li>
            <li> {t('indexFeature6')} </li>
          </ul>
          <br />
          <p> {t('indexClaimer')} </p>
          <br />
          <b> {t('indexBugsHeader')} </b>
          <ul>
            <li> {t('indexBug1')} </li>
            <li> {t('indexBug2')} </li>
            <li> {t('indexBug3')} </li>
          </ul>
        </div>

      </section>
    </div>
  );
}
