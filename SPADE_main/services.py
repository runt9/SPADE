import json
import time
from SPADE import settings
from SPADE_main.exceptions import EmptyRequestError, InvalidArgumentError
from SPADE_main.models import Players, Events


def login(request):
    if len(request.body) == 0:
        raise EmptyRequestError('No request body given')

    post_data = json.loads(request.body)
    if 'password' not in post_data:
        raise InvalidArgumentError('No password given')

    if settings.SECRET_PASSWORD == post_data['password']:
        request.session['authorized'] = True
        return True
    else:
        return False


def draft_player(request, player):
    if len(request.body) == 0:
        raise EmptyRequestError('No request body given')

    post_data = json.loads(request.body)
    if 'teamId' not in post_data or post_data['teamId'] == 0:
        raise InvalidArgumentError('No team given')

    max_draft_position = Players.objects.latest('draft_position').draft_position
    player.league_team = post_data['teamId']
    player.draft_position = max_draft_position + 1
    player.save()
    create_player_drafted_event(player)


def add_player(request):
    if len(request.body) == 0:
        raise EmptyRequestError('No request body given')

    post_data = json.loads(request.body)
    if 'name' not in post_data or len(post_data['name']) == 0:
        raise InvalidArgumentError('No name given')
    if 'position' not in post_data or len(post_data['position']) == 0:
        raise InvalidArgumentError('No position given')
    if 'nfl_team' not in post_data or len(post_data['nfl_team']) == 0:
        raise InvalidArgumentError('No NFL team given')
    if 'bye_week' not in post_data or post_data['bye_week'] == 0:
        raise InvalidArgumentError('No bye week given')

    player = Players(name=post_data['name'], nfl_team=post_data['nfl_team'], position=post_data['position'],
                     bye_week=post_data['bye_week'], games_played=0, last_season_points=0, league_team='',
                     draft_position=0, completion_percentage=0, passing_yards=0, passing_touchdowns=0, interceptions=0,
                     rushing_yards=0, rushing_touchdowns=0, receiving_yards=0, receiving_touchdowns=0, longest_fg=0,
                     fg_percentage=0, def_points_per_game=0, def_interceptions=0, dst_touchdowns=0)
    player.save()
    create_new_player_event(player)


def unassign_player(player):
    player.league_team = ''
    player.draft_position = 0
    player.save()
    create_player_unassigned_event(player)


def get_events(request):
    if len(request.GET) == 0:
        raise EmptyRequestError('No request parameters sent')

    if 'id' not in request.GET:
        raise InvalidArgumentError('No id given')

    ret_val = []
    query_id = request.GET['id']
    if query_id == '0':
        ret_val.append({'id': Events.objects.latest('id').id})
    else:
        events = Events.objects.all().filter(id__gt=query_id)
        for event in events:
            ret_val.append({'id': event.id, 'type': event.type, 'data': event.data})

    return json.dumps(ret_val)


def create_player_drafted_event(player):
    data = {
        'id': player.id,
        'draft_position': player.draft_position,
        'league_team': player.league_team
    }
    Events.objects.create(timestamp=time.time(), type='playerDrafted', data=data)


def create_player_unassigned_event(player):
    data = {
        'id': player.id
    }
    Events.objects.create(timestamp=time.time(), type='playerUnassigned', data=data)


def create_new_player_event(player):
    data = {
        'id': player.id,
        'name': player.name,
        'nfl_team': player.nfl_team,
        'bye_week': player.bye_week,
        'position': player.position,
        'games_played': player.games_played,
        'last_season_points': player.last_season_points,
        'league_team': player.league_team,
        'draft_position': player.draft_position,
        'completion_percentage': player.completion_percentage,
        'passing_yards': player.passing_yards,
        'passing_touchdowns': player.passing_touchdowns,
        'interceptions': player.interceptions,
        'rushing_yards': player.rushing_yards,
        'rushing_touchdowns': player.rushing_touchdowns,
        'receiving_yards': player.receiving_yards,
        'receiving_touchdowns': player.receiving_touchdowns,
        'longest_fg': player.longest_fg,
        'fg_percentage': player.fg_percentage,
        'def_points_per_game': player.def_points_per_game,
        'def_interceptions': player.def_interceptions,
        'dst_touchdowns': player.dst_touchdowns,
    }
    Events.objects.create(timestamp=time.time(), type='playerAdded', data=data)