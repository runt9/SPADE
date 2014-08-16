from django.db import models
import jsonfield
import json


class Players(models.Model):
    name = models.CharField(max_length=50)
    nfl_team = models.CharField(max_length=3)
    bye_week = models.IntegerField()
    position = models.CharField(max_length=4)
    games_played = models.IntegerField()
    last_season_points = models.IntegerField()
    league_team = models.CharField(max_length=4)
    draft_position = models.IntegerField()
    completion_percentage = models.DecimalField(max_digits=4, decimal_places=1)
    passing_yards = models.IntegerField()
    passing_touchdowns = models.IntegerField()
    interceptions = models.IntegerField()
    rushing_yards = models.IntegerField()
    rushing_touchdowns = models.IntegerField()
    receiving_yards = models.IntegerField()
    receiving_touchdowns = models.IntegerField()
    longest_fg = models.IntegerField()
    fg_percentage = models.DecimalField(max_digits=4, decimal_places=1)
    def_points_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    def_interceptions = models.IntegerField()
    dst_touchdowns = models.IntegerField()

    def __unicode__(self):
        return self.name


class Events(models.Model):
    timestamp = models.IntegerField()
    type = models.CharField(max_length=20)
    data = jsonfield.JSONField()

    def __unicode__(self):
        return json.dumps(self.data)