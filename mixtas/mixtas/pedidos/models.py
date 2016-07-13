# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.db import models


class Mesas(models.Model):

    status = models.BooleanField()
    name = models.CharField(max_length=50)
    location = models.CharField(max_length=50)
    description = models.CharField(max_length=50)
    n_chairs = models.IntegerField()
    n_people = models.IntegerField()
