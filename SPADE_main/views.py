import json
from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import render_to_response
from SPADE import settings
import logging

logger = logging.getLogger(__name__)


def index(request):
    return render_to_response('index.html')


def players(request):
    return render_to_response('players.html')


def draft_board(request):
    return render_to_response('draft_board.html')


def admin_login(request):
    if len(request.body) == 0:
        return HttpResponseBadRequest('Must specify a password')

    post_data = json.loads(request.body)
    if 'password' not in post_data:
        return HttpResponseBadRequest('Must specify a password')

    if settings.SECRET_PASSWORD == post_data['password']:
        request.session['authorized'] = True
        return HttpResponse('Success')
    else:
        return HttpResponseForbidden('Invalid Password')