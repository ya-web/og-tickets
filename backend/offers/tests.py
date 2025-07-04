from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Offer

class OfferAPITests(APITestCase):
    def setUp(self):
        """
        Create some offers for API testing.
        """
        self.offer1 = Offer.objects.create(
            name="Solo",
            description="1 ticket pour une personne",
            price=50.00,
            nb_place=1
        )
        self.offer2 = Offer.objects.create(
            name="Duo",
            description="1 ticket pour deux personnes",
            price=90.00,
            nb_place=2
        )

    def test_get_offers(self):
        """
        Ensure the API returns the list of offers in JSON format.
        """
        url = reverse('offers_list')  # Make sure the URL name matches the one defined in urls.py
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()

        # Verify that the response is a non-empty list
        self.assertIsInstance(data, list)
        self.assertGreaterEqual(len(data), 2)

        # Verify that each offer contains the expected fields
        for offer in data:
            self.assertIn('id', offer)
            self.assertIn('name', offer)
            self.assertIn('description', offer)
            self.assertIn('price', offer)
            self.assertIn('nb_place', offer)

        ids = [o['id'] for o in data]
        if self.offer1.id in ids:
            solo = [o for o in data if o['id'] == self.offer1.id][0]
            self.assertEqual(solo['nb_place'], 1)
        if self.offer2.id in ids:
            duo = [o for o in data if o['id'] == self.offer2.id][0]
            self.assertEqual(duo['nb_place'], 2)

    def test_offer_str(self):
        """
        Ensure that the __str__() method of the Offer model returns the offer name.
        """
        self.assertEqual(str(self.offer1), self.offer1.name)

