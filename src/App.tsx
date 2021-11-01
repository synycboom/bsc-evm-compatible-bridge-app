import { Switch, Route } from 'react-router-dom';
import HomePage from 'src/pages/HomePage';
import BridgePage from 'src/pages/BridgePage';

import 'antd/dist/antd.css';
import './App.css';

const App: React.FC = () => {
  return (
    <Switch>
      <Route path='/' component={BridgePage} />
      <Route path='/bridge' component={HomePage} />
    </Switch>
  );
};

export default App;
