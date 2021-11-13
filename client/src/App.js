import { BrowserRouter as Router, Route } from 'react-router-dom'
import 'semantic-ui-css/semantic.min.css'
import './App.css';

import Home from "./pages/Home"
import Register from "./pages/Register"
import Login from "./pages/Login"
import MenuBar from './components/MenuBar';
import { AuthProvider } from './context/auth'
import AuthRoute from './util/auth-route';
import SinglePost from './pages/SinglePost';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="ui container">

          <MenuBar />
          <Route exact path="/" component={Home} />
          <AuthRoute exact path="/login" component={Login} />
          <AuthRoute exact path="/register" component={Register} />
          <Route exact path="/post/:postId" component={SinglePost} />
        </div >
      </Router>
    </AuthProvider>
  );
}

export default App;
