import json
from django.test import TestCase
from SPADE_main.models import Players


class ApiTestCase(TestCase):
    def setUp(self):
        Players.objects.create(
            name='test',
            nfl_team='tst',
            bye_week=4,
            position='qb',
            games_played=16,
            last_season_points=0,
            league_team='',
            draft_position=0,
            completion_percentage=0,
            passing_yards=0,
            passing_touchdowns=0,
            interceptions=0,
            rushing_yards=0,
            rushing_touchdowns=0,
            receiving_yards=0,
            receiving_touchdowns=0,
            longest_fg=0,
            fg_percentage=0,
            def_points_per_game=0,
            def_interceptions=0,
            dst_touchdowns=0
        )

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

    def test_admin_logout(self):
        response = self.client.get('/admin_logout/')
        self.assertEqual(response.status_code, 200)

    def test_draft_player(self):
        response = self.client.post('/api/player/1/draft/',
                                    content_type='application/json',
                                    data=json.dumps({'teamId': 'TEST'}))
        self.assertEqual(response.status_code, 200)

    def test_draft_invalid_player(self):
        response = self.client.post('/api/player/2/draft/',
                                    content_type='application/json',
                                    data=json.dumps({'teamId': 'TEST'}))
        self.assertEqual(response.status_code, 404)

    def test_no_player(self):
        response = self.client.post('/api/player/1/draft/', content_type='application/json')
        self.assertEqual(response.status_code, 400)