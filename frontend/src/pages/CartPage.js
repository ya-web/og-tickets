import React, { useEffect, useState, useContext } from 'react';
import Layout from '../components/layout/Layout';
import InCartOffersForOlympicEvent from '../components/InCartOffersForOlympicEvent';
import LoadingSpinner from '../components/LoadingSpinner';
import AddOfferButton from '../components/AddOfferButton';
import { useCartByOlympicEvent } from '../hooks/useCartByOlympicEvent';
import { getOffers } from '../services/offersService';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import { formatDate } from '../utils/utils.js';
import { useNavigate } from 'react-router-dom';
import LoadError from '../components/listItems/LoadError.js';

/**
 * Page component for displaying and managing the cart.
 * @component
 * @returns {JSX.Element} The cart page with cart items and options to add more offers.
 */
const CartPage = () => {
  /**
   * Custom hook to get cart items grouped by Olympic event.
   * @type {Object}
   */
  const { olympicEvents, cartTotal } = useCartByOlympicEvent();

  /**
   * State to store the list of available offers.
   * @type {Array}
   */
  const [offers, setOffers] = useState([]);

  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState(false);

  /**
   * Context to check if the user is authenticated.
   * @type {boolean}
   */
  const { isAuthenticated } = useContext(AuthContext);

  /**
   * Hook to navigate
   * @type {Function}
   */
  const navigate = useNavigate();

  /**
   * Effect to load all offers when the component mounts.
   */
  useEffect(() => {
    let isMounted = true;
    setOffersLoading(true);
    setOffersError(false);
    getOffers()
      .then((data) => {
        if (isMounted) {
          setOffers(data);
          setOffersLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setOffers([]);
          setOffersLoading(false);
          setOffersError(true);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <Layout
      title='Votre Panier'
      subtitle='Consultez le contenu de votre panier et gérez vos réservations par épreuve.'
      mainClassName='cart-page'
    >
      <h2>Contenu du panier</h2>
      {offersLoading ? (
        <LoadingSpinner />
      ) : offersError ? (
        <LoadError itemsLabel={'offre'} />
      ) : olympicEvents.length === 0 ? (
        <p className='info-message'>Votre panier est vide.</p>
      ) : (
        <div className='cart-olympic-events-list'>
          {olympicEvents.map(({ olympicEvent, items }) => {
            const offerIdsInCartSet = new Set(items.map((i) => i.offer.id));
            const availableOffers = offers.filter(
              (offer) => !offerIdsInCartSet.has(offer.id)
            );
            return (
              <section
                key={olympicEvent.id}
                className='cart-olympic-event-section'
              >
                <h3 data-testid='olympic-event-heading'>
                  {olympicEvent.sport}
                </h3>
                <p>
                  {olympicEvent.name} || {olympicEvent.description} <br />
                  {formatDate(olympicEvent.date_time)}
                </p>

                <InCartOffersForOlympicEvent
                  key={olympicEvent.id}
                  olympicEventId={olympicEvent.id}
                />
                {availableOffers.length > 0 && (
                  <div className='add-offer-section'>
                    <p>Ajouter une offre :</p>
                    <div className='add-offer-buttons'>
                      {availableOffers.map((offer, index) => (
                        <AddOfferButton
                          key={`${offer.id}-${olympicEvent.id}-${index}`}
                          offer={offer}
                          olympicEvent={olympicEvent}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {olympicEvents.length > 0 ? (
        <div className='cart-total'>
          <strong>Total global&nbsp;: {cartTotal} €</strong>
          <div className='order-button-container'>
            <button
              className='button order-button'
              disabled={!isAuthenticated}
              title={
                !isAuthenticated
                  ? 'Créez un compte / connectez-vous pour passer commande'
                  : ''
              }
              onClick={() => navigate('/finale')}
            >
              Passer commande
            </button>
            {!isAuthenticated && (
              <p className='info-message'>
                Vous devez être connecté pour passer commande.
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className='view-all'>
          <Link to='/epreuves' className='button'>
            Voir les épreuves
          </Link>
        </div>
      )}
    </Layout>
  );
};

export default CartPage;
