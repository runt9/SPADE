from django.conf.urls import patterns, include
from SPADE_main.api import PlayerResource

player_resource = PlayerResource()

urlpatterns = patterns('',
    (r'^$', 'SPADE_main.views.index'),
    (r'^api/', include(player_resource.urls)),
    (r'^draft_board/', 'SPADE_main.views.draft_board')
)
