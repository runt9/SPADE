from tastypie.resources import ModelResource
from models import Players


class PlayerResource(ModelResource):
    """
    API Facet
    """
    class Meta:
        queryset = Players.objects.all()
        resource_name = 'player'