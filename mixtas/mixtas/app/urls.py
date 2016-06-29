# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.conf.urls import patterns, url
from django.views.generic import TemplateView

urlpatterns = patterns('mixtas.app.views',
    url(r'^$', TemplateView.as_view(template_name='app/index.html')),
)