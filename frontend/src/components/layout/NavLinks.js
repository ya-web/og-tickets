import React from 'react';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaChild } from 'react-icons/fa';

const NavLinks = ({ onLinkClick }) => {
  return (
    <>
      <ul className='nav-links'>
        <li>
          <Link
            data-testid='nav-link-events'
            to='/epreuves'
            onClick={onLinkClick}
          >
            Les épreuves
          </Link>
        </li>
        <li>
          <Link
            data-testid='nav-link-offers'
            to='/offres'
            onClick={onLinkClick}
          >
            Nos offres
          </Link>
        </li>
      </ul>
      <ul className='nav-links'>
        <li>
          <Link
            data-testid='nav-link-cart'
            to='/panier'
            onClick={onLinkClick}
            className='iconlink'
          >
            <span className='nav-link-icon cart'>
              <FaShoppingBag />
            </span>
            <span className='nav-link-text'>Panier</span>
          </Link>
        </li>
        <li>
          <Link
            data-testid='nav-link-login'
            to='/se-connecter'
            onClick={onLinkClick}
            className='iconlink'
          >
            <span className='nav-link-icon user'>
              <FaChild />
            </span>
            <span className='nav-link-text'>Connexion</span>
          </Link>
        </li>
      </ul>
    </>
  );
};

export default NavLinks;
