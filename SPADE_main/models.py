from django.db import models


class LeagueTeams(models.Model):
    owner = models.CharField(max_length=50)
    short_name = models.CharField(max_length=3)
    long_name = models.CharField(max_length=50)

class NflTeams(models.Model):
    short_name = models.CharField(max_length=3)
    long_name = models.CharField(max_length=50)

    def __unicode__(self):
        return self.short_name


class PlayerPosition(models.Model):
    position = models.CharField(max_length=3)

class Players(models.Model):
    name = models.CharField(max_length=50)
    owned_by = models.ForeignKey(LeagueTeams, related_name="+")
    draft_position = models.IntegerField()
    nfl_team = models.ForeignKey(NflTeams, related_name="+")
    player_position = models.ForeignKey(PlayerPosition, related_name="+")
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

class QuarterBacks(Players):
    qb_rating = models.DecimalField(max_digits=4, decimal_places=1)
    completions = models.IntegerField()
    attempts = models.IntegerField()
    completion_percentage = models.DecimalField(max_digits=3, decimal_places=1)
    passing_yards = models.IntegerField()
    passing_yards_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    passing_yards_per_attempt = models.DecimalField(max_digits=3, decimal_places=1)
    passing_touchdowns = models.IntegerField()
    interceptions = models.IntegerField()
    rushing_attempts = models.IntegerField()
    rushing_yards = models.IntegerField()
    rushing_yards_per_game = models.DecimalField(max_digits=3, decimal_places=1)
    yards_per_rushing_attempt = models.DecimalField(max_digits=4, decimal_places=1)
    rushing_touchdowns = models.IntegerField()
    sacks = models.IntegerField()
    yards_lost_from_sacks = models.IntegerField()
    fumbles = models.IntegerField()
    fumbles_lost = models.IntegerField()

class RunningBacks(Players):
    rushes = models.IntegerField()
    rushing_yards = models.IntegerField()
    rushing_yards_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    rushing_yards_per_attempt = models.DecimalField(max_digits=2, decimal_places=1)
    rushing_touchdowns = models.IntegerField()
    receptions = models.IntegerField()
    targets = models.IntegerField()
    receiving_yards = models.IntegerField()
    receiving_yards_per_game = models.DecimalField(max_digits=3, decimal_places=1)
    receiving_yards_per_reception = models.DecimalField(max_digits=3, decimal_places=1)
    longest_reception = models.IntegerField()
    average_yards_after_catch = models.DecimalField(max_digits=3, decimal_places=1)
    first_downs = models.IntegerField()
    receiving_touchdowns = models.IntegerField()
    fumbles = models.IntegerField()
    fumbles_lost = models.IntegerField()

class WideReceivers(Players):
    receptions = models.IntegerField()
    targets = models.IntegerField()
    receiving_yards = models.IntegerField()
    receiving_yards_per_game = models.DecimalField(max_digits=3, decimal_places=1)
    receiving_yards_per_reception = models.DecimalField(max_digits=3, decimal_places=1)
    longest_reception = models.IntegerField()
    average_yards_after_catch = models.DecimalField(max_digits=3, decimal_places=1)
    first_downs = models.IntegerField()
    receiving_touchdowns = models.IntegerField()
    kickoff_returns = models.IntegerField()
    kickoff_return_yards = models.IntegerField()
    yards_per_kickoff_return = models.DecimalField(max_digits=3, decimal_places=1)
    longest_kickoff_return = models.IntegerField()
    kickoff_return_touchdowns = models.IntegerField()
    punt_returns = models.IntegerField()
    punt_return_yards = models.IntegerField()
    yards_per_punt_return = models.DecimalField(max_digits=3, decimal_places=1)
    longest_punt_return = models.IntegerField()
    punt_return_touchdowns = models.IntegerField()
    fumbles = models.IntegerField()
    fumbles_lost = models.IntegerField()

class TightEnds(Players):
    receptions = models.IntegerField()
    targets = models.IntegerField()
    receiving_yards = models.IntegerField()
    receiving_yards_per_game = models.DecimalField(max_digits=3, decimal_places=1)
    receiving_yards_per_reception = models.DecimalField(max_digits=3, decimal_places=1)
    longest_reception = models.IntegerField()
    average_yards_after_catch = models.DecimalField(max_digits=3, decimal_places=1)
    first_downs = models.IntegerField()
    receiving_touchdowns = models.IntegerField()
    rushes = models.IntegerField()
    rushing_yards = models.IntegerField()
    rushing_yards_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    rushing_yards_per_attempt = models.DecimalField(max_digits=2, decimal_places=1)
    rushing_touchdowns = models.IntegerField()
    fumbles = models.IntegerField()
    fumbles_lost = models.IntegerField()

class SpecialTeams(Players):
    kickoffs = models.IntegerField()
    yards_per_kickoff = models.DecimalField(max_digits=3, decimal_places=1)
    touchbacks = models.IntegerField()
    returns = models.IntegerField()
    yards_per_return = models.DecimalField(max_digits=3, decimal_places=1)
    touchdown_returns = models.IntegerField()

class Defence(Players):
    points_per_game = models.DecimalField(max_digits=3, decimal_places=1)
    rushing_yards_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    passing_yards_per_game = models.DecimalField(max_digits=4, decimal_places=1)
    interceptions = models.IntegerField()
    touchdown_interceptions = models.IntegerField()
    forced_fumbles = models.IntegerField()
    defensive_touchdowns = models.IntegerField()
    tackles = models.IntegerField()
    passes_defended = models.IntegerField()
    sacks = models.IntegerField()
