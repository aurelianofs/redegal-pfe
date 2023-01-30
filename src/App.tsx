import React from 'react';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Outlet,
  Route,
  RouterProvider,
} from "react-router-dom";
import Context from '@/context';

import TopBar from '@/components/TopBar';
import Home from '@/pages/Home';
import PodcastDetail from '@/pages/PodcastDetail';
import EpisodeDetail from './pages/EpisodeDetail';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={
      <main className='max-w-screen-lg mx-auto px-4'>
        <TopBar />
        <Outlet />
      </main>
    }>
      <Route path="/" element={<Home />} />
      <Route path="podcast/:podcastId" element={<PodcastDetail />} />
      <Route path="podcast/:podcastId/episode/:episodeId" element={<EpisodeDetail />} />
    </Route>
  )
);

function App() {
  return (
    <Context>
      <RouterProvider router={router} />
    </Context>
  );
}

export default App;
