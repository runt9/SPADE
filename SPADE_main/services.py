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


def unassign_player(player):
    player.league_team = ''
    player.draft_position = 0
    player.save()
    create_player_unassigned_event(player)


def get_events(request):
    if len(request.GET) == 0:
        raise EmptyRequestError('No request parameters sent')

    if 'time' not in request.GET:
        raise InvalidArgumentError('No timestamp given')

    timestamp = request.GET['time']
    events = Events.objects.all().filter(timestamp__gte=timestamp)
    ret_val = []
    for event in events:
        ret_val.append({'type': event.type, 'data': event.data})

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