import { Switch, Route } from 'react-router-dom';
import HomePage from 'src/pages/HomePage';
import BridgePage from 'src/pages/BridgePage';
import StatusPage from 'src/pages/StatusPage';

import 'antd/dist/antd.less';
import './App.css';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path='/bridge' component={BridgePage} />
      <Route path='/status' component={StatusPage} />
      <Route path='/' component={HomePage} />
    </Switch>
  );
};

export default App;
