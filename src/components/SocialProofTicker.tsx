import { useTranslation } from 'react-i18next';

const SocialProofTicker = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full flex justify-center pt-24 pb-4">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-full px-6 py-3 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-white text-sm font-medium">
            <span className="text-blue-400">{t('socialProof.founders')}</span>{' '}
            {t('socialProof.bookedThisWeek')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialProofTicker;
