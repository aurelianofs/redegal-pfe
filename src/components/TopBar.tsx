import { LoaderContext } from '@/context/LoaderContext';
import React, { useContext } from 'react';
import { Link } from "react-router-dom";

const Loader = () => {
  const { isLoading } = useContext(LoaderContext);

  return isLoading ? (
    <div className='animate-spin h-6 w-6 rounded-full border-4 border-y-sky-900 border-x-white' />
  ) : null;
}

const TopBar = () => {
  return (
    <header className="flex py-4 border-b border-neutral-400 justify-between">
      <Link to={"/"} className='text-sky-700 font-bold'>Podcaster</Link>
      <Loader />
    </header>
  );
};

export default TopBar;
