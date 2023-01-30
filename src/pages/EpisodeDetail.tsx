import PodcastSidebar from "@/components/PodcastSidebar";
import { useLoader } from "@/context/LoaderContext";
import { getPodcastDetails, getPodcastEpisodeDetails } from "@/service/api/api";
import Episode from "@/types/Episode";
import Podcast from "@/types/Podcast";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EpisodeDetail = () => {
  const { podcastId, episodeId } = useParams();
  const [ podcast, setPodcast ] = useState<Podcast | null>(null)
  const [ episode, setEpisode ] = useState<Episode | null>(null)
  const loader = useLoader();

  useEffect(() => {
    (async () => {
      const [ podcast, episode ] = await loader( Promise.all([
        getPodcastDetails( Number( podcastId ) ),
        getPodcastEpisodeDetails( Number( podcastId ), Number( episodeId ) )
      ]));

      setPodcast( podcast );
      if(episode) setEpisode( episode );
    })();

    // eslint-disable-next-line
  }, []);

  return podcast && episode ? (
    <div className="flex gap-5 py-5 items-start">
      <PodcastSidebar podcast={podcast} />

      <div className="grow">
        <div className='p-4 shadow-lg'>
          <h1 className="text-xl font-bold">{episode.name}</h1>
          <div className="text-sm py-5" dangerouslySetInnerHTML={{__html: episode.description.replace(/\n/g, "<br />")}} />
          <audio src={episode.source} controls className="w-full" />
        </div>
      </div>
    </div>
  ) : null;
};

export default EpisodeDetail;
