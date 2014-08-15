import json
from django.test import TestCase


class ApiTestCase(TestCase):
    def admin_login(self, input_data):
        post_data = json.dumps(input_data)
        return self.client.post('/admin_login/', content_type='application/json', data=post_data)

    def test_root_url(self):
        response = self.client.get('')
        self.assertEqual(response.status_code, 200)

    def test_player_url(self):
        response = self.client.get('/api/player/')
        self.assertEqual(response.status_code, 200)

    def test_draft_board_url(self):
        response = self.client.get('/draft_board/')
        self.assertEqual(response.status_code, 200)

    def test_successful_admin_login(self):
        response = self.admin_login({'password': 'temppw'})
        self.assertEqual(response.status_code, 200)

    def test_unsuccessful_admin_login(self):
        response = self.admin_login({'password': 'failpw'})
        self.assertEqual(response.status_code, 403)

    def test_empty_admin_login(self):
        response = self.client.get('/admin_login/')
        self.assertEqual(response.status_code, 400)

    def test_invalid_admin_login(self):
        response = self.admin_login({'foo': 'bar'})
        self.assertEqual(response.status_code, 400)