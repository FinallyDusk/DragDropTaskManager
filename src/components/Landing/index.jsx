import React from 'react';
import './index.scss';
import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className='landingContainer'>
      <Link to='/task'>Start App</Link>
    </div>
  )
}
