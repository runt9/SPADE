from django.db import models


class NflTeams(models.Model):
    short_name = models.CharField(max_length=3)
    long_name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.short_name


class Players(models.Model):
    name = models.CharField(max_length=50)
    nfl_team = models.ForeignKey(NflTeams)
    games_played = models.IntegerField()
    espn_ranking = models.IntegerField()
    last_season_points = models.IntegerField()

    def __unicode__(self):
        return self.name


class Kickers(Players):
    fg_0_19 = models.CharField(max_length=5)
    fg_20_29 = models.CharField(max_length=5)
    fg_30_39 = models.CharField(max_length=5)
    fg_40_49 = models.CharField(max_length=5)
    fg_50 = models.CharField(max_length=5)
    fg_made = models.IntegerField()
    fg_attempted = models.IntegerField()
    fg_percent = models.DecimalField(max_digits=3, decimal_places=1)
    longest_fg = models.IntegerField()
    xp_made = models.IntegerField()
    xp_attempted = models.IntegerField()
    xp_percent = models.DecimalField(max_digits=3, decimal_places=1)
    points = models.IntegerField()
