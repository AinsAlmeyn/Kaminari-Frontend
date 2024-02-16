import 'devextreme/dist/css/dx.common.css';
import './themes/generated/theme.base.css';
import './themes/generated/theme.additional.css';
import React from 'react';
import { HashRouter as Router } from 'react-router-dom';
import './dx-styles.scss';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import { useScreenSizeClass } from './utils/media-query';
import Content from './Content';
import UnauthenticatedContent from './UnauthenticatedContent';
import 'bootstrap/dist/css/bootstrap.css';
import { GlobalFunctionsProvider } from './global/GlobalFunctionsContext';

//! LOCALIZATION
// import 'devextreme/localization/messages/tr.json';
// import { locale, loadMessages } from 'devextreme/localization';
// loadMessages(require('devextreme/localization/messages/tr.json'));
// locale('tr');
function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }

  if (user) {
    return <Content />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  const screenSizeClass = useScreenSizeClass();

  return (
    <Router>
      <GlobalFunctionsProvider>
        <AuthProvider>
          <NavigationProvider>
            <div className={`app ${screenSizeClass}`}>
              <App />
            </div>
          </NavigationProvider>
        </AuthProvider>
      </GlobalFunctionsProvider>
    </Router>
  );
}
