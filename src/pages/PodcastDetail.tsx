import PodcastSidebar from "@/components/PodcastSidebar";
import { useLoader } from "@/context/LoaderContext";
import { getPodcastDetails, getPodcastEpisodes } from "@/service/api/api";
import Episode from "@/types/Episode";
import Podcast from "@/types/Podcast";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const readableDuration = (durationInMiliseconds: number): string => {
  const durationInSeconds = Math.floor(durationInMiliseconds / 1000);
  const durationInMinutes = Math.floor(durationInSeconds / 60);
  const durationInHours = Math.floor(durationInMinutes / 60);

  const secondsVal = durationInSeconds % 60;
  const seconds = (secondsVal < 10 ? '0' : '') + secondsVal;

  const minutesVal = durationInMinutes % 60;
  const minutes = (minutesVal < 10 && durationInHours ? '0' : '') + minutesVal + ':';

  const hours = durationInHours ? durationInHours + ':' : '';

  return hours + minutes + seconds;
};

const readableDate = (dateStr: string): string => {
  const dateArr = dateStr.substring(0, 10).split('-');

  return Number(dateArr[2]) + '/' + Number(dateArr[1]) + '/' + dateArr[0];
}

const PodcastDetail = () => {
  const { podcastId } = useParams();
  const [ podcast, setPodcast ] = useState<Podcast | null>(null)
  const [ episodes, setEpisodes ] = useState<Episode[]>([])
  const loader = useLoader();

  useEffect(() => {
    (async () => {
      const [ podcast, episodes ] = await loader( Promise.all([
        getPodcastDetails( Number( podcastId ) ),
        getPodcastEpisodes( Number( podcastId ) )
      ]));

      setPodcast( podcast );
      if(episodes) setEpisodes( episodes );
    })();

    // eslint-disable-next-line
  }, []);

  return podcast ? (
    <div className="flex gap-5 py-5 items-start">
      <PodcastSidebar podcast={podcast} isPodcastDetail={true} />

      <div className="grow">
        <div className='py-3 px-4 shadow-lg mb-5'>
          <h3 className="text-xl font-bold">Episodes: {episodes.length}</h3>
        </div>

        <div className='p-4 shadow-lg'>

          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left px-2 py-3 font-bold">Title</th>
                <th className="text-left px-2 py-3 font-bold">Date</th>
                <th className="text-left px-2 py-3 font-bold">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y">

              {episodes.map((episode, i) => (
                <tr key={episode.id} className={i % 2 ? 'bg-gray-100' : ''}>
                  <td className="px-2 py-3 text-sm">
                    <Link to={`/podcast/${podcastId}/episode/${episode.id}`} className="text-sky-700">{episode.name}</Link>
                  </td>
                  <td className="px-2 py-3 text-sm">
                    {readableDate(episode.releaseDate)}
                  </td>
                  <td className="px-2 py-3 text-right text-sm">
                    {readableDuration(episode.duration)}
                  </td>
                </tr>
              ))}

            </tbody>
          </table>

        </div>
      </div>
    </div>
  ) : null;
};

export default PodcastDetail;
