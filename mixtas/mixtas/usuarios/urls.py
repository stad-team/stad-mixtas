# -*- coding: utf-8 -*-
"""
STAD TEAM
~~~~~~~~~~
"""
from __future__ import absolute_import, unicode_literals, print_function

from django.conf.urls import patterns, url, include
from django.views.generic import TemplateView

from rest_framework import routers
from .views import CrearUsuariosView

# Routers provide an easy way of automatically determining the URL conf.
router = routers.SimpleRouter()
router.register(r'usuarios', CrearUsuariosView)


urlpatterns = patterns('',
    url(r'^$', TemplateView.as_view(template_name='usuarios/usuarios.html')),
    url(r'^api/', include(router.urls, namespace='api')),
)
