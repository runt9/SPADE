from django.shortcuts import render

# Create your views here.
from django.shortcuts import render_to_response


def index(request):
    return render_to_response('index.html')


def players(request):
    return render_to_response('players.html')


def view_player(request, player_id):
    return render_to_response('view_player.html')


def draft_board(request):
    return render_to_response('draft_board.html')