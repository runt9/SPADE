from django.conf.urls import url
from django.http import HttpResponseBadRequest, HttpResponse, HttpResponseNotFound, HttpResponseForbidden
from tastypie.resources import ModelResource
from tastypie.utils import trailing_slash
from SPADE_main.exceptions import EmptyRequestError, InvalidArgumentError
from models import Players
from SPADE_main import services


class PlayerResource(ModelResource):
    """
    API Facet
    """
    class Meta:
        queryset = Players.objects.all()
        max_limit = None
        resource_name = 'player'

    def prepend_urls(self):
        return [
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/draft%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('draft'), name="api_player_draft"),
            url(r"^(?P<resource_name>%s)/(?P<pk>\w[\w/-]*)/unassign%s$" %
                (self._meta.resource_name, trailing_slash()),
                self.wrap_view('unassign'), name="api_player_unassign")
        ]

    def draft(self, request, **kwargs):
        if 'authorized' not in request.session or not request.session['authorized']:
            return HttpResponseForbidden('You are not allowed to access this resource')

        try:
            self.method_check(request, allowed=['post'])
            basic_bundle = self.build_bundle(request=request)
            player = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
            services.draft_player(request, player)
        except EmptyRequestError:
            return HttpResponseBadRequest('Must specify a team')
        except InvalidArgumentError:
            return HttpResponseBadRequest('Must specify a team')
        except Players.DoesNotExist:
            return HttpResponseNotFound('Specified player does not exist')

        return HttpResponse('Success')

    def unassign(self, request, **kwargs):
        if 'authorized' not in request.session or not request.session['authorized']:
            return HttpResponseForbidden('You are not allowed to access this resource')

        try:
            self.method_check(request, allowed=['get'])
            basic_bundle = self.build_bundle(request=request)
            player = self.cached_obj_get(bundle=basic_bundle, **self.remove_api_resource_names(kwargs))
            services.unassign_player(player)
        except Players.DoesNotExist:
            return HttpResponseNotFound('Specified player does not exist')

        return HttpResponse('Success')