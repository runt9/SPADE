from tastypie.resources import ModelResource
from models import Players
from models import LeagueTeams


class PlayerResource(ModelResource):
    """
    API Facet
    """
    class Meta:
        queryset = Players.objects.all()
        resource_name = 'player'


class LeagueTeamResource(ModelResource):
    """
    API Facet
    """
    class Meta:
        queryset = LeagueTeams.objects.all()
        resource_name = 'league_team'