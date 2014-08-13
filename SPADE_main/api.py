from tastypie.resources import ModelResource
from models import Players


class PlayerResource(ModelResource):
    """
    API Facet
    """
    class Meta:
        queryset = Players.objects.all()
        max_limit = None
        resource_name = 'player'