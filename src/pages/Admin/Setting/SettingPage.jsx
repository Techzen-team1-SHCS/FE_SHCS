import { useSettings } from './hooks/useSettings';
import SettingMain from './main/SettingMain';

const SettingPage = () => {
    const settingsContext = useSettings();
    return <SettingMain {...settingsContext} />;
};

export default SettingPage;