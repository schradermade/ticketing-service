import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/build-client';
import UniversalHeader from '../components/Header';

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <UniversalHeader currentUser={currentUser} />
      <div className='container'>
        <Component { ...pageProps} currentUser={currentUser} />
      </div>
    </div>
  )
} 

AppComponent.getInitialProps = async (appContext) => {
  const client = buildClient(appContext.ctx);
  const { data } = await client.get('/api/users/currentuser');

  const pageProps = await appContext.Component.getInitialProps?.(appContext.ctx, client, data.currentUser) ?? {};

  return {
    pageProps,
    currentUser: data.currentUser
  }
}

export default AppComponent;