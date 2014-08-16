import json
from SPADE import settings
from SPADE_main.exceptions import EmptyRequestError, InvalidArgumentError
from SPADE_main.models import Players


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