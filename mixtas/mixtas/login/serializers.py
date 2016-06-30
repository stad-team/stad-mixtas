# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~
"""
from __future__ import unicode_literals

from django.conf import settings
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User

from rest_framework import serializers


class LoginSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('username', 'password')
