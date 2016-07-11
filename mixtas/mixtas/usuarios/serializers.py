# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.contrib.auth.models import User

from rest_framework import serializers


class SerializadorUsuarios(serializers.ModelSerializer):
    class Meta:
        model = User