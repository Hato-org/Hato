import React from 'react';
// import { AnimatePresence } from 'framer-motion';
import {
  // Routes,
  // Route,
  // useLocation,
  createBrowserRouter,
} from 'react-router-dom';
// import { useRecoilValue } from 'recoil';
import RequireLogin from './components/login/RequireLogin';
import Setting from './components/settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import PostElement from './components/posts';
import ErrorFallback from './components/common/ErrorFallback';
// import { userAtom } from './store/auth';

const Events = React.lazy(() => import('./pages/Events'));
// const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const EventDetail = React.lazy(() => import('./pages/EventDetail'));
const Home = React.lazy(() => import('./pages/Home'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Timetable = React.lazy(() => import('./pages/Timetable'));
const Posts = React.lazy(() => import('./pages/Posts'));
const PostDetail = React.lazy(() => import('./pages/PostDetail'));

// function Router() {
//   const user = useRecoilValue(userAtom);
//   const location = useLocation();

//   return (
//     <AnimatePresence mode="wait">
//       <Routes location={location} key={location.pathname}>
//         <Route path="/" element={user ? <Dashboard /> : <Home />} />
//         <Route path="/login" element={<Login />} />
//         <Route path="/" element={<RequireLogin />}>
//           <Route path="settings" element={<Settings />}>
//             <Route index element={<Setting.Top />} />
//             <Route path="account" element={<Setting.Account />} />
//             <Route path="theme" element={<Setting.Theme />} />
//           </Route>
//           <Route path="timetable" element={<Timetable />} />
//           <Route path="events">
//             <Route index element={<Events />} />
//             <Route path=":id" element={<EventDetail />} />
//           </Route>
//           <Route path="posts" element={<Posts />}>
//             <Route index element={<PostElement.Top />} />
//             {/* <Route path="subj-news" element={<PostElement.SubjectNews />} />
//             <Route path="exam-news" element={<PostElement.ExamNews />} /> */}
//             <Route path="hatoboard" element={<PostElement.Hatoboard />} />
//           </Route>
//           <Route path="posts/:id" element={<PostDetail />} />
//         </Route>
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </AnimatePresence>
//   );
// }

const router = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorFallback />,
    element: <Home />,
  },
  {
    path: '/login',
    errorElement: <ErrorFallback />,
    element: <Login />,
  },
  {
    path: '/',
    element: <RequireLogin />,
    errorElement: <ErrorFallback />,
    children: [
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            index: true,
            element: <Setting.Top />,
          },
          {
            path: 'account',
            element: <Setting.Account />,
          },
          {
            path: 'theme',
            element: <Setting.Theme />,
          },
        ],
      },
      {
        path: 'timetable',
        element: <Timetable />,
      },
      {
        path: 'events',
        element: <Events />,
      },
      {
        path: 'events/:id',
        element: <EventDetail />,
      },
      {
        path: 'posts',
        element: <Posts />,
        children: [
          {
            path: 'hatoboard',
            element: <PostElement.Hatoboard />,
          },
        ],
      },
      {
        path: 'posts/:id',
        element: <PostDetail />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
