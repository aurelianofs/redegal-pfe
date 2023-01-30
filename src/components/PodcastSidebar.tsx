import React from 'react';
import Podcast from '@/types/Podcast';
import { Link } from 'react-router-dom';

const PodcastSidebar = ({ podcast, isPodcastDetail }: { podcast: Podcast, isPodcastDetail?: boolean }) => {
  const PodcastNameEl = isPodcastDetail ? 'h1' : 'h2';

  return (
    <aside className="w-64 shrink-0 p-4 shadow-lg">
      <img
        className='object-cover rounded-sm block h-32 w-32 mx-auto'
        src={podcast.image}
        title={podcast.name + ' logo'}
        alt={podcast.name + ' logo'}
      />

      <hr className='my-4' />

      <PodcastNameEl className='font-bold'>
        <Link to={`/podcast/${podcast.id}`}>{podcast.name}</Link>
      </PodcastNameEl>
      <p className='text-sm italic'>by {podcast.author}</p>

      <hr className='my-4' />

      <h2 className='text-sm font-bold'>Description</h2>
      <p className='text-sm'>{podcast.description}</p>

    </aside>
  );
};

export default PodcastSidebar;
