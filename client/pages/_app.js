import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import UniversalHeader from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
<div>
  <UniversalHeader currentUser={currentUser} />
  <Component { ...pageProps } />
</div>
  )
} 

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const pageProps = await appContext.Component.getInitialProps?.(appContext.ctx) ?? {};

  return {
    pageProps,
    currentUser: data.currentUser
  }
}

export default AppComponent;