import { Routes, Route, Navigate } from 'react-router-dom';
import appInfo from './app-info';
import routes from './app-routes';
import { SideNavInnerToolbar as SideNavBarLayout } from './layouts';
import { Footer } from './components';
import { LoadPanel } from 'devextreme-react/load-panel';
import { useSelector } from 'react-redux';
import MessageModal from './components/message-modal/MessageModal';

export default function Content() {
  const isLoading = useSelector((state) => state.app.isLoading);

  return (
    <SideNavBarLayout title={appInfo.title}>
      <Routes>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
        <Route path='*' element={<Navigate to='/home' />} />
      </Routes>

      <Footer>
        Copyright © 2022-{new Date().getFullYear()} AinsAlmeyn tarafindan gelistirilmistir.
        <LoadPanel
          shadingColor="rgba(0,0,0,0.4)"
          position={'center'}
          visible={isLoading}
          showIndicator={true}
          shading={true}
          showPane={false}
          hideOnOutsideClick={false}
        />
        <MessageModal />
      </Footer>
    </SideNavBarLayout>
  );
}
