from django.conf.urls import patterns, include
from tastypie.api import Api
from SPADE_main.api import PlayerResource

player_resource = PlayerResource()

urlpatterns = patterns('',
    (r'^$', 'SPADE_main.views.index'),
    (r'^api/', include(player_resource.urls))
)
