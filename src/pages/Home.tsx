import { useEffect, useState } from "react";
import { useLoader } from "@/context/LoaderContext";
import Podcast from "@/types/Podcast";
import { getPodcasts } from "@/service/api/api";
import { Link } from "react-router-dom";

const includesCaseUnsensitive = (stack: string, needle: string) => {
  return stack.toLowerCase().indexOf(needle.toLowerCase()) !== -1;
}

const matchAuthorOrName = (term: string) => (podcast: Podcast) => {
  console.log(term, podcast);
  return includesCaseUnsensitive(podcast.name, term) || includesCaseUnsensitive(podcast.author, term);
}

type PodcastJSX = {
  id: number;
  name: string | JSX.Element;
  author: string | JSX.Element;
  image: string;
};

const highlightSearch = ( text: string, search: string ): string | JSX.Element => {
  const idx = text.toLowerCase().indexOf(search.toLowerCase());
  const length = search.length;

  const start = text.substring(0, idx);
  const middle = text.substring(idx, idx + length);
  const end = text.substring(idx + length);

  return !search || idx === -1 ? text : (<>
    { start }<mark className="inline">{ middle }</mark>{ end }
  </>)
};

const HomeGridItem = ({ podcast }: { podcast: PodcastJSX }) => {
  return (
    <Link to={`podcast/${podcast.id}`}>
      <div className="pt-16 h-full">
        <div className="text-center shadow-lg h-full p-4 flex flex-col">
          <img
            className="object-cover block rounded-full h-32 w-32 -mt-20 mx-auto mb-4"
            src={podcast.image}
            title={podcast.name + ' logo'}
            alt={podcast.name + ' logo'}
          />
          <h2 className="uppercase mt-auto mb-1 text-sm font-semibold">{podcast.name}</h2>
          <p className="text-gray-500 text-sm mb-auto">Author: {podcast.author}</p>
        </div>
      </div>
    </Link>
  );
};

const Home = () => {
  const [ podcasts, setPodcasts ] = useState<Podcast[]>([]);
  const [ search, setSearch ] = useState('');
  const loader = useLoader();

  useEffect(() => {
    (async () => {
      const podcasts: Podcast[] = await loader( getPodcasts() );
      setPodcasts( podcasts );
    })();

    // eslint-disable-next-line
  }, []);

  const filteredPodcasts = !search ? podcasts : podcasts.filter( matchAuthorOrName( search ) )

  return (
    <>
      <div className='flex flex-column md:flex-row-reverse py-4 gap-4'>
        <div className="relative">
          <input
            type="text"
            className="border border-neutral-400 rounded px-2 h-8"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
          { search ?
            <button className="absolute round h-6 w-6  right-1 top-1/2 -mt-3 rounded-full bg-red-400 text-white font-bold leading-none pb-[3px]"
            onClick={() => {
              setSearch('');
            }}>x</button>
          : null }
        </div>
        { podcasts.length ?
          <span className='inline-block bg-sky-700 px-2 py-1 text-white rounded font-semibold'>{ filteredPodcasts.length }</span>
        : null }
      </div>

      <div className="grid grid-cols-4 gap-x-5 gap-y-10 mt-5">
        { filteredPodcasts.map( (podcast) => (
          <HomeGridItem
            podcast={{
              ...podcast,
              name: highlightSearch(podcast.name, search),
              author: highlightSearch(podcast.author, search),
            }}
            key={podcast.id}
          />
        )) }
      </div>
    </>
  );
};

export default Home;
