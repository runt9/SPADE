from django.test import TestCase


class ApiTestCase(TestCase):
    def test_root_url(self):
        response = self.client.get('')
        self.assertEqual(response.status_code, 200)

    def test_player_url(self):
        response = self.client.get('/api/player/')
        self.assertEqual(response.status_code, 200)

    def test_draft_board_url(self):
        response = self.client.get('/draft_board/')
        self.assertEqual(response.status_code, 200)

    def test_invalid_url(self):
        response = self.client.get('/mangled_url')
        self.assertNotEqual(response.status_code, 200)