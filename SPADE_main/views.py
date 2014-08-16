from django.http import HttpResponse, HttpResponseForbidden, HttpResponseBadRequest
from django.shortcuts import render_to_response
from SPADE_main.exceptions import EmptyRequestError, InvalidArgumentError
from SPADE_main import services


def index(request):
    return render_to_response('index.html')


def draft_board(request):
    return render_to_response('draft_board.html')


def admin_login(request):
    try:
        success = services.login(request)
    except EmptyRequestError:
        return HttpResponseBadRequest('Must specify a password')
    except InvalidArgumentError:
        return HttpResponseBadRequest('Must specify a password')

    if success:
        return HttpResponse('Success')
    else:
        return HttpResponseForbidden('Invalid Password')


def admin_logout(request):
    request.session['authorized'] = False
    return HttpResponse('Logged out', content_type="application/json")