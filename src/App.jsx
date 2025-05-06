// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login/Login';
import {MainLayout} from './pages/layouts/MainLayout/';
import PrivateRoute from './routes/PrivateRoutes';
import PublicRoute from './routes/PublicRoutes';
import { routerList } from './constants';
import { Books, BookDetails, BookForm } from './pages/Books';
import { Topics, TopicForm, TopicDetails } from './pages/Topics';

function App() {
  return (
    <Router>
      <Routes> 
        {/* Public route */}
        <Route element={<PublicRoute />}>
          <Route path="login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
        </Route>

        {/* Private route */}
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<MainLayout />} >
            {/* Dynamic routes from routerList */}
            {
              routerList.map((item)=>{
                const Page = item.component
                
                return Page ? (
                  <Route 
                    key={item.href}
                    path={item.href}
                    element={<Page/>}
                  />
                ) : null
              })
            }
            
            {/* Book management routes */}
            <Route path="/books" element={<Books />} />
            <Route path="/books/create" element={<BookForm />} />
            <Route path="/books/:id" element={<BookDetails />} />
            <Route path="/books/:id/edit" element={<BookForm />} />
            
            {/* Topic management routes */}
            <Route path="/topics" element={<Topics />} />
            <Route path="/topics/create" element={<TopicForm />} />
            <Route path="/topics/:id/edit" element={<TopicForm />} />
            <Route path="/topics/details/:id/edit" element={<TopicDetails />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
